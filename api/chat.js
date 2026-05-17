const fs = require('fs');
const path = require('path');

let cachedPortfolioContext;

function loadPortfolioContext() {
  if (cachedPortfolioContext !== undefined) return cachedPortfolioContext;
  const fromEnv = (process.env.PORTFOLIO_CONTEXT || '').trim();
  if (fromEnv) {
    cachedPortfolioContext = fromEnv;
    return cachedPortfolioContext;
  }
  try {
    const filePath = path.join(__dirname, 'portfolio-context.txt');
    cachedPortfolioContext = fs.readFileSync(filePath, 'utf8').trim();
  } catch (e) {
    cachedPortfolioContext = '';
  }
  return cachedPortfolioContext;
}

function isMockKey(key) {
  if (!key || typeof key !== 'string') return true;
  const t = key.trim();
  if (!t) return true;
  if (/^sk-xxxx/i.test(t)) return true;
  if (/^xxxx/i.test(t)) return true;
  if (t === 'REPLACE_ME' || t === 'fake') return true;
  return false;
}

function envInt(name, fallback, max) {
  const n = parseInt(process.env[name] || '', 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, max);
}

function allowedOriginsList() {
  const raw = (process.env.CHAT_ALLOWED_ORIGIN || '').trim();
  if (!raw || raw === '*') return null;
  return raw
    .split(',')
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
}

function header(req, name) {
  const v = req.headers[name] || req.headers[name.toLowerCase()];
  return v ? String(v).trim() : '';
}

function requestOrigin(req) {
  return header(req, 'origin');
}

function refererOrigin(req) {
  const ref = header(req, 'referer');
  if (!ref) return '';
  try {
    return new URL(ref).origin;
  } catch (e) {
    return '';
  }
}

function isOriginAllowed(req) {
  const allowed = allowedOriginsList();
  if (!allowed || !allowed.length) return true;
  const origin = requestOrigin(req) || refererOrigin(req);
  if (!origin) return false;
  return allowed.indexOf(origin) !== -1;
}

function corsHeaders(req) {
  const allowed = allowedOriginsList();
  const origin = requestOrigin(req);
  const h = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
  if (allowed && allowed.length) {
    if (origin && allowed.indexOf(origin) !== -1) {
      h['Access-Control-Allow-Origin'] = origin;
    }
  } else {
    h['Access-Control-Allow-Origin'] =
      (process.env.CHAT_ALLOWED_ORIGIN || '*').trim() || '*';
  }
  return h;
}

function clientIp(req) {
  const xf = header(req, 'x-forwarded-for');
  if (xf) return xf.split(',')[0].trim() || 'unknown';
  const real = header(req, 'x-real-ip');
  if (real) return real;
  if (req.socket && req.socket.remoteAddress) return String(req.socket.remoteAddress);
  return 'unknown';
}

function upstashBase() {
  const base = (process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/\/$/, '');
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
  if (!base || !token) return null;
  return { base: base, token: token };
}

function pipelineCount(row) {
  if (!row || row.error) return null;
  const n = row.result;
  if (typeof n === 'number' && Number.isFinite(n)) return n;
  const parsed = parseInt(n, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

async function upstashPipeline(commands) {
  const cfg = upstashBase();
  if (!cfg || !commands.length) return null;
  try {
    const res = await fetch(cfg.base + '/pipeline', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + cfg.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commands)
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (e) {
    return null;
  }
}

async function checkRateLimit(ip) {
  const cfg = upstashBase();
  if (!cfg) return { ok: true, skipped: true };

  const perMin = envInt('CHAT_RATE_LIMIT_PER_MIN', 10, 60);
  const perDay = envInt('CHAT_RATE_LIMIT_PER_DAY', 50, 500);
  const safeIp = ip.replace(/[^a-zA-Z0-9.:_-]/g, '_').slice(0, 64) || 'unknown';
  const minuteKey = 'chat:rl:m:' + safeIp;
  const dayKey =
    'chat:rl:d:' +
    safeIp +
    ':' +
    new Date().toISOString().slice(0, 10);

  const rows = await upstashPipeline([
    ['INCR', minuteKey],
    ['INCR', dayKey]
  ]);
  if (!rows || rows.length < 2) return { ok: false, reason: 'storage' };

  const minCount = pipelineCount(rows[0]);
  const dayCount = pipelineCount(rows[1]);
  if (minCount === null || dayCount === null) return { ok: false, reason: 'storage' };

  const expireCmds = [];
  if (minCount === 1) expireCmds.push(['EXPIRE', minuteKey, 60]);
  if (dayCount === 1) expireCmds.push(['EXPIRE', dayKey, 86400]);
  if (expireCmds.length) await upstashPipeline(expireCmds);

  if (minCount > perMin) return { ok: false, reason: 'minute' };
  if (dayCount > perDay) return { ok: false, reason: 'day' };

  return { ok: true, skipped: false };
}

function mockReply(locale) {
  if (locale === 'en') {
    return (
      'Demo mode: no production API key is configured. ' +
      'Set OPENAI_API_KEY and CHAT_ALLOWED_ORIGIN in your server environment variables, then redeploy.'
    );
  }
  return (
    'Mode démo : aucune clé API de production n’est configurée. ' +
    'Ajoutez OPENAI_API_KEY et CHAT_ALLOWED_ORIGIN dans les variables d’environnement de votre serveur, puis redéployez.'
  );
}

function rateLimitReply(locale) {
  if (locale === 'en') {
    return 'Too many messages in a short time. Please try again in a few minutes.';
  }
  return 'Trop de messages en peu de temps. Réessayez dans quelques minutes.';
}

async function readJsonBody(req) {
  if (req.body && Buffer.isBuffer(req.body)) {
    try {
      return JSON.parse(req.body.toString('utf8') || '{}');
    } catch (e) {
      return {};
    }
  }
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}');
    } catch (e) {
      return {};
    }
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  try {
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function sendJson(res, status, headers, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...headers });
  res.end(JSON.stringify(obj));
}

module.exports = async function handler(req, res) {
  const headers = corsHeaders(req);

  if (req.method === 'OPTIONS') {
    if (!isOriginAllowed(req)) {
      res.writeHead(403, headers);
      res.end();
      return;
    }
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, headers, { error: 'Method not allowed' });
    return;
  }

  if (!isOriginAllowed(req)) {
    sendJson(res, 403, headers, { error: 'Forbidden' });
    return;
  }

  const body = await readJsonBody(req);
  const messageLocale = body.locale === 'en' ? 'en' : 'fr';
  const message = (body.message || '').toString().trim();
  const history = Array.isArray(body.history) ? body.history : [];

  const maxMessageLen = envInt('CHAT_MAX_MESSAGE_LENGTH', 1500, 4000);
  const maxHistory = envInt('CHAT_MAX_HISTORY_MESSAGES', 10, 20);

  if (!message) {
    sendJson(res, 400, headers, { error: 'Missing message' });
    return;
  }

  if (message.length > maxMessageLen) {
    sendJson(res, 413, headers, { error: 'Message too long' });
    return;
  }

  const rl = await checkRateLimit(clientIp(req));
  if (!rl.ok) {
    if (rl.reason === 'storage') {
      sendJson(res, 503, headers, { error: 'Service temporarily unavailable' });
      return;
    }
    sendJson(res, 429, headers, {
      error: 'Rate limit exceeded',
      reply: rateLimitReply(messageLocale)
    });
    return;
  }

  const useMock =
    process.env.OPENAI_USE_MOCK === '1' ||
    isMockKey((process.env.OPENAI_API_KEY || '').trim());

  if (useMock) {
    sendJson(res, 200, headers, { reply: mockReply(messageLocale), demo: true });
    return;
  }

  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  const model = (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
  const context = loadPortfolioContext();

  const styleFr = [
    'Style : répondez comme Sarah Ranganadane, à la première personne (je).',
    'Rédigez en phrases complètes et fluides, reliées entre elles (D\'abord…, Ensuite…, En parallèle…, D\'une part…, D\'autre part…).',
    'N\'utilisez pas de listes à puces ni de lignes commençant par "-", sauf si le visiteur demande explicitement une liste.',
    'Pas de Markdown (pas de **, pas de #). Deux courts paragraphes maximum, environ 80 à 130 mots, sauf demande de détail.',
    'Exemple de ton pour le parcours (à adapter, ne pas recopier mot pour mot) : « D\'une part, pour ma formation, j\'ai d\'abord obtenu une licence de mathématiques à Sorbonne Université en 2025 ; je poursuis aujourd\'hui un master IA appliquée au Business à Eugénia School. D\'autre part, en parallèle, je suis en alternance chez ACE Énergie… »'
  ].join(' ');
  const styleEn = [
    'Style: reply as Sarah Ranganadane, first person (I).',
    'Write in full, flowing sentences (First…, Then…, In parallel…, On one hand…, On the other hand…).',
    'Do not use bullet lists or lines starting with "-", unless the visitor explicitly asks for a list.',
    'No Markdown (no **, no #). At most two short paragraphs, about 80–130 words, unless more detail is requested.',
    'Example tone for background (adapt, do not copy verbatim): "On one hand, I earned a mathematics degree from Sorbonne Université in 2025, and I am now pursuing a Master in AI applied to Business at Eugénia School. On the other hand, in parallel, I am on an apprenticeship at ACE Énergie…"'
  ].join(' ');

  const systemParts = [
    'You are the portfolio assistant for Sarah Ranganadane. When visitors say "your", they mean Sarah\'s.',
    'Answer only from the author-provided context. Do not invent facts. If something is missing, say so briefly in one sentence.',
    'Use the relevant context sections (path, experience, skills, projects, diplomas) for each question.',
    messageLocale === 'en' ? styleEn : styleFr,
    messageLocale === 'en' ? 'Respond in English.' : 'Répondez en français.'
  ];
  if (context) {
    systemParts.push('--- Context (author-supplied) ---\n' + context);
  }

  const messages = [
    { role: 'system', content: systemParts.join('\n\n') },
    ...history
      .filter(function (m) {
        return (
          m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim()
        );
      })
      .slice(-maxHistory)
      .map(function (m) {
        return { role: m.role, content: m.content.trim().slice(0, maxMessageLen) };
      }),
    { role: 'user', content: message }
  ];

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.35,
        max_tokens: 800
      })
    });

    const raw = await openaiRes.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (e) {
      data = {};
    }

    if (!openaiRes.ok) {
      sendJson(res, openaiRes.status, headers, {
        error: (data && data.error && data.error.message) || raw || 'OpenAI error'
      });
      return;
    }

    const reply =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? String(data.choices[0].message.content).trim()
        : '';

    sendJson(res, 200, headers, { reply: reply || mockReply(messageLocale) });
  } catch (err) {
    sendJson(res, 500, headers, { error: 'Server error' });
  }
};

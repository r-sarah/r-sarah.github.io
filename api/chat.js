
function isMockKey(key) {
  if (!key || typeof key !== 'string') return true;
  const t = key.trim();
  if (!t) return true;
  if (/^sk-xxxx/i.test(t)) return true;
  if (/^xxxx/i.test(t)) return true;
  if (t === 'REPLACE_ME' || t === 'fake') return true;
  return false;
}

function corsHeaders() {
  const allow = (process.env.CHAT_ALLOWED_ORIGIN || '*').trim();
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function mockReply(locale) {
  if (locale === 'en') {
    return (
      'Demo mode: no real OpenAI key is configured yet. ' +
      'Set OPENAI_API_KEY in your Vercel project (and CHAT_ALLOWED_ORIGIN to your GitHub Pages URL), then redeploy.'
    );
  }
  return (
    'Mode démo : aucune vraie clé OpenAI n’est configurée. ' +
    'Ajoutez OPENAI_API_KEY dans Vercel (et CHAT_ALLOWED_ORIGIN vers votre URL github.io), puis redéployez.'
  );
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
  const headers = corsHeaders();

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, headers, { error: 'Method not allowed' });
    return;
  }

  const body = await readJsonBody(req);
  const message = (body.message || '').toString().trim();
  const locale = body.locale === 'en' ? 'en' : 'fr';
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message) {
    sendJson(res, 400, headers, { error: 'Missing message' });
    return;
  }

  const useMock =
    process.env.OPENAI_USE_MOCK === '1' ||
    isMockKey((process.env.OPENAI_API_KEY || '').trim());

  if (useMock) {
    sendJson(res, 200, headers, { reply: mockReply(locale), demo: true });
    return;
  }

  const apiKey = (process.env.OPENAI_API_KEY || '').trim();
  const model = (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
  const context = (process.env.PORTFOLIO_CONTEXT || '').toString().trim();

  const systemParts = [
    'You are a helpful assistant for a personal portfolio website.',
    'Answer only based on the following author-provided context when it is relevant. If the context does not contain the answer, say you do not have that information in the provided materials — do not invent facts.',
    'Keep answers concise (a few short paragraphs at most).',
    locale === 'en' ? 'Respond in English.' : 'Répondez en français.'
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
      .slice(-20)
      .map(function (m) {
        return { role: m.role, content: m.content.trim() };
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

    sendJson(res, 200, headers, { reply: reply || mockReply(locale) });
  } catch (err) {
    sendJson(res, 500, headers, { error: 'Server error' });
  }
};

(function () {
  'use strict';

  var root = document.getElementById('portfolio-chat-root');
  if (!root) return;

  var launcher = document.getElementById('portfolio-chat-launcher');
  var panel = document.getElementById('portfolio-chat-panel');
  var form = document.getElementById('portfolio-chat-form');
  var input = document.getElementById('portfolio-chat-input');
  var sendBtn = document.getElementById('portfolio-chat-send');
  var messagesEl = document.getElementById('portfolio-chat-messages');
  var suggestionsEl = document.getElementById('portfolio-chat-suggestions');

  var history = [];
  var welcomeInserted = false;

  function pack() {
    var lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
    var i18n = window.PORTFOLIO_I18N || {};
    return i18n[lang] || i18n.fr || {};
  }

  function t(key) {
    var p = pack();
    if (p[key] !== undefined && p[key] !== '') return p[key];
    var fr = (window.PORTFOLIO_I18N || {}).fr || {};
    return fr[key] !== undefined ? fr[key] : key;
  }

  function cfg() {
    return window.PORTFOLIO_CHAT_CONFIG || { apiUrl: '', maxHistoryMessages: 12 };
  }

  function apiUrl() {
    return (cfg().apiUrl || '').trim();
  }

  function setOpen(open) {
    if (!panel || !launcher) return;
    panel.hidden = !open;
    if (!open) {
      panel.setAttribute('aria-hidden', 'true');
      try {
        if (document.activeElement && panel.contains(document.activeElement)) {
          document.activeElement.blur();
        }
      } catch (err) {}
      try {
        launcher.focus();
      } catch (err2) {}
    } else {
      panel.removeAttribute('aria-hidden');
    }
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      ensureWelcome();
      if (input) {
        input.focus();
        try {
          input.select();
        } catch (e) {}
      }
    }
  }

  function scrollMessagesToEnd() {
    if (!messagesEl) return;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function plainAssistantText(text) {
    if (!text) return '';
    return String(text)
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/`([^`]+)`/g, '$1')
      .trim();
  }

  function appendBubble(role, text, extraClass) {
    if (!messagesEl) return;
    var display = role === 'assistant' ? plainAssistantText(text) : text;
    var wrap = document.createElement('div');
    wrap.className =
      'portfolio-chat-msg portfolio-chat-msg--' +
      (role === 'user' ? 'user' : 'bot') +
      (extraClass ? ' ' + extraClass : '');
    var bubble = document.createElement('div');
    bubble.className = 'portfolio-chat-msg-bubble';
    bubble.textContent = display;
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollMessagesToEnd();
    return bubble;
  }

  function ensureWelcome() {
    if (welcomeInserted || !messagesEl) return;
    welcomeInserted = true;
    var bubble = appendBubble('assistant', t('chat.welcome'), 'portfolio-chat-msg--welcome');
    if (bubble) bubble.setAttribute('data-chat-welcome', 'true');
  }

  function parseReply(data) {
    if (!data || typeof data !== 'object') return '';
    if (typeof data.reply === 'string') return data.reply;
    if (typeof data.message === 'string') return data.message;
    if (data.choices && data.choices[0] && data.choices[0].message) {
      var m = data.choices[0].message.content;
      return typeof m === 'string' ? m : '';
    }
    return '';
  }

  function trimHistory() {
    var max = cfg().maxHistoryMessages || 12;
    while (history.length > max) history.shift();
  }

  function maxInputLength() {
    var n = cfg().maxInputLength;
    return typeof n === 'number' && n > 0 ? n : 1500;
  }

  function assistantErrorForStatus(status, data) {
    if (status === 429) {
      if (data && data.reply) return String(data.reply).trim();
      return t('chat.rateLimited');
    }
    if (status === 403) return t('chat.forbidden');
    if (status === 413) return t('chat.tooLong');
    return t('chat.error');
  }

  function sendText(raw) {
    var text = (raw || '').trim();
    if (!text) return;
    var maxLen = maxInputLength();
    if (text.length > maxLen) text = text.slice(0, maxLen);

    ensureWelcome();
    appendBubble('user', text);
    history.push({ role: 'user', content: text });
    trimHistory();

    var url = apiUrl();
    if (!url) {
      appendBubble('assistant', t('chat.offlineReply'));
      history.push({ role: 'assistant', content: t('chat.offlineReply') });
      trimHistory();
      return;
    }

    sendBtn.disabled = true;
    input.disabled = true;
    var thinking = document.createElement('div');
    thinking.className =
      'portfolio-chat-msg portfolio-chat-msg--bot portfolio-chat-msg--thinking';
    var tb = document.createElement('div');
    tb.className = 'portfolio-chat-msg-bubble';
    tb.setAttribute('aria-live', 'polite');
    tb.textContent = t('chat.thinking');
    thinking.appendChild(tb);
    messagesEl.appendChild(thinking);
    scrollMessagesToEnd();

    var locale = document.documentElement.lang === 'en' ? 'en' : 'fr';
    var prior = history.slice(0, -1);
    var body = JSON.stringify({
      message: text,
      locale: locale,
      history: prior
    });

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      credentials: 'omit'
    })
      .then(function (res) {
        return res.text().then(function (txt) {
          var data;
          try {
            data = txt ? JSON.parse(txt) : {};
          } catch (e) {
            data = {};
          }
          if (!res.ok) {
            var err = new Error('HTTP ' + res.status);
            err.status = res.status;
            err.data = data;
            throw err;
          }
          return data;
        });
      })
      .then(function (data) {
        var reply = plainAssistantText(parseReply(data).trim());
        if (!reply) reply = t('chat.error');
        thinking.remove();
        appendBubble('assistant', reply);
        history.push({ role: 'assistant', content: reply });
        trimHistory();
      })
      .catch(function (err) {
        thinking.remove();
        var msg =
          err && err.status
            ? assistantErrorForStatus(err.status, err.data)
            : t('chat.error');
        appendBubble('assistant', msg);
        history.push({ role: 'assistant', content: msg });
        trimHistory();
      })
      .finally(function () {
        sendBtn.disabled = false;
        input.disabled = false;
        if (input) input.focus();
      });
  }

  if (launcher) {
    launcher.addEventListener('click', function () {
      setOpen(panel.hidden);
    });
  }
  if (root) {
    root.addEventListener(
      'click',
      function (e) {
        if (!e.target.closest('#portfolio-chat-close')) return;
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
        setOpen(false);
      },
      true
    );
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel && !panel.hidden) setOpen(false);
  });

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input || input.disabled) return;
      var v = input.value;
      input.value = '';
      sendText(v);
    });
  }

  if (suggestionsEl) {
    suggestionsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-chat-suggestion-key]');
      if (!btn) return;
      var k = btn.getAttribute('data-chat-suggestion-key');
      if (k) sendText(t(k));
    });
  }

  document.addEventListener('portfolio-i18n-applied', function () {
    var wEl = messagesEl && messagesEl.querySelector('[data-chat-welcome]');
    if (wEl) wEl.textContent = t('chat.welcome');
    var thinkingEl =
      messagesEl &&
      messagesEl.querySelector('.portfolio-chat-msg--thinking .portfolio-chat-msg-bubble');
    if (thinkingEl) thinkingEl.textContent = t('chat.thinking');
  });

  setOpen(true);
})();

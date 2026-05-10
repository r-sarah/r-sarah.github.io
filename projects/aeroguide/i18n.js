(function () {
  'use strict';
  var c = window.PROJECT_I18N_COMMON || { fr: {}, en: {} };
  window.PROJECT_PAGE_I18N = {
    fr: Object.assign({}, c.fr, {
      'meta.title': 'AeroGuide : Votre assistance voyage intelligent | Sarah Ranganadane',
      'page.h1': 'AeroGuide : Votre assistance voyage intelligent',
      'page.intro':
        "J'ai développé un agent IA spécialisé dans l'accompagnement des voyageurs pour centraliser des informations souvent dispersées et contradictoires. L'application répond précisément aux questions sur les visas, la douane, la sécurité aérienne et la santé.",
      'page.badge.rag': 'Agent RAG',
      'page.badge.langchain': 'Langchain',
      'page.badge.crawl': 'Crawl4AI (Scraping)',
      'page.badge.openai': 'OpenAI',
      'page.badge.vector': 'Vector Stores (FAISS/ChromaDB)',
      'page.badge.cursor': 'Cursor (Interface)',
      'page.goals':
        'Garantir une fiabilité maximale des informations voyage en s\'appuyant sur des sources officielles pour supprimer le stress lié aux préparatifs administratifs et logistiques.',
      'page.b1.title': 'Scraping de sources officielles',
      'page.b1.body':
        "J'ai automatisé la récupération de données fiables depuis Diplomatie.gouv, Douane.gouv, Air France et Elsan Care via Crawl4AI pour garantir des réponses certifiées.",
      'page.b2.title': 'Architecture RAG complète',
      'page.b2.p1':
        "<strong class=\"bento-card-lead\">Traitement des données :</strong> J'ai découpé les textes en chunks et les ai vectorisés pour conserver leur sens sémantique.",
      'page.b2.p2':
        '<strong class="bento-card-lead">Stockage intelligent :</strong> Utilisation de Vector Stores pour organiser les données et permettre des recherches par similarité ultra-rapides.',
      'page.b3.title': 'Agent IA contextuel',
      'page.b3.p1':
        "<strong class=\"bento-card-lead\">Mémoire persistante :</strong> L'agent se souvient de la destination et de la compagnie aérienne de l'utilisateur pour affiner ses conseils au fil de la discussion.",
      'page.b3.p2':
        '<strong class="bento-card-lead">Réflexion logique :</strong> Le système est capable de croiser les informations entre santé, bagages et visas pour offrir une vision globale du voyage.',
      'page.img.chat.alt': "Capture de conversation contextuelle de l'agent IA AeroGuide",
      'page.img.chat.caption': 'Voici un aperçu du code du chatbot.',
      'page.avail.title':
        'Disponibilité <span class="count-up" data-target="24" data-decimals="0">0</span>/7',
      'page.b4.body':
        "Mise en place d'un expert toujours accessible pour lever les doutes instantanément avant ou pendant le voyage.",
      'page.img.ui.alt': 'Interface du chatbot AeroGuide',
      'page.img.ui.caption': 'Interface du chatbot AeroGuide',
      'page.schema.title': "Schéma de l'architecture RAG",
      'page.schema.text':
        'Ce schéma présente le flux complet du projet, de la collecte de données officielles jusqu\'à la génération d\'une réponse fiable pour le voyageur.',
      'page.iframe.schema': 'Schema architecture RAG AeroGuide'
    }),
    en: Object.assign({}, c.en, {
      'meta.title': 'AeroGuide: Your smart travel assistant | Sarah Ranganadane',
      'page.h1': 'AeroGuide: Your smart travel assistant',
      'page.intro':
        'I built an AI agent focused on helping travelers by centralizing scattered, sometimes conflicting information. The app answers questions on visas, customs, flight safety, and health.',
      'page.badge.rag': 'RAG agent',
      'page.badge.langchain': 'LangChain',
      'page.badge.crawl': 'Crawl4AI (scraping)',
      'page.badge.openai': 'OpenAI',
      'page.badge.vector': 'Vector stores (FAISS/ChromaDB)',
      'page.badge.cursor': 'Cursor (UI)',
      'page.goals':
        'Maximize reliability by grounding answers in official sources and reduce stress around admin and logistics.',
      'page.b1.title': 'Official-source scraping',
      'page.b1.body':
        'I automated reliable data pulls from Diplomatie.gouv, Douane.gouv, Air France, and Elsan Care via Crawl4AI.',
      'page.b2.title': 'Full RAG architecture',
      'page.b2.p1':
        '<strong class="bento-card-lead">Data processing:</strong> I chunked texts and embedded them to preserve semantic meaning.',
      'page.b2.p2':
        '<strong class="bento-card-lead">Smart storage:</strong> Vector stores organize data for fast similarity search.',
      'page.b3.title': 'Context-aware AI agent',
      'page.b3.p1':
        '<strong class="bento-card-lead">Persistent memory:</strong> The agent remembers destination and airline to refine advice during the chat.',
      'page.b3.p2':
        '<strong class="bento-card-lead">Logical reasoning:</strong> The system cross-checks health, baggage, and visa info for a complete travel picture.',
      'page.img.chat.alt': 'Contextual AeroGuide AI chat screenshot',
      'page.img.chat.caption': 'Preview of the chatbot code.',
      'page.avail.title':
        'Availability <span class="count-up" data-target="24" data-decimals="0">0</span>/7',
      'page.b4.body':
        'An expert always on hand to clear doubts instantly before or during the trip.',
      'page.img.ui.alt': 'AeroGuide chatbot interface',
      'page.img.ui.caption': 'AeroGuide chatbot interface',
      'page.schema.title': 'RAG architecture diagram',
      'page.schema.text':
        'This diagram shows the full flow—from collecting official data to generating a reliable traveler answer.',
      'page.iframe.schema': 'AeroGuide RAG architecture schema'
    })
  };
})();

(function () {
  'use strict';
  var c = window.PROJECT_I18N_COMMON || { fr: {}, en: {} };
  window.PROJECT_PAGE_I18N = {
    fr: Object.assign({}, c.fr, {
      'meta.title': 'Hackathon - Mirakl | Sarah Ranganadane',
      'page.h1': 'Hackathon - Mirakl',
      'section.stack': 'Outils & technos IA',
      'section.objective': 'Objectifs',
      'page.intro':
        'Lors d\'un Hackathon intensif de <span class="count-up" data-target="5" data-decimals="0" data-duration="2200">0</span> jours organisé par Mirakl, mon équipe de <span class="count-up" data-target="7" data-decimals="0">0</span> personnes a développé une plateforme pour automatiser la recherche et l\'évaluation de vendeurs cibles (prospects) pour les marketplaces.',
      'page.badge.dust': 'Dust (Multi-agents)',
      'page.badge.n8n': 'n8n',
      'page.badge.codex': 'Codex',
      'page.badge.vercel': 'Vercel',
      'page.goal':
        'Identifier des vendeurs pertinents sur le web, automatiser leur scoring de compatibilité et proposer une solution flexible permettant de choisir n\'importe quelle marketplace source plutôt que de se limiter à des géants imposés.',
      'page.b1.title': 'Généralisation de la solution',
      'page.b1.body':
        'Nous avons développé une approche sur mesure permettant de scraper et d\'analyser les vendeurs de n\'importe quelle plateforme, allant plus loin que le sujet d\'origine axé uniquement sur Amazon et Zalando.',
      'page.b2.title': 'Architecture Multi-Agents (Dust)',
      'page.b2.body':
        'Nous avons configuré une chaîne de trois agents IA spécialisés : un <strong>Scraper Agent</strong> pour extraire automatiquement les données brutes des boutiques ; un <strong>Qualifier Agent</strong> pour analyser les types de produits et vérifier la cohérence avec la marketplace cible ; un <strong>Lead Gen Agent</strong> pour générer le score final et formuler une recommandation d\'action (Valider / Rejeter).',
      'page.b3.title': 'Automatisation des flux',
      'page.b3.body':
        'Création de workflows complets sur n8n pour orchestrer l\'envoi des données récoltées vers l\'infrastructure d\'agents Dust sans intervention manuelle.',
      'page.b4.title': 'Performance en compétition',
      'page.b4.body':
        'Notre solution a été sélectionnée parmi <span class="count-up" data-target="4" data-decimals="0">0</span> groupes concurrents pour accéder à la grande finale de notre sujet devant un jury d\'experts. Nous avons ensuite eu l\'opportunité de pitcher notre projet directement devant le CEO de Mirakl, au sein même des locaux de l\'entreprise.',
      'page.proto.title': 'Solution',
      'page.iframe.proto': 'Mirakl Connect Prospector',
      'page.btn.proto': 'Ouvrir le prototype',
      'page.event.title': "L'événement",
      'page.img1.alt': 'Photo du hackathon Mirakl',
      'page.img3.alt': 'Photo du hackathon Mirakl',
      'page.video.fallback': 'Votre navigateur ne supporte pas la lecture vidéo.'
    }),
    en: Object.assign({}, c.en, {
      'meta.title': 'Hackathon - Mirakl | Sarah Ranganadane',
      'page.h1': 'Hackathon - Mirakl',
      'section.stack': 'AI tools & tech',
      'section.objective': 'Objectives',
      'page.intro':
        'During an intensive <span class="count-up" data-target="5" data-decimals="0" data-duration="2200">0</span>-day hackathon organized by Mirakl, my team of <span class="count-up" data-target="7" data-decimals="0">0</span> built a platform to automate the search and evaluation of target sellers (prospects) for marketplaces.',
      'page.badge.dust': 'Dust (Multi-agents)',
      'page.badge.n8n': 'n8n',
      'page.badge.codex': 'Codex',
      'page.badge.vercel': 'Vercel',
      'page.goal':
        'Find relevant sellers on the web, automate compatibility scoring, and deliver a flexible solution that lets users choose any source marketplace instead of being limited to imposed giants.',
      'page.b1.title': 'Generalized solution',
      'page.b1.body':
        'We built a tailored approach to scrape and analyze sellers on any platform—going beyond the original brief focused only on Amazon and Zalando.',
      'page.b2.title': 'Multi-agent architecture (Dust)',
      'page.b2.body':
        'We set up a chain of three specialized AI agents: a <strong>Scraper Agent</strong> to automatically extract raw store data; a <strong>Qualifier Agent</strong> to analyze product types and check fit with the target marketplace; a <strong>Lead Gen Agent</strong> to produce the final score and an action recommendation (Approve / Reject).',
      'page.b3.title': 'Workflow automation',
      'page.b3.body':
        'Full n8n workflows orchestrate sending collected data to the Dust agent infrastructure with no manual steps.',
      'page.b4.title': 'Competition performance',
      'page.b4.body':
        'Our solution was selected from <span class="count-up" data-target="4" data-decimals="0">0</span> competing teams to reach the grand final for our track in front of an expert jury. We then pitched the project directly to Mirakl’s CEO at the company’s headquarters.',
      'page.proto.title': 'Solution',
      'page.iframe.proto': 'Mirakl Connect Prospector',
      'page.btn.proto': 'Open prototype',
      'page.event.title': 'The event',
      'page.img1.alt': 'Mirakl hackathon photo',
      'page.img3.alt': 'Mirakl hackathon photo',
      'page.video.fallback': 'Your browser does not support video playback.'
    })
  };
})();

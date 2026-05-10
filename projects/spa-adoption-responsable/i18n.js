(function () {
  'use strict';
  var c = window.PROJECT_I18N_COMMON || { fr: {}, en: {} };
  window.PROJECT_PAGE_I18N = {
    fr: Object.assign({}, c.fr, {
      'meta.title': 'SPA : Vers une adoption responsable | Sarah Ranganadane',
      'page.h1': 'SPA : Vers une adoption responsable',
      'page.intro':
        "Dans ce projet d'équipe à Eugenia School, nous avons cherché à comprendre pourquoi tant d'animaux sont abandonnés. Pour cela, nous avons récupéré et analysé les données réelles du site de la SPA.",
      'page.badge.py': 'Python (Scraping et nettoyage)',
      'page.badge.api': 'API',
      'page.badge.sheets': 'Google Sheets (Visualisation)',
      'page.goals':
        'Identifier les vraies raisons des abandons, identifier les animaux les plus concernés et proposer une solution.',
      'page.b1.title': 'Récupération des données',
      'page.b1.body':
        'J\'ai extrait et organisé plus de <span class="count-up" data-target="4000" data-decimals="0" data-duration="3000">0</span> informations grâce au web scraping. J\'ai ensuite nettoyé ces données pour qu\'elles soient exploitables (correction des dates, types d\'animaux, etc).',
      'page.img1.alt': 'Extrait du script Python utilise pour le scraping des donnees SPA',
      'page.b1.caption': 'Aperçu du script de collecte des données.',
      'page.b2.title': 'Ce que les chiffres nous disent',
      'page.b2.body':
        'L\'analyse montre que la raison principale est le manque de temps ou l\'incompatibilité entre le maître et l\'animal (<span class="count-up" data-target="47.4" data-decimals="1" data-duration="2800">0,0</span> % des cas sont liés au propriétaire).',
      'page.img2.alt': "Diagramme en camembert des causes principales d'abandon",
      'page.b2.caption': "Aperçu des causes d'abandon en camembert.",
      'page.b3.title': 'Création de la solution',
      'page.b3.body':
        "Solution : Aider les gens à adopter de manière plus responsable. J'ai imaginé un questionnaire de compatibilité. Il aide les futurs adoptants à vérifier si leur mode de vie colle bien avec les besoins de l'animal (entretien, sorties, budget).",
      'page.b4.title': 'Présentation orale',
      'page.b4.body':
        "Enfin j'ai présenté les résultats et les graphiques devant un jury et <span class=\"count-up\" data-target=\"60\" data-decimals=\"0\" data-duration=\"2600\">0</span> étudiants pour expliquer les conclusions.",
      'page.showcase.title': 'Aperçu de la solution',
      'page.showcase.text':
        "Le questionnaire web aide les futurs adoptants à évaluer leur compatibilite avec un animal avant l'adoption. Cette étape limite les adoptions impulsives et favorise des placements plus durables.",
      'page.iframe.live': 'Apercu du questionnaire Animal Solidarity',
      'page.btn.live': 'Voir le questionnaire en ligne'
    }),
    en: Object.assign({}, c.en, {
      'meta.title': 'SPA: Toward responsible adoption | Sarah Ranganadane',
      'page.h1': 'SPA: Toward responsible adoption',
      'page.intro':
        'In this team project at Eugenia School, we investigated why so many animals are abandoned. We pulled and analyzed real data from the SPA (French animal welfare society) website.',
      'page.badge.py': 'Python (scraping & cleaning)',
      'page.badge.api': 'API',
      'page.badge.sheets': 'Google Sheets (visualization)',
      'page.goals':
        'Identify the real reasons for abandonment, which animals are most affected, and propose a solution.',
      'page.b1.title': 'Data collection',
      'page.b1.body':
        'I extracted and organized more than <span class="count-up" data-target="4000" data-decimals="0" data-duration="3000">0</span> records via web scraping, then cleaned the data so it could be used (dates, animal types, etc.).',
      'page.img1.alt': 'Python script excerpt used for SPA data scraping',
      'page.b1.caption': 'Preview of the data collection script.',
      'page.b2.title': 'What the numbers tell us',
      'page.b2.body':
        'The analysis shows the main reason is lack of time or a mismatch between owner and pet (<span class="count-up" data-target="47.4" data-decimals="1" data-duration="2800">0,0</span>% of cases relate to the owner).',
      'page.img2.alt': 'Pie chart of main abandonment causes',
      'page.b2.caption': 'Pie chart preview of abandonment causes.',
      'page.b3.title': 'Building the solution',
      'page.b3.body':
        'Solution: help people adopt more responsibly. I designed a compatibility questionnaire so prospective adopters can check whether their lifestyle fits the animal’s needs (care, outings, budget).',
      'page.b4.title': 'Oral presentation',
      'page.b4.body':
        'Finally I presented the results and charts to a jury and <span class="count-up" data-target="60" data-decimals="0" data-duration="2600">0</span> students to explain the conclusions.',
      'page.showcase.title': 'Solution preview',
      'page.showcase.text':
        'The web questionnaire helps prospective adopters assess compatibility with an animal before adoption—reducing impulse adoptions and supporting more lasting placements.',
      'page.iframe.live': 'Animal Solidarity questionnaire preview',
      'page.btn.live': 'Open the live questionnaire'
    })
  };
})();

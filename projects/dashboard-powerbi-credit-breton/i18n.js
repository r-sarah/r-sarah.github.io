(function () {
  'use strict';
  var c = window.PROJECT_I18N_COMMON || { fr: {}, en: {} };
  window.PROJECT_PAGE_I18N = {
    fr: Object.assign({}, c.fr, {
      'meta.title': 'Dashboard Power BI - Crédit Breton | Sarah Ranganadane',
      'page.h1': 'Dashboard Power BI - Crédit Breton',
      'page.intro':
        'Dans le cadre d’un business case fictif, j’ai travaillé comme consultant pour le réseau "Crédit Breton". Ce projet simulait une situation réelle en entreprise autour de l’attribution de prêts immobiliers. J’ai analysé les processus existants dans les agences et proposé des solutions pour améliorer la prise de décision et le traitement des dossiers.',
      'page.badge.pbi': 'Power BI (Power Query et DAX)',
      'page.badge.excel': 'Excel',
      'page.badge.model': 'modélisation de données',
      'page.goals':
        'Réduire le temps de prise de décision, améliorer la qualité des dossiers entre les agences et automatiser le scoring des clients.',
      'page.b1.title': 'Système de scoring automatisé',
      'page.b1.body':
        'J’ai créé un indicateur de score de crédit. Les conseillers peuvent maintenant voir rapidement si un prêt est possible.',
      'page.b2.title': 'Optimisation des délais',
      'page.b2.body':
        'Le dashboard permet d’analyser les dossiers plus vite. Les clients reçoivent une réponse plus rapide et le travail en agence est plus fluide.',
      'page.b3.title': 'Performance commerciale',
      'page.b3.body':
        'Le projet a permis de réduire le nombre de dossiers renvoyés par la cellule centrale, car les agences utilisent désormais les mêmes règles d’analyse pour évaluer les demandes de prêt.',
      'page.b4.body':
        'J\'ai conçu une vue globale pour suivre l’activité des <span class="count-up" data-target="6" data-decimals="0">0</span> agences du réseau.',
      'page.img.db.alt': 'Schéma relationnel des tables Agences, Prêts et Clients',
      'page.img.db.caption': 'Architecture de la base de données',
      'page.img.map.alt': 'Vue géographique de la Bretagne comparant les agences du réseau',
      'page.img.map.caption': 'Voici un aperçu du dashboard.'
    }),
    en: Object.assign({}, c.en, {
      'meta.title': 'Power BI Dashboard - Crédit Breton | Sarah Ranganadane',
      'page.h1': 'Power BI Dashboard - Crédit Breton',
      'page.intro':
        'For a fictional business case I worked as a consultant to the "Crédit Breton" network. The project simulated a real mortgage lending workflow. I analyzed branch processes and proposed ways to improve decisions and case handling.',
      'page.badge.pbi': 'Power BI (Power Query & DAX)',
      'page.badge.excel': 'Excel',
      'page.badge.model': 'Data modeling',
      'page.goals':
        'Shorten decision time, improve case quality across branches, and automate client scoring.',
      'page.b1.title': 'Automated scoring',
      'page.b1.body':
        'I built a credit score indicator so advisors can quickly see whether a loan is viable.',
      'page.b2.title': 'Faster turnaround',
      'page.b2.body':
        'The dashboard speeds up case analysis. Clients get answers sooner and branch work flows more smoothly.',
      'page.b3.title': 'Commercial performance',
      'page.b3.body':
        'The project reduced cases bounced back by headquarters because branches now share the same analysis rules for loan requests.',
      'page.b4.body':
        'I designed an overview to monitor activity across the network’s <span class="count-up" data-target="6" data-decimals="0">0</span> branches.',
      'page.img.db.alt': 'Relational schema for Branches, Loans, and Clients tables',
      'page.img.db.caption': 'Database architecture',
      'page.img.map.alt': 'Geographic view of Brittany comparing branch locations',
      'page.img.map.caption': 'Dashboard preview.'
    })
  };
})();

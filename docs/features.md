# Catalogue des fonctionnalités du client Web

Ce document distingue les parcours déjà disponibles dans le nouveau client, ceux dont la conception est validée et ceux qui restent à concevoir. La [feuille de route](roadmap.md) reste la référence pour l'ordre du travail et les étapes d'implémentation.

## Statuts

- **Disponible** : présent dans le nouveau client et utilisable avec l'API ;
- **En développement** : implémentation commencée mais non terminée ;
- **Conçu** : parcours et wireframes validés provisoirement, sans implémentation dans le nouveau client ;
- **Prévu** : retenu dans le MVP mais pas encore entièrement conçu ;
- **Différé** : exclu du premier MVP Web et réévalué après usage réel.

La présence de code historique dans la branche ne rend pas une fonctionnalité disponible. Les pages liées aux anciens portefeuilles d'investissement doivent être retirées ou remplacées et la version `0.1.0` reste accessible dans l'historique Git.

## Disponibles

| Domaine        | Fonctionnalité                                                   | Limites actuelles                                                       |
| -------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Navigation     | Structure principale sur ordinateur et mobile                    | Les destinations métier seront ajoutées avec leurs pages                |
| Apparence      | Direction visuelle et thèmes clair et sombre                     | Le choix est mémorisé localement                                        |
| Foyer actif    | Premier lancement, sélection, persistance et changement de foyer | Sans authentification ni gestion des membres dans le MVP Web            |
| Vue d'ensemble | Patrimoine actuel et flux du mois courant                        | Les pages Transactions et Rapport mensuel restent à implémenter         |
| Comptes        | Liste groupée, création, détail et modification d’un compte      | Correction des soldes de rapprochement à valider en usage réel          |
| Comptes        | Archivage à solde nul, consultation séparée et restauration      | Historique conservé ; vérification du solde demandée après restauration |
| Référentiels   | Consultation du catalogue global des établissements              | Accessible depuis le menu du foyer et « Plus », en lecture seule        |

## En développement

| Domaine | Fonctionnalité                                  | État actuel                                                                                    |
| ------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Comptes | Ajout et correction des soldes de rapprochement | Ajout disponible depuis le détail. Correction depuis l’historique à valider avec l’API réelle. |

## Conçues

| Domaine         | Fonctionnalité                                                             | Limites actuelles                                                                              |
| --------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Transactions    | Liste chronologique, recherche, filtres et pagination progressive          | Contrat API consolidé disponible, client non implémenté                                        |
| Transactions    | Détail des revenus, dépenses et transferts                                 | Page dédiée uniquement dans la V1                                                              |
| Transactions    | Création et modification manuelles                                         | Montant nominal et effet explicite disponibles côté API                                        |
| Transactions    | Suppression individuelle et atomique des transferts                        | Aucune restauration dans la V1                                                                 |
| Import CSV      | [Compte, fichier, configuration, sélection et confirmation](csv-import.md) | Parcours validé le 11 novembre 2026 ; vocabulaire clarifié à la demande, client non implémenté |
| Rapport mensuel | Sélection du mois, revenus, dépenses et flux net                           | Aucun mois futur ni comparaison temporelle dans le MVP                                         |
| Rapport mensuel | Sankey sur ordinateur et listes à barres sur mobile                        | Liste de repli lorsque les montants ne permettent pas un Sankey fiable                         |
| Rapport mensuel | Ventilation par catégorie et transactions sources                          | Réutilise les filtres de la page Transactions                                                  |
| Qualité         | États de chargement, vide, erreur et succès                                | Règles communes à implémenter dans chaque parcours                                             |
| Accessibilité   | Responsive, clavier et cible WCAG 2.2 AA                                   | Conformité à vérifier après implémentation                                                     |

Les décisions détaillées sont consignées dans la [vue d'ensemble](overview.md), le [foyer actif](active-household.md), les [comptes](accounts.md), les [transactions](transactions.md), le [rapport mensuel](monthly-report.md) et les [règles transversales](cross-cutting-rules.md).

## Prévues pour le MVP

| Domaine          | Fonctionnalité                                                           | Objectif                                                                  |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| API côté serveur | Proxy Nuxt de même origine                                               | Masquer l'origine et la version de l'API au navigateur                    |
| Erreurs          | Intégration des Problem Details RFC 9457                                 | Contrat API disponible, à relier aux parcours Web                         |
| Référentiels     | Gestion des catégories et consultation des établissements pris en charge | Alimenter les comptes et transactions sans création libre d'établissement |
| Validation       | Données représentatives et tests navigateur                              | Vérifier le parcours complet en usage régulier                            |

## Différées après le MVP

- synchronisation bancaire ;
- budgets, objectifs et opérations récurrentes ;
- suivi détaillé des investissements et des titres ;
- multidevise ;
- partage familial, invitations et permissions ;
- pièces jointes, justificatifs et tags ;
- restauration des transactions supprimées ;
- analyses financières avancées.

Une fonctionnalité passe de « Prévue » à « Conçue » lorsque son parcours, ses cas limites et ses principaux états sont suffisamment définis. Elle ne devient « Disponible » qu'après implémentation et vérification avec l'API réelle.

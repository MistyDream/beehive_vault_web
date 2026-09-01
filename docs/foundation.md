# Décisions de fondation

Ce document résume la fondation de la reconstruction du client web. Les décisions
structurantes et leur historique sont conservés dans les
[Architecture Decision Records](adr/README.md).

## Conserver le socle Nuxt

Le client reste fondé sur Nuxt, Vue et TypeScript. La reconstruction conserve également l'internationalisation, les thèmes clair et sombre, les tokens visuels et les composants génériques dont le comportement reste adapté au nouveau produit.

Les pages, types, stores, composables et composants propres aux anciens portefeuilles d'investissement ne constituent pas une base fonctionnelle pour le nouveau MVP. Ils seront retirés ou remplacés progressivement après la passe de conception.

## Décisions formalisées

- [ADR-0001](adr/0001-nuxt-server-api-proxy.md) : le navigateur accède à l'API par un proxy serveur Nuxt de même origine ;
- [ADR-0002](adr/0002-preserve-decimal-strings.md) : les montants restent des chaînes décimales exactes à la frontière HTTP ;
- [ADR-0003](adr/0003-active-household-context.md) : le client résout et mémorise le foyer actif sans l'ajouter à toutes les URL de page.
- [ADR-0004](adr/0004-organize-components-by-responsibility.md) : les composants migrés sont organisés par responsabilité technique ou domaine métier plutôt que selon Atomic Design.

## Stabiliser les prérequis API

La liste nécessaire à la résolution du foyer actif est désormais exposée par `GET /v1/households`. Elle retourne la collection complète dans un ordre déterministe, sans pagination.

Les réponses métier de l'API utilisent désormais les Problem Details de la RFC 9457. Leurs URN `type`, leurs extensions `code` et leurs erreurs de champ structurées fournissent le contrat transversal nécessaire au nouveau client.

Le client utilisera le `type` canonique ou son raccourci `code` pour les comportements et les traductions, sans interpréter les messages humains retournés par le serveur.

Les autres contrats consommés sont désormais stabilisés et disponibles :

- pagination `page` et `limit` avec un `total` exact ;
- transferts représentés une seule fois dans la chronologie ;
- résumés compacts des comptes et catégories incorporés aux opérations ;
- montant nominal et effets signés calculés par l'API ;
- sous-totaux des groupes de comptes sans calcul décimal dans le navigateur ;
- cycle de vie des comptes archivés ;
- validation et correction des soldes ;
- catalogue global d'établissements.

La phase des prérequis API est terminée. Le client peut maintenant construire ses premiers parcours sans réimplémenter les règles métier ou les signes monétaires dans le navigateur.

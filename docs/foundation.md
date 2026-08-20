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

## Stabiliser les prérequis API

La liste nécessaire à la résolution du foyer actif est désormais exposée par `GET /v1/households`. Elle retourne la collection complète dans un ordre déterministe, sans pagination.

L'adoption des réponses Problem Details de la RFC 9457 reste le dernier prérequis transversal avant que le nouveau client dépende du contrat d'erreur de l'API.

Le client utilisera le code métier stable des erreurs pour les comportements et les traductions, sans interpréter les messages humains retournés par le serveur.

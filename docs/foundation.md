# Décisions de fondation

Ce document rassemble les décisions déjà validées pour la reconstruction du client web. Elles pourront devenir des ADR séparés lorsqu'une alternative ou une conséquence mérite de conserver un historique détaillé.

## Conserver le socle Nuxt

Le client reste fondé sur Nuxt, Vue et TypeScript. La reconstruction conserve également l'internationalisation, les thèmes clair et sombre, les tokens visuels et les composants génériques dont le comportement reste adapté au nouveau produit.

Les pages, types, stores, composables et composants propres aux anciens portefeuilles d'investissement ne constituent pas une base fonctionnelle pour le nouveau MVP. Ils seront retirés ou remplacés progressivement après la passe de conception.

## Accéder à l'API par un proxy Nuxt

Le navigateur appelle des routes de même origine sous `/api` sans connaître l'adresse du serveur Rust ni sa version :

```text
Navigateur  GET /api/households
Nuxt        GET {apiBase}/v1/households
```

L'adresse et la version de l'API appartiennent à la configuration privée du serveur Nuxt. Cette frontière évite une configuration CORS pour le navigateur, isole le client du préfixe `/v1` et prépare l'ajout ultérieur de l'authentification.

Masquer ces informations au navigateur constitue un découplage, pas une mesure de sécurité. L'autorisation des opérations reste de la responsabilité de l'API.

## Préserver les montants décimaux

Les montants reçus et envoyés restent des chaînes décimales à la frontière HTTP. Le client ne les convertit pas globalement en nombres JavaScript.

Les composants d'affichage et de saisie seront adaptés à ce contrat. Une bibliothèque décimale pourra être retenue pour les calculs locaux après une évaluation ciblée ; l'API reste la source des agrégations financières.

## Stabiliser les prérequis API

Deux évolutions de l'API précèdent son intégration par le nouveau client :

- exposer `GET /v1/households` afin de retrouver ou sélectionner un foyer ;
- adopter les réponses Problem Details de la RFC 9457.

Le client utilisera le code métier stable des erreurs pour les comportements et les traductions, sans interpréter les messages humains retournés par le serveur.

# ADR-0001 — Accéder à l'API par un proxy serveur Nuxt

- Statut : Accepté
- Date : 2026-08-20

## Contexte

Le client historique appelle directement l'API Rust depuis le navigateur à partir d'une URL publique. Le navigateur connaît ainsi l'adresse du serveur et le préfixe de version `/v1`. Chaque environnement doit également autoriser les origines du client avec CORS.

La reconstruction doit stabiliser l'interface consommée par le navigateur, préparer une future authentification et permettre à l'API Rust d'évoluer sans répéter sa configuration technique dans le code client.

## Décision

Le navigateur appelle uniquement des routes de même origine sous `/api`. Des handlers serveur Nuxt transmettent ces requêtes à l'API Rust.

```text
Navigateur  GET /api/households
Nuxt        GET {apiBase}/v1/households
```

L'adresse du serveur Rust et sa version appartiennent à la configuration privée de Nuxt. Elles ne sont pas exposées dans `runtimeConfig.public`.

Le proxy conserve la méthode, les paramètres, le corps et les statuts utiles. Il transmet les réponses JSON ainsi que les Problem Details RFC 9457 sans inventer un second contrat d'erreur. Les futurs secrets, jetons d'accès et appels à des prestataires externes restent exclusivement côté serveur.

Le proxy demeure une frontière de transport légère. Les règles financières et l'autorisation d'accéder aux données restent sous la responsabilité de l'API Rust.

## Conséquences positives

- le navigateur ne dépend plus de l'adresse ni de la version de l'API Rust ;
- les appels utilisent la même origine et ne nécessitent pas de configuration CORS pour le navigateur ;
- la future authentification peut être traitée côté serveur ;
- les contrats de succès et d'erreur restent définis par l'API métier ;
- un changement de version peut être absorbé à la frontière Nuxt.

## Conséquences négatives

- chaque appel traverse un intermédiaire supplémentaire ;
- le proxy doit préserver correctement les statuts, en-têtes et corps ;
- les erreurs réseau et délais d'attente existent sur deux segments ;
- les routes serveur Nuxt nécessitent des tests d'intégration dédiés.

Masquer l'adresse et la version constitue un découplage, pas une mesure de sécurité. L'API doit toujours vérifier l'autorisation de chaque opération.

## Alternatives considérées

### Appeler directement l'API Rust

Rejetée car le navigateur resterait couplé à son adresse, à sa version et à sa configuration CORS. Les futurs secrets ne pourraient pas être conservés côté serveur.

### Exposer uniquement l'adresse, mais masquer la version

Rejetée car cette solution conserve deux origines et ne fournit pas la frontière nécessaire à l'authentification et aux intégrations externes.

### Construire un backend web complet dans Nuxt

Rejetée car il dupliquerait les règles métier de l'API Rust. Le proxy ne doit adapter que le transport et les besoins propres au navigateur.

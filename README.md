# Beehive Vault Web

Client web de Beehive Vault, une application personnelle de suivi patrimonial et de compréhension des flux financiers.

Le projet entre dans une reconstruction du MVP sur la branche `reboot/web-foundation`. La version `0.1.0`, centrée sur les portefeuilles d'investissement, reste disponible dans l'historique Git et sous le tag `v0.1.0`.

## État actuel

- l'audit statique de la version `0.1.0` est terminé ;
- Nuxt, Vue, TypeScript, l'internationalisation et le socle visuel sont conservés ;
- le domaine historique des portefeuilles sera remplacé par celui du nouveau socle financier ;
- la conception produit et visuelle précède toute nouvelle implémentation.

## Documentation

- [Feuille de route](docs/roadmap.md)
- [Catalogue des fonctionnalités](docs/features.md)
- [Décisions de fondation](docs/foundation.md)
- [Décisions d'architecture](docs/adr/README.md)
- [Chantier de conception](docs/design.md)
- [Direction visuelle](docs/visual-direction.md)
- [Audit des composants génériques](docs/component-audit.md)
- [Foyer actif](docs/active-household.md)
- [Comptes](docs/accounts.md)
- [Transactions](docs/transactions.md)
- [Rapport mensuel](docs/monthly-report.md)
- [Règles transversales](docs/cross-cutting-rules.md)
- [Vue d'ensemble](docs/overview.md)
- [Environnement de développement](docs/development.md)

## Développement

L'environnement local utilise Node.js 20 ou plus récent, Corepack avec Yarn 4, Rust,
PostgreSQL 18 et Process Compose. Consulter le guide de
[développement local](docs/development.md) pour préparer, démarrer et arrêter
l'ensemble de l'application.

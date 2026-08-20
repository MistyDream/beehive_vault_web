# Architecture Decision Records

Ce répertoire conserve les décisions d'architecture importantes du client web Beehive Vault. Un ADR explique le contexte d'une décision, le choix effectué, les alternatives considérées et ses conséquences.

## Cycle de vie

Un ADR possède l'un des statuts suivants :

- `Proposé` : la décision est en discussion ;
- `Accepté` : la décision guide le projet ;
- `Remplacé` : un nouvel ADR prend sa place ;
- `Abandonné` : la décision n'est plus applicable sans remplacement direct.

Un ADR accepté n'est pas réécrit pour refléter une nouvelle décision. Un nouvel ADR est créé et référence celui qu'il remplace afin de préserver l'historique.

## Index

- [ADR-0001 — Accéder à l'API par un proxy serveur Nuxt](0001-nuxt-server-api-proxy.md)
- [ADR-0002 — Préserver les montants sous forme de chaînes décimales](0002-preserve-decimal-strings.md)
- [ADR-0003 — Résoudre et persister le foyer actif côté client](0003-active-household-context.md)

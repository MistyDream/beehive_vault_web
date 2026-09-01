# ADR-0004 — Organiser les composants par responsabilité et domaine

- Statut : Accepté
- Date : 2026-09-01

## Contexte

Le client historique classe ses composants selon les catégories Atomic Design `atoms`, `molecules` et `organisms`. Cette organisation fournit une hiérarchie initiale, mais la frontière entre ces catégories devient subjective dès qu'un composant combine une interaction, une mise en page et un contexte d'utilisation.

La reconstruction introduit à la fois des primitives génériques, des éléments de formulaire, des structures de navigation et des composants propres aux foyers, comptes, transactions et rapports. Leur rôle et leur domaine constituent des critères de placement plus stables que leur niveau supposé de composition.

Nuxt auto-importe les composants sans préfixer leur nom avec leur chemin. Les noms de fichiers génériques doivent donc rester explicites et uniques dans l'ensemble du projet.

## Décision

Les nouveaux composants et les composants adaptés sont organisés par responsabilité technique ou par domaine métier :

```text
components/
├── ui/
├── form/
├── feedback/
├── layout/
├── households/
├── accounts/
├── transactions/
└── reports/
```

Les répertoires techniques ont les responsabilités suivantes :

- `ui` contient les primitives visuelles génériques telles que les boutons, surfaces, séparateurs, badges et filtres ;
- `form` contient les champs, leurs aides, leurs erreurs et les contrôles de saisie ;
- `feedback` contient les dialogues, notifications et états transversaux ;
- `layout` contient la structure générale, la navigation et les éléments de page partagés.

Les autres répertoires regroupent les composants composés autour d'un domaine fonctionnel. Un composant utilisé par un seul parcours reste dans son domaine même s'il contient plusieurs primitives.

Le préfixe `BH` est conservé pour les primitives génériques qui forment le design system interne. Les composants métier utilisent des noms explicites fondés sur leur rôle, par exemple `AccountListItem` ou `HouseholdSelector`, sans préfixe obligatoire.

La migration reste progressive :

1. un composant historique reste dans son répertoire Atomic Design tant qu'il n'est ni adapté, ni remplacé, ni supprimé ;
2. sa première modification fonctionnelle dans la reconstruction le déplace vers le répertoire cible approprié ;
3. les imports et tests sont mis à jour dans la même tranche ;
4. aucun déplacement massif n'est réalisé uniquement pour uniformiser l'arborescence.

## Conséquences positives

- le placement dépend d'une responsabilité ou d'un domaine observable ;
- les primitives génériques restent distinctes des composants métier ;
- l'arborescence suit les parcours et le vocabulaire de la reconstruction ;
- la migration peut avancer par petites tranches révisables ;
- le préfixe des primitives réduit les collisions liées aux auto-imports Nuxt.

## Conséquences négatives

- l'ancienne et la nouvelle organisation coexistent pendant la migration ;
- certains composants transversaux peuvent demander un choix entre `ui`, `feedback` et `layout` ;
- déplacer un composant adapté impose de mettre à jour ses imports et ses tests ;
- le préfixe `BH` rend les noms des primitives légèrement plus longs.

## Alternatives considérées

### Conserver Atomic Design

Rejetée car les catégories décrivent un niveau de composition interprétable plutôt qu'une responsabilité stable. Elles ne permettent pas non plus d'identifier directement le domaine propriétaire d'un composant métier.

### Utiliser un dossier entièrement plat

Rejetée car la liste deviendrait difficile à parcourir avec la croissance du MVP et mélangerait primitives, structure et composants métier.

### Organiser tous les composants uniquement par domaine

Rejetée car les primitives, champs et mécanismes de retour utilisateur sont partagés entre plusieurs domaines. Les dupliquer ou les rattacher arbitrairement au premier parcours créerait un mauvais signal de propriété.

### Extraire immédiatement un paquet de design system

Rejetée car les primitives servent actuellement un seul client. Une extraction ajouterait une frontière de publication et de compatibilité avant qu'un second consommateur ou un besoin de versionnement ne la justifie.

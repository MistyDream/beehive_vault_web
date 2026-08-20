# Chantier de conception

La reconstruction comprend une nouvelle passe de conception avant l'implémentation des parcours. Elle doit améliorer l'expérience sans perdre les acquis d'accessibilité, de responsive design et d'identité visuelle de la version `0.1.0`.

Les décisions prises pendant cette passe sont consignées dans la [direction visuelle](visual-direction.md).

## Objectifs

- rendre le patrimoine et les flux du mois compréhensibles dès l'accueil ;
- guider un premier utilisateur depuis la création du foyer jusqu'à sa première vue consolidée ;
- réduire la densité et la complexité des écrans de gestion ;
- permettre de remonter d'un total financier à ses comptes ou transactions sources ;
- conserver une expérience cohérente sur mobile et ordinateur ;
- viser WCAG 2.1 AA pour les parcours du MVP.

## Écrans à concevoir en priorité

1. [création ou sélection du foyer](active-household.md) — structure et wireframe validés ;
2. navigation générale et [vue d'ensemble](overview.md) — structure validée ;
3. liste et détail des comptes ;
4. liste et formulaire des transactions ;
5. rapport mensuel et accès aux transactions sources ;
6. gestion des catégories et établissements.

## Livrables attendus

- architecture de l'information ;
- parcours principaux et cas limites ;
- wireframes mobile et ordinateur ;
- hiérarchie visuelle du tableau de bord ;
- inventaire des composants conservés, adaptés, remplacés ou supprimés ;
- états de chargement, vide, erreur et succès ;
- règles de contenu, de formatage financier et d'accessibilité.

La structure de la vue d'ensemble et la [direction visuelle](visual-direction.md) sont validées. L'[audit des composants génériques](component-audit.md) définit le socle à préserver, les éléments à reconstruire et leur ordre de migration.
La structure et le wireframe du [foyer actif](active-household.md) sont également validés.

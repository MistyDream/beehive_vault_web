# Audit des composants génériques

Cet audit détermine ce qui peut réellement servir à la reconstruction du client web. Il porte sur les composants, composables, dépendances et conventions de la version `0.1.0`. Il ne valide pas leur apparence actuelle : tout élément conservé doit encore être aligné avec la [direction visuelle](visual-direction.md).

## Décisions

Les termes suivants décrivent le devenir du code existant :

- **conserver** : le rôle et l'implémentation constituent une base saine ;
- **adapter** : le comportement principal reste utile, mais son API, son style ou son accessibilité doivent évoluer ;
- **remplacer** : le besoin demeure, mais l'implémentation actuelle n'est pas une base suffisamment sûre ;
- **supprimer** : le composant appartient au domaine historique ou n'apporte pas assez de valeur pour justifier son maintien.

Les composants ne sont pas migrés uniquement parce qu'ils sont génériques. Ils doivent répondre à un besoin concret du MVP.

## Résultat synthétique

Le socle historique contient de bons acquis, mais pas encore un design system réutilisable tel quel.

- les mécanismes de thème, de notification, de focus des dialogues et les bases des champs de formulaire sont à préserver ;
- la navigation et la structure de page doivent être remplacées pour suivre les wireframes validés ;
- les composants qui manipulent des montants doivent être remplacés afin de ne jamais convertir les décimaux de l'API en nombres JavaScript ;
- les composants complexes de sélection et de tableau demandent une nouvelle fondation accessible, responsive et testée ;
- tout le domaine des portefeuilles d'investissement doit être supprimé de la branche de reconstruction.

## Inventaire des composants

### Atomes

| Composant           | Décision  | Motif principal                                                                                                                     |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `BHBadge`           | Adapter   | Conserver le rôle d'indicateur non interactif, puis le distinguer clairement d'un filtre amovible.                                  |
| `BHButton`          | Adapter   | Bonne base sémantique, mais variantes par défaut, liens, états désactivés et tailles tactiles doivent être clarifiés.               |
| `BHCardBase`        | Remplacer | La mise en page `flex` et les espacements sont imposés à toutes les surfaces. Une primitive `Surface` plus neutre est nécessaire.   |
| `BHCurrencyDisplay` | Remplacer | Le montant est un `number`, le placement de la devise est forcé et la couleur porte implicitement le sens positif ou négatif.       |
| `BHImage`           | Supprimer | Le composant n'ajoute pas de politique d'image utile par rapport à `NuxtImg`.                                                       |
| `BHPercentDisplay`  | Supprimer | Il est lié aux performances d'investissement. Un format de mesure sera conçu lorsqu'un nouveau besoin apparaîtra.                   |
| `BHSeparator`       | Adapter   | La primitive doit utiliser un séparateur sémantique et gérer explicitement son orientation.                                         |
| `BHStockAvatar`     | Supprimer | Il appartient au domaine des valeurs mobilières.                                                                                    |
| `BHTag`             | Remplacer | Ses responsabilités se confondent avec `BHBadge` et son action de suppression est trop petite. Il devient un `FilterChip` distinct. |
| `BHToaster`         | Adapter   | `vue-sonner` et le mécanisme de thème sont utiles ; les styles et les couleurs doivent suivre les nouveaux tokens.                  |

### Champs et interactions

| Composant            | Décision  | Motif principal                                                                                                                             |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `BHBaseInput`        | Adapter   | Association label-erreur correcte ; ajouter aide, `name`, autocomplétion et conventions communes aux champs.                                |
| `BHDateInput`        | Adapter   | L'entrée native est une bonne base ; supprimer l'API inutilisée et l'intégrer au socle commun des champs.                                   |
| `BHTextarea`         | Adapter   | Base accessible utile ; relier aussi l'aide et le compteur à la zone de texte.                                                              |
| `BHNumberInput`      | Remplacer | `parseFloat`, le bornage pendant la saisie et le modèle `number` détruisent la représentation décimale attendue pour l'argent.              |
| `BHBaseSelect`       | Remplacer | Le combobox artisanal est volumineux, sans tests, et l'attribut `required` appliqué à son bouton n'a pas la sémantique attendue.            |
| `BHSearchableSelect` | Remplacer | Il contient un bouton d'effacement imbriqué dans le bouton combobox, structure HTML invalide et fragile pour les technologies d'assistance. |
| `BHDropdown`         | Adapter   | Floating UI, le clavier et le mouvement réduit sont déjà traités ; l'API, le focus et le rendu visuel restent à normaliser et tester.       |
| `BHTabs`             | Adapter   | Le clavier est pris en charge, mais les onglets de navigation et les onglets interactifs doivent être séparés et reliés à leurs panneaux.   |

### Structure et affichage de données

| Composant                | Décision  | Motif principal                                                                                                                                                                   |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BHModal`                | Adapter   | Le dialogue, le piège de focus, Échap et le blocage du défilement sont de bonnes bases. La fermeture extérieure doit être configurable selon le risque.                           |
| `BHDrawer`               | Remplacer | Le comportement de dialogue est utile, mais son contenu est piloté par un store global et effacé avant la fin de la fermeture. Une API contrôlée localement sera plus prévisible. |
| `BHTable`                | Remplacer | Données en `any`, clé de ligne incorrecte en l'absence d'identifiant, absence de légende et de stratégie responsive, pagination et tri trop couplés.                              |
| `BHHeader`               | Remplacer | Il ne contient qu'un déclencheur mobile et dépend de l'ancienne barre latérale.                                                                                                   |
| `BHSidebar`              | Remplacer | Sa navigation et son pied ne correspondent plus au menu de foyer et à la navigation mobile validés.                                                                               |
| `BHVerticalNavigation`   | Remplacer | Son API est liée à l'ancienne navigation extensible.                                                                                                                              |
| `BHNavigationExpandable` | Supprimer | Les référentiels du foyer ne doivent pas devenir des onglets extensibles de la navigation principale.                                                                             |
| `BHKpiTile`              | Supprimer | Le motif de grille de KPI vient du portefeuille historique et ne correspond pas à la hiérarchie de la vue d'ensemble.                                                             |

### Domaine historique

Les composants suivants sont supprimés sans migration. Ils peuvent rester
consultables dans le tag `v0.1.0` si une interaction ponctuelle doit servir de
référence :

- `BHPortfolioCard`, `BHPortfolioPerformanceFormulaCard` et `BHPortfolioPeriodPicker` ;
- `BHPortfolioAllocationCard`, `BHPortfolioCashCard`, `BHPortfolioDeleteDialog`, `BHPortfolioForm`, `BHPortfolioHeaderBand` et `BHPortfolioKpiStrip` ;
- `BHPortfolioPerformanceBreakdownCard`, `BHPortfolioPerformanceHeroCard`, `BHPortfolioPerformanceWaterfallCard` et `BHPortfolioPositionsCard` ;
- `BHPortfolioRecentTransactionsCard`, `BHPortfolioStockDrawerContent`, `BHPortfolioTransactionsCard` et `BHPortfolioTransactionsToolbar`.

## Composables et infrastructure

| Élément                                                                         | Décision                | Motif principal                                                                                                                                      |
| ------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useFieldIds`                                                                   | Adapter                 | Conserver les identifiants stables et ajouter les relations vers l'aide et les contraintes.                                                          |
| `useModalFocusTrap`                                                             | Adapter                 | Conserver le retour du focus ; sécuriser le rendu serveur, les dialogues imbriqués et les tests clavier.                                             |
| `useTheme`                                                                      | Adapter                 | Conserver la persistance et la transition courte ; appliquer les nouveaux thèmes et la stratégie de préférence initiale qui sera retenue.            |
| `useToast`                                                                      | Conserver               | API simple et indépendante du domaine.                                                                                                               |
| `useLocaleFormatters`                                                           | Remplacer partiellement | Séparer dates, montants et quantités. Les dates doivent expliciter leur fuseau et l'argent doit préserver les chaînes décimales.                     |
| `useSidebar`                                                                    | Remplacer               | Le nouvel app shell aura des comportements distincts sur ordinateur et mobile.                                                                       |
| `useDrawer` et le store associé                                                 | Supprimer               | Leur injection globale de composants crée un couplage inutile.                                                                                       |
| `useChartTheme`                                                                 | Différer                | Aucun graphique n'est requis avant la définition des données historiques à afficher.                                                                 |
| Plugin API                                                                      | Remplacer               | Le navigateur appelle aujourd'hui directement une URL publique. Le nouveau client passera par le proxy Nuxt et conservera la normalisation RFC 9457. |
| Composables, stores, types et utilitaires `portfolio`/`transaction` historiques | Supprimer               | Les contrats et calculs correspondent au domaine d'investissement abandonné.                                                                         |

Le lien d'évitement vers le contenu principal, les états de focus visibles, la prise en charge de `prefers-reduced-motion`, les squelettes et le changement de thème sans flash sont des comportements à préserver, indépendamment des fichiers qui les portent actuellement.

## Dépendances

### À conserver

- Nuxt, Vue, TypeScript, Vue Router et l'internationalisation ;
- Tailwind et les tokens CSS sémantiques, après simplification de la palette ;
- Pinia pour les futurs états réellement partagés, sans l'utiliser par défaut pour piloter les composants d'interface ;
- VueUse, Lucide, Floating UI, `focus-trap`, `vue-sonner`, `@nuxt/fonts` et `@nuxt/image` tant que leurs usages restent justifiés.

### À retirer ou différer

`highcharts`, `highcharts-vue` et `nuxt-charts` ne doivent pas être chargés dans le nouveau socle. Deux solutions de graphiques coexistent actuellement alors qu'aucun contrat de données historiques n'est encore défini, et l'accessibilité de Highcharts est explicitement désactivée dans le plugin existant. Une seule solution sera choisie au moment où un graphique utile aura été conçu.

## Primitives cibles

La reconstruction doit introduire les primitives au rythme des parcours, dans l'ordre de dépendance suivant :

1. tokens de couleur, typographie Manrope, espacements, rayons, ombres, focus et mouvement réduit ;
2. `Button`, `IconButton`, `Surface`, `Divider`, `Badge` et `FilterChip` ;
3. `FormField`, `TextInput`, `MoneyInput`, `DateInput` et `Textarea` ;
4. `Select`, `Combobox`, `Menu` et les onglets de navigation ;
5. `Dialog`, `Drawer`, `Toast` et panneaux d'état ;
6. `Pagination`, puis présentation tabulaire ou en liste selon les données et la largeur disponible ;
7. composants métier composés à partir de ces primitives.

`MoneyInput` et l'affichage des montants doivent accepter une représentation décimale sous forme de chaîne. La mise en forme localisée est une opération d'affichage ; elle ne doit jamais modifier la valeur transmise à l'API.

## Accessibilité, responsive et tests

Les composants interactifs migrés devront être vérifiés au minimum selon les règles suivantes :

- navigation complète au clavier, ordre de focus prévisible et retour du focus après fermeture d'une couche ;
- nom accessible, état et message d'erreur reliés à chaque contrôle ;
- cible tactile d'au moins 44 par 44 pixels pour les actions isolées ;
- contraste WCAG 2.2 AA dans les deux thèmes, sans utiliser la couleur comme seule porteuse de sens ;
- prise en charge du zoom, du mouvement réduit et des largeurs mobiles ;
- transformation explicite des tableaux en listes ou cartes lorsque le simple défilement horizontal ne suffit pas.

Le projet ne possède actuellement aucun test automatisé de composant ni script de test. Avant de migrer les interactions complexes, la fondation technique devra ajouter un environnement de tests Vue/Nuxt, des tests d'accessibilité automatisés et quelques tests navigateur sur les parcours critiques. Les contrôles automatisés compléteront, sans la remplacer, une vérification manuelle au clavier et avec un lecteur d'écran.

## Ordre de migration

1. mettre en place les vérifications et les tests nécessaires aux primitives ;
2. retirer les pages, contrats, stores et dépendances du domaine historique ;
3. adapter les tokens, Manrope, le thème et l'app shell responsive ;
4. migrer les primitives visuelles simples et les états de page ;
5. reconstruire les champs, en commençant par la saisie monétaire exacte ;
6. reconstruire les couches de dialogue et les menus ;
7. n'introduire sélection avancée, tableau ou graphique qu'avec le premier parcours qui en démontre le besoin.

Chaque étape doit rester assez petite pour être revue avant le commit suivant.

# Direction visuelle

- Statut : direction validée
- Date de dernière mise à jour : 2026-08-18

Ce document consigne les décisions visuelles du nouveau client web. Il complète la structure fonctionnelle définie dans la [vue d'ensemble](overview.md), sans figer prématurément les composants ni leurs dimensions exactes.

## Référence visuelle

[Ouvrir la vue d'ensemble en clair, sombre, ordinateur et mobile](wireframes/overview-visual-direction.html)

Cette référence réunit les décisions ci-dessous dans la structure validée de la
vue d'ensemble. Elle guide la définition des tokens et des composants, sans
constituer une spécification au pixel près.

## 1. Personnalité générale

### Décision

Beehive Vault adopte une identité **chaleureuse et précise** :

- une application personnelle, calme et rassurante ;
- une présentation rigoureuse des données financières ;
- une identité visible sans reprendre les codes d'une banque traditionnelle ;
- un équilibre cible d'environ 80 % de sobriété et 20 % d'identité Beehive.

La chaleur ne doit pas réduire le contraste ni rendre l'interface décorative.
Les données et leur hiérarchie restent prioritaires.

### Thèmes clair et sombre

Les deux thèmes partagent la même identité, la même hiérarchie et les mêmes règles de composants. Le thème sombre n'est pas une direction artistique indépendante.

- le thème clair reprend la direction « chaleureuse et précise » validée ;
- le thème sombre utilise une palette chaude : charbon légèrement brun, surfaces gris chaud, miel lumineux et bleu pétrole adouci ;
- le thème sombre conserve plusieurs niveaux de surface afin de ne pas devenir un ensemble noir uniforme.

### Directions écartées

- une identité sobre et institutionnelle, jugée trop froide et générique ;
- une identité Beehive très expressive, qui risquerait de concurrencer les
  informations financières ;
- un thème sombre bleuté, plus technologique mais moins chaleureux ;
- un thème noir très contrasté, plus spectaculaire mais potentiellement plus
  fatigant.

## 2. Fond principal du thème clair

### Décision

Le thème clair utilise un fond ivoire évoquant le papier. Cette teinte apporte une chaleur perceptible et distingue Beehive Vault des interfaces financières entièrement blanches ou grises.

Les cartes sont seulement légèrement plus claires. Certaines sections peuvent rester directement sur le fond afin d'éviter un empilement de rectangles et de préserver une hiérarchie calme.

### Variantes écartées

- le blanc cassé, plus conventionnel malgré un contraste légèrement plus net ;
- le gris chaud, plus dense et minéral, mais susceptible de rendre l'ensemble plus terne.

## 3. Barre latérale

### Décision

Sur ordinateur, la barre latérale utilise un charbon sombre qui contraste avec le fond ivoire. Elle sert d'ancrage visuel, sépare clairement la navigation du contenu et renforce l'identité de l'application sans concurrencer les données.

Dans le thème sombre, elle conserve le même rôle avec une surface légèrement plus foncée que le contenu principal, plutôt qu'un contraste clair-sombre aussi marqué.

L'état actif emploie un fond charbon plus clair et un accent miel. Le menu du foyer reste placé en bas de la barre latérale.

### Variantes écartées

- une barre latérale ivoire ton sur ton, plus légère mais moins structurante ;
- une barre latérale miel, plus distinctive mais trop présente pour un usage quotidien.

## 4. Couleurs d'accent

### Décision

Le miel est l'accent principal de Beehive Vault. Il identifie notamment la navigation active, les actions principales, les sélections et les éléments de marque. Son usage reste mesuré afin de préserver la priorité des données.

Le bleu pétrole est l'accent secondaire. Il est utilisé pour les liens, les informations contextuelles et certaines séries ou représentations graphiques.
Il ne concurrence pas le miel dans la hiérarchie des actions.

Les couleurs sémantiques restent indépendantes de ces accents : le vert, le rouge, l'orange et leurs équivalents accessibles sont réservés aux états et aux significations financières appropriées. Une information ne repose jamais sur la couleur seule.

### Variantes écartées

- le bleu pétrole comme couleur d'interaction principale, qui réduirait la présence de l'identité Beehive ;
- le miel et le bleu pétrole à importance égale, qui rendrait la hiérarchie des interactions moins prévisible.

## 5. Surfaces et profondeur

### Décision

L'interface utilise des surfaces calmes délimitées par des bordures fines. La carte principale peut recevoir une teinte légèrement distincte, tandis que les sections secondaires restent sobres et que les lignes internes ne deviennent pas chacune une nouvelle carte.

Une ombre légère renforce la séparation des surfaces sur le fond ivoire. Elle sera un peu plus perceptible que dans la première proposition, mais restera diffuse, de faible opacité et sans donner l'impression que les cartes flottent fortement au-dessus de la page.

Les ombres ne remplacent jamais une hiérarchie claire et ne sont pas appliquées systématiquement aux listes, tableaux ou éléments imbriqués.

### Variantes écartées

- les cartes flottantes aux ombres et volumes marqués, trop proches d'un tableau de bord générique ;
- une présentation entièrement éditoriale, élégante mais moins robuste pour les écrans denses et l'adaptation mobile.

## 6. Arrondis

### Décision

L'interface utilise une échelle d'arrondis équilibrée plutôt qu'un rayon unique :

- 10 à 12 px pour les surfaces principales et les cartes ;
- environ 8 px pour les boutons, champs, éléments de navigation et petits contrôles ;
- des valeurs plus faibles uniquement lorsque la densité d'un tableau ou d'une liste le justifie.

Cette échelle accompagne la chaleur de la palette sans donner aux surfaces une apparence excessivement molle ou ludique.

### Variantes écartées

- des arrondis compacts de 6 à 8 px partout, plus précis mais trop rigides ;
- des arrondis de 16 à 20 px, trop doux et susceptibles d'accentuer l'effet d'empilement de cartes.

## 7. Typographie

### Décision

Manrope est l'unique famille typographique de l'interface. Elle est utilisée pour les titres, le contenu, la navigation, les contrôles et les montants. La hiérarchie repose sur la taille, la graisse, la couleur et l'espacement plutôt que sur l'association de plusieurs polices.

Les montants utilisent des chiffres tabulaires afin de rester alignés dans les listes, tableaux et comparaisons. Ils conservent cependant la même famille que le reste de l'interface : aucune police monospace dédiée n'est employée.

Les graisses nécessaires seront limitées pendant la définition des tokens afin de préserver une interface calme et un chargement raisonnable.

### Variantes écartées

- Source Sans 3, très lisible mais plus neutre et moins distinctive ;
- l'association historique de Poppins pour les titres et Nunito pour le contenu, plus douce mais moins homogène ;
- Space Mono pour les montants, dont le caractère technique attirerait trop l'attention.

## 8. Motif alvéolaire

### Décision

Le motif alvéolaire est une signature discrète et occasionnelle. Il reste présent dans le logo et peut apparaître en filigrane très léger sur des surfaces à faible densité d'information, par exemple un écran d'accueil initial, un état vide ou une zone explicitement consacrée à la marque.

Il n'est pas utilisé derrière les données financières courantes, dans les tableaux, ni comme texture permanente de la barre latérale. Sa présence ne doit jamais réduire la lisibilité ou concurrencer les montants.

### Variantes écartées

- un motif structurel récurrent dans la navigation et les surfaces, trop exposé pour un usage quotidien ;
- une disparition complète en dehors du logo, qui limiterait inutilement les possibilités de signature sur les écrans peu denses.

## 9. Densité et espacements

### Décision

L'interface adopte une densité équilibrée. Les grandes sections disposent d'une respiration nette, tandis que les lignes de comptes et les valeurs comparables restent suffisamment proches pour être parcourues rapidement.

Les contrôles interactifs conservent une cible tactile d'au moins 44 px lorsque le contexte l'exige. Les tableaux et listes longues peuvent employer une variante plus compacte, sans réduire la lisibilité ni la taille des cibles essentielles.

Sur mobile, les espacements latéraux sont réduits avant la taille du texte ou des contrôles. Le défilement vertical reste accepté lorsqu'il préserve une hiérarchie claire.

### Variantes écartées

- une densité compacte appliquée à toute l'interface, trop chargée pour la vue d'ensemble ;
- une densité très spacieuse, confortable mais génératrice de défilement et moins efficace pour comparer plusieurs comptes.

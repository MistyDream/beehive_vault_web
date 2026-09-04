# Vue d'ensemble

- Statut : structure validée
- Date : 2026-08-18

## Wireframe de référence

[Ouvrir le wireframe interactif](wireframes/overview.html)

Le wireframe présente les variantes ordinateur et mobile de la structure
validée. Il sert de référence fonctionnelle pour la hiérarchie et la navigation,
mais ne fige pas encore la direction visuelle finale ni les dimensions exactes.

## Rôle

La vue d'ensemble répond à la question « où en suis-je aujourd'hui ? ». Elle
privilégie la compréhension du patrimoine actuel et du mois en cours plutôt que
l'accès à toutes les fonctionnalités du produit.

Elle répond dans cet ordre à trois questions :

1. quelle est la valeur actuelle du patrimoine ?
2. comment ce patrimoine se répartit-il entre actifs, dettes et types de
   comptes ?
3. quel est le résultat financier du mois en cours ?

La page reste principalement consultative. La création et la gestion détaillée
appartiennent aux écrans fonctionnels concernés.

## Hiérarchie de l'information

### Patrimoine actuel

Le patrimoine net constitue l'information principale. Il est accompagné des
totaux d'actifs et de dettes afin d'expliquer immédiatement sa composition.

La page n'affiche pas encore de variation ni de courbe historique. Ces éléments
seront ajoutés lorsque l'API pourra reconstruire une évolution fiable du
patrimoine.

### Composition du patrimoine

Les comptes sont regroupés en premier lieu par rôle financier plutôt que par
établissement :

- comptes du quotidien, qui regroupent les liquidités ;
- épargne et investissements ;
- dettes.

Chaque groupe affiche son montant et les comptes qui le composent. Un groupe
permet d'accéder aux comptes sources. Les établissements restent une information
secondaire présentée dans les détails. Les montants des trois groupes utilisent
directement les sous-totaux `daily`, `savings` et `liabilities` fournis par
l'API ; le client ne recalcule aucun sous-total monétaire.

### Mois en cours

Le bloc mensuel expose uniquement :

- les revenus ;
- les dépenses ;
- le flux net ;
- les principales catégories de dépenses.

La période correspond toujours au mois courant dans le fuseau horaire du foyer.
La vue d'ensemble ne possède aucun sélecteur de mois.

Le lien « Analyse mensuelle » ouvre une page dédiée où l'utilisateur pourra
changer de mois, consulter toutes les catégories et remonter aux transactions
sources.

### Actions contextuelles

Un bloc d'attention peut apparaître lorsqu'une action concrète est nécessaire,
par exemple pour catégoriser des transactions. Il disparaît lorsqu'aucune action
n'est requise et ne réserve donc pas un emplacement vide permanent.

De futurs usages pourront inclure un rapprochement ancien, un import à vérifier
ou une anomalie détectée, une fois ces règles définies par le produit.

## Navigation

La navigation principale sur ordinateur contient uniquement :

- Vue d'ensemble ;
- Comptes ;
- Transactions.

Les catégories et établissements sont des référentiels de gestion. Ils sont
accessibles depuis le menu du foyer placé en bas de la barre latérale, avec la
gestion du foyer et l'apparence. Le profil et la déconnexion pourront rejoindre
ce menu lorsqu'une authentification existera.

Sur mobile, la navigation inférieure contient :

- Accueil ;
- Comptes ;
- Transactions ;
- Plus.

« Plus » donne accès au foyer et aux référentiels sans surcharger la navigation
quotidienne.

## Actions et accès aux détails

La vue d'ensemble ne contient ni bouton global « Ajouter une transaction » ni
bouton central de création sur mobile. Une transaction se crée depuis l'écran
Transactions, où son contexte et ses règles sont visibles.

Les accès contextuels conservés sont :

- la composition du patrimoine vers les comptes concernés ;
- « Voir les comptes » vers la collection complète ;
- « Analyse mensuelle » vers le rapport détaillé ;
- une action d'attention vers les éléments à traiter.

## Éléments volontairement exclus

- les transactions récentes ;
- le choix d'un mois ;
- les catégories et établissements dans la navigation principale ;
- une action globale de création de transaction ;
- les variations et graphiques historiques non expliqués par l'API actuelle ;
- les cartes ou indicateurs ajoutés uniquement pour remplir l'espace.

## Adaptation responsive

Sur ordinateur, la composition du patrimoine occupe davantage d'espace que le
résumé mensuel afin de conserver une hiérarchie centrée sur le patrimoine.

Sur mobile, les sections s'empilent dans l'ordre suivant :

1. patrimoine net, actifs et dettes ;
2. résumé du mois en cours ;
3. composition du patrimoine ;
4. action contextuelle lorsqu'elle existe.

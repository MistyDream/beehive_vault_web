# Comptes

- Statut : conception fonctionnelle validée provisoirement
- Date : 2026-08-20
- Liste, détail et formulaires : structure validée provisoirement

## Wireframes de référence

- [Liste des comptes](wireframes/accounts.html) ;
- [détail d'un compte](wireframes/account-detail.html) ;
- [création d'un compte](wireframes/account-creation.html) ;
- [mise à jour et correction d'un solde](wireframes/balance-dialog.html).

Ces wireframes couvrent les formats ordinateur et mobile. Ils fixent la hiérarchie des parcours principaux sans constituer une spécification au pixel près.
Les espacements, la densité et les détails visuels seront ajustés pendant l'implémentation réelle.

## Rôle

La page Comptes explique la composition actuelle du patrimoine et donne accès à la gestion de ses sources. Elle approfondit la vue d'ensemble sans devenir une seconde page d'accueil.

Elle répond dans cet ordre à trois questions :

1. quelle est la valeur nette représentée par les comptes ?
2. où se trouvent les actifs et les dettes ?
3. quel compte faut-il consulter ou mettre à jour ?

## Liste des comptes

### Résumé

Le haut de page présente un résumé compact :

- patrimoine net ;
- total des actifs ;
- total des dettes.

Le patrimoine net reste plus visible sur la vue d'ensemble. Sa répétition sur la page Comptes sert ici de clé de lecture et permet de vérifier que la composition détaillée explique bien le total.

### Groupes

Les comptes actifs sont regroupés par fonction financière, pas par établissement :

| Groupe visible             | Types de compte                      |
| -------------------------- | ------------------------------------ |
| Comptes du quotidien       | compte courant, espèces              |
| Épargne et investissements | épargne, investissement, autre actif |
| Dettes                     | carte de crédit, prêt, autre dette   |

Les investissements constituent une forme d'épargne. Leur type précis reste visible sur la ligne sans créer une quatrième section. Un groupe vide n'apparaît pas dans l'état normal.

Chaque groupe affiche son sous-total puis ses comptes. Les groupes restent dépliés : le volume personnel attendu ne justifie pas encore des accordéons.

### Ligne d'un compte

Une ligne contient uniquement :

- le nom du compte ;
- son établissement lorsqu'il est référencé ;
- son type ;
- son montant actuel ;
- un lien couvrant la ligne vers la page dédiée.

Le montant principal provient de `calculatedBalance`. La date et le dernier solde renseigné restent sur la page du compte.

Les libellés s'adaptent au type :

- « Solde actuel » pour un actif ordinaire ;
- « Valeur actuelle » pour un investissement ;
- « Montant dû » pour une dette.

Les dettes sont présentées comme des montants dus positifs dans les totaux. Le patrimoine net explicite leur soustraction des actifs. Un solde signé réel reste possible, notamment pour un découvert sur un actif ou un crédit sur un compte de dette ; l'interface devra alors adapter son libellé sans masquer le signe.

La liste ne propose aucune action en ligne. La modification, le rapprochement et l'archivage appartiennent à la page du compte.

### Actions

« Ajouter un compte » reste placé dans l'en-tête de cette page, où son contexte est clair. Il ne devient ni une action globale de la vue d'ensemble ni un bouton flottant sur mobile.

Les comptes archivés sont accessibles par une entrée secondaire distincte. Ils ne sont pas mélangés aux trois groupes actifs.

La recherche, les filtres et le tri manuel sont différés jusqu'à ce que le volume réel de comptes les justifie.

## Page d'un compte

Le MVP utilise uniquement une page dédiée. Il n'introduit ni panneau latéral ni aperçu rapide parallèle.

La page présente dans cet ordre :

1. nom, type et établissement ;
2. solde actuel, valeur actuelle ou montant dû ;
3. dernier solde renseigné avec sa date ;
4. action « Mettre à jour le solde » ;
5. transactions récentes ;
6. lien vers la page Transactions filtrée sur ce compte ;
7. historique des soldes du plus récent au plus ancien ;
8. actions de modification et d'archivage.

Le dernier solde renseigné explique le point d'ancrage. Une phrase indique que les transactions postérieures à cette date sont incluses dans le solde actuel, sans demander au navigateur de recalculer un agrégat déjà fourni par l'API.

La page n'intègre pas toute la collection paginée des transactions. Elle montre seulement les mouvements récents nécessaires à la compréhension immédiate et renvoie vers l'écran spécialisé pour la suite.

## Création

La création utilise une page dédiée et le même formulaire dans deux contextes :

- après la création d'un foyer, avec « Plus tard » comme sortie secondaire ;
- depuis la page Comptes, avec « Annuler » comme sortie secondaire.

Le formulaire contient :

1. type de compte ;
2. nom ;
3. établissement référencé facultatif ;
4. solde actuel, valeur actuelle ou montant dû ;
5. date du solde, préremplie avec la date actuelle du foyer.

La devise est héritée du foyer. Elle est affichée près du montant et transmise à l'API, mais ne peut pas être changée dans le formulaire.

Après la création initiale d'un foyer, « Plus tard » ouvre une vue d'ensemble vide plutôt que d'enfermer l'utilisateur dans l'onboarding. Après création d'un compte, le nouveau compte devient la destination du parcours.

## Établissements référencés

Le formulaire ne permet pas de créer un établissement. Il propose un catalogue global configuré côté serveur et une option « Aucun établissement ».

Le catalogue distingue :

- un établissement référencé, disponible comme information du compte ;
- un établissement synchronisable, future capacité liée à un prestataire bancaire.

Un compte manuel peut changer ou retirer son établissement à tout moment. Une future connexion bancaire pourra rendre ce champ dépendant de la source synchronisée.

Un établissement absent ne bloque jamais la création. Une future action « Mon établissement n'est pas référencé » pourra signaler le manque sans créer une entrée libre ou dupliquée.

## Modification

La modification utilise un dialogue léger depuis la page du compte. Elle couvre :

- le nom ;
- le type ;
- l'établissement facultatif.

Le solde possède son propre parcours et la devise reste celle du foyer.

Le type peut changer uniquement au sein d'une même famille économique :

- entre les types d'actif ;
- entre les types de dette.

Le client n'expose jamais le passage d'un actif vers une dette ou inversement, même lorsque l'API pourrait techniquement l'accepter avant la première transaction. Un changement de type peut déplacer le compte entre « Comptes du quotidien » et « Épargne et investissements » sans modifier son montant.

## Mise à jour et correction d'un solde

« Mettre à jour le solde » ouvre un dialogue contenant :

- le nouveau montant ;
- sa date, préremplie avec la date actuelle du foyer ;
- la devise en lecture seule.

La source `reconciliation` est transmise automatiquement. Elle n'est pas un choix utilisateur.

Une mise à jour ajoute un nouveau point d'ancrage et conserve les précédents. Sa date doit être postérieure au dernier solde et ne peut pas être future dans le fuseau horaire du foyer.

Chaque entrée de l'historique peut être corrigée. La correction modifie son montant ou sa date sans créer un doublon pour le même jour. La suppression d'un solde est exclue du MVP : la correction permet de réparer une erreur tout en conservant un point d'ancrage pour le compte.

## Archivage et restauration

L'archivage conserve le compte, ses transactions et ses soldes dans l'historique, mais le retire du patrimoine actuel et des choix proposés pour une nouvelle transaction.

Le MVP autorise l'archivage uniquement lorsque `calculatedBalance` vaut zéro.
Cette règle évite qu'un actif ou une dette disparaisse du patrimoine sans mouvement ni rapprochement expliquant la variation. Elle pourra être réévaluée après usage réel.

La confirmation d'archivage rappelle que les données passées sont conservées.
Après succès, l'utilisateur revient à la liste des comptes.

La vue des comptes archivés reste séparée et principalement en lecture seule.
Elle permet de consulter puis de restaurer un compte. Après restauration, l'interface demande de vérifier son solde actuel avant de reprendre son usage normal.

## États

| Situation           | Comportement attendu                                                            |
| ------------------- | ------------------------------------------------------------------------------- |
| Chargement          | Afficher des squelettes qui conservent la forme du résumé et des groupes.       |
| Échec de la page    | Remplacer les données par une erreur et une action « Réessayer ».               |
| Aucun compte        | Expliquer le premier compte et proposer uniquement « Ajouter un compte ».       |
| Groupe vide         | Ne pas afficher le groupe dans l'état normal.                                   |
| Mutation réussie    | Actualiser les données puis afficher une notification discrète.                 |
| Mutation échouée    | Conserver le formulaire ou le contexte courant et afficher l'erreur appropriée. |
| Changement de foyer | Ne jamais conserver ni révéler les comptes du foyer précédent.                  |

Les erreurs de validation sont reliées aux champs à partir des Problem Details RFC 9457. Une valeur déjà affichée peut rester visible pendant une actualisation du même foyer, mais jamais pendant un changement de foyer.

## Responsive et accessibilité

- conserver la même hiérarchie et le même ordre de groupes sur ordinateur et mobile ;
- empiler le résumé sur deux lignes en mobile avant de réduire la lisibilité ;
- utiliser des lignes compactes plutôt que de grandes cartes indépendantes ;
- aligner les montants avec des chiffres tabulaires ;
- utiliser des liens ou boutons sémantiques couvrant les lignes ;
- fournir un nom accessible comprenant le compte et son montant ;
- ne pas utiliser la couleur ou le signe comme seule explication d'une dette ;
- maintenir des cibles tactiles d'au moins 44 par 44 pixels ;
- placer le focus sur le titre après navigation et dans le dialogue après son ouverture ;
- restituer le focus à l'action d'origine après fermeture d'un dialogue.

## Contrat API cible

Le catalogue global et le cycle de vie des soldes sont disponibles :

- `GET /v1/institutions` fournit déjà le catalogue global non paginé `{ id, name }` ;
- ce catalogue est maintenu côté serveur et reste entièrement en lecture seule pour le client Web ;
- chaque compte conserve `institutionId`, résolu depuis cette collection stable ;
- un solde initial ou ajouté ne peut pas être futur dans le fuseau du foyer ;
- un nouveau rapprochement doit être strictement postérieur au dernier ;
- `PATCH .../balances/{balanceId}` corrige le montant, la date ou les deux en conservant la source.

Les autres évolutions sont stabilisées mais restent à implémenter :

- la liste des comptes retourne `items` et les sous-totaux décimaux `daily`, `savings` et `liabilities` ;
- `status=active` ou `status=archived` distingue les deux collections, avec `active` par défaut ;
- la consultation individuelle retrouve également un compte archivé ;
- `POST .../accounts/{accountId}/restore` restaure un compte de manière idempotente ;
- l'archivage est refusé lorsque `calculatedBalance` n'est pas nul.

Tous les montants restent des chaînes décimales avec au maximum quatre chiffres après le séparateur. Le navigateur classe les comptes selon `kind`, mais ne calcule aucun sous-total.

La liste filtrée des transactions par `accountId` existe déjà et peut alimenter les mouvements récents ainsi que le lien vers la collection complète.

## Suite

La conception fonctionnelle de 0.6.2 est suffisamment définie pour préparer les contrats API puis l'implémentation. Les règles et wireframes restent provisoires jusqu'à leur validation en usage réel.

La prochaine étape de conception est 0.6.3 — Transactions.

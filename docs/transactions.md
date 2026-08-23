# Transactions

- Statut : conception fonctionnelle validée provisoirement
- Date : 2026-08-20
- Liste, détail, formulaires et suppression : structure validée provisoirement

## Wireframes de référence

- [liste des transactions](wireframes/transactions.html) ;
- [détail d'une transaction ou d'un transfert](wireframes/transaction-detail.html) ;
- [création et modification](wireframes/transaction-form.html) ;
- [confirmation de suppression](wireframes/transaction-delete-dialog.html).

Ces wireframes couvrent les formats ordinateur et mobile. Ils fixent la hiérarchie des parcours principaux sans constituer une spécification au pixel près. Les espacements, la densité et les détails visuels seront ajustés pendant l'implémentation réelle.

## Rôle

La page Transactions sert à consulter et maintenir les mouvements du foyer. Elle ne remplace pas le rapport mensuel : elle privilégie la recherche, les filtres et les opérations de gestion plutôt que l'analyse d'une période.

Elle répond principalement à trois besoins :

1. retrouver un mouvement récent ou précis ;
2. comprendre son effet et son rattachement ;
3. créer, corriger ou supprimer une transaction sans perdre le contexte de consultation.

## Liste

### Périmètre par défaut

Une ouverture directe depuis la navigation principale affiche toutes les transactions du foyer, des plus récentes aux plus anciennes, sans imposer le mois courant.

Une arrivée depuis un autre écran conserve son contexte :

- depuis un compte, le filtre du compte est actif ;
- depuis un rapport mensuel, les bornes du mois sont actives ;
- depuis une catégorie du rapport, la période, la nature et la catégorie sont actives.

Les filtres sont représentés dans l'URL. Le retour depuis un détail ou un formulaire doit restaurer les filtres, la pagination déjà chargée et, lorsque possible, la position de défilement.

### Organisation

Les transactions sont regroupées par date de comptabilisation. Les groupes et leurs lignes suivent le tri stable fourni par l'API, du mouvement le plus récent au plus ancien.

Chaque ligne affiche uniquement :

- une petite icône de catégorie ou une icône neutre ;
- le libellé ;
- la catégorie et le compte pour un revenu ou une dépense ;
- les comptes source et destination pour un transfert ;
- le montant exprimé comme un effet économique compréhensible ;
- la nature en libellé secondaire lorsque le contexte le nécessite.

Une catégorie absente est nommée explicitement « Non catégorisé ». La note et l'origine manuelle ou importée restent sur la page de détail, sauf lorsqu'elles justifient une intervention visible.

Les icônes aident au parcours visuel sans porter seules la signification. Une catégorie sans icône stable utilise un pictogramme neutre. Leur modèle définitif dépendra de la conception du référentiel des catégories.

### Montants

- un revenu nominal est présenté comme une entrée ;
- une dépense nominale est présentée comme une sortie ;
- un transfert affiche son montant nominal sans couleur positive ou négative ;
- un remboursement ou une correction conserve son effet inverse sans changer artificiellement de nature ;
- les comptes de dette ne doivent jamais obliger le navigateur à reconstruire les règles comptables internes de l'API.

L'affichage associe toujours le signe, le libellé de nature et le contexte du compte. La couleur seule ne distingue jamais une entrée d'une sortie.

### Pagination

La première requête charge 50 mouvements. Une action « Afficher plus » ajoute la page suivante à la liste existante afin de préserver les groupes par date et la continuité de lecture.

La V1 n'affiche ni nombre total de résultats ni numéros de page. Elle n'introduit pas de défilement infini : le chargement reste déclenché explicitement par l'utilisateur.

## Filtres

La V1 expose uniquement :

- la recherche par libellé ou note ;
- la période ;
- le compte ;
- la nature : revenu, dépense ou transfert ;
- la catégorie, avec « Non catégorisé ».

Le filtre de période propose toutes les dates par défaut, le mois courant, le mois précédent et une période personnalisée. Une période reçue depuis un rapport peut afficher directement le mois correspondant.

Le filtre technique de source reste absent tant que l'import et la synchronisation ne créent pas de besoin utilisateur. La catégorie sélectionnée doit rester compatible avec la nature du mouvement.

Sur ordinateur, la recherche et les filtres forment une barre compacte. Sur mobile, la recherche reste visible et un bouton « Filtres » ouvre un panneau dédié. Les filtres actifs sont annoncés, visibles et supprimables individuellement.

## Détail

Le MVP utilise une page dédiée pour les transactions et les transferts. Cette structure commune aux formats ordinateur et mobile facilite les liens directs et laisse suffisamment d'espace aux deux mouvements d'un transfert.

### Revenu ou dépense

La page présente :

1. le libellé, la catégorie et la nature ;
2. le montant et son effet ;
3. la date ;
4. le compte, avec un lien vers celui-ci ;
5. l'origine ;
6. la note éventuelle ;
7. les actions de modification et de suppression.

### Transfert

Le transfert est consulté comme une seule opération. La page présente son montant nominal puis les deux mouvements avec, pour chacun :

- son rôle source ou destination ;
- son compte ;
- son montant signé sur le compte ;
- sa date ;
- son libellé ;
- sa note éventuelle.

L'utilisateur ne consulte, ne modifie et ne supprime jamais l'un des deux mouvements comme une transaction autonome.

## Création et modification

« Ajouter une transaction » apparaît uniquement dans l'en-tête de la page Transactions. Il ouvre une page dédiée et ne devient pas une action globale de la vue d'ensemble.

Le premier contrôle choisit entre dépense, revenu et transfert. La dépense est sélectionnée par défaut. Le même écran sert à la création et à la modification, avec un titre et une action finale adaptés.

### Revenu ou dépense

Le formulaire contient :

1. le compte ;
2. le montant ;
3. la date, préremplie avec la date actuelle du foyer ;
4. le libellé ;
5. la catégorie facultative, filtrée selon la nature ;
6. la note facultative.

La devise du foyer est affichée en lecture seule. Une création ouverte depuis un compte le présélectionne. Le montant nominal est saisi sans demander à l'utilisateur de connaître le signe brut stocké pour la famille du compte.

Le contrat exact entre montant nominal, effet inverse et montant signé doit être stabilisé avant l'implémentation. Il doit notamment préserver les remboursements et corrections sans reproduire dans le navigateur les règles propres aux actifs et aux dettes.

### Transfert

Le formulaire contient :

- le montant nominal strictement positif et la devise du foyer ;
- le compte, la date, le libellé et la note facultative du mouvement source ;
- le compte, la date, le libellé et la note facultative du mouvement destination.

Les comptes doivent être différents. La création, la modification et la suppression passent toujours par les routes atomiques du transfert.

Un revenu ou une dépense peut changer de nature avant ou pendant sa modification, avec réinitialisation ou validation de la catégorie. Une transaction ordinaire ne peut pas devenir un transfert et inversement.

## Suppression

La suppression est individuelle et utilise un dialogue simple. Elle ne demande ni saisie de confirmation ni deuxième avertissement.

Pour un revenu ou une dépense, le dialogue rappelle que le mouvement sera retiré du solde du compte et des rapports concernés. Pour un transfert, il rappelle que les deux mouvements seront supprimés ensemble.

L'API réalise une suppression logique, mais aucune restauration n'est exposée dans la V1. L'interface présente donc l'action comme non annulable. Les actions en masse sont exclues.

## Transactions importées

L'import n'appartient pas encore au parcours Web de la V1. Lorsqu'il sera introduit :

- le compte, la date, le libellé et le montant bancaires resteront en lecture seule ;
- la catégorie et la note resteront modifiables ;
- l'origine importée deviendra visible lorsqu'elle explique ces restrictions.

## États

| Situation | Comportement attendu |
| --- | --- |
| Chargement initial | Conserver la forme de la barre de filtres et de plusieurs groupes datés avec des squelettes. |
| Chargement suivant | Conserver la liste visible et placer l'attente près de « Afficher plus ». |
| Aucun mouvement | Expliquer le premier mouvement et proposer uniquement « Ajouter une transaction ». |
| Aucun résultat filtré | Conserver les filtres, expliquer l'absence de résultat et proposer de les effacer. |
| Échec de la liste | Afficher l'erreur et « Réessayer » sans perdre les filtres. |
| Mutation réussie | Actualiser les données concernées et afficher une notification discrète. |
| Mutation échouée | Conserver le formulaire ou le dialogue et relier les Problem Details aux champs concernés. |
| Changement de foyer | Ne jamais conserver ni révéler les transactions du foyer précédent. |

## Responsive et accessibilité

- conserver le même ordre de lecture et les mêmes informations essentielles sur ordinateur et mobile ;
- réduire les espacements avant de réduire la taille du texte ;
- conserver des lignes compactes et des cibles tactiles d'au moins 44 par 44 pixels ;
- utiliser des titres de groupes datés sémantiques ;
- fournir à chaque ligne un nom accessible comprenant le libellé, le montant et le compte ;
- ne pas utiliser la couleur, l'icône ou le signe comme seule explication de la nature ;
- annoncer le nombre de filtres actifs et les résultats actualisés ;
- placer le focus sur le titre après navigation et dans le dialogue après son ouverture ;
- restituer le focus à l'action d'origine après la fermeture d'un dialogue.

## Contrat API cible

La collection utilise une enveloppe `items`, `page`, `limit` et `total`. Le Web détermine si une page suivante existe avec ces valeurs ; aucun `hasMore` redondant n'est nécessaire. Le total compte les opérations logiques après application des filtres, un transfert ne comptant qu'une fois.

Chaque élément possède `operationType` égal à `transaction` ou `transfer`. Une transaction ordinaire incorpore des résumés compacts de son compte et de sa catégorie actuelle, même lorsqu'ils sont archivés. Un transfert incorpore ses deux mouvements et leurs comptes ; la date source constitue sa date canonique de classement.

Les réponses distinguent :

- `amount`, montant nominal strictement positif ;
- `effect`, égal à `standard` ou `reversal` ;
- `economicAmount`, effet signé sur le patrimoine ;
- `accountAmount`, montant signé appliqué au compte.

La création et la modification transmettent seulement le montant nominal et l'effet. L'API dérive les signes propres au type de compte. Un transfert conserve un montant nominal positif et reste économiquement neutre.

Les montants utilisent des chaînes décimales avec au maximum quatre chiffres après le séparateur. Le contrat ne reçoit pas de métadonnée d'icône pendant le MVP : chaque catégorie possède un pictogramme neutre de repli côté client.

Les Problem Details RFC 9457 déjà disponibles relient les erreurs aux formulaires. Les filtres actuels, les routes de détail et le cycle atomique des transferts restent conservés.

## Suite

La conception fonctionnelle de 0.6.3 est suffisamment définie pour préparer les contrats API puis l'implémentation. Les règles et wireframes restent provisoires jusqu'à leur validation en usage réel.

La prochaine étape de conception est 0.6.4 — Rapport mensuel.

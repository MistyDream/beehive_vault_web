# Import d’un relevé CSV

- Statut : **parcours validé le 11 novembre 2026**, référence de conception pour Web #10 et Web #11 ; client Web non implémenté.
- Ticket : [Web #9](https://github.com/MistyDream/beehive_vault_web/issues/9).
- Date : 11 novembre 2026.
- [Ouvrir la maquette interactive](wireframes/csv-import.html) · [Direction visuelle](visual-direction.md) · [Règles transversales](cross-cutting-rules.md).

Le parcours prépare l’import dans un seul compte actif du foyer. Il sépare la lecture du fichier, qui ne modifie rien, de la confirmation qui crée les transactions. L’utilisateur a validé le parcours et les autres choix le 11 novembre 2026, en demandant de clarifier le vocabulaire du point 3. Les libellés concrets ci-dessous répondent à cette demande d’ajustement ; ils n’ont pas fait l’objet d’une approbation distincte avant présentation. Ce document constitue la référence de conception pour Web #10 et Web #11, sans lancer leur implémentation.

## Essayer le parcours

Ouvrir `docs/wireframes/csv-import.html` dans un navigateur récent, directement ou depuis un serveur statique local. Les fichiers CSS et JavaScript voisins doivent rester à côté du HTML. Aucune dépendance, connexion à l’API, authentification, télémétrie ou persistance n’est utilisée. La police Manrope est employée si elle est installée ; la maquette hors ligne utilise sinon la police système. L’implémentation utilisera les ressources typographiques du produit.

1. Choisir le compte puis « Utiliser le relevé fictif ». On peut aussi télécharger le CSV fictif et le choisir dans le champ fichier ; seuls ses octets exacts sont reconnus par cette maquette. Aucun analyseur CSV de production n’est fourni.
2. Passer à la configuration. Modifier le séparateur pour essayer une erreur, puis revenir au point-virgule. Associer `Booking`, `Description`, `Amount` aux trois champs ; essayer deux fois la même colonne pour voir le résumé d’erreur.
3. Afficher l’aperçu : trois lignes valides et deux rejetées. Tenter de poursuivre sans sélection, sélectionner les lignes valides puis tenter sans classification. Affecter explicitement « Dépense / Paiement » à la sélection, corriger `Salary` en « Revenu / Revenu reçu » et `Refund` en « Dépense / Remboursement reçu ». Après chaque changement de nature, choisir à nouveau le type de mouvement. Aucun choix n’est déduit du signe.
4. Vérifier le récapitulatif, revenir à la configuration sans rien modifier et retrouver la sélection et les choix. Confirmer : trois lignes importées. « Réessayer le même relevé » repasse par le récapitulatif et retourne trois lignes déjà importées.
5. Utiliser « Essayer un état », puis « Appliquer ». Chaque scénario repart au début avec l’exemple prêt. Parcourir les étapes pour voir le chargement, les erreurs et la reprise. « Confirmation sans réponse » simule volontairement un import abouti dont la réponse est perdue ; son réessai retourne des doublons sans nouvel ajout.

Les montants et dates sont des chaînes d’affichage fixes ; aucun total ni mouvement sur le solde n’est calculé. Les réponses et délais sont simulés. Le contrôle de configuration ne représente pas un analyseur général. Le réimport démontré concerne le compte conservé dans ce parcours ; le prototype ne constitue pas un registre d’imports multi-comptes. Un rechargement efface toute la session fictive.

## Entrées et architecture de l’information

- Dans Transactions, action secondaire « Importer un relevé » à côté de « Ajouter une transaction » ; depuis le détail d’un compte actif, même entrée avec compte présélectionné. Aucune nouvelle action globale dans la vue d’ensemble.
- Page dédiée avec quatre étapes et un résultat persistant dans la session : **Compte et fichier → Configuration → Aperçu et choix → Confirmation → Résultat**.
- Le foyer reste celui du contexte client existant, sans identifiant dans les URL. L’en-tête rappelle le compte et le nom du fichier à partir de la configuration.
- Le résultat propose « Voir les transactions » filtrées sur le compte et « Importer un autre relevé ». La destination Transactions reste hors de la maquette et dépend de son implémentation ; aucun lien factice ne simule une page disponible.

### 1. Compte et fichier

Afficher seulement les comptes actifs, avec leur nom, leur famille actif/dette et leur devise. Sans compte, expliquer qu’il faut en créer ou réactiver un ; ne pas ouvrir les étapes suivantes. Un chargement initial des comptes emploiera un squelette du sélecteur ; une erreur de liste aura une reprise locale, sans masquer la navigation.

Le fichier est lu comme texte UTF-8, sans conversion silencieuse de ses octets, fins de ligne, BOM ou espaces. Un fichier non UTF-8 doit être remplacé ou converti explicitement par l’utilisateur. Le contrôle fichier conserve son nom après un retour tant que la page reste ouverte. Un fichier remplacé invalide l’aperçu, les classifications et les résultats associés.

### 2. Configuration

Trois formats explicites : séparateur de colonnes, format des dates et séparateur décimal. Trois associations distinctes : date bancaire, libellé, montant signé. L’extrait du fichier reste du texte échappé, jamais du HTML. La production devra proposer les vrais noms d’en-têtes et annoncer les colonnes absentes ou ambiguës ; la détection éventuelle n’est qu’une suggestion à confirmer, pas un format implicite.

Les formats pris en charge sont exclusivement ceux du contrat ci-dessous. La modification du compte, du fichier ou du format invalide l’aperçu et impose une nouvelle prévisualisation avant confirmation. Revenir puis poursuivre sans modification conserve les lignes, leur sélection et leurs choix.

### 3. Aperçu et choix

Conserver l’ordre fourni et le numéro de première ligne physique, même lorsqu’un enregistrement s’étend sur plusieurs lignes. Afficher compte et devise, date, libellé, montant signé **du fichier**, statut valide/rejeté et erreur utile. Les lignes rejetées n’affichent pas de contenu source recopié depuis l’API et ne sont pas sélectionnables. Plusieurs erreurs d’une ligne doivent être listées, avec leurs champs.

Le nombre de lignes valides/rejetées et le nombre sélectionné restent visibles. Les filtres n’effacent pas les choix. Une vue filtrée sans résultat conserve ses filtres ; un en-tête sans données ou un fichier entièrement rejeté propose de revenir au fichier ou à la configuration. La production devra limiter le rendu aux lignes consultées tout en conservant la sélection complète, jusqu’à 5 000 lignes, sans défilement horizontal de la page.

**Aucune sélection ni classification automatique.** « Sélectionner les lignes valides » sélectionne l’ensemble des lignes valides, y compris hors du filtre, sans rien classer. L’affectation groupée porte explicitement sur toutes les lignes sélectionnées et remplace leurs choix ; les champs restent corrigeables ligne par ligne. Ce mécanisme évite de répéter jusqu’à 5 000 fois la même classification tout en rendant la décision visible. Le signe bancaire seul ne permet jamais d’inférer `nature` ou `effect`.

| Nature  | Type de mouvement   | Sens explicite                                                 | Valeurs envoyées       |
| ------- | ------------------- | -------------------------------------------------------------- | ---------------------- |
| Dépense | Paiement            | Vous payez une dépense.                                        | `expense` / `standard` |
| Dépense | Remboursement reçu  | Vous recevez le remboursement d’une dépense.                   | `expense` / `reversal` |
| Revenu  | Revenu reçu         | Vous recevez un revenu.                                        | `income` / `standard`  |
| Revenu  | Remboursement versé | Vous rendez un revenu reçu en trop, par exemple un trop-perçu. | `income` / `reversal`  |

Le champ **Type de mouvement** est désactivé avant le choix de la nature, avec une aide expliquant ce préalable. Ses options dépendent de la nature, dans l’affectation groupée comme dans chaque ligne. Changer de nature efface le type précédemment choisi et demande de le confirmer à nouveau ; la sélection de la ligne reste conservée. La modification de la nature groupée ne modifie les lignes qu’après une nouvelle application explicite. Les valeurs API `standard` et `reversal` restent inchangées. Le récapitulatif et les résultats reprennent les mêmes libellés concrets.

Les deux choix sont requis pour chaque ligne sélectionnée. Le compte peut être une dette : le navigateur n’en déduit pas un nouveau signe. La confirmation rappelle la classification, le compte et le montant du fichier ; elle ne promet pas un effet chiffré sur le solde, absent de la réponse de prévisualisation. Aucun transfert ni catégorie n’est choisi pendant cet import.

### 4. Confirmation et résultat

Le récapitulatif énumère les seules lignes sélectionnées avec leurs classifications et rappelle celles laissées de côté. Les transactions seront sans catégorie, d’origine importée. Le compte, la date bancaire, le libellé, le montant sur le compte et les données sources sont conservés ; nature, catégorie et note restent modifiables par le parcours Transactions.

Une confirmation validée enregistre toute la sélection de manière atomique. Une réponse de validation échouée ne donne pas de succès partiel. Le résultat distingue **Importée** (`imported`) et **Déjà importée · aucun nouvel ajout** (`duplicate`) pour chaque ligne dans l’ordre de la sélection. Ne pas annoncer que les classifications des doublons ont été mises à jour. Le lien futur vers une transaction déjà importée peut ne pas être disponible si celle-ci a été supprimée : pas de promesse de restauration ni de lien cassé.

Un doublon désigne le même texte CSV UTF-8 exact et la même première ligne physique sur le même compte. Renommer le fichier, réordonner la sélection ou changer sa classification n’en change pas l’identité. Deux positions de contenu identique restent distinctes ; changer les octets, notamment les fins de ligne, crée un nouveau relevé. Des exports différents peuvent donc se recouvrir : l’interface l’explique avant confirmation, sans présenter la détection comme un rapprochement bancaire universel.

## Contrat effectif à respecter lors de l’implémentation

Référence : [API intégrée, commit 3d71b78](https://github.com/MistyDream/beehive_vault_api/blob/3d71b78abc6ea374d4fb2c63861e50cdf1b26898/docs/api.md#prévisualisation-dun-relevé-csv). Les contrats CSV sont identiques à la révision source `15da77c`. Le navigateur passera uniquement par le proxy Nuxt de même origine. La disponibilité de ces routes API n’atteste pas l’existence de routes proxy Web ni d’une authentification.

| Opération      | Route API et contrat                                                                                                                                                                                                              |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Comptes actifs | `GET /v1/households/{household_id}/accounts?status=active` ; lire `items`, conserver la devise du compte.                                                                                                                         |
| Prévisualiser  | `POST /v1/households/{household_id}/accounts/{account_id}/imports/csv/preview` ; JSON `{csv, format}`. Aucun stockage ni effet sur les soldes.                                                                                    |
| Format         | `delimiter`: `comma`, `semicolon`, `tab` ; `dateFormat`: `year_month_day`, `day_month_year`, `month_day_year` ; `decimalSeparator`: `dot`, `comma` ; `columns`: `bookingDate`, `label`, `amount` associés à trois noms distincts. |
| Réponse aperçu | `accountId`, `currency`, `rows` ; `status: valid` avec `line`, `bookingDate`, `label`, `signedAmount` exact ; ou `status: rejected` avec `line`, `errors[{code, field}]`. Aucun jeton d’aperçu.                                   |
| Confirmer      | Même route terminée par `/confirm` ; renvoyer les mêmes `csv` et `format`, `fileName` et `rows[{line, nature, effect}]`. Nature `income`/`expense`, effet `standard`/`reversal`. Pas de montant recalculé dans la sélection.      |
| Résultat       | `accountId`, `rows[{line, status, transactionId}]` ; `status` vaut `imported` ou `duplicate`. Pas de compteurs ni total monétaire serveur à inventer.                                                                             |

Le premier enregistrement non vide est l’en-tête ; les espaces de bord des noms sont ignorés, leur casse est significative. Les colonnes supplémentaires sont ignorées. LF, CRLF, BOM UTF-8 initial, champs entre guillemets avec séparateurs ou retours à la ligne et guillemets doublés sont pris en charge. Les lignes physiques vides hors des champs entre guillemets sont ignorées. Les dates requièrent leurs zéros initiaux. Les montants utilisent des chiffres ASCII, un signe facultatif, au plus 16 chiffres entiers et quatre décimales, sans séparateur de milliers ni notation scientifique ; zéro est rejeté.

| Limite                                                  | Traitement prévu                                                                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| CSV UTF-8 décodé : **1 Mio (1 048 576 octets)**         | Contrôle de taille avant envoi, puis validation API. Ne pas compter les caractères JavaScript comme des octets.             |
| Données : **5 000 enregistrements**                     | En-tête exclu ; ne pas confondre avec les lignes physiques, car un champ peut contenir un retour à la ligne.                |
| JSON de prévisualisation : **2 Mio (2 097 152 octets)** | Mesurer le corps sérialisé UTF-8 complet, échappements compris. Un CSV admissible peut produire un JSON trop grand.         |
| JSON de confirmation : **2,5 Mio (2 621 440 octets)**   | Inclut CSV, format, nom et sélection. Réutiliser le même encodage JSON compact ; contrôler avant envoi et traiter le `413`. |
| Sélection                                               | Entre 1 et 5 000 lignes valides, chacune une seule fois.                                                                    |
| Nom de fichier                                          | Entre 1 et 255 caractères après retrait des espaces de bord, sans caractère de contrôle.                                    |

Les plafonds JSON restent une règle d’envoi technique ; le contenu utilisateur dit comment réduire le relevé. La maquette montre leurs erreurs, sans fabriquer un fichier de plusieurs Mio pour les simuler.

## États, erreurs et reprise

L’implémentation choisira les messages avec `type`/`code` stables et les détails de champ avec `errors.location`, `pointer`, `code`. Elle n’interprétera jamais `title` ou `detail` comme logique métier. Les champs et lignes concernés restent identifiables dans le résumé, sans afficher les réponses brutes.

| Situation / code                | Présentation et reprise                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aperçu ou confirmation en cours | Libellé « Analyse du fichier… » / « Import en cours… », annonce polie, double soumission impossible. Conserver le contenu ; désactiver uniquement les actions qui invalident la requête et le changement de contexte.                                                                                                                                   |
| `validation_error` de format    | Résumé avec liens et messages sous les contrôles : `invalid_value`, `empty_column_mapping`, `duplicate_column_mapping`, `missing_csv_column`. Conserver fichier et configuration.                                                                                                                                                                       |
| En-tête / structure             | `missing_csv_header`, `invalid_csv_header`, `invalid_csv_syntax` : expliquer le fichier à corriger, aucun aperçu partiel. `csv_row_limit` : réduire à 5 000 enregistrements.                                                                                                                                                                            |
| `payload_too_large` / 413       | Réduire le fichier ; distinguer limite du texte et de l’envoi JSON lorsque l’information est connue. Conserver la configuration, proposer de remplacer le fichier.                                                                                                                                                                                      |
| Ligne rejetée                   | `column_count_mismatch` : nombre de champs ; `invalid_date` : format ou date impossible ; `date_in_future` : date future dans le fuseau du foyer ; `invalid_length` : libellé de 1 à 500 caractères ; `invalid_amount` : montant nul, mal formé ou hors limites. Expliquer sans recopier de source brute.                                               |
| Aucune ligne sélectionnée       | Bloquer la progression avec « Sélectionnez au moins une ligne ». Les lignes rejetées restent non sélectionnables.                                                                                                                                                                                                                                       |
| Choix incomplet                 | Focus au résumé, lien vers la nature ou le type de mouvement de la première ligne concernée, même si un filtre la masquait.                                                                                                                                                                                                                             |
| Confirmation refusée            | `invalid_file_name` vers le nom ; `invalid_selection_size` vers la sélection ; `duplicate_csv_selection`, `csv_line_not_found`, `rejected_csv_line` vers la ligne grâce à `#/rows/{index}/line` et à l’ordre exact envoyé ; `invalid_value` vers nature/type de mouvement. Aucun ajout, retour à la sélection conservée ou nouvel aperçu si nécessaire. |
| `account_not_found` / 404       | Compte inconnu, extérieur au foyer ou archivé : retirer le compte des choix, conserver les paramètres non financiers, demander un compte actif et refaire l’aperçu. Ne pas affirmer qu’il est certainement archivé.                                                                                                                                     |
| `household_not_found` / 404     | Retour au contexte de foyer ; retirer immédiatement les données de l’ancien foyer. Aucun relevé ne passe silencieusement dans un autre foyer.                                                                                                                                                                                                           |
| Réseau / serveur à l’aperçu     | Erreur intégrée et « Réessayer », fichier et configuration conservés.                                                                                                                                                                                                                                                                                   |
| Réponse de confirmation perdue  | Ne pas annoncer un échec certain. Réessayer le **même texte exact, même format, même sélection** ; `duplicate` rend la répétition sûre pour ces mêmes identités. Ne pas reformater le fichier pendant la reprise.                                                                                                                                       |
| Retour ou sortie                | Retour entre étapes avec saisie conservée. Conservation uniquement en mémoire, aucune donnée bancaire dans le stockage local. Avertir avant sortie du produit si des choix seraient perdus ; pas de brouillon durable promis.                                                                                                                           |

Le prototype rend cliquables les grandes familles d’erreur et les deux niveaux de rejet. La matrice couvre les codes supplémentaires attendus du produit sans prétendre simuler chaque réponse API. Une reprise « compte archivé » revient au sélecteur ; son retrait réel de la collection devra être testé avec l’API pendant l’implémentation.

## Ordinateur, mobile, thèmes et accessibilité

La maquette reprend le fond ivoire, les surfaces chaudes, la barre latérale charbon et les accents miel/pétrole. Le thème sombre conserve la même hiérarchie avec surfaces charbon brun. Les statuts et erreurs sont écrits, jamais portés par la couleur seule.

Sur ordinateur, formulaire en colonnes et lignes avec montant à droite. Sur mobile, champs et actions s’empilent, le montant revient sous le libellé et chaque ligne conserve sa sélection, ses erreurs et ses deux choix. La navigation contextuelle n’impose pas une table large. Cible à partir de 320 px CSS et à 200 % de zoom ; aucune action collée au bas de l’écran ne recouvre le focus.

- Région principale, titre unique, étapes ordonnées avec étape courante, lien d’évitement.
- Boutons, champs et liens d’action d’au moins 44 px ; chaque case possède une zone de sélection de 44 px et un nom contenant ligne et libellé.
- Ordre clavier naturel ; focus visible ; focus au titre d’étape après navigation, au résumé après erreur. Les liens du résumé révèlent l’étape ou la ligne concernée avant d’y placer le focus.
- Filtres et affectation groupée laissent le focus sur le contrôle utilisé et annoncent le résultat. Les montants conservent toutes les décimales significatives.
- Annonces polies pour chargement, sélection et résultat ; alerte pour erreur nécessitant correction. Aucune notification temporaire ne contient une décision.
- Pas de dialogue ajouté au parcours : pas de piège de focus nécessaire. Aucun mouvement animé ; respecter les préférences de réduction des animations dans le produit.

La vérification navigateur de cette maquette couvre le parcours et les mises en page. Elle ne constitue pas une déclaration de conformité WCAG du futur produit ni un test avec lecteur d’écran.

## Décisions de référence et validation

1. Entrées depuis Transactions et le détail d’un compte ; page dédiée avec quatre étapes et résultat.
2. Sélection initialement vide, classification toujours explicite ; affectation groupée qui remplace les choix des seules lignes sélectionnées puis correction individuelle.
3. Choix du type de mouvement adapté à la nature : « Paiement » / « Remboursement reçu » pour une dépense, « Revenu reçu » / « Remboursement versé » pour un revenu. Le remboursement versé explique le trop-perçu rendu. Le type est à choisir à nouveau après un changement de nature ; aucun choix n’est déduit du signe CSV.
4. Aucune catégorie pendant l’import ; correction du fichier hors du produit et retour par nouvel aperçu, sans éditeur de cellules CSV intégré.
5. Brouillon en mémoire pendant la session, sans conservation de données bancaires dans le navigateur après rechargement ; avertissement de sortie à concevoir dans l’implémentation.

Le 11 novembre 2026, l’utilisateur a validé le parcours présenté et les choix hors vocabulaire du point 3. Il a délégué la clarification de ce point, mise en œuvre ci-dessus. Cette validation du parcours permet de préparer Web #10 et Web #11 selon le workflow du projet ; elle ne vaut ni implémentation, ni validation technique du futur client, ni approbation préalable des mots exacts de cet ajustement. Des retours de conception générale pourront être traités ultérieurement.

## Vérification de ce livrable

Le 11 novembre 2026, essais dans un navigateur Brave isolé : parcours complet et réimport, retour avec choix conservés, affectation groupée puis correction de lignes, absence de sélection, classification incomplète, associations dupliquées, dix scénarios alternatifs, reprise après réponse de confirmation perdue, fichier fictif téléchargé puis choisi, clavier et focus d’étape. Contrôle des largeurs 320, 390, 720 et 1 440 px, thèmes clair/sombre et inspection des captures ordinateur/mobile. Aucun débordement horizontal de page constaté. Les champs Nature et Type de mouvement sont accompagnés d’une explication spécifique à la classification choisie. Après le retour utilisateur du même jour, les quatre sens, les options groupées et individuelles, la remise à zéro du type lors du changement de nature, le récapitulatif et les reprises ont été vérifiés de nouveau au navigateur ; les captures ordinateur/mobile ont été actualisées.

La syntaxe JavaScript, les liens locaux, les ressources du prototype et le formatage global ont été vérifiés. Les routes, valeurs de champs, limites et codes ont été rapprochés du contrat API référencé. Les suites produit ne sont pas nécessaires pour ce changement limité à la documentation. Aucun essai avec API réelle, lecteur d’écran ou session d’authentification n’est revendiqué ; ces validations appartiendront à l’implémentation.

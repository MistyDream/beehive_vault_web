# Règles transversales de l'interface

## Statut

Ces règles sont validées pour la reconstruction du MVP. Elles s'appliquent à tous les parcours et complètent les décisions propres à chaque écran.

Elles définissent une cible de conception et de vérification. Leur présence dans la documentation ne constitue pas encore une déclaration de conformité du client non implémenté.

## Principes

- préserver le contenu encore utilisable pendant une attente ou une erreur partielle ;
- placer le retour d'état au plus près de l'action ou de la zone concernée ;
- distinguer une collection réellement vide d'une recherche sans résultat ;
- ne jamais exposer les données du foyer précédent pendant un changement de contexte ;
- conserver les saisies lorsqu'une mutation échoue ;
- proposer une seule action de reprise claire lorsqu'elle existe ;
- ne pas utiliser une notification temporaire pour une information qui demande encore une décision.

## Chargement

### Chargement initial

Lorsque la forme du contenu est connue, un squelette reprend sa structure principale. Il évite un grand indicateur d'attente isolé et ne simule pas des données plus détaillées que nécessaire.

Le squelette ne doit pas provoquer de changement brutal de mise en page lorsque les données arrivent. Une page dont le contenu est déjà rendu côté serveur n'ajoute pas artificiellement un état de chargement au moment de l'hydratation.

### Actualisation

Une actualisation conserve les données visibles. Un indicateur discret, placé près de la zone actualisée, signale l'attente sans remettre toute la page en squelette.

Si l'actualisation échoue, les données précédentes restent consultables avec une indication qu'elles peuvent ne plus être à jour et une action « Réessayer ».

### Action locale

Une mutation désactive uniquement les champs et actions qui ne peuvent plus être utilisés pendant son traitement. Son bouton adopte un libellé explicite comme « Enregistrement… » ou « Suppression… ».

La page entière n'est pas bloquée lorsqu'une interaction indépendante reste sûre. Une action en cours ne peut pas être soumise une seconde fois.

### Changement de foyer

Le changement de foyer retire immédiatement les données du foyer précédent avant de charger le nouveau contexte. Aucun cache d'interface ne doit afficher, même brièvement, les comptes ou transactions d'un autre foyer.

## États vides

Un état vide réel explique l'objet absent et propose au maximum une action principale pertinente. Son contenu reste spécifique au parcours, par exemple la création du premier compte ou de la première transaction.

Un état sans résultat filtré :

- conserve les filtres visibles ;
- explique qu'aucun élément ne correspond ;
- propose de retirer les filtres ;
- ne suggère pas de créer un objet qui existe peut-être déjà hors du filtre.

Une visualisation sans données n'affiche ni axes, ni graphique, ni légende artificiels. Elle est remplacée par un message court et une éventuelle action de navigation.

## Erreurs et reprise

### Erreur initiale

Lorsqu'aucun contenu utile ne peut être présenté, un panneau intégré à la page décrit le problème avec une action « Réessayer ». La navigation générale reste disponible.

### Erreur partielle

Une erreur limitée à une section ne remplace pas les autres données de la page. Elle apparaît dans la zone concernée avec sa propre action de reprise.

### Erreur de mutation

Un formulaire, dialogue ou panneau reste ouvert après un échec. Les valeurs saisies sont conservées et les contrôles redeviennent disponibles. Une erreur réseau ou serveur propose une nouvelle tentative sans demander une nouvelle saisie.

Les détails internes, traces, identifiants techniques et réponses brutes de l'API ne sont jamais affichés à l'utilisateur.

## Problem Details et formulaires

L'API expose ses erreurs selon les Problem Details RFC 9457. Le proxy Nuxt préserve ce contrat et normalise également ses propres erreurs de transport avant qu'elles atteignent les composants de l'interface.

- `type` est l'identité canonique du problème et l'extension `code` son raccourci stable en `snake_case` ;
- le statut HTTP ne suffit pas à choisir tout le contenu présenté ;
- `title` et `detail` fournissent un repli lorsqu'un type n'est pas encore reconnu ;
- l'extension `errors` relie les erreurs de validation aux champs avec `location`, `pointer`, `code` et `detail`.

Une erreur de champ apparaît sous son contrôle et lui est reliée sémantiquement. Lorsque plusieurs champs sont invalides, un résumé placé en tête du formulaire fournit des liens vers chacun d'eux sans supprimer les messages locaux.

Une erreur métier générale apparaît dans le formulaire plutôt que dans une notification temporaire. Après soumission invalide, le focus rejoint le résumé d'erreurs ou, pour un cas simple, le premier champ invalide.

## Succès et notifications

Une lecture ou une navigation réussie ne déclenche aucune notification.

Après une création, modification, suppression ou archivage réussie :

1. les données concernées sont actualisées ;
2. une notification discrète confirme l'action ;
3. le message est annoncé poliment aux technologies d'assistance ;
4. la notification reste fermable manuellement.

Une information qui nécessite encore une action reste visible dans la page. Les erreurs bloquantes ne disparaissent pas automatiquement dans un toast.

## Montants et devises

Les montants reçus, manipulés et transmis restent des chaînes décimales. Le client ne les convertit pas en `number` JavaScript pour les calculs, le tri, le transport ou la mise en forme.

L'affichage français utilise une espace pour les groupes de milliers et une virgule décimale. Les montants ne sont pas abrégés en milliers ou millions dans le MVP.

| Contexte | Exemple |
| --- | ---: |
| Résumé sans fraction significative | `12 450 €` |
| Résumé avec fraction | `12 450,50 €` |
| Transaction détaillée | `42,00 €` |
| Précision significative retournée par l'API | `42,3456 €` |
| Correction | `− 18,50 €` |
| Flux explicitement positif | `+ 320,00 €` |

Les résumés peuvent retirer les zéros fractionnaires inutiles. Les vues détaillées affichent au minimum les décimales usuelles de la devise et ne masquent jamais une précision supplémentaire significative retournée par l'API.

Le signe `+` est réservé aux contextes où l'effet doit être explicite, comme une entrée ou le flux net. Une valeur négative conserve un véritable signe moins. Un transfert utilise un montant nominal neutre. La couleur accompagne ces significations sans remplacer le signe ou le libellé.

Les composants contenant des montants utilisent des chiffres tabulaires et doivent accepter des valeurs d'au moins plusieurs millions sans chevauchement, troncature silencieuse ni changement d'unité.

### Saisie monétaire

Le champ monétaire :

- accepte la virgule ou le point comme séparateur pendant la saisie ;
- conserve une représentation textuelle intermédiaire valide ;
- n'ajoute ni ne retire de chiffres pendant que l'utilisateur écrit ;
- applique la mise en forme locale à la sortie du champ ;
- normalise une chaîne décimale pour l'API ;
- affiche la devise du foyer en lecture seule lorsqu'elle ne peut pas être modifiée.

La précision maximale autorisée par devise doit être stabilisée dans le contrat API avant l'implémentation complète des formulaires.

## Dates, heures et quantités

Les dates métier sans heure utilisent le fuseau du foyer et une forme localisée :

- `20 août 2026` dans un détail ;
- `20 août` dans un groupe dont l'année est évidente ;
- `YYYY-MM-DD` uniquement dans les URL, champs natifs et échanges API.

Les horodatages UTC sont convertis dans le fuseau du foyer lorsqu'ils apportent une information utile. Une heure ou un fuseau n'est pas ajouté à une simple date de comptabilisation.

Les mois sont écrits sous la forme `août 2026`. Les quantités utilisent les règles de pluralisation de la langue active : « 1 transaction », « 2 transactions ».

## Contenu et terminologie

Le ton reste simple, direct et calme.

- une action commence par un verbe précis : « Ajouter un compte », « Archiver le compte », « Réessayer » ;
- une cause utile remplace les formulations vagues lorsqu'elle est connue ;
- les messages évitent « Oups », les points d'exclamation et les formulations culpabilisantes ;
- une action destructive explique sa conséquence sans répéter uniquement le texte du bouton ;
- les termes foyer, compte, transaction, revenu, dépense, transfert, patrimoine net et flux net restent stables ;
- le vocabulaire technique de l'API, des identifiants, des RFC ou de l'atomicité reste absent de l'interface.

Un message décrit d'abord la situation, puis l'action concrète permettant de la résoudre :

> **Impossible d'enregistrer la transaction**  
> Le compte sélectionné a été archivé. Choisissez un autre compte.

## Responsive

Les changements de disposition répondent à l'espace réellement disponible plutôt qu'à une liste d'appareils. Les parcours doivent fonctionner à partir de 320 pixels CSS et à 200 % de zoom sans perte de contenu ou d'action.

- l'ordre de lecture et les informations essentielles restent identiques ;
- les espacements et la disposition évoluent avant de réduire la taille du texte ;
- les blocs latéraux s'empilent lorsque leur contenu ne tient plus ;
- une table devient une liste ou des cartes lorsque le défilement horizontal ne permet plus un usage clair ;
- une visualisation complexe possède une représentation mobile ou textuelle complète ;
- une grande valeur financière revient à la ligne ou réorganise son conteneur sans être masquée.

Le défilement horizontal reste réservé aux données qui l'exigent réellement et ne s'applique jamais à la page entière.

## Accessibilité

Le MVP vise [WCAG 2.2 niveau AA](https://www.w3.org/TR/WCAG22/). Cette version étend WCAG 2.1 et constitue la cible retenue pour la reconstruction.

Les règles minimales comprennent :

- un titre principal unique, des régions sémantiques et un lien d'évitement vers le contenu ;
- une navigation complète au clavier dans un ordre prévisible ;
- un focus visible, jamais entièrement masqué, et restitué après la fermeture d'une couche ;
- des contrôles dotés d'un nom, d'un état et des relations sémantiques nécessaires ;
- des actions isolées offrant une cible tactile d'au moins 44 par 44 pixels ;
- des contrastes AA vérifiés dans les thèmes clair et sombre ;
- aucune information portée uniquement par la couleur, une icône, un signe ou une position ;
- la prise en charge de `prefers-reduced-motion` ;
- des dialogues qui contiennent le focus, gèrent Échap lorsque le risque le permet et restituent le focus à l'action d'origine ;
- des annonces limitées aux changements importants afin de ne pas saturer les technologies d'assistance ;
- un résumé textuel et une représentation alternative complète pour les graphiques, dont le Sankey du rapport mensuel.

La conformité concerne chaque variante responsive d'une page. Elle ne sera déclarée qu'après vérification des parcours implémentés.

## Vérification

L'implémentation combine :

- tests unitaires des formateurs et règles de contenu ;
- tests de composants pour le clavier, le focus et les relations accessibles ;
- analyse automatisée de l'accessibilité sur les états principaux ;
- tests navigateur des parcours critiques sur ordinateur et mobile ;
- vérification manuelle au clavier, au zoom et avec un lecteur d'écran ;
- contrôle des deux thèmes, des états vides, erreurs, attentes et grandes valeurs financières.

Les outils automatisés complètent l'examen manuel sans constituer à eux seuls une preuve de conformité.

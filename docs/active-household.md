# Foyer actif

- Statut : structure et wireframe validés
- Date : 2026-08-20

## Wireframe de référence

[Ouvrir le wireframe interactif](wireframes/active-household.html)

Le wireframe couvre la création initiale, la sélection entre plusieurs foyers et le menu du foyer sur ordinateur et mobile. Il sert de référence fonctionnelle et applique la direction visuelle validée sans figer les dimensions exactes de l'implémentation.

## Rôle

Le foyer constitue le contexte de toutes les données financières affichées par l'application. Le démarrage doit retrouver un foyer utilisable sans demander un choix inutile, tout en permettant à un même utilisateur de séparer plusieurs foyers dès le MVP.

Le produit reste personnel et sans gestion de membres, d'invitations ou de permissions. Plusieurs foyers représentent ici plusieurs périmètres financiers indépendants gérés par le même utilisateur.

## Démarrage de l'application

Le client commence par charger les foyers disponibles, puis applique les règles suivantes dans cet ordre :

1. lorsqu'aucun foyer n'existe, ouvrir la création du premier foyer ;
2. lorsqu'un seul foyer existe, l'activer automatiquement ;
3. lorsque plusieurs foyers existent, restaurer le dernier foyer utilisé s'il appartient toujours à la collection ;
4. lorsqu'aucun choix mémorisé n'est valide, ouvrir la sélection des foyers.

Pendant cette résolution, l'application présente un écran neutre avec la marque et un indicateur discret. Elle n'affiche pas brièvement une page métier vide ou les données d'un autre foyer.

## Persistance du foyer actif

L'identifiant du foyer actif est mémorisé localement dans le navigateur. Il est validé à chaque démarrage contre la collection retournée par l'API avant d'être utilisé.

Les routes visibles restent centrées sur la tâche, par exemple `/accounts` ou `/transactions`, sans répéter l'identifiant du foyer. Le client ajoute ce contexte aux appels transmis à son proxy Nuxt.

L'identifiant ne constitue pas un secret ni un mécanisme d'autorisation. Lorsque l'authentification sera introduite, l'API restera responsable de vérifier que l'utilisateur peut accéder au foyer demandé.

## Création d'un foyer

### Informations demandées

Le formulaire contient uniquement :

- le nom du foyer, obligatoire ;
- la devise principale, avec `EUR` proposé par défaut ;
- le fuseau horaire, détecté depuis le navigateur mais modifiable.

La devise et le fuseau déterminent l'interprétation des comptes et des périodes mensuelles. Le formulaire les explique sans ajouter de configuration avancée.
Leur modification après création n'appartient pas à ce parcours et nécessitera un contrat API dédié.

### Premier foyer

La création initiale occupe une page dédiée sans navigation principale, puisqu'il n'existe encore aucun contexte financier. Elle ne peut pas être annulée.

Après le succès :

1. le foyer créé devient actif ;
2. son identifiant est mémorisé ;
3. l'utilisateur poursuit vers l'ajout de son premier compte.

Cette destination évite de présenter une vue d'ensemble entièrement vide et continue directement vers la première donnée utile.

### Foyer supplémentaire

Un foyer supplémentaire peut être créé depuis le menu du foyer ou depuis l'écran de sélection. Le même formulaire est réutilisé avec une action d'annulation.

Après sa création, le nouveau foyer devient actif et le parcours continue vers l'ajout de son premier compte. L'ancien foyer et ses données restent inchangés.

## Sélection d'un foyer

L'écran de sélection apparaît uniquement lorsque plusieurs foyers existent et qu'aucun foyer actif valide ne peut être restauré, ou lorsque l'utilisateur demande explicitement à changer de foyer.

Chaque entrée affiche :

- le nom du foyer ;
- sa devise principale ;
- son fuseau horaire ;
- une indication lorsque le foyer était le dernier utilisé.

Une action claire ouvre le foyer. Une action secondaire permet d'en créer un nouveau. La recherche, les favoris et le tri manuel sont exclus tant que leur utilité n'est pas démontrée par le nombre de foyers réellement utilisé.

La sélection réussie remplace le foyer actif, met à jour sa persistance et ouvre la vue d'ensemble. Elle ne conserve jamais une page de compte ou de transaction appartenant au foyer précédent.

## Accès depuis la navigation

Sur ordinateur, le bloc du foyer actif reste placé en bas de la barre latérale.
Il affiche son nom et un monogramme décoratif, puis ouvre un menu donnant accès à :

- changer de foyer ;
- créer un foyer ;
- gérer les établissements ;
- gérer les catégories ;
- régler l'apparence.

La gestion détaillée des informations du foyer sera ajoutée lorsque son contrat de modification aura été défini.

Sur mobile, les mêmes fonctions sont accessibles depuis l'entrée « Plus » de la navigation inférieure. Le contenu peut prendre la forme d'un panneau adapté à la hauteur disponible plutôt que d'un menu flottant étroit.

## États et reprise

| Situation                  | Comportement attendu                                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Chargement initial         | Afficher un écran neutre sans révéler un foyer précédent avant validation.                                      |
| Échec de la liste          | Afficher une erreur plein écran et « Réessayer » ; ne pas proposer la création puisque l'état réel est inconnu. |
| Aucun foyer                | Ouvrir directement la création initiale.                                                                        |
| Foyer mémorisé absent      | Oublier l'identifiant puis sélectionner parmi les foyers restants ou créer le premier.                          |
| Validation du formulaire   | Relier chaque erreur au champ concerné et conserver toutes les valeurs saisies.                                 |
| Échec réseau à la création | Conserver le formulaire, expliquer que rien n'a été créé et permettre de réessayer.                             |
| Échec du changement        | Conserver le foyer courant et signaler l'échec sans afficher de données mélangées.                              |
| Création réussie           | Activer le nouveau foyer une seule fois puis poursuivre vers le premier compte.                                 |

Les réponses RFC 9457 fourniront les codes métier nécessaires aux messages et aux comportements spécifiques. Un message humain renvoyé par l'API ne sera pas utilisé comme identifiant de traduction.

## Accessibilité et responsive

- placer le focus sur le titre principal après chaque changement d'écran ;
- annoncer les erreurs globales et associer les erreurs de validation à leurs champs ;
- représenter les foyers comme une liste d'actions nommées, utilisable entièrement au clavier, plutôt que comme des cartes cliquables sans sémantique ;
- ne jamais utiliser uniquement le monogramme, la couleur ou la position pour identifier un foyer ;
- conserver des cibles tactiles d'au moins 44 par 44 pixels ;
- afficher le formulaire dans une colonne lisible sur ordinateur et sur mobile ;
- empiler la collection de foyers sur petit écran et limiter sa largeur sur grand écran ;
- respecter le mouvement réduit pendant les transitions de page et de panneau.

## Contrat API

Les routes de création, de liste et de consultation individuelle existent. Le parcours de démarrage utilise `GET /v1/households`, qui retourne un tableau JSON non paginé. Chaque entrée possède la même représentation que la création et la consultation individuelle : `id`, `name`, `baseCurrency`, `timezone`, `createdAt` et `updatedAt`.

Une installation sans foyer retourne `200 OK` avec `[]`. La collection est ordonnée par nom sans distinction de casse, puis par date de création et identifiant. La création d'un foyer supplémentaire réutilise `POST /v1/households`.

L'API locale ne possède pas encore d'authentification ni d'autorisation et retourne donc tous les foyers de l'installation. Une future autorisation conservera le contrat de collection et limitera son contenu aux foyers accessibles à l'utilisateur authentifié.

## Hors périmètre

- membres, invitations, rôles et permissions ;
- partage d'un foyer entre plusieurs utilisateurs ;
- suppression d'un foyer ;
- recherche et organisation avancée des foyers ;
- synchronisation bancaire pendant la création du foyer ;
- modification de la devise ou du fuseau après création.

La connexion d'une banque sera étudiée avec le parcours des comptes. L'ajout manuel reste disponible dans le MVP et l'import CSV précède l'agrégation bancaire.

## Suite

La conception des comptes précisera la transition vers l'ajout du premier compte.

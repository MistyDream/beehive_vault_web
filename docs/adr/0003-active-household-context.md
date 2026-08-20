# ADR-0003 — Résoudre et persister le foyer actif côté client

- Statut : Accepté
- Date : 2026-08-20

## Contexte

Toutes les données financières appartiennent à un foyer. Un même utilisateur peut gérer plusieurs foyers indépendants dès le MVP, mais les membres, invitations et permissions sont différés.

Au démarrage, le client ne connaît pas nécessairement l'identifiant à utiliser.
L'API expose déjà la création et la consultation individuelle, mais doit encore ajouter la collection `GET /v1/households`. Le client doit distinguer le premier lancement, la reprise ordinaire et le choix entre plusieurs foyers sans afficher les données d'un contexte obsolète.

## Décision

Le client résout le foyer actif à partir de la collection disponible et du dernier identifiant mémorisé dans le navigateur :

1. aucune entrée ouvre la création du premier foyer ;
2. une seule entrée est activée automatiquement ;
3. plusieurs entrées restaurent le dernier foyer encore valide ;
4. en l'absence de choix valide, l'utilisateur sélectionne un foyer.

Le foyer actif est mémorisé localement dans le navigateur. Sa validité est vérifiée contre la collection à chaque démarrage avant d'afficher une page métier. Pendant cette résolution, une attente neutre empêche de révéler brièvement les données d'un autre foyer.

Les routes visibles restent centrées sur la tâche, par exemple `/accounts` et `/transactions`. L'identifiant du foyer n'est pas répété dans l'URL de chaque page. Les appels du navigateur vers le proxy Nuxt incluent explicitement le foyer requis, puis le proxy construit la route versionnée de l'API conformément à l'ADR-0001.

La création ou la sélection met à jour le contexte actif. Un changement de foyer ouvre toujours sa vue d'ensemble et ne conserve pas une ressource appartenant au foyer précédent.

L'identifiant mémorisé n'est ni un secret ni une preuve d'autorisation. Lorsque l'authentification sera ajoutée, l'API devra vérifier l'appartenance ou le droit d'accès à chaque requête.

## Conséquences positives

- le démarrage ordinaire ne demande aucun choix inutile ;
- plusieurs périmètres financiers restent clairement séparés ;
- les URL de navigation demeurent simples et stables ;
- un foyer supprimé ou devenu inaccessible ne reste pas actif silencieusement ;
- la stratégie est compatible avec une future autorisation côté API.

## Conséquences négatives

- le premier rendu attend la résolution effectuée dans le navigateur ;
- une nouvelle installation du navigateur ne connaît pas le dernier foyer ;
- les liens vers une page ne transportent pas explicitement le foyer ciblé ;
- tous les accès aux données doivent recevoir correctement le contexte actif ;
- les onglets ouverts sur des foyers différents peuvent demander une stratégie supplémentaire si ce besoin apparaît.

## Alternatives considérées

### Limiter le MVP à un unique foyer

Rejetée car plusieurs périmètres indépendants constituent un besoin simple à prendre en charge avant l'introduction des membres et du partage.

### Inclure le foyer dans toutes les URL de page

Rejetée pour le MVP car elle alourdirait la navigation et exposerait ce détail dans chaque lien. Cette décision pourra être réévaluée si les liens directs entre foyers deviennent un usage important.

### Conserver le foyer uniquement en mémoire

Rejetée car l'utilisateur devrait le sélectionner après chaque rechargement.

### Utiliser immédiatement un cookie serveur

Rejetée car le proxy reçoit explicitement le foyer pour chaque opération et que le MVP ne possède pas encore d'authentification serveur. Un cookie pourra être introduit avec la session utilisateur si le rendu serveur du contexte devient nécessaire.

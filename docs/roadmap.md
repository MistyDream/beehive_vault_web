# Feuille de route du client web

La feuille de route suit des tranches verticales. La conception précède l'implémentation afin que les parcours et la hiérarchie de l'information ne soient pas dictés par les composants historiques.

## État actuel

- **Branche :** `reboot/web-foundation` ;
- **Phase active :** phase 0 — Conception ;
- **Dernière étape terminée :** audit statique de la version `0.1.0` ;
- **Prochaine étape :** architecture de l'information et tableau de bord.

## Phase 0 — Conception

- définir les parcours principaux du MVP ;
- revoir la navigation et l'architecture de l'information ;
- concevoir le tableau de bord sur mobile et ordinateur ;
- définir la nouvelle direction visuelle ;
- auditer les composants génériques existants ;
- documenter les états et règles d'accessibilité.

## Phase 1 — Prérequis API

- ajouter la liste des foyers ;
- migrer les erreurs vers RFC 9457 ;
- stabiliser les contrats consommés par le client.

## Phase 2 — Fondation technique

- retirer le domaine historique des portefeuilles ;
- configurer le proxy serveur Nuxt ;
- introduire les types du socle financier ;
- préserver les montants décimaux ;
- mettre à niveau les scripts de vérification et les tests ;
- adapter le design system validé pendant la phase 0.

## Phase 3 — Foyer actif

- créer un foyer ;
- retrouver et sélectionner un foyer existant ;
- conserver le contexte actif ;
- gérer les états de premier lancement.

## Phase 4 — Tableau de bord et patrimoine

- afficher le patrimoine net ;
- distinguer actifs et dettes ;
- présenter les comptes et établissements principaux ;
- fournir les accès vers les détails sources.

## Phase 5 — Comptes et référentiels

- gérer les comptes et soldes de rapprochement ;
- gérer les établissements ;
- gérer les catégories.

## Phase 6 — Transactions

- lister, filtrer et paginer les transactions ;
- créer et modifier les revenus et dépenses ;
- créer et modifier les transferts ;
- gérer les suppressions et états d'erreur.

## Phase 7 — Flux mensuels

- afficher les revenus, dépenses et flux net ;
- ventiler les montants par catégorie ;
- représenter les transactions non catégorisées ;
- remonter de chaque total aux transactions sources.

## Phase 8 — Validation du MVP

- vérifier les parcours mobile et ordinateur ;
- couvrir les parcours critiques par des tests navigateur ;
- terminer la passe d'accessibilité ;
- valider le produit avec des données de démonstration représentatives.

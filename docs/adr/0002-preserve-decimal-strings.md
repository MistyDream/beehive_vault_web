# ADR-0002 — Préserver les montants sous forme de chaînes décimales

- Statut : Accepté
- Date : 2026-08-20

## Contexte

L'API transmet les montants financiers sous forme de chaînes décimales afin de préserver leur valeur exacte. Le client historique utilise des `number`, `parseFloat` et `Intl.NumberFormat` directement sur ces valeurs. Une conversion globale vers le format binaire des nombres JavaScript peut introduire des arrondis, supprimer des zéros significatifs ou rendre une saisie intermédiaire impossible à représenter fidèlement.

Le client doit afficher et saisir des montants localisés sans modifier la valeur échangée avec l'API. Les agrégations financières disponibles restent calculées par l'API, qui constitue leur source de vérité.

## Décision

Les montants reçus et envoyés à la frontière HTTP restent des chaînes décimales.
Les types de contrat, stores, formulaires et composants monétaires ne les convertissent pas implicitement en `number`.

La saisie conserve séparément le texte présenté à l'utilisateur et la chaîne décimale normalisée destinée à l'API. Le formatage localisé est une opération de présentation et ne modifie jamais cette valeur canonique.

Les composants génériques numériques ne sont pas utilisés pour l'argent. Un composant monétaire dédié gère le signe, le séparateur décimal, la devise, les états intermédiaires de saisie et les erreurs de validation.

Lorsqu'un calcul local exact devient réellement nécessaire, une bibliothèque décimale sera évaluée pour ce cas précis. Son type ne remplacera pas le contrat HTTP sous forme de chaîne, et le client ne recalculera pas silencieusement les agrégations déjà fournies par l'API.

## Conséquences positives

- les valeurs échangées avec l'API restent exactes ;
- la saisie ne perd pas de précision pendant l'édition ;
- les règles d'arrondi restent explicites ;
- les agrégations affichées correspondent aux résultats de l'API ;
- le traitement monétaire est identifiable dans les types et composants.

## Conséquences négatives

- les montants ne peuvent pas utiliser directement les opérateurs arithmétiques JavaScript ;
- le formatage localisé demande une implémentation dédiée ;
- les composants historiques fondés sur `number` doivent être remplacés ;
- les comparaisons et tris locaux exigent une stratégie décimale explicite.

## Alternatives considérées

### Convertir tous les montants en `number`

Rejetée car cette représentation binaire ne garantit pas l'exactitude décimale et rend les conversions implicites difficiles à auditer.

### Utiliser des entiers en unité mineure

Rejetée comme contrat générique car le nombre de décimales dépend de la devise et parce que l'API a déjà retenu une représentation décimale explicite. Cette technique pourra rester interne à un calcul ciblé si ses règles sont définies.

### Introduire immédiatement une bibliothèque décimale partout

Rejetée car le client n'a pas encore de calcul local justifiant cette dépendance.
Elle serait évaluée à partir d'un besoin observé plutôt que généralisée par anticipation.

# Rapport mensuel

## Statut

La conception fonctionnelle du rapport mensuel et son wireframe sont validés provisoirement pour le MVP. Les détails visuels pourront évoluer pendant l'implémentation et la validation en usage réel.

Le [wireframe interactif](wireframes/monthly-report.html) présente la version ordinateur avec diagramme de Sankey et la version mobile avec listes à barres.

## Rôle

Le rapport mensuel répond à la question « comment les flux du foyer se composent-ils sur un mois civil précis ? ». Il complète la vue d'ensemble, qui reste limitée au mois courant, et la page Transactions, qui privilégie la recherche et la maintenance des mouvements.

Il permet de :

1. comparer les revenus, les dépenses et le flux net d'un mois ;
2. comprendre leur ventilation par catégorie ;
3. repérer les transactions non catégorisées ;
4. remonter de chaque total aux transactions sources.

Le rapport reste consultatif. La création et la modification des mouvements appartiennent à la page Transactions.

## Accès et période

Le lien « Analyse mensuelle » de la vue d'ensemble ouvre le rapport du mois courant. Le rapport n'occupe pas une entrée supplémentaire dans la navigation principale du MVP.

Le mois fait partie de l'URL, par exemple `/monthly-report/2026-07`. Une actualisation, un lien partagé ou un retour depuis une transaction conservent ainsi la période consultée.

Le contrôle de période affiche le mois et l'année entre deux flèches :

- les flèches passent au mois précédent ou suivant ;
- le libellé ouvre un sélecteur de mois et d'année pour les déplacements plus éloignés ;
- les mois postérieurs au mois courant du foyer sont désactivés ;
- l'action « Revenir au mois actuel » apparaît uniquement lorsqu'un autre mois est consulté.

Le mois courant est déterminé dans le fuseau horaire du foyer. Sur mobile, le même contrôle reste centré sous le titre.

## Résumé

Trois indicateurs apparaissent en tête de page :

- les revenus, leur montant total et leur nombre de transactions ;
- les dépenses, leur montant total et leur nombre de transactions ;
- le flux net, égal aux revenus diminués des dépenses.

Les revenus et dépenses occupent un niveau visuel équivalent. Le flux net reçoit une emphase légèrement supérieure parce qu'il résume le résultat du mois, sans devenir une carte dominante. Son signe reste explicite et sa couleur distingue un résultat positif, négatif ou nul sans porter seule la signification.

Aucune comparaison avec le mois précédent n'est affichée dans le MVP. L'API ne fournit pas encore le contexte nécessaire pour expliquer correctement une variation.

Les indicateurs de revenus et de dépenses donnent accès aux transactions correspondantes. Le flux net n'est pas cliquable, car il ne représente pas une collection distincte de mouvements.

## Répartition sur ordinateur

Un diagramme de Sankey constitue la visualisation principale sur ordinateur. Il relie les catégories de revenus à l'ensemble des flux du mois, puis cet ensemble aux catégories de dépenses et au flux net positif.

Le diagramme représente une répartition agrégée. Il ne prétend pas retracer l'affectation réelle d'un euro reçu à une dépense particulière.

Les règles suivantes s'appliquent :

- un flux net positif apparaît comme une destination ;
- lorsque les dépenses dépassent les revenus, une source virtuelle « Déficit du mois » équilibre la représentation ;
- un flux net nul ne crée aucun nœud artificiel ;
- les largeurs sont calculées à partir des montants décimaux retournés par l'API ;
- les catégories et leurs montants restent directement libellés ;
- la couleur distingue les revenus, dépenses et flux net, mais le sens reste compréhensible grâce aux libellés et à la position.

Un Sankey n'est affiché que lorsque tous les totaux et montants agrégés peuvent être représentés sans déformation. Une catégorie négative issue d'un remboursement ou d'une correction déclenche la liste de repli. Le client ne transforme pas une valeur négative en valeur absolue pour forcer son entrée dans le diagramme.

Les listes détaillées des dépenses et revenus restent présentes sous le diagramme. Elles donnent le montant exact, le nombre de transactions et l'accès aux sources sans demander d'interpréter uniquement la largeur des flux.

## Répartition sur mobile et repli

Sur mobile, le Sankey est remplacé par deux listes à barres, dépenses puis revenus. La même représentation sert de repli sur ordinateur lorsque les données ne permettent pas un Sankey fiable.

Chaque ligne affiche :

- l'icône et le nom de la catégorie ;
- le nombre de transactions ;
- le montant signé ;
- une barre indiquant son poids relatif dans la section ;
- une affordance indiquant l'accès aux transactions sources.

Les montants négatifs restent explicitement signés et utilisent un traitement de barre distinct. Aucun pourcentage trompeur n'est calculé lorsque le total de la section est nul ou que des corrections empêchent une comparaison pertinente.

Toutes les catégories retournées par le rapport sont affichées, dans l'ordre décroissant fourni par l'API. Le MVP ne limite pas la liste aux catégories principales.

## Transactions sources

Le rapport réutilise la collection Transactions plutôt que d'introduire une seconde liste de mouvements :

- « Revenus » transmet les bornes du mois et la nature `income` ;
- « Dépenses » transmet les bornes du mois et la nature `expense` ;
- une catégorie transmet en plus son identifiant ;
- « Non catégorisé » transmet le filtre spécifique `uncategorized=true` ;
- « Voir toutes les transactions du mois » transmet uniquement les bornes de la période.

Les filtres sont représentés dans l'URL de la page Transactions. Le retour au rapport restaure le mois, la position de défilement et, lorsque possible, le nœud ou la ligne à l'origine de la navigation.

## Transactions non catégorisées

Le groupe virtuel « Non catégorisé » participe normalement aux totaux et à la ventilation. Il utilise une icône neutre et un traitement visuel légèrement distinct.

La mention discrète « À catégoriser » indique qu'une intervention est possible sans présenter la situation comme une erreur. Son activation ouvre les transactions non catégorisées du mois et de la nature concernés.

## Mois vide

Lorsqu'un mois ne comporte aucun revenu ni aucune dépense :

- les trois indicateurs affichent `0 €` ;
- aucun diagramme ou ensemble de barres vide n'est dessiné ;
- le message « Aucun flux enregistré pour ce mois » remplace la ventilation ;
- un lien permet de consulter les transactions du mois.

Aucun bouton de création de transaction n'est ajouté au rapport. Les états génériques de chargement et d'erreur suivent les [règles transversales](cross-cutting-rules.md).

## Responsive et accessibilité

Le Sankey est une amélioration visuelle réservée aux espaces qui permettent de lire ses libellés sans réduction excessive. Les listes restent la représentation complète sur mobile et la solution de repli accessible.

La visualisation doit fournir un résumé textuel aux technologies d'assistance. Les catégories interactives sont atteignables au clavier, possèdent un libellé complet et ne reposent ni sur la couleur ni sur le survol. Le sélecteur de mois annonce la période active et l'indisponibilité des mois futurs.

Les montants utilisent des chiffres tabulaires et conservent leur signe. Le formatage respecte la devise et les conventions linguistiques du foyer sans conversion en nombre binaire susceptible de perdre de la précision.

## Contrat API

La route `GET /v1/households/{household_id}/monthly-flows/{month}` couvre déjà le cœur du rapport : bornes du mois, devise, revenus, dépenses, flux net, nombres de transactions et ventilations par catégorie.

La navigation vers les sources repose sur les filtres existants de la collection Transactions. Les besoins complémentaires identifiés pendant la conception des transactions restent applicables, notamment la pagination progressive, l'effet économique affichable et la résolution des catégories archivées.

Le client peut déterminer le mois courant à partir du fuseau horaire déjà exposé par le foyer. Aucun nouveau calcul métier ne doit être réimplémenté pour reconstruire les totaux du rapport.

## Suite

La conception fonctionnelle de 0.6.4 est suffisamment définie pour préparer l'implémentation. Les comportements communs sont précisés par les [règles transversales](cross-cutting-rules.md).

# Feuille de route du client web

La feuille de route suit des tranches verticales. La conception précède
l'implémentation afin que les parcours et la hiérarchie de l'information ne
soient pas dictés par les composants historiques.

Le [catalogue des fonctionnalités](features.md) distingue séparément ce qui est disponible, conçu, en développement, prévu ou différé.

## État actuel

- **Branche :** `reboot/web-foundation` ;
- **Phase active :** phase 2 — Fondation technique ;
- **Étape active :** 2.1 — Nettoyage du domaine historique ;
- **Dernière étape terminée :** 1.3 — Contrats consommés par le client ;

Légende :

- ✅ terminé ;
- 🚧 en cours ;
- ⬜ à faire.

## Phase 0 — Conception ✅

### 0.1 — Audit de la version `0.1.0` ✅

- inventorier les parcours, composants et dépendances historiques ;
- distinguer le socle générique du domaine des portefeuilles d'investissement ;
- identifier les acquis d'accessibilité et de responsive design à préserver.

### 0.2 — Fondation de la reconstruction ✅

- confirmer Nuxt, Vue, TypeScript et l'internationalisation ;
- définir la stratégie de proxy et de versionnement de l'API ;
- documenter les contraintes du nouveau domaine financier ;
- établir la feuille de route de la reconstruction.

### 0.3 — Navigation et vue d'ensemble ✅

- définir l'architecture de la navigation sur ordinateur et mobile ;
- hiérarchiser le patrimoine, les comptes et les flux du mois courant ;
- exclure les transactions récentes et le choix du mois de la vue d'ensemble ;
- valider les wireframes fonctionnels sur ordinateur et mobile.

### 0.4 — Direction visuelle ✅

- adopter une identité chaleureuse et précise ;
- définir les thèmes clair et sombre ;
- choisir la palette, la typographie, les surfaces et les arrondis ;
- définir la densité et l'usage du motif alvéolaire ;
- valider la vue d'ensemble dans les deux thèmes et formats.

### 0.5 — Audit des composants génériques ✅

- classer les composants historiques à conserver, adapter, remplacer ou supprimer ;
- identifier les primitives nécessaires au nouveau design system ;
- vérifier leur accessibilité et leur comportement responsive ;
- définir l'ordre de migration des composants retenus.

Les décisions détaillées sont consignées dans l'[audit des composants génériques](component-audit.md).

### 0.6 — Parcours et états restants ✅

#### 0.6.1 — Foyer actif ✅

- concevoir la création, la sélection et la persistance du foyer actif ;
- traiter le démarrage avec zéro, un ou plusieurs foyers ;
- valider le [wireframe ordinateur et mobile](active-household.md).

#### 0.6.2 — Comptes ✅

- documenter la [liste, le détail et les formulaires](accounts.md) ;
- valider provisoirement les wireframes de la liste, du détail, de la création et du rapprochement sur ordinateur et mobile ;
- définir le rapprochement, l'archivage et les établissements référencés ;
- identifier les prérequis API nécessaires à l'implémentation.

#### 0.6.3 — Transactions ✅

- concevoir et documenter la [liste, le détail et les formulaires](transactions.md) ;
- distinguer les revenus, dépenses et transferts ;
- préserver le contexte pendant la consultation et la modification ;
- valider provisoirement les wireframes sur ordinateur et mobile ;
- identifier les prérequis API nécessaires à l'implémentation.

#### 0.6.4 — Rapport mensuel ✅

- concevoir et documenter le [rapport mensuel](monthly-report.md) ;
- valider provisoirement le Sankey sur ordinateur et les listes à barres sur mobile ;
- représenter les transactions non catégorisées ;
- permettre de remonter aux transactions sources.

#### 0.6.5 — Règles transversales ✅

- documenter les [états de chargement, vide, erreur et succès](cross-cutting-rules.md) ;
- définir les règles de contenu et de formatage financier ;
- viser WCAG 2.2 AA sur les parcours du MVP.

**Résultat attendu :** le client dispose d'une architecture de l'information, d'une direction visuelle et de parcours suffisamment définis pour commencer la reconstruction sans dépendre du domaine historique.

## Phase 1 — Prérequis API ✅

### 1.1 — Liste des foyers ✅

- ajouter la route permettant de retrouver les foyers existants ;
- définir le contrat nécessaire au premier lancement et à la sélection du foyer.

### 1.2 — Erreurs RFC 9457 ✅

- migrer les erreurs consommées par le client vers les Problem Details ;
- stabiliser les types, codes et champs exploitables par l'interface.

### 1.3 — Contrats consommés par le client ✅

- confirmer les routes et représentations nécessaires aux premiers parcours ;
- documenter les éventuels écarts entre les besoins web et l'API existante ;
- catalogue global d'établissements : ✅ implémenté ;
- validation et correction des soldes : ✅ implémentées ;
- cycle de vie et sous-totaux des comptes : ✅ implémentés ;
- consolider les opérations, leurs montants et leur pagination avec `total` : ✅ implémenté.

**Résultat attendu :** le client peut retrouver un foyer, traiter les erreurs
et construire les premiers parcours Comptes et Transactions à partir de
contrats stables.

## Phase 2 — Fondation technique 🚧

### 2.1 — Nettoyage du domaine historique 🚧

- retirer les pages et composants propres aux portefeuilles d'investissement ;
- conserver uniquement les fondations génériques validées par l'audit.

### 2.2 — Accès à l'API ⬜

- configurer le proxy serveur Nuxt ;
- masquer la version de l'API au navigateur ;
- introduire les types du socle financier ;
- préserver les montants décimaux de bout en bout.

### 2.3 — Socle d'interface ⬜

- adapter les tokens aux thèmes validés ;
- mettre en place la nouvelle structure de navigation ;
- migrer les premières primitives du design system ;
- mettre à niveau les scripts de vérification et les tests.

**Résultat attendu :** le client dispose d'un socle exécutable aligné avec la
nouvelle API et la direction visuelle.

## Phase 3 — Foyer actif ⬜

### 3.1 — Premier lancement ⬜

- créer un foyer lorsqu'il n'en existe aucun ;
- présenter les états de chargement, d'erreur et de reprise du parcours.

### 3.2 — Sélection du foyer ⬜

- retrouver et sélectionner un foyer existant ;
- conserver le contexte actif ;
- permettre de changer de foyer depuis le menu prévu à cet effet.

**Résultat attendu :** l'utilisateur rejoint un foyer actif de façon fiable à
chaque ouverture de l'application.

## Phase 4 — Vue d'ensemble et patrimoine ⬜

### 4.1 — Patrimoine actuel ⬜

- afficher le patrimoine net ;
- distinguer les actifs et les dettes ;
- regrouper les comptes par rôle financier ;
- fournir les accès vers les comptes sources.

### 4.2 — Mois en cours ⬜

- afficher les revenus, dépenses et flux net du mois courant ;
- présenter les principales catégories de dépenses ;
- fournir l'accès vers l'analyse mensuelle détaillée ;
- afficher les actions contextuelles lorsqu'une intervention est nécessaire.

**Résultat attendu :** la vue d'ensemble répond à la question « où en suis-je
aujourd'hui ? » à partir des données réelles du foyer.

## Phase 5 — Comptes et référentiels ⬜

### 5.1 — Comptes et rapprochements ⬜

- lister et consulter les comptes ;
- gérer les comptes et leurs soldes de rapprochement ;
- représenter clairement les actifs, dettes et comptes archivés.

### 5.2 — Établissements et catégories ⬜

- gérer les établissements ;
- gérer les catégories ;
- préserver l'accès aux référentiels depuis le menu du foyer.

**Résultat attendu :** l'utilisateur peut comprendre et maintenir les sources de
son patrimoine et de ses transactions.

## Phase 6 — Transactions ⬜

### 6.1 — Consultation ⬜

- lister, filtrer et paginer les transactions ;
- distinguer les revenus, dépenses et transferts ;
- représenter les transactions non catégorisées et supprimées lorsque le
  contexte le nécessite.

### 6.2 — Transactions ordinaires ⬜

- créer et modifier les revenus et dépenses ;
- gérer la catégorie, le compte et la date de comptabilisation ;
- traiter les validations et erreurs de l'API.

### 6.3 — Transferts et suppressions ⬜

- créer et modifier les transferts ;
- gérer les suppressions ;
- préserver les règles atomiques exposées par l'API.

**Résultat attendu :** l'utilisateur peut maintenir manuellement les mouvements
qui expliquent ses soldes et ses flux.

## Phase 7 — Flux mensuels ⬜

### 7.1 — Rapport mensuel ⬜

- afficher les revenus, dépenses et flux net du mois sélectionné ;
- ventiler les montants par catégorie ;
- représenter explicitement les transactions non catégorisées ;
- permettre de changer de mois sur la page dédiée.

### 7.2 — Transactions sources ⬜

- remonter de chaque total aux transactions sources ;
- préserver le contexte du mois et de la catégorie pendant la navigation.

**Résultat attendu :** l'utilisateur comprend la composition de ses flux
mensuels et peut vérifier chaque total.

## Phase 8 — Validation du MVP ⬜

### 8.1 — Qualité des parcours ⬜

- vérifier les parcours sur mobile et ordinateur ;
- couvrir les parcours critiques par des tests navigateur ;
- terminer la passe d'accessibilité WCAG 2.2 AA.

### 8.2 — Usage représentatif ⬜

- préparer des données de démonstration représentatives ;
- valider le parcours complet du foyer au rapport mensuel ;
- ajuster le produit selon les difficultés observées en usage réel.

**Résultat attendu :** le socle du MVP répond aux questions définies dans la
fondation produit et peut être utilisé régulièrement.

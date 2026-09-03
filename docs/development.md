# Environnement de développement

## Objectif

L'environnement local démarre les trois services nécessaires au client web :

1. PostgreSQL 18 sur `127.0.0.1:5432` ;
2. l'API Rust sur `127.0.0.1:8080` ;
3. Nuxt sur `http://127.0.0.1:3000`.

Process Compose orchestre leur démarrage, vérifie leur disponibilité et les arrête dans l'ordre inverse. Son interface de contrôle utilise le port local `9090` pour ne pas entrer en conflit avec l'API.

## Prérequis

- Rust stable ;
- Node.js 20 ou plus récent ;
- Corepack avec Yarn 4 ;
- PostgreSQL 18 installé avec Homebrew ;
- Process Compose.

Installer Process Compose avec :

```bash
brew install f1bonacc1/tap/process-compose
```

Caddy n'est pas encore nécessaire. Il sera ajouté dans une seconde étape lorsque l'application fonctionnera correctement sur ses ports locaux.

## Première préparation

Créer les fichiers d'environnement locaux s'ils n'existent pas encore :

```bash
cp .env.example .env
cp ../beehive_vault_api/.env.example ../beehive_vault_api/.env
```

Au premier démarrage de PostgreSQL, préparer le rôle et les bases depuis le dépôt de l'API :

```bash
cd ../beehive_vault_api
./scripts/setup-postgres.sh
```

Cette préparation est réentrante. L'API applique ensuite automatiquement ses migrations au démarrage.

## Démarrer et arrêter l'environnement

Démarrer tous les services en arrière-plan depuis le dépôt web :

```bash
./scripts/dev-up.sh
```

Ouvrir l'interface Process Compose pour consulter leur état et leurs journaux :

```bash
./scripts/dev-attach.sh
```

Quitter cette interface avec `q` ne coupe pas les services. Pour tout arrêter :

```bash
./scripts/dev-down.sh
```

L'application est disponible sur `http://127.0.0.1:3000` lorsque les trois processus sont prêts.

## PostgreSQL

Si un serveur répond déjà sur `127.0.0.1:5432`, Process Compose le réutilise et ne l'arrête pas avec les autres services.

Sinon, il lance directement le serveur PostgreSQL 18 installé par Homebrew. Par défaut, le cluster attendu se trouve dans le répertoire `var/postgresql@18` de Homebrew. Un autre emplacement peut être fourni avec la variable `BEEHIVE_POSTGRES_DATA_DIR`.

Après un arrêt brutal, PostgreSQL peut laisser un fichier `postmaster.pid` alors que le processus correspondant n'existe plus. Le script refuse de supprimer automatiquement ce fichier : il indique le chemin et le PID à vérifier afin d'éviter d'endommager un serveur encore actif.

## Routage de l'API

Le navigateur n'appelle jamais directement `127.0.0.1:8080`. Il utilise les routes même origine de Nuxt, qui relaie les requêtes vers la valeur privée `NUXT_API_BASE`.

La configuration locale attend :

```dotenv
NUXT_API_BASE=http://127.0.0.1:8080
```

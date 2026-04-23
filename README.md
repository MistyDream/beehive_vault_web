# Beehive Vault Web

Frontend Nuxt 4 pour Beehive Vault — portfolio tracking et scoring d'actions.

## Prérequis

- **Node 22+** (`.nvmrc` fourni — `nvm use` pour aligner)
- **Yarn 4** via corepack (`corepack enable` une fois, puis `yarn <cmd>`)
- API Rust lancée sur `$API_BASE_URL` (par défaut `http://127.0.0.1:8080`)

## Setup

```bash
nvm use                  # Node 22 depuis .nvmrc
corepack enable          # active le shim yarn 4
yarn install
cp .env.example .env     # si présent, sinon définir API_BASE_URL
```

## Commandes

```bash
yarn dev                 # dev server http://localhost:3000
yarn build               # build production (Nitro + client)
yarn preview             # preview du build
yarn lint                # ESLint
yarn lint:fix            # ESLint + autofix
yarn format              # Prettier
yarn nuxt typecheck      # Vue/TypeScript typecheck
```

## Documentation

- `CLAUDE.md` — stack, structure, conventions, patterns (point d'entrée pour contribuer)
- Notes Obsidian dans `/mnt/c/Users/Max/Documents/Obsidian Vault/Projets/Beehive Vault/`

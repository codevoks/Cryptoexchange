# McRyptoX

This is a crpto currency exchage in Turborepo

## Prerequisites

```
- Node.js
- Docker (Optional)
- npm
- PostgreSQL & Redis (installed locally or via Docker)
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
```

## Project Structure (Monorepo)

```bash
apps/
  web/              # Next.js frontend app
  matching-engine/  # Matching engine for processing orders
  ws-server/        # WebSocket server for real-time trading data

packages/
  db/               # Prisma + database access logic
  redis-utils/      # Redis pub/sub + queue logic
  auth-utils/       # JWT, password hashing, etc.
  types/            # Shared TypeScript types across apps

configs/
  typescript/       # Shared TypeScript configurations
  tailwind/         # Shared TailwindCSS config (if used)

data/
  postgres/         # PostgreSQL volume (for Docker)
  redis/            # Redis volume (for Docker)
```

## Setup 1 - Local Development (without Docker)

```
# 1. Clone the repository
git clone https://github.com/codevoks/Cryptoexchange.git
cd Cryptoexchange

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example.local .env
# ➤ Edit .env with your DB, Redis, etc.

# 4. Push database schema
npx prisma db push

# 5. Generate Prisma Client
npx prisma generate

# 6. build the project
npx turbo run build

# 7. run the project
npx turbo run dev
```

## Setup 2 - Docker Development (with Docker)

```
# 1. Clone the repository
git clone https://github.com/codevoks/Cryptoexchange.git
cd Cryptoexchange

# 2. Create your .env file
cp .env.example.docker .env
# ➤ Fill required values

# 3. Build images
docker-compose build --no-cache

# 4. Start everything using Docker Compose
docker-compose up

# 5.(Optional) Tear down
docker-compose down
```

## Data Folder (Local Volume)

```
data/
  postgres/       # PostgreSQL volume
  redis/          # Redis volume
```

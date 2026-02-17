#!/usr/bin/env bash
set -euo pipefail
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

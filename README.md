# Football Agent Web (Original)

Single-player web simulation game built with Next.js + Prisma + SQLite.

## Run
```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## One-command bootstrap
```bash
npm run bootstrap
```

## Core Play Loop
1. Start save with agency + managed players.
2. Build company sponsorships for clubs.
3. Trade club stocks.
4. Set weekly player support programs.
5. Reach ownership threshold and apply presidency policies.
6. Use editor mode in Settings (code: `IUNDERSTAND`).

## Routes
- `/` dashboard + news + week control
- `/agency` staff + support programs
- `/company` company + sponsorship
- `/players` player list
- `/clubs` club list
- `/market` transfer offers and negotiation output
- `/stocks` stock market, chart, portfolio
- `/season` tables
- `/presidency` presidency panel
- `/editor` in-game editor
- `/settings` tick tools, editor toggle, export/import save

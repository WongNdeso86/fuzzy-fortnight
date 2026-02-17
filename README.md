# Football Agent Web (Original)

Single-player web simulation game built with Next.js + Prisma + SQLite.

## Quick Start (Install & Run)
```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Open: `http://localhost:3000`

## One-command bootstrap
```bash
npm run bootstrap
```

## Cara Main Singkat
1. Buka `/` lalu klik **Advance 1 week** atau auto x2/x4/x8.
2. Ke `/agency` untuk assign program support pemain mingguan.
3. Ke `/company` untuk bikin sponsorship ke klub (`clubId`).
4. Ke `/stocks` untuk buy/sell saham klub dan pantau chart.
5. Ke `/presidency` kalau ownership sudah lewat threshold (default 51%).
6. Ke `/settings` untuk aktifkan editor (kode: `IUNDERSTAND`) + export/import save.

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

## Troubleshooting Install
Kalau `npm install` gagal `403 Forbidden` (policy/proxy):

1. Jalankan diagnosa:
   ```bash
   npm run doctor
   ```
2. Jika pakai jaringan kantor, gunakan npm registry internal:
   ```bash
   npm config set registry <internal-registry-url>
   npm install
   ```
3. Jika proxy env salah konfigurasi dan network mengizinkan direct:
   ```bash
   env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy npm install
   ```

## Local helper
```bash
npm run doctor
```
Menampilkan proxy env + cek koneksi ke npm registry.

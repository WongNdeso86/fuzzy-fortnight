"use client";

import { useMemo, useState } from "react";

type StockLite = { clubId: number; clubName: string; price: number; tradableShares: number; availableShares: number };

export function TradePanel({ stocks }: { stocks: StockLite[] }) {
  const [clubId, setClubId] = useState<number>(stocks[0]?.clubId ?? 1);
  const [shares, setShares] = useState(100);
  const selected = useMemo(() => stocks.find((s) => s.clubId === clubId), [stocks, clubId]);

  const trade = async (action: "BUY" | "SELL") => {
    const res = await fetch("/api/orders", { method: "POST", body: JSON.stringify({ clubId, shares, action }) });
    const data = await res.json();
    if (!res.ok) alert(data.message ?? "Trade failed");
    location.reload();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <select className="input" value={clubId} onChange={(e) => setClubId(Number(e.target.value))}>
          {stocks.map((s) => <option key={s.clubId} value={s.clubId}>{s.clubName} (#{s.clubId})</option>)}
        </select>
        <input className="input" type="number" min={1} value={shares} onChange={(e) => setShares(Number(e.target.value))} />
        <button className="btn" onClick={() => trade("BUY")}>Buy</button>
        <button className="btn" onClick={() => trade("SELL")}>Sell</button>
      </div>
      {selected && <p className="text-xs text-slate-300">Price ${selected.price.toFixed(2)} • Tradable {selected.tradableShares.toLocaleString()} • Available {selected.availableShares.toLocaleString()}</p>}
    </div>
  );
}

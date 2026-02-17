"use client";
import { useState } from "react";

export function TradePanel() {
  const [clubId,setClubId]=useState(1); const [shares,setShares]=useState(100);
  const trade = async (action:"BUY"|"SELL")=>{await fetch('/api/orders',{method:'POST',body:JSON.stringify({clubId,shares,action})});location.reload();};
  return <div className="flex gap-2"><input className="input" type="number" value={clubId} onChange={e=>setClubId(Number(e.target.value))}/><input className="input" type="number" value={shares} onChange={e=>setShares(Number(e.target.value))}/><button className="btn" onClick={()=>trade('BUY')}>Buy</button><button className="btn" onClick={()=>trade('SELL')}>Sell</button></div>;
}

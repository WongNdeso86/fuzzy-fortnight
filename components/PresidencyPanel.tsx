"use client";
import { useState } from "react";

export function PresidencyPanel({ clubs }: { clubs: { id: number; name: string }[] }) {
  const [clubId, setClubId] = useState(clubs[0]?.id ?? 1);
  const [wageRatio, setWageRatio] = useState(0.55);
  const [fac, setFac] = useState(50000);
  const [youth, setYouth] = useState(30000);
  const save = async()=>{await fetch('/api/presidency',{method:'POST',body:JSON.stringify({clubId,wageRatio,facilitiesSpend:fac,youthSpend:youth})});location.reload();};
  return <div className="card flex flex-wrap gap-2"><select className="input" value={clubId} onChange={e=>setClubId(Number(e.target.value))}>{clubs.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input className="input" type="number" step="0.01" value={wageRatio} onChange={e=>setWageRatio(Number(e.target.value))}/><input className="input" type="number" value={fac} onChange={e=>setFac(Number(e.target.value))}/><input className="input" type="number" value={youth} onChange={e=>setYouth(Number(e.target.value))}/><button className="btn" onClick={save}>Apply Policy</button></div>;
}

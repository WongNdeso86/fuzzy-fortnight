"use client";
import { useState } from "react";

export function SponsorForm() {
  const [clubId, setClubId] = useState(1);
  const create = async () => {
    await fetch("/api/sponsorship", { method: "POST", body: JSON.stringify({ clubId, weeklyAmount: 100000, durationWeeks: 26, performanceBonus: 25000, brandLift: 2 }) });
    location.reload();
  };
  return <div className="card flex items-center gap-2"><input className="input" type="number" value={clubId} onChange={e=>setClubId(Number(e.target.value))}/><button className="btn" onClick={create}>Create Sponsorship</button></div>;
}

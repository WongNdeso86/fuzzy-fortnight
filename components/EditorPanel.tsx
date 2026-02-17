"use client";
import { useState } from "react";

export function EditorPanel() {
  const [kind,setKind]=useState("agency");
  const [id,setId]=useState(1);
  const [field,setField]=useState("cash");
  const [value,setValue]=useState("10000000");
  const save = async()=>{await fetch('/api/editor',{method:'POST',body:JSON.stringify({kind,id,field,value:Number(value)})});alert('saved');};
  return <div className="card space-y-2"><h1 className="font-semibold">In-Game Editor</h1><div className="flex gap-2"><select className="input" value={kind} onChange={e=>setKind(e.target.value)}><option value="agency">Agency</option><option value="player">Player</option><option value="club">Club</option><option value="stock">Stock</option><option value="sponsorship">Sponsorship</option><option value="world">World</option></select><input className="input" value={id} onChange={e=>setId(Number(e.target.value))}/><input className="input" value={field} onChange={e=>setField(e.target.value)}/><input className="input" value={value} onChange={e=>setValue(e.target.value)}/><button className="btn" onClick={save}>Save</button></div><p className="text-xs text-slate-400">Contoh: player + id + overall + 90</p></div>;
}

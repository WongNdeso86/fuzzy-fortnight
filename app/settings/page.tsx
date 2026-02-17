"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [code, setCode] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [thresholdMode, setThresholdMode] = useState("CONTROL_51");
  const toggle = async () => {
    await fetch("/api/settings", { method: "POST", body: JSON.stringify({ kind: "editor", code, enabled, thresholdMode }) });
    alert("updated");
  };
  const exportSave = async () => {
    const res = await fetch("/api/settings", { method: "POST", body: JSON.stringify({ kind: "export" }) });
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "save-backup.json";
    a.click();
  };
  const run52 = async () => { await fetch('/api/sim52',{method:'POST'}); alert('52 weeks completed'); };
  const importSave = async (file: File) => {
    const text = await file.text();
    await fetch("/api/settings", { method: "POST", body: JSON.stringify({ kind: "import", data: JSON.parse(text) }) });
    alert("imported");
  };

  return <div className="space-y-3">
    <div className="card flex gap-2 items-center"><input className="input" placeholder="IUNDERSTAND" value={code} onChange={e=>setCode(e.target.value)}/><label><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/> Editor On</label><select className="input" value={thresholdMode} onChange={e=>setThresholdMode(e.target.value)}><option value="CONTROL_51">51% Control</option><option value="FULL_100">100% Takeover</option></select><button className="btn" onClick={toggle}>Apply</button></div>
    <div className="card flex gap-2"><button className="btn" onClick={exportSave}>Export Save JSON</button><button className="btn" onClick={run52}>Run 52-week sim</button></div>
  <div className="card"><input type="file" accept="application/json" onChange={e=>{const f=e.target.files?.[0]; if(f) importSave(f);}}/></div></div>;
}

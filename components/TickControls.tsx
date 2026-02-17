"use client";

import { useState } from "react";

export function TickControls() {
  const [running, setRunning] = useState(false);

  const one = async () => {
    await fetch("/api/tick", { method: "POST" });
    location.reload();
  };

  const auto = async (speed: number) => {
    setRunning(true);
    for (let i = 0; i < speed; i++) {
      await fetch("/api/tick", { method: "POST" });
      await new Promise((r) => setTimeout(r, 250));
    }
    setRunning(false);
    location.reload();
  };

  return (
    <div className="card flex flex-wrap gap-2">
      <button className="btn" onClick={one}>Advance 1 week</button>
      <button className="btn" onClick={() => auto(2)} disabled={running}>Auto x2</button>
      <button className="btn" onClick={() => auto(4)} disabled={running}>Auto x4</button>
      <button className="btn" onClick={() => auto(8)} disabled={running}>Auto x8</button>
    </div>
  );
}

import { runOneWeekTick } from "@/lib/sim/tickEngine";

export async function POST() {
  for (let i = 0; i < 52; i++) await runOneWeekTick();
  return Response.json({ ok: true });
}

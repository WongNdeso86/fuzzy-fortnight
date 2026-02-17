import { runOneWeekTick } from "@/lib/sim/tickEngine";

export async function POST() {
  await runOneWeekTick();
  return Response.json({ ok: true });
}

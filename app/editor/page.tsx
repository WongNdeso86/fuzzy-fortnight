import { prisma } from "@/lib/prisma";
import { EditorPanel } from "@/components/EditorPanel";

export default async function EditorPage() {
  const state = await prisma.gameState.findUnique({ where: { id: 1 } });
  if (!state?.editorEnabled) return <div className="card">Editor OFF. Aktifkan dari settings + kode IUNDERSTAND.</div>;
  return <EditorPanel />;
}

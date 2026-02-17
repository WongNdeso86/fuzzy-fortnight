import Link from "next/link";

const links = ["/", "/agency", "/company", "/players", "/clubs", "/market", "/stocks", "/season", "/presidency", "/editor", "/settings"];

export function Nav() {
  return (
    <nav className="card sticky top-2 z-20 mb-4 flex flex-wrap gap-2">
      {links.map((l) => (
        <Link key={l} href={l} className="rounded bg-slate-800 px-2 py-1 text-xs hover:bg-slate-700">
          {l === "/" ? "dashboard" : l.slice(1)}
        </Link>
      ))}
    </nav>
  );
}

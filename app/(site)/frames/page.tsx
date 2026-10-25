import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Style frames" };

// Temporary: pick a direction, then this folder is deleted (build step 2).
export default function Frames() {
  return (
    <main className="grid min-h-dvh place-items-center p-8">
      <div className="grid gap-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em]">Pick a direction</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link className="rounded-full border px-6 py-3 hover:bg-black hover:text-white" href="/frames/editorial">
            A — Editorial
          </Link>
          <Link className="rounded-full border px-6 py-3 hover:bg-black hover:text-white" href="/frames/bold">
            B — Dark &amp; Bold
          </Link>
        </div>
      </div>
    </main>
  );
}

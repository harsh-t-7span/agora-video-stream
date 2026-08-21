"use client";

import Link from "next/link";
import { PanoramaVideoTest } from "@/component/panorama-video-test";

export default function RecordedTest() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Recorded Insta360 test</h1>
          <p className="text-sm text-zinc-400">
            Interactive 360 video playback.
          </p>
        </div>

        <Link
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900"
          href="/"
        >
          Live viewer
        </Link>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <PanoramaVideoTest />
      </main>
    </div>
  );
}

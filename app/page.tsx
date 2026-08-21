import Link from "next/link";
import { VideoCallingLoader } from "@/component/Video-calling-loader";

export default function Home() {
  return (
    <>
      <div className="absolute right-4 top-4 z-10">
        <Link
          className="rounded-md border border-zinc-700 bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-zinc-900"
          href="/test-recorded"
        >
          Recorded test
        </Link>
      </div>
      <VideoCallingLoader />
    </>
  );
}

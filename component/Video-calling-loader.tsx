"use client";

import dynamic from "next/dynamic";

const VideoCalling = dynamic(() => import("@/component/video-calling"), {
  ssr: false,
  loading: () => (
    <p className="flex min-h-screen items-center justify-center bg-black text-white">
      Loading viewer...
    </p>
  ),
});

export function VideoCallingLoader() {
  return <VideoCalling />;
}

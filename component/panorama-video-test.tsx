"use client";

import { useEffect, useState } from "react";
import { CI360VideoViewer } from "@cloudimage/360-video/react";
import "@cloudimage/360-video/css";
import {
  PANORAMA_VIDEO_SRC,
  RECORDED_VIDEO_SETUP,
  resolvePanoramaVideoSrc,
} from "@/component/recorded-videos";

export function PanoramaVideoTest() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function prepareVideo() {
      const result = await resolvePanoramaVideoSrc();
      if (cancelled) {
        return;
      }

      if (result.error) {
        setLoadError(result.error);
        return;
      }

      setVideoSrc(result.src);
    }

    prepareVideo();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loadError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="max-w-2xl text-lg font-medium text-red-400">{loadError}</p>
        <ul className="max-w-lg list-disc space-y-2 text-left text-sm text-zinc-400">
          {RECORDED_VIDEO_SETUP.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (!videoSrc) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-400">
        Checking for 360 video...
      </div>
    );
  }

  return (
    <div className="relative min-h-0 flex-1">
      <CI360VideoViewer
        autoplay={false}
        className="h-full w-full"
        controls
        dragToRotate
        fov={75}
        gyroscope
        loop
        muted={false}
        onError={(error) => {
          const message =
            error instanceof Error
              ? error.message
              : `Could not load ${PANORAMA_VIDEO_SRC}`;
          setLoadError(message);
        }}
        scrollToZoom
        src={videoSrc}
        style={{ width: "100%", height: "100%" }}
        theme="dark"
      />
      <p className="pointer-events-none absolute bottom-4 left-4 text-sm text-white/70">
        Drag to look around. Pinch or scroll to zoom.
      </p>
    </div>
  );
}

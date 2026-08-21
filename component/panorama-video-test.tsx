"use client";

import { useState } from "react";
import { CI360VideoViewer } from "@cloudimage/360-video/react";
import "@cloudimage/360-video/css";

const PANORAMA_VIDEO_SRC = "/videos/test-360.mp4";

export function PanoramaVideoTest() {
  const [loadError, setLoadError] = useState<string | null>(null);

  if (loadError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="max-w-2xl text-lg font-medium text-red-400">{loadError}</p>
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
        src={PANORAMA_VIDEO_SRC}
        style={{ width: "100%", height: "100%" }}
        theme="dark"
      />
      <p className="pointer-events-none absolute bottom-4 left-4 text-sm text-white/70">
        Drag to look around. Pinch or scroll to zoom.
      </p>
    </div>
  );
}

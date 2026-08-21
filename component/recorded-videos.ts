export const PANORAMA_VIDEO_SRC = "/videos/test-360-2.mp4";
export const PANORAMA_VIDEO_RAW_SRC = "/videos/test-360.insv";

export const RECORDED_VIDEO_SETUP = [
  "360 mode needs public/videos/test-360-2.mp4 (equirectangular export, 2:1 aspect).",
  "Raw .insv files cannot play in the browser — open test-360.insv in Insta360 Studio, then Export as equirectangular MP4 and save as test-360.mp4.",
];

async function videoExists(src: string) {
  try {
    const response = await fetch(src, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function resolvePanoramaVideoSrc() {
  if (await videoExists(PANORAMA_VIDEO_SRC)) {
    return { src: PANORAMA_VIDEO_SRC, error: null };
  }

  if (await videoExists(PANORAMA_VIDEO_RAW_SRC)) {
    return {
      src: null,
      error:
        "Found test-360.insv, but browsers cannot play raw Insta360 files. Export it from Insta360 Studio as equirectangular MP4 and save as public/videos/test-360.mp4.",
    };
  }

  return {
    src: null,
    error: `Missing ${PANORAMA_VIDEO_SRC}. Add an equirectangular MP4 export from Insta360 Studio.`,
  };
}

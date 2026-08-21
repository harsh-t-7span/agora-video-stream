"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  RemoteUser,
  useIsConnected,
  useJoin,
  useRTCClient,
  useRemoteUsers,
} from "agora-rtc-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ThreeLive360Player } from "@/component/three-live-360-player";

type ChannelMode = "live" | "rtc";
type ViewerMode = "flat" | "360";

export default function VideoCalling() {
  const [mode, setMode] = useState<ChannelMode>("live");
  const [appId, setAppId] = useState("c143c8f57f5644dd9ac6ce101678dd5c");
  const [channel, setChannel] = useState("demo_channel");
  const [token, setToken] = useState(
    "007eJxTYPCwLlmr3yY29V17n13z1yjfFH7O/4Iz6y4Y5Ifl1ZjZPFBgSDY0MU62SDM1TzM1MzFJSbFMTDZLTjU0MDQzt0hJMU1e8aI9qyGQkSH88zkmRgYIBPF5GFJSc/PjkzMS8/JScxgYAP5WInA=",
  );
  const client = useMemo(
    () => AgoraRTC.createClient({ mode, codec: "vp8" }),
    [mode],
  );

  return (
    <AgoraRTCProvider client={client} key={mode}>
      <StreamViewer
        appId={appId}
        channel={channel}
        mode={mode}
        onAppIdChange={setAppId}
        onChannelChange={setChannel}
        onModeChange={setMode}
        onTokenChange={setToken}
        token={token}
      />
    </AgoraRTCProvider>
  );
}

function StreamViewer({
  appId,
  channel,
  mode,
  onAppIdChange,
  onChannelChange,
  onModeChange,
  onTokenChange,
  token,
}: {
  appId: string;
  channel: string;
  mode: ChannelMode;
  onAppIdChange: (value: string) => void;
  onChannelChange: (value: string) => void;
  onModeChange: (mode: ChannelMode) => void;
  onTokenChange: (value: string) => void;
  token: string;
}) {
  const client = useRTCClient();
  const [calling, setCalling] = useState(false);
  const [roleReady, setRoleReady] = useState(false);
  const [viewerMode, setViewerMode] = useState<ViewerMode>("flat");
  const isConnected = useIsConnected();

  useEffect(() => {
    let cancelled = false;

    async function prepareRole() {
      setRoleReady(false);
      if (mode === "live") {
        await client.setClientRole("audience");
      }
      if (!cancelled) {
        setRoleReady(true);
      }
    }

    prepareRole();

    return () => {
      cancelled = true;
    };
  }, [client, mode]);

  const { error, isLoading } = useJoin(
    {
      appid: appId.trim(),
      channel: channel.trim(),
      token: token.trim() ? token.trim() : null,
    },
    calling && roleReady,
  );

  const remoteUsers = useRemoteUsers();

  async function handleLeave() {
    setCalling(false);
    try {
      await client.leave();
    } catch {
      // Already left or disconnect in progress.
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {!calling || !isConnected ? (
        <div className="relative flex flex-1 items-center justify-center p-6">
          <div className="absolute right-4 top-4 z-10">
            <Link
              className="rounded-md border border-zinc-700 bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur hover:bg-zinc-900"
              href="/test-recorded"
            >
              Recorded test
            </Link>
          </div>
          <form
            className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6"
            onSubmit={(event) => {
              event.preventDefault();
              setCalling(true);
            }}
          >
            <h1 className="text-xl font-semibold">Watch mobile stream</h1>
            <p className="text-sm text-zinc-400">
              Use the same App ID and channel as the phone. Generate a token for
              this web viewer if the project uses an App Certificate.
            </p>

            {/* <label className="flex flex-col gap-1 text-sm">
              Channel profile
              <select
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                onChange={(event) =>
                  onModeChange(event.target.value as ChannelMode)
                }
                value={mode}
              >
                <option value="live">Live broadcast (phone is host)</option>
                <option value="rtc">
                  RTC call (phone is in communication)
                </option>
              </select>
            </label> */}

            <label className="flex flex-col gap-1 text-sm">
              App ID
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                onChange={(event) => onAppIdChange(event.target.value)}
                placeholder="Agora App ID"
                value={appId}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Channel
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                onChange={(event) => onChannelChange(event.target.value)}
                placeholder="Same channel as the phone"
                value={channel}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Token
              <input
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                onChange={(event) => onTokenChange(event.target.value)}
                placeholder="Leave empty only if certificate is off"
                value={token}
              />
            </label>

            {error ? (
              <p className="text-sm text-red-400">{error.message}</p>
            ) : null}

            <button
              className="rounded-md bg-white px-4 py-2 font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!roleReady || isLoading}
              type="submit"
            >
              {isLoading ? "Joining..." : "Watch stream"}
            </button>
          </form>
        </div>
      ) : (
        <div className="relative flex min-h-screen flex-1 flex-col">
          {remoteUsers.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-zinc-400">
              Waiting for the mobile stream...
            </div>
          ) : (
            <div className="grid min-h-screen flex-1 grid-cols-1">
              {remoteUsers.map((user) =>
                viewerMode === "flat" || !user.videoTrack ? (
                  <RemoteUser
                    className="stream-video min-h-screen w-full bg-black"
                    key={user.uid}
                    playAudio
                    playVideo
                    user={user}
                    videoPlayerConfig={{ fit: "contain", mirror: false }}
                  />
                ) : (
                  <div
                    className="relative min-h-screen w-full bg-black"
                    key={user.uid}
                  >
                    <ThreeLive360Player videoTrack={user.videoTrack} />
                    <RemoteUser
                      className="sr-only"
                      playAudio
                      playVideo={false}
                      user={user}
                    />
                  </div>
                ),
              )}
            </div>
          )}

          <div className="absolute right-4 top-4 z-50 flex gap-2">
            {/* Demo: Flat toggle hidden — default is 360
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                viewerMode === "flat"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white"
              }`}
              onClick={() => setViewerMode("flat")}
              type="button"
            >
              Flat
            </button>
            */}
            {/* <button
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                viewerMode === "360"
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-white"
              }`}
              onClick={() => setViewerMode("360")}
              type="button"
            >
              360
            </button> */}
            <button
              className="rounded-md bg-white px-4 py-2 font-medium text-black"
              onClick={() => {
                void handleLeave();
              }}
              type="button"
            >
              Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

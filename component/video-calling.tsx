"use client";

import AgoraRTC, {
  AgoraRTCProvider,
  RemoteUser,
  useIsConnected,
  useJoin,
  useRTCClient,
  useRemoteUsers,
} from "agora-rtc-react";
import { useEffect, useMemo, useState } from "react";

type ChannelMode = "live" | "rtc";

export default function VideoCalling() {
  const [mode, setMode] = useState<ChannelMode>("live");
  const [appId, setAppId] = useState("c143c8f57f5644dd9ac6ce101678dd5c");
  const [channel, setChannel] = useState("demo_channel");
  const [token, setToken] = useState(process.env.NEXT_PUBLIC_AGORA_TOKEN ?? "");
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

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {!isConnected ? (
        <div className="flex flex-1 items-center justify-center p-6">
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
              Token (optional)
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
              {remoteUsers.map((user) => (
                <RemoteUser
                  className="stream-video min-h-screen w-full bg-black"
                  key={user.uid}
                  playAudio
                  playVideo
                  user={user}
                  videoPlayerConfig={{ fit: "contain", mirror: false }}
                />
              ))}
            </div>
          )}

          <button
            className="absolute right-4 top-4 rounded-md bg-white px-4 py-2 font-medium text-black"
            onClick={() => setCalling(false)}
            type="button"
          >
            Leave
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import MapModal from "@/components/dock/MapModal";

// WMO weather-code → short condition label (Open-Meteo).
function weatherText(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain Showers";
  if (code <= 86) return "Snow Showers";
  return "Thunderstorm";
}

const innerShadow =
  "shadow-[inset_0px_-3px_6px_0px_rgba(0,0,0,0.12),inset_0px_4px_8px_0px_rgba(255,255,255,0.04)]";

// Free, royalty-free tracks (SoundHelix). <audio> plays cross-origin without
// CORS; preload="none" so nothing downloads until the user hits play.
const TRACKS = [
  { title: "Aurora", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Skyline", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Momentum", artist: "SoundHelix", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function Dock() {
  const icons = useRef<(HTMLDivElement | null)[]>([]);
  const [mapOpen, setMapOpen] = useState(false);

  // Live Muscat weather via Open-Meteo (free, no key), refreshed every 10 min.
  const [weather, setWeather] = useState<{ temp: number | null; condition: string }>({
    temp: null,
    condition: "Loading…",
  });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=23.5859&longitude=58.4059&current=temperature_2m,weather_code&timezone=auto"
        );
        const j = await res.json();
        if (!alive || !j?.current) return;
        setWeather({
          temp: Math.round(j.current.temperature_2m),
          condition: weatherText(j.current.weather_code),
        });
      } catch {
        /* keep last value */
      }
    };
    load();
    const id = setInterval(load, 600_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // --- Music player (Spotify widget) ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState(false);
  const wantPlay = useRef(false);

  const playPause = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      wantPlay.current = true;
      a.play().catch(() => {});
    } else {
      wantPlay.current = false;
      a.pause();
    }
  };
  const skip = (d: number) => {
    wantPlay.current = true;
    setTrack((t) => (t + d + TRACKS.length) % TRACKS.length);
  };
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.load();
    if (wantPlay.current) a.play().catch(() => {});
  }, [track]);

  // Cursor-distance magnification on the square app icons (macOS-style).
  const onMove = (e: React.MouseEvent) => {
    const x = e.clientX;
    icons.current.forEach((el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const d = Math.abs(x - cx);
      const s = 1 + 0.3 * Math.max(0, 1 - d / 90);
      el.style.transform = `scale(${s.toFixed(3)})`;
    });
  };
  const reset = () =>
    icons.current.forEach((el) => {
      if (el) el.style.transform = "scale(1)";
    });

  // Square app icon (Terminal / Figma) — cropped image in a rounded box.
  const AppIcon = ({
    i,
    img,
    name,
    indicator,
  }: {
    i: number;
    img: string;
    name: string;
    indicator?: boolean;
  }) => (
    <div className="group relative flex flex-col items-center">
      <div
        ref={(n) => {
          icons.current[i] = n;
        }}
        className="relative size-16 origin-bottom transition-transform duration-150 ease-out will-change-transform"
      >
        <div className={`size-16 overflow-hidden rounded-[14px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.2)]`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/dock/${img}`} alt={name} draggable={false} className="size-full select-none object-cover scale-[1.25]" />
        </div>
        <div aria-hidden className={`pointer-events-none absolute inset-0 rounded-[14px] ${innerShadow}`} />
      </div>
      <span className={`mt-1.5 size-1.5 rounded-full ${indicator ? "bg-white/55" : "bg-transparent"}`} />
    </div>
  );

  // Plain icon image with its own squircle (Maps / Mail).
  const PlainIcon = ({
    i,
    img,
    name,
    onClick,
  }: {
    i: number;
    img: string;
    name: string;
    onClick?: () => void;
  }) => (
    <div className="group relative flex flex-col items-center">
      <div
        ref={(n) => {
          icons.current[i] = n;
        }}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        className={`relative size-16 origin-bottom transition-transform duration-150 ease-out will-change-transform ${
          onClick ? "cursor-pointer" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/dock/${img}`} alt={name} draggable={false} className="size-16 select-none object-contain drop-shadow-[0px_2px_6px_rgba(0,0,0,0.2)]" />
      </div>
      <span className="mt-1.5 size-1.5 rounded-full bg-transparent" />
    </div>
  );

  return (
    <>
    <div className="flex items-end justify-start overflow-x-auto px-4 pb-2 pt-12 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
      <div
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="relative shrink-0 rounded-[28px] border border-white/20"
      >
        {/* Frosted background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28px] backdrop-blur-[8px]"
          style={{
            backgroundImage:
              "linear-gradient(178deg, rgba(47,47,47,0.59) 48%, rgba(33,33,33,0.75) 77%)",
          }}
        />

        <div className="relative flex items-end gap-[17px] px-4 pb-1 pt-4">
          {/* Terminal */}
          <AppIcon i={0} img="terminal.png" name="Terminal" />

          {/* Weather widget */}
          <div className="relative flex flex-col items-center">
            <div
              className="relative h-16 w-[200px] overflow-hidden rounded-[14px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.2)]"
              style={{ backgroundImage: "linear-gradient(-72deg, #2663b5 0%, #2f92d5 99%)" }}
            >
              <div className="absolute left-3.5 top-2.5 flex max-w-[110px] flex-col gap-0.5 text-[12px] font-medium leading-tight text-white">
                <span className="truncate">{weather.condition}</span>
                <span className="text-[14.4px]">Muscat</span>
              </div>
              <span className="absolute right-[46px] top-1 font-extralight leading-none text-white text-[38px]">
                {weather.temp ?? "··"}&deg;
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/dock/weather-icon.png" alt="" aria-hidden className="absolute -bottom-1 right-0 size-[50px] object-contain" />
              <div aria-hidden className={`pointer-events-none absolute inset-0 rounded-[14px] ${innerShadow}`} />
            </div>
            <span className="mt-1.5 size-1.5 rounded-full bg-transparent" />
          </div>

          {/* Spotify widget */}
          <div className="relative flex flex-col items-center">
            <div className="relative h-16 w-[200px] overflow-hidden rounded-[14px] border border-[#191919]/60 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/dock/spotify-art.png" alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
              <div aria-hidden className="absolute inset-0 bg-black/[0.67]" />

              {/* Hidden audio element */}
              <audio
                ref={audioRef}
                src={TRACKS[track].src}
                loop={repeat}
                preload="none"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => skip(1)}
              />

              {/* Now-playing marquee */}
              <div className="marquee marquee-left absolute inset-x-0 top-2.5 overflow-hidden" style={{ ["--marquee-duration" as string]: "9s" }}>
                <div className="marquee-track text-[11px] font-medium">
                  {[0, 1].map((k) => (
                    <span key={k} className="mr-6 inline-flex gap-2 whitespace-nowrap">
                      <span className="text-white">{TRACKS[track].title}</span>
                      <span className="text-white/75">{TRACKS[track].artist}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="absolute inset-x-0 bottom-1.5 flex items-center justify-center gap-2">
                <button type="button" aria-label="Repeat" onClick={() => setRepeat((r) => !r)} className={`transition-colors ${repeat ? "text-[#df6a1b]" : "text-white/85 hover:text-white"}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                    <path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" />
                  </svg>
                </button>
                <button type="button" aria-label="Previous" onClick={() => skip(-1)} className="text-white/85 transition-colors hover:text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M6 6h2v12H6zM20 6v12L9 12z" /></svg>
                </button>
                <button type="button" aria-label={playing ? "Pause" : "Play"} onClick={playPause} className="text-white transition-transform hover:scale-110">
                  {playing ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M8 5v14l11-7z" /></svg>
                  )}
                </button>
                <button type="button" aria-label="Next" onClick={() => skip(1)} className="text-white/85 transition-colors hover:text-white">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M16 6h2v12h-2zM4 6v12l11-6z" /></svg>
                </button>
                <button type="button" aria-label="Like" onClick={() => setLiked((l) => !l)} className={`transition-colors ${liked ? "text-[#ff3b5c]" : "text-white/85 hover:text-white"}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3 1 4 2.5 1-1.5 2-2.5 4-2.5 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" /></svg>
                </button>
              </div>

              {/* Edge fades */}
              <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#191919] to-transparent" />
              <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-[#191919] to-transparent" />
              <div aria-hidden className={`pointer-events-none absolute inset-0 rounded-[14px] ${innerShadow}`} />
            </div>

            {/* Notification badge */}
            <div className="absolute -right-1.5 -top-1.5 size-5 overflow-hidden rounded-md border border-white/12 bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/dock/spotify-notif.jpg" alt="" aria-hidden className="size-full object-cover" />
            </div>
            <span className="mt-1.5 size-1.5 rounded-full bg-transparent" />
          </div>

          {/* Figma */}
          <AppIcon i={1} img="figma.png" name="Figma" indicator />

          {/* Maps */}
          <PlainIcon i={2} img="maps.png" name="Maps" onClick={() => setMapOpen(true)} />

          {/* Mail */}
          <PlainIcon
            i={3}
            img="mail.png"
            name="Mail"
            onClick={() => {
              window.location.href = "mailto:info@kioskoman.com";
            }}
          />
        </div>

        {/* Inner edge highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0px_1px_4px_0px_rgba(255,255,255,0.08),inset_0px_-1px_4px_0px_rgba(0,0,0,0.56)]"
        />
      </div>
    </div>
    <MapModal open={mapOpen} onClose={() => setMapOpen(false)} />
    </>
  );
}

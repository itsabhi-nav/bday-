"use client";

import { useState, useSyncExternalStore } from "react";
import { Volume2, VolumeX, Play, Pause, Music2 } from "lucide-react";
import {
  subscribeMusic,
  getMusicSnapshot,
  toggleMusic,
  toggleMute,
  setMusicVolume,
} from "@/lib/music";
import { audioConfig } from "@/config/birthday";

/**
 * Warm cream music pill. Reflects the REAL player state — the icon only ever
 * shows "playing" when the shared audio element is actually playing.
 */
export default function MusicController() {
  const snap = useSyncExternalStore(subscribeMusic, getMusicSnapshot, getMusicSnapshot);
  const [expanded, setExpanded] = useState(false);

  if (!snap.hasSrc || snap.failed) {
    return (
      <div
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-cocoa/15 bg-ivory/95 px-4 py-2 text-xs text-cocoasoft shadow-photo backdrop-blur"
        title="Place your song at /public/audio/happy-birthday.mp3"
        role="status"
      >
        <Music2 className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden sm:inline">Music unavailable — add happy-birthday.mp3</span>
        <span className="sm:hidden">Quiet mode</span>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1 rounded-full border border-cocoa/15 bg-ivory/95 py-1.5 pl-2 pr-1.5 shadow-photo backdrop-blur"
      role="group"
      aria-label="Music controls"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? "Hide volume" : "Show volume"}
        aria-expanded={expanded}
        title={audioConfig.title}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-cream transition hover:bg-butter/60"
      >
        {snap.playing ? (
          <span className="flex h-4 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="eq-bar w-[3px] rounded-full bg-cherry"
                style={{ height: "100%", animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </span>
        ) : (
          <Music2 className="h-4 w-4 text-cherry" aria-hidden />
        )}
      </button>
      <button
        onClick={() => void toggleMusic()}
        aria-label={snap.playing ? "Pause music" : "Play music"}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-cherry text-ivory transition hover:bg-cherrydeep"
      >
        {snap.playing ? (
          <Pause className="h-4 w-4" aria-hidden />
        ) : (
          <Play className="ml-0.5 h-4 w-4" aria-hidden />
        )}
      </button>
      <button
        onClick={toggleMute}
        aria-label={snap.muted ? "Unmute music" : "Mute music"}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-cream transition hover:bg-butter/60"
      >
        {snap.muted ? (
          <VolumeX className="h-4 w-4" aria-hidden />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden />
        )}
      </button>
      {expanded && (
        <span className="flex items-center gap-2 pr-2">
          <label htmlFor="birthday-volume" className="sr-only">
            Music volume
          </label>
          <input
            id="birthday-volume"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={snap.muted ? 0 : snap.volume}
            onChange={(e) => setMusicVolume(Number(e.target.value))}
            className="h-1 w-20 cursor-pointer accent-[#C83D4D]"
          />
        </span>
      )}
    </div>
  );
}

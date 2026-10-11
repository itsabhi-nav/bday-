"use client";

/**
 * Single shared music player.
 *
 * Why this exists: browsers only allow audio with sound inside a real user
 * gesture. So the opening "Open your surprise" button calls `playMusic()`
 * DIRECTLY in its click handler — no timers, no waiting for animations.
 * Every other component shares this one instance: no duplicates, no restarts
 * on re-render or scroll.
 */

import { audioConfig } from "@/config/birthday";

export interface MusicSnapshot {
  playing: boolean;
  failed: boolean;
  hasSrc: boolean;
  volume: number;
  muted: boolean;
}

let audio: HTMLAudioElement | null = null;
let failed = false;
let fadeTimer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribeMusic(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function ensureAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audioConfig.src) {
    failed = true;
    return null;
  }
  if (!audio) {
    audio = new Audio(audioConfig.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.addEventListener("error", () => {
      failed = true;
      emit();
    });
    audio.addEventListener("play", emit);
    audio.addEventListener("pause", emit);
  }
  return audio;
}

function fadeTo(target: number) {
  if (fadeTimer) clearInterval(fadeTimer);
  if (!audio) return;
  const step = Math.max(0.02, target / 25);
  fadeTimer = setInterval(() => {
    if (!audio) {
      if (fadeTimer) clearInterval(fadeTimer);
      return;
    }
    const current = audio.volume;
    if (current < target) {
      audio.volume = Math.min(target, current + step);
    } else if (current > target) {
      audio.volume = Math.max(target, current - step);
    } else if (fadeTimer) {
      clearInterval(fadeTimer);
    }
  }, 100);
}

/**
 * Call this INSIDE the opening button's onClick. Returns true if playback
 * actually started — never claims playing when it failed.
 */
export async function playMusic(): Promise<boolean> {
  const el = ensureAudio();
  if (!el) {
    emit();
    return false;
  }
  try {
    el.muted = false;
    await el.play();
    fadeTo(audioConfig.volume);
    return true;
  } catch {
    failed = true;
    emit();
    return false;
  }
}

export async function toggleMusic(): Promise<boolean> {
  const el = ensureAudio();
  if (!el) {
    emit();
    return false;
  }
  try {
    if (el.paused) {
      await el.play();
      fadeTo(el.muted ? 0 : audioConfig.volume);
      return true;
    }
    el.pause();
    return false;
  } catch {
    failed = true;
    emit();
    return false;
  }
}

export function toggleMute(): void {
  if (!audio) return;
  audio.muted = !audio.muted;
  if (!audio.muted && !audio.paused) fadeTo(audioConfig.volume);
  emit();
}

export function setMusicVolume(v: number): void {
  if (!audio) return;
  audio.muted = false;
  audio.volume = v;
  emit();
}

let cachedSnapshot: MusicSnapshot | null = null;

export function getMusicSnapshot(): MusicSnapshot {
  const next: MusicSnapshot = {
    playing: !!audio && !audio.paused && !failed,
    failed,
    hasSrc: !!audioConfig.src,
    volume: audio ? audio.volume : audioConfig.volume,
    muted: audio ? audio.muted : false,
  };
  // useSyncExternalStore compares snapshots with Object.is — return the
  // cached object when nothing changed to avoid an infinite render loop.
  if (
    cachedSnapshot &&
    cachedSnapshot.playing === next.playing &&
    cachedSnapshot.failed === next.failed &&
    cachedSnapshot.hasSrc === next.hasSrc &&
    cachedSnapshot.volume === next.volume &&
    cachedSnapshot.muted === next.muted
  ) {
    return cachedSnapshot;
  }
  cachedSnapshot = next;
  return next;
}

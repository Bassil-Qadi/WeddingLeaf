"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface Countdown {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function secondsUntil(target: number): number {
  return Math.max(0, Math.floor((target - Date.now()) / 1000));
}

function split(totalSeconds: number): Countdown {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  return { days, hours, mins, secs: totalSeconds % 60 };
}

/**
 * A clock as an external store: the passage of time is not React state, and
 * the seconds remaining is the only thing worth notifying about.
 *
 * Polls faster than it emits so the displayed second never lags a full tick
 * behind the wall clock, but only wakes React when the number actually
 * changes.
 */
function createClock(target: number) {
  // Zero until something subscribes: reading the wall clock while rendering
  // would make the render impure, and the server's answer is zero anyway.
  let snapshot = 0;
  const listeners = new Set<() => void>();
  let timer: ReturnType<typeof setInterval> | undefined;

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);

      if (listeners.size === 1) {
        snapshot = secondsUntil(target);
        timer = setInterval(() => {
          const next = secondsUntil(target);
          if (next === snapshot) return;
          snapshot = next;
          for (const notify of listeners) notify();
        }, 250);
      }

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) clearInterval(timer);
      };
    },
    getSnapshot: () => snapshot,
  };
}

/**
 * Time left until `targetISO`, clamped at zero once the wedding has passed.
 *
 * The server renders zeros: it has no "now" the browser would agree with, and
 * a countdown that disagreed on the first frame would tear on hydration. The
 * real remainder arrives on the first client render after hydration.
 */
export function useCountdown(targetISO: string): Countdown {
  const clock = useMemo(() => {
    const target = new Date(targetISO).getTime();
    // An unparseable date is a date already past: the countdown stays at zero.
    return createClock(Number.isNaN(target) ? 0 : target);
  }, [targetISO]);

  const seconds = useSyncExternalStore(
    clock.subscribe,
    clock.getSnapshot,
    () => 0,
  );

  return split(seconds);
}

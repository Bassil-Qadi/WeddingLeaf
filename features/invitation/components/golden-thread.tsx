"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  motion,
} from "framer-motion";
import { useThread } from "./thread-context";

interface Point {
  x: number;
  y: number;
}

interface ThreadGeometry {
  /** The single path shared by the unlit rail and the drawn progress line. */
  d: string;
  width: number;
  height: number;
  /** Geometric length in px — for placing the comet, not for the dash. */
  length: number;
  /** Scroll progress at which each node ignites, in node order. */
  thresholds: number[];
}

/** A node lights up just before the reading line reaches its center. */
const IGNITE_LEAD_PX = 8;
/** The comet is hidden at the very ends, where it would sit on the raw tip. */
const COMET_FADE = 0.003;
/** Re-measuring is expensive; coalesce bursts of resize notifications. */
const RESIZE_DEBOUNCE_MS = 160;

/**
 * Catmull-Rom through the points, emitted as cubic beziers — one continuous
 * curve that passes exactly through every node rather than near it.
 */
function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const previous = points[i - 1] ?? points[i];
    const start = points[i];
    const end = points[i + 1];
    const next = points[i + 2] ?? end;

    const c1x = start.x + (end.x - previous.x) / 6;
    const c1y = start.y + (end.y - previous.y) / 6;
    const c2x = end.x - (next.x - start.x) / 6;
    const c2y = end.y - (next.y - start.y) / 6;

    d +=
      ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}` +
      ` ${c2x.toFixed(1)} ${c2y.toFixed(1)}` +
      ` ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
  }

  return d;
}

/**
 * The signature mechanic: one gold line that draws itself as you scroll,
 * threading through every chapter and igniting each node it passes.
 *
 * It lives behind the content and spans the whole scroll track. The path is
 * measured from the DOM (wherever the `<ThreadNode>` markers actually landed)
 * rather than hard-coded, so it survives reflow, font swaps and resize.
 */
export function GoldenThread({ opened }: { opened: boolean }) {
  const { trackRef, nodesRef, setLitCount } = useThread();
  const reduceMotion = useReducedMotion();

  const railRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<SVGCircleElement>(null);
  const cometCoreRef = useRef<SVGCircleElement>(null);

  const [geometry, setGeometry] = useState<ThreadGeometry | null>(null);

  // How much of the thread has been drawn, 0→1. Framer turns this into the
  // stroke dash itself; setting `strokeDasharray` by hand does not survive
  // its SVG style pass.
  const pathLength = useMotionValue(0);

  // The reading line sits a little above the middle of the viewport: the
  // thread reaches a chapter as you begin to read it, not as you leave it.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 52vh", "end 52vh"],
  });

  const measure = useCallback(() => {
    const track = trackRef.current;
    // Measure on the rail: the progress path carries a `pathLength` attribute
    // that normalizes its dash units, and we want real pixels here.
    const path = railRef.current;
    if (!track || !path) return;

    const trackRect = track.getBoundingClientRect();
    const width = track.offsetWidth;
    const height = track.offsetHeight;
    if (!height) return;

    const points: Point[] = [...nodesRef.current.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, el]) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - trackRect.left + rect.width / 2,
          y: rect.top - trackRect.top + rect.height / 2,
        };
      });
    if (points.length < 2) return;

    // Extend past the first and last node so the thread runs off both ends of
    // the track instead of starting and stopping in mid-air.
    const first = points[0];
    const last = points[points.length - 1];
    const d = smoothPath([
      { x: first.x, y: 0 },
      ...points,
      { x: last.x, y: height },
    ]);

    // Measure off the live element — a detached path reports length 0 in
    // some engines.
    path.setAttribute("d", d);

    setGeometry({
      d,
      width,
      height,
      length: path.getTotalLength(),
      thresholds: points.map((p) => (p.y - IGNITE_LEAD_PX) / height),
    });
  }, [trackRef, nodesRef]);

  // Re-measure on mount, and again once the veil lifts: the scroll lock is
  // released then, and the returning scrollbar reflows the track.
  useLayoutEffect(() => {
    measure();
  }, [measure, opened]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let timer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(measure, RESIZE_DEBOUNCE_MS);
    });

    observer.observe(track);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [measure, trackRef]);

  const applyProgress = useCallback(
    (progress: number) => {
      if (!geometry) return;

      const { length, thresholds } = geometry;

      if (reduceMotion) {
        pathLength.set(1);
        setLitCount(thresholds.length);
        return;
      }

      pathLength.set(progress);

      const comet = cometRef.current;
      const core = cometCoreRef.current;
      const path = railRef.current;

      if (comet && core && path) {
        const visible = progress > COMET_FADE && progress < 1 - COMET_FADE;
        if (visible) {
          const tip = path.getPointAtLength(length * progress);
          for (const circle of [comet, core]) {
            circle.setAttribute("cx", String(tip.x));
            circle.setAttribute("cy", String(tip.y));
          }
        }
        comet.style.opacity = visible ? "0.95" : "0";
        core.style.opacity = visible ? "1" : "0";
      }

      setLitCount(thresholds.filter((t) => progress >= t).length);
    },
    [geometry, reduceMotion, pathLength, setLitCount],
  );

  useMotionValueEvent(scrollYProgress, "change", applyProgress);

  // `change` only fires on scroll, so paint the initial state by hand — this
  // is also what draws the whole thread at once under reduced motion.
  useEffect(() => {
    applyProgress(scrollYProgress.get());
  }, [applyProgress, scrollYProgress]);

  return (
    <svg
      aria-hidden="true"
      width={geometry?.width}
      height={geometry?.height}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 size-full overflow-visible"
    >
      <defs>
        <linearGradient
          id="gt-gold-gradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#d8ab4a" />
          <stop offset="0.5" stopColor="#a67c2e" />
          <stop offset="1" stopColor="#7d5d20" />
        </linearGradient>

        <filter id="gt-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.6" result="blurred" />
          <feMerge>
            <feMergeNode in="blurred" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id="gt-comet">
          <stop offset="0" stopColor="#fff1cf" />
          <stop offset="0.4" stopColor="#d8a93f" />
          <stop offset="1" stopColor="rgba(166,124,46,0)" />
        </radialGradient>
      </defs>

      {/* The unlit thread, waiting to be drawn over. */}
      <path
        ref={railRef}
        d={geometry?.d}
        fill="none"
        stroke="rgba(166,124,46,0.24)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <motion.path
        ref={progressRef}
        d={geometry?.d}
        fill="none"
        stroke="url(#gt-gold-gradient)"
        strokeWidth="1.8"
        strokeLinecap="round"
        filter="url(#gt-glow)"
        style={{ pathLength }}
      />

      {/* The bright point where the thread is being drawn right now. */}
      <circle
        ref={cometRef}
        r="8"
        fill="url(#gt-comet)"
        style={{ opacity: 0 }}
      />
      <circle
        ref={cometCoreRef}
        r="2"
        fill="#b8862b"
        style={{ opacity: 0 }}
      />
    </svg>
  );
}

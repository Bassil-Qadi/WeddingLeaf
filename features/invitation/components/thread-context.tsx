"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

export type ThreadNodeKind = "origin" | "waypoint" | "knot";

interface ThreadContextValue {
  /** The scroll track the thread spans — its full height is the path. */
  trackRef: RefObject<HTMLDivElement | null>;
  /** Node markers keyed by their order down the page. */
  nodesRef: RefObject<Map<number, HTMLSpanElement>>;
  registerNode: (index: number, el: HTMLSpanElement | null) => void;
  /** Light the first `count` nodes; the rest go dark. Safe to call per frame. */
  setLitCount: (count: number) => void;
}

const ThreadContext = createContext<ThreadContextValue | null>(null);

/**
 * Shares the track element and the node registry between `<GoldenThread>`
 * (which measures them to build its path) and the `<ThreadNode>` markers
 * scattered through the chapters (which light up as it reaches them).
 *
 * Nothing here is React state. `setLitCount` runs on every scroll frame, and
 * routing that through a context value would re-render every chapter on the
 * page each time a node ignites. It writes `data-lit` straight to the
 * registered elements instead, and CSS takes it from there.
 */
export function ThreadProvider({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Map<number, HTMLSpanElement>>(new Map());
  const litCountRef = useRef(0);

  const paint = useCallback((index: number, el: HTMLSpanElement) => {
    el.dataset.lit = String(index < litCountRef.current);
  }, []);

  const registerNode = useCallback(
    (index: number, el: HTMLSpanElement | null) => {
      if (el) {
        nodesRef.current.set(index, el);
        // A node can mount after the thread has already passed its position.
        paint(index, el);
      } else {
        nodesRef.current.delete(index);
      }
    },
    [paint],
  );

  const setLitCount = useCallback(
    (count: number) => {
      if (count === litCountRef.current) return;
      litCountRef.current = count;
      for (const [index, el] of nodesRef.current) paint(index, el);
    },
    [paint],
  );

  const value = useMemo(
    () => ({ trackRef, nodesRef, registerNode, setLitCount }),
    [registerNode, setLitCount],
  );

  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  );
}

export function useThread(): ThreadContextValue {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThread must be used within a <ThreadProvider>");
  }
  return context;
}

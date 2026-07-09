"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
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
  /** Nodes with `index < litCount` have been passed by the reading line. */
  litCount: number;
  setLitCount: (count: number) => void;
}

const ThreadContext = createContext<ThreadContextValue | null>(null);

/**
 * Shares the track element and the node registry between `<GoldenThread>`
 * (which measures them to build its path) and the `<ThreadNode>` markers
 * scattered through the chapters (which light up as it reaches them).
 *
 * The registry is a ref, not state: registering a node must not re-render
 * the chapter it lives in, and the thread re-measures on its own schedule
 * (mount, resize, veil-open) rather than on every registration.
 */
export function ThreadProvider({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Map<number, HTMLSpanElement>>(new Map());
  const [litCount, setLitCount] = useState(0);

  const registerNode = useCallback(
    (index: number, el: HTMLSpanElement | null) => {
      if (el) nodesRef.current.set(index, el);
      else nodesRef.current.delete(index);
    },
    [],
  );

  const value = useMemo(
    () => ({ trackRef, nodesRef, registerNode, litCount, setLitCount }),
    [registerNode, litCount],
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

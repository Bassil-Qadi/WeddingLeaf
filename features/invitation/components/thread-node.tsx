"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useThread, type ThreadNodeKind } from "./thread-context";

interface ThreadNodeProps {
  /** Position down the page, 0-based. The thread is drawn through these in order. */
  index: number;
  kind?: ThreadNodeKind;
  className?: string;
}

/**
 * A waypoint the golden thread passes through. Position it with the usual
 * inset utilities inside a `relative` chapter; `<GoldenThread>` measures
 * wherever it lands and bends the path to meet it.
 */
export function ThreadNode({
  index,
  kind = "waypoint",
  className,
}: ThreadNodeProps) {
  const { registerNode } = useThread();

  const ref = useCallback(
    (el: HTMLSpanElement | null) => registerNode(index, el),
    [registerNode, index],
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-kind={kind}
      // `data-lit` is owned by `<GoldenThread>` from here on: it writes it
      // directly to this element as the reading line passes.
      data-lit="false"
      className={cn(
        "gt-node absolute z-[2]",
        // Nodes are centered on their anchor by negative margins rather than
        // a translate, because `data-lit` claims `transform` for the scale-up.
        // The centered origin/knot hang off `left-1/2` (physical), so they
        // take a physical `-ml`; the waypoints hang off the RTL-leading edge.
        kind === "origin" && "size-[9px] -ml-[4.5px] -mt-[4.5px]",
        kind === "knot" && "size-[13px] -ml-[6.5px] -mt-[6.5px]",
        kind === "waypoint" && "size-[11px] -ms-[5.5px] -mt-[5.5px]",
        className,
      )}
    />
  );
}

export { type ThreadNodeKind };

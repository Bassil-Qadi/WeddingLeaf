"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Print the door sheet. Trivial, but it has to be a client component — the page
 * itself is server-rendered and `window.print()` only exists in the browser.
 */
export function SheetPrintButton() {
  return (
    <Button onClick={() => window.print()} size="sm">
      <Printer className="size-4" />
      طباعة
    </Button>
  );
}

"use client";

import { useState } from "react";

import { Envelope } from "../envelope/envelope";
import { InvitationPaper } from "../paper/invitation-paper";

export function InvitationExperience() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative mt-24 flex justify-center">

      <InvitationPaper opened={opened} />

      <Envelope
        opened={opened}
        onOpen={() => setOpened(true)}
      />

    </div>
  );
}
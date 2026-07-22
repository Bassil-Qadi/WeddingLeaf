import type { InvitationData } from "../types";
import { AlbumTemplate } from "./album-template";
import { AureliaTemplate } from "./aurelia-template";
import { CardTemplate } from "./card-template";
import { GemTemplate } from "./gem-template";
import { RoyalTemplate } from "./royal-template";
import { ThreadTemplate } from "./thread-template";

/**
 * Chooses which invitation layout renders. `template` is the layout axis
 * (structure + motion); `theme` is only colour and is applied *inside* each
 * template, so palettes ride on whichever layout is picked. Every layout is a
 * self-contained experience owning its own `.gt` root — see each template file.
 *
 * Feature logic (RSVP, the .ics calendar button, the map) lives in shared
 * pieces the templates compose, so adding a layout never means rebuilding a
 * feature.
 */
export function InvitationExperience({
  invitation,
}: {
  invitation: InvitationData;
}) {
  switch (invitation.template) {
    case "card":
      return <CardTemplate invitation={invitation} />;
    case "album":
      return <AlbumTemplate invitation={invitation} />;
    // The three "royal" layouts share one story and one cover component; only
    // the opening animation differs, carried by `treatment`.
    case "envelope":
    case "doors":
    case "veil":
      return (
        <RoyalTemplate invitation={invitation} treatment={invitation.template} />
      );
    // The modern, 3D layout — a pointer-parallax stage with a spinning crystal.
    case "gem":
      return <GemTemplate invitation={invitation} />;
    // The kinetic layout — a glowing portal that dissolves into a scroll-story.
    case "aurelia":
      return <AureliaTemplate invitation={invitation} />;
    case "thread":
    default:
      return <ThreadTemplate invitation={invitation} />;
  }
}

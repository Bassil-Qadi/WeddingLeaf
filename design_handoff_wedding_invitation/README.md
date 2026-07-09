# Handoff: WeddingLeaf — "Golden Thread" Invitation Experience

## Overview
A premium, Arabic-first (RTL) interactive wedding-invitation experience for the WeddingLeaf
SaaS product. The signature interaction is **The Golden Thread**: a single continuous gold
line that draws itself as the user scrolls, weaving right-to-left through the story of the
wedding (names → story → save-the-date → programme → venue → closing). The experience opens
with a **veil lift (كشف الطرحة)** — a full-screen ivory veil that the user lifts to reveal
the invitation.

Concept rationale: instead of a static card or an envelope cliché, the whole invitation is
carried by one physical metaphor — a thread of gold — so every animation has narrative
purpose (the thread advances the story). It is mobile-first, RTL-native, and light-luxury.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype that
demonstrates the intended look, motion, and behavior. **They are not production code to copy
verbatim.** The task is to **recreate this experience in the target codebase's environment**
using its established patterns and libraries.

The requested target stack for this product is:
- **Next.js 16 (App Router) + TypeScript**
- **Tailwind CSS**
- **Framer Motion** (for all animation)
- **shadcn/ui** components + **Lucide** icons

Map the prototype's hand-rolled JS/CSS animation onto idiomatic Framer Motion + Tailwind (see
"Implementation notes for the target stack" at the bottom). Keep the architecture clean and
componentized.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion timings, and copy are all
specified below and should be recreated faithfully. Exact hex values, durations, and easing
curves are given.

---

## Global Setup

- **Direction:** `dir="rtl"`, `lang="ar"` on the root. All text is right-aligned; the thread
  and narrative flow right-to-left.
- **Fonts:**
  - Arabic UI/body: **IBM Plex Sans Arabic** (weights 200, 300, 400, 500, 600, 700). Thin
    weights (200/300) are used for large display text — this is what gives the luxury feel.
  - Latin / numerals / ampersand accents: **Cormorant Garamond** (500/600, plus italic 500).
    Used for the `&`, small caps labels, chapter index numerals, and dates.
- **Numerals:** Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩) everywhere in Arabic content, including the
  live countdown. Convert with: `String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])`.
- **Mobile-first & responsive.** Sizes use `clamp()`. Fully works on phone and desktop.
- **Accessibility:** honor `prefers-reduced-motion` — disable the thread draw, comet, and 3D
  motion; reveal content statically; the veil fades instead of lifting.

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| Paper / background base | `#f4eee3` | Page background |
| Paper light | `#f8f3ea` | Top of background gradient |
| Paper mid | `#f2eadd` | Middle of gradient |
| Paper deep | `#ece2d0` | Bottom of gradient |
| Ink (primary text) | `#2b2620` | Headings, names, body emphasis |
| Ink 74% | `rgba(43,38,32,.74)` | Body copy |
| Ink 60% / 55% / 50% / 42% | `rgba(43,38,32,.6…)` | Secondary/muted text |
| Gold (primary accent) | `#a67c2e` | Labels, thread mid, active accents |
| Gold light | `#d8ab4a` | Thread top, highlights, lit nodes |
| Gold deep | `#7d5d20` | Thread bottom, hover text |
| Gold button text | `#8a6620` | Button labels |
| Gold hairlines | `rgba(166,124,46, .14–.5)` | Rules, borders, dividers |
| Comet core | `#b8862b` | Bright point at thread tip |

Background is a layered radial + linear gradient (candlelit ivory):
```
radial-gradient(125% 85% at 50% -8%, rgba(255,252,246,0.9), transparent 55%),
radial-gradient(80% 55% at 82% 12%, rgba(214,178,120,0.10), transparent 60%),
radial-gradient(70% 50% at 12% 92%, rgba(198,168,120,0.10), transparent 60%),
linear-gradient(180deg, #f8f3ea 0%, #f2eadd 45%, #ece2d0 100%)
```

### Spacing / layout
- Content column: `max-width: 680px`, centered, horizontal padding `clamp(18px,5vw,40px)`.
- Each chapter section: `min-height: 100vh`, vertically centered content.
- The thread hugs the **right** edge of the content column (RTL leading side); content is
  right-aligned with right padding (~44–68px) to clear the thread + nodes.

### Typography scale
- Names (hero): `clamp(52px, 15vw, 104px)`, weight 200.
- Section headings: `clamp(28px, 7vw, 40px)`, weight 400.
- Body: `clamp(16px, 4.4vw, 19px)`, weight 300, line-height ~2.1.
- Small caps labels (Cormorant): 12px, `letter-spacing: .34–.5em`, uppercase.
- Chapter index numerals (٠١…): Cormorant 15px, `letter-spacing: .34em`, gold.

### Motion timings & easing
- Primary easing: `cubic-bezier(.2,.7,.2,1)` (content reveals).
- Veil-lift easing: `cubic-bezier(.76,0,.24,1)`.
- Content reveal: opacity + `translateY(24px→0)`, duration ~1s, staggered by ~.1s per element.
- Hero entrance: same, staggered .18/.38/.5/.7s, triggered when the veil opens.
- Thread draw: linked to scroll progress (not time).

---

## Screens / Views

This is a single continuous vertical scroll experience with an opening overlay. "Screens" =
the overlay + six stacked chapters.

### 0. Opening — The Veil (كشف الطرحة)
- **Purpose:** Cover the invitation until the user chooses to open it; create a ceremonial
  "unveiling" moment.
- **Layout:** Full-screen `position: fixed` overlay, z-index above everything. Centered
  column of composition. Scroll is **locked** (`body overflow: hidden`) until opened.
- **Components (centered, top→bottom):**
  - WeddingLeaf wordmark (Cormorant, `letter-spacing:.44em`, uppercase, muted ink), pinned top.
  - Ornament: `— ◆ —` (two 38px gold hairlines flanking a 6px rotated-45° diamond outline).
  - **Seal:** 98px circle, 1px gold border, radial gold glow inside, monogram **"س · ع"**
    (Cormorant 30px, gold). Breathing animation (scale 1↔1.05, ~4.6s).
  - Kicker: "أنتم مدعوّون لحضور حفل زفاف" (12px, `letter-spacing:.34em`, gold).
  - Names: "سارة **&** عمر" (weight 200, `clamp(34px,10vw,58px)`; the `&` is Cormorant italic
    gold).
  - Date: "١٤ نوفمبر ٢٠٢٦" (Cormorant, `letter-spacing:.16em`, muted).
  - **Button:** "اكشفوا الطرحة" — pill, 1px gold border, faint gold fill, gold text, padding
    `16px 44px`; subtle pulsing box-shadow (`gt-pulse`, 3.2s); hover deepens fill/border.
  - Hint: "المسوا لكشف الدعوة" (12px, `letter-spacing:.2em`, faint).
  - **Silk sheen:** a diagonal translucent-white band sweeping across the veil on a loop
    (`gt-sheen`, 7s) for a fabric shimmer. Plus a faint dotted lace texture
    (`radial-gradient` dots, 22px grid, opacity .5).
- **Veil background:** ivory radial + linear gradient (near-opaque), inset bottom shadow to
  imply hanging fabric.
- **Open interaction (on button click):**
  1. Seal flares (bright gold box-shadow, scale 1.06); the centered composition fades and
     lifts slightly (`opacity→0`, `translateY(-14px) scale(1.02)`, .7s).
  2. After ~470ms the **entire veil lifts upward**: `transform: translateY(-106%) scale(1.03)`,
     `opacity→0`, `filter: blur(3px)`. Transition:
     `transform 1.5s cubic-bezier(.76,0,.24,1), opacity 1.1s ease .5s, filter 1.2s ease .3s`,
     `transform-origin: top center`.
  3. At ~900ms the hero content reveals (rises in) behind the lifting veil.
  4. At ~1500ms scroll is unlocked; at ~2000ms the veil is set `visibility:hidden`.
  - **Reduced motion:** skip the lift; simply fade the overlay out over .6s and reveal hero.

### 1. Hero
- **Purpose:** The emotional opener — the couple's names.
- **Layout:** Full-viewport, centered column, `text-align:center`.
- **Components:**
  - Kicker "بطاقة دعوة" (Cormorant, uppercase, `letter-spacing:.5em`, gold).
  - Names stacked: "سارة" / gold italic Cormorant "&" (with a slow gold gradient shimmer,
    `gt-shimmer` 6s) / "عمر" — each name `clamp(52px,15vw,104px)`, weight 200, ink.
  - Ornament `— ◆ —` (as above).
  - Subline: "يتشرّفان بدعوتكم لمشاركتهما فرحة العمر" then "الرياض · ١٤ نوفمبر ٢٠٢٦"
    (Cormorant accent).
  - Scroll hint pinned bottom-center: "تابعوا الخيط" + a double-chevron SVG bouncing
    (`gt-chev`, 1.8s).
  - A soft radial **aura** behind the names that parallaxes with pointer position (desktop).
  - **Origin knot:** the thread is "born" at a 9px node near the bottom of the hero.
- **Entrance:** each element rises in (opacity + translateY) with staggered delays, triggered
  by the veil opening (not on page load).

### 2. Chapter 01 — قصتنا (Our Story)
- **Purpose:** Short narrative + couple photo.
- **Layout:** Two columns (flex row, wraps on mobile): text block (right, RTL-leading) and a
  **portrait photo frame** (left). Gap `clamp(28px,5vw,56px)`.
- **Components:**
  - Index "٠١", heading "قصتنا", body paragraph (see Copy).
  - Photo frame: `aspect-ratio 3/4`, `flex 0 1 300px`. Matte frame = 9px padding, 1px gold
    border, faint paper fill, plus two small L-shaped gold corner accents (top-right &
    bottom-left, offset -7px). **User-fillable image** (empty placeholder captioned
    "صورة العروسين" — the couple photo).
  - Thread node on the right edge, reveals/ignites on scroll.

### 3. Chapter 02 — احفظوا التاريخ (Save the Date)
- **Purpose:** Date + live countdown.
- **Layout:** Single right-aligned block, `max-width 520px`. A huge ghosted "2" watermark sits
  behind on the left (`clamp(150px,32vw,240px)`, gold at ~7% opacity) for depth.
- **Components:**
  - Index "٠٢", heading "احفظوا التاريخ".
  - Date: "١٤ نوفمبر" (weight 200, `clamp(40px,12vw,68px)`) + "٢٠٢٦" (Cormorant italic gold).
  - Detail: "يوم الجمعة · الساعة الثامنة مساءً".
  - **Countdown:** 4-cell grid (`direction:ltr`), each cell = bordered box (1px gold @22%, gold
    @4% fill) with a large gold number (`clamp(24px,7vw,34px)`, tabular-nums, Arabic-Indic) and
    a label below (يوم / ساعة / دقيقة / ثانية). Updates every second. Target:
    **2026-11-14T20:00:00+03:00** (Riyadh). Clamp to 0 when past.

### 4. Chapter 03 — برنامج الحفل (Programme)
- **Purpose:** Timeline of the evening.
- **Layout:** Right-aligned block, `max-width 460px`; ghost "3" watermark behind.
- **Components:** 4 rows, each = a Cormorant time (LTR, left-aligned, `min-width 74px`, gold) +
  an Arabic label; rows separated by 1px gold hairlines. Times/labels:
  - ٧:٠٠ — استقبال الضيوف
  - ٨:٠٠ — عقد القِران
  - ٩:٠٠ — حفل العشاء
  - ١٠:٣٠ — السهرة

### 5. Chapter 04 — المكان (Venue)
- **Purpose:** Where + a venue photo + directions.
- **Layout:** Right-aligned block, `max-width 520px`.
- **Components:**
  - Index "٠٤", heading "المكان".
  - Venue name "قاعة الأندلس للاحتفالات" (`clamp(19px,5.4vw,24px)`).
  - Address "طريق الملك فهد — حيّ العليا، الرياض" (muted).
  - **Venue photo frame:** full-width, `height 220px`, same matte frame treatment. Empty
    user-fillable placeholder captioned "صورة القاعة".
  - Button "احصلوا على الاتجاهات ←" — pill outline, gold text, hover fill. (Wire to a maps URL.)

### 6. Closing
- **Purpose:** Warm send-off + RSVP + hashtag.
- **Layout:** Centered column. The thread returns to center and ends in a larger "knot" node.
- **Components:**
  - Monogram in an 86px ring (breathing), "س · ع".
  - "بحضوركم تكتمل فرحتنا" (`clamp(20px,5.6vw,28px)`).
  - Short gold divider rule.
  - RSVP line: "لتأكيد الحضور: +٩٦٦…" (wire to real number).
  - Hashtag: "#سارة_و_عمر" (gold, `letter-spacing:.14em`).
  - Signature: "سارة & عمر · ١٤ · ١١ · ٢٠٢٦" (Cormorant, LTR).

---

## The Golden Thread (signature mechanic)

An SVG spanning the full height of the content column, behind the content (`z-index:0`).

- **Path:** a single smooth curve (Catmull-Rom → cubic bezier) passing through one **node
  marker per chapter**. Markers alternate slightly between `right:26px` and `right:44px` to
  give the thread a gentle wave; the hero origin node and the closing knot are centered, so
  the thread starts and ends at center and bows to the right through the middle chapters.
- **Two stroked paths sharing the same `d`:**
  - `rail`: static, `rgba(166,124,46,.24)`, 1.4px — the "unlit" thread.
  - `progress`: gold vertical gradient (`#d8ab4a → #a67c2e → #7d5d20`), 1.8px, soft glow
    (`feGaussianBlur` filter). Drawn via `stroke-dasharray = pathLength` and
    `stroke-dashoffset = pathLength * (1 - scrollProgress)`.
- **Comet:** a bright radial dot (`url(#gt-comet)`) + tiny solid core positioned at the tip of
  the drawn thread using `path.getPointAtLength(len * progress)`. Fades out at the very start
  and end.
- **Nodes:** 11px dots (ivory fill, gold border). When the reading line passes a node it
  **ignites** — fills with a gold radial, brightens border, glows, scales up (1.3, or 1.15 for
  the origin/knot). Transition `all .7s cubic-bezier(.2,.7,.2,1)`.
- **Scroll progress:** `progress = clamp01((scrollY - trackTop + viewportH*0.52) / trackHeight)`.
- Rebuild the path on resize (re-measure node positions and total length).

## Additional ambient motion
- **Gold dust motes:** ~10 tiny blurred gold dots drifting slowly upward on staggered loops
  (`gt-drift`, 11–17s), fixed layer, low opacity. Subtle pointer parallax on desktop.
- **Grain:** a fixed fractal-noise SVG overlay, `mix-blend-mode:multiply`, opacity ~.045, for
  a paper texture.
- **Pointer parallax (desktop only, non-reduced-motion):** the hero aura translates ~30px and
  the motes layer ~12px with the cursor.

## State Management
- `opened: boolean` — whether the veil has been lifted (gates scroll lock + hero entrance).
- Countdown: `{ days, hours, mins, secs }` recomputed every second from the target timestamp.
- Scroll progress + active node index — derive on scroll (rAF-throttled); no need to store in
  React state if you drive the SVG imperatively, but with Framer Motion prefer `useScroll` +
  `useTransform` (see below).
- Per-chapter `inView` for reveal animations (Framer Motion `whileInView` / IntersectionObserver).
- Image slots: two user-supplied photos (couple, venue) — in production these come from the
  couple's uploaded media, not drag-and-drop placeholders.

## Assets
- **No raster/vector asset files** are required by the prototype. All ornaments, the thread,
  the comet, nodes, seal, and grain are CSS/SVG generated inline.
- **Fonts:** IBM Plex Sans Arabic + Cormorant Garamond (Google Fonts). In Next.js prefer
  `next/font/google`.
- **Photos:** two placeholders (couple portrait 3:4, venue 3:2-ish 220px tall) to be filled
  with real images in production.
- **Icons:** the double-chevron scroll hint and the directions arrow can be Lucide
  (`ChevronsDown`, `ArrowLeft` — mind RTL direction).

## Screenshots
Reference renders are in `screenshots/` (light theme, thread fully drawn, nodes lit):
- `0-veil-cover.png` — the opening veil (before lifting)
- `1-hero.png` — names / hero
- `2-story.png` — 01 قصتنا, with the couple photo frame (empty placeholder)
- `3-save-the-date.png` — 02 احفظوا التاريخ, with live countdown
- `4-programme.png` — 03 برنامج الحفل
- `5-venue.png` — 04 المكان, with the venue photo frame
- `6-closing.png` — closing knot
Note: photo frames appear empty because they are user-fillable in the prototype; in production
they hold the couple's real photos.

## Files in this bundle
- `Golden Thread Invitation.dc.html` — the source prototype (all markup + logic). Primary
  reference for exact styles, copy, and the animation logic (thread build, scroll handler,
  veil open sequence, countdown).
- `image-slot.js` — the drag-and-drop image placeholder web component used for the two photo
  frames in the prototype. **Not needed in production** — replace with your app's image
  component; listed only so the prototype runs.
- `Golden Thread Invitation.html` — a fully self-contained, offline single-file build of the
  same design (open in any browser to see it run, including the veil lift and thread).

---

## Implementation notes for the target stack (Next.js + Framer Motion + Tailwind)

- **Component architecture (suggested):**
  - `<InvitationExperience>` — orchestrates the veil + scroll container + thread.
  - `<Veil>` — the opening overlay; `onOpen` callback lifts scroll lock.
  - `<GoldenThread>` — the SVG spine; consumes scroll progress.
  - `<Chapter>` — generic section wrapper (index, heading, reveal, node marker slot).
  - `<Hero>`, `<Story>`, `<SaveTheDate>` (+ `<Countdown>`), `<Programme>`, `<Venue>`,
    `<Closing>` — content components.
  - `<PhotoFrame>` — the matte gold frame around an image.
- **Thread with Framer Motion:** use `useScroll({ target: trackRef })` → `scrollYProgress`;
  map it to the progress path with `useTransform(scrollYProgress, [0,1], [pathLength, 0])`
  bound to `strokeDashoffset` on an animated `<motion.path>`. Position the comet with
  `getPointAtLength` in a `useMotionValueEvent` handler.
- **Veil lift:** a `<motion.div>` with `variants` for `sealed` / `lifted`
  (`y: '-106%', scale: 1.03, opacity: 0, filter: 'blur(3px)'`), the given easing, and an
  `onAnimationComplete` to unmount + release the scroll lock. Orchestrate the seal/content
  fade with `staggerChildren`/`delayChildren`.
- **Reveals:** `whileInView` with `viewport={{ once: true, margin: '0px 0px -8% 0px' }}` and the
  translateY-up/opacity variant; stagger children.
- **RTL:** set `dir="rtl"` on the layout; use logical Tailwind utilities (`ps-*/pe-*`,
  `text-start/end`) and mirror any directional icons.
- **Reduced motion:** wrap animation in `useReducedMotion()`; fall back to static reveals and a
  simple veil fade.
- **Countdown:** a client component with a 1s interval; format digits to Arabic-Indic.

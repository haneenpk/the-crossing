# The Crossing — A Journey in Eight Scenes

An interactive cinematic website about space, distance and the way home.
The visitor is the astronaut; the scroll is the mission. Scrolling the hero
drives the film's playhead — you push through the hatch yourself.

## Run

```bash
npm install
npm run dev      # development
npm run build    # production build
npm run start    # serve the production build
```

Set `NEXT_PUBLIC_SITE_URL` in production so Open Graph URLs resolve to your domain.

## Structure

```
src/
  app/                     layout (fonts, metadata), page (scene composition), globals.css (tokens, glass, starfield, grain)
  components/
    providers/SmoothScroll  Lenis driven by the GSAP ticker (one clock for everything)
    sections/               Hero, Overview, Timeline, Moonwalk, Beyond, Missions, Return, Footer
    ui/                     Nav, SceneIndicator, Starfield, SectionLabel, RevealLines, StatCounter
  lib/                     motion.ts (one easing, cinematic durations), hooks.ts (hydration-safe media queries)
public/media/              ffmpeg-processed assets (scrub-optimised H.264, mobile variant, poster, stills)
```

## Design system in one breath

Void black `#050505` · space navy `#08111E` · soft white `#E8EAED` · silver `#8A94A6` ·
one ember accent `#D98E5F` sampled from the city lights in the film.
Instrument Serif for display, Inter for body, IBM Plex Mono for telemetry labels.
One easing curve (`cubic-bezier(0.16,1,0.3,1)`), no bounce, glass in exactly four places.

## Motion & performance notes

- Hero video is re-encoded with an 8-frame GOP so scroll-scrubbing seeks are cheap;
  the playhead is lerped inside the GSAP ticker — never set directly from scroll events.
- All scroll pins are CSS `sticky` inside tall wrappers (no pin-spacers to fight Lenis).
- Only `transform`, `opacity`, `filter` and `clip-path` are animated.
- Images ship through `next/image` (AVIF/WebP responsive variants); the 4K still never
  leaves the server at full weight.
- `prefers-reduced-motion` collapses the film to stills and fades.

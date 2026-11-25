<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep pilot itinerary examples and FAQ data in a pilot-only module; do not mutate the shared production catalog.
- Store editor overrides locally under a pilot-specific slug key and read them after hydration; SSR must retain accessible default stages.
- Generate pilot FAQ JSON-LD in leaf route heads from the exact FAQ arrays rendered on the page to avoid divergent or duplicate schema.
- Load GSAP and ScrollTrigger inside the pilot layout effect and clean its context on route changes; default content must remain visible without JavaScript.
- Keep home photo depth and wide/detail motion in a desktop media context with clipped images; resizing, reduced motion and route cleanup must restore the static composition without moving adjacent text.
- Keep the pilot hero slideshow isolated from shared galleries with licensed attribution, a visible first SSR frame, decoded replacements and automatic playback suspended for reduced motion or hidden tabs.
- Use viewport-relative sizing for shared headings, page gutters and section spacing. Bound fluid values with `clamp()` to preserve readability, and check the layout on a phone, a tablet and a wide desktop. Keep the hero selectors visually slim with a 44px minimum touch target.
- Keep travel references in editorial notes. Write the route, timing and extension details directly on each trek page. Place image license links in photo credits.
- Public pages use the fluid viewport-based root scale in site-layout.css. Use rem-based spacing, text and icons on that scale, and the shared site frame for alignment. The main navigation uses text-only links and controls. Keep one itinerary day visible by default and provide the native full-route disclosure.

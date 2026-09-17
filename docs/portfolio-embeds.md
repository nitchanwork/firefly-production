# Portfolio embeds

`src/data/portfolio.ts` is the only source of portfolio post URLs. Paste quoted URLs into a brand's Photography or Videography array, separated by commas. Copied query parameters are removed automatically for embedding; stored data and ordering are preserved.

`PortfolioBrand.astro` renders full-width type sections with automatic counts, ten initial items and independent ten-item Load More batches. Grids use five columns at 1200px+, three at 768–1199px, and two below 768px.

`InstagramEmbed.astro` provides an inert official blockquote template, dark loading/fallback states and an outer sizing wrapper. `src/scripts/instagramEmbeds.ts` mounts templates within 250px of the viewport and loads `https://www.instagram.com/embed.js` once. A shared promise and debounced processing handle concurrent mounts. Hidden brand/type frames are removed to stop playback and remounted when visible. Later batches remain inert. `src/scripts/portfolioPreload.ts` prepares only the next batch for nearby visible brand/type sections after foreground embeds settle and the browser is idle. It initializes two background embeds at a time, increasing to four when a Load More button is within two viewport heights. Staged posts are transparent, inert, absolutely positioned slots inside the same grid; they neither change the visible count nor accept interaction. Clicking Load More reveals those exact nodes without reparenting or reloading their iframes. An early click reveals immediately and lets any unfinished embeds load normally. Filter changes discard staged work and rebuild the queue for the current selection.

Captions are not enabled. No credentials, environment configuration, server endpoints, downloaded media or direct media URLs are needed. The existing static Astro deployment is sufficient.

The centralized `--embed-native-width` setting accommodates Instagram's minimum width. The complete outer iframe scales to fit narrow tiles, and ResizeObserver follows its actual height. Outer borders, radius, shadows, padding and margins are removed. We do not crop or cover playback controls or manipulate the cross-origin document. Native white backgrounds, account details, login prompts and controls inside the frame remain Instagram-controlled. Five-column tiles necessarily make the native controls smaller.

Script failure or a frame that does not initialize within 25 seconds shows a dark individual fallback with an Open post link. A late-loading frame can still replace the fallback. Instagram may render its own private/deleted-post message inside an otherwise loaded frame; the parent page cannot reliably detect that cross-origin content. Ad blockers, account restrictions and Instagram availability can affect embedding or playback independently of this site.

Validation: `npm run build` and `node --experimental-strip-types --test tests/instagram.test.mjs`. No separate lint or type-check command is configured in this repository.

# Firefly Production Website

## Project Overview

This is the official portfolio website for Firefly Production House.

The website is built with Astro.

Primary purposes:
- Showcase photography work
- Showcase video production work
- Showcase social media content
- Present production packages
- Allow future budget-based package filtering
- Generate leads from potential clients

## Tech Stack

- Astro
- HTML
- CSS
- Vanilla JavaScript

Do not add React, Vue, Svelte, Tailwind, Bootstrap, or other frameworks unless explicitly requested.

## Project Structure

Use reusable Astro components.

Current important files:

- src/layouts/BaseLayout.astro
- src/components/Navbar.astro
- src/components/Hero.astro
- src/components/WorkCard.astro
- src/styles/global.css

Pages:

- /
- /work
- /packages
- /contact

## Design Direction

The visual direction should feel like a modern creative production house.

Characteristics:

- Minimal
- Editorial
- Large typography
- Strong photography and video
- Generous spacing
- Clean grid system
- Dark visual direction
- Professional rather than playful

Avoid:
- Generic SaaS website styling
- Excessive rounded cards
- Excessive gradients
- Unnecessary shadows
- Bootstrap-like layouts

## Development Rules

1. Read existing files before making changes.
2. Preserve the existing visual language unless instructed otherwise.
3. Prefer reusable components over duplicated HTML.
4. Keep components simple and readable.
5. Make all layouts responsive.
6. Desktop and mobile must both be considered.
7. Avoid unnecessary dependencies.
8. Do not install npm packages without asking first.
9. Do not delete existing functionality unless explicitly requested.
10. Use semantic HTML when possible.

## CSS

Use the existing CSS variables in global.css.

Prefer:
- CSS Grid
- Flexbox
- clamp()
- responsive CSS
- scoped Astro styles where appropriate

Avoid excessive inline styles.

## JavaScript

Use vanilla JavaScript for simple interactions.

Do not introduce a frontend framework unless the interaction genuinely requires it.

## Images and Video

Static media should normally be stored under:

public/images/
public/videos/

Use:
- object-fit: cover
- responsive sizing
- lazy loading where appropriate

Performance is important because this website will contain many photographs and videos.

## Future Package System

The Packages page will eventually support:

- Budget input
- Service filtering
- Package filtering
- Recommended packages
- Photography
- Video
- Social content
- Creative production

Keep future extensibility in mind when structuring package data.

## AI Working Style

When given a task:

1. Inspect the relevant existing files.
2. Explain briefly what files will be changed.
3. Make the minimum necessary changes.
4. Do not redesign unrelated sections.
5. Check for obvious errors after making changes.
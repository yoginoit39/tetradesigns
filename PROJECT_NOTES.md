# Tetra Design & Concepts — Project Notes

Living handoff doc. Read this first when picking the project back up.
Last updated: 2026-09-24.

## What this is
Marketing site for **Tetra Design & Concepts** (civil & structural engineering, Kampala, Uganda; est. 1994).
Owner is a structural engineer (20 yrs experience). Next.js 16 (App Router) **static export** → hosted on
**cPanel shared hosting** at `https://tetradesignandconcepts.com`. Repo: `github.com/yoginoit39/tetradesigns` (push via SSH).

## Stack / structure
- `src/app/` pages: `/`, `/about`, `/projects`, `/contact` (+ `template.tsx` = route crossfade).
- Fonts: **Syne** (`--font-oswald`) headings, **DM Sans** (`--font-barlow`) body. Dark theme `#0C0A09` + purple `#6D28D9`.
- Motion: Lenis smooth scroll (`SmoothScroll.tsx`), GSAP ScrollTrigger reveals (`ScrollReveal.tsx`, variants slide/clip/scale),
  `Parallax.tsx`, `ScrollProgress.tsx`, `SectionNav.tsx` (homepage dot nav), `Preloader.tsx` (5 s cinematic intro on hard load only).
- Nav: `Navigation.tsx` = floating glass pill, sliding indicator, hides on scroll-down / returns on scroll-up.
- 3D (react-three-fiber): `three/HeroBuildingScene.tsx` = mid-rise **steel-frame** model (columns, girders, slabs, end bracing,
  core, footings, gridlines) that assembles floor-by-floor. `three/StructureViewer.tsx` (About) = stick-model **gravity load analysis**
  (blue compression / magenta bending, beams sag). **No crane** — owner dislikes cranes.
- Light pages get `LightBackdrop.tsx` (soft lavender aurora washes, multiply blend; **no grid lines**).
- Contact form: `ContactForm.tsx` → `public/api/contact.php` (PHPMailer, SMTP) with honeypot, per-IP rate limit, length caps,
  header-injection guard, URL-flood check.
- Showreel: `public/video.mp4` (33 s, 72–105 s cut of the original, H.264, 5 MB) + `video-poster.jpg`.
  Original 46 MB `.mov` is NOT in the repo (backup on owner's Desktop: `~/Desktop/tetra-video-backup/`).

## Deploy runbook (cPanel)
1. `npm run build` → outputs `out/`.
2. Zip contents (never include the live mail config):
   `cd out && zip -rq ../deploy.zip . -x '.*' -x '*/.*' -x 'api/config.php'`
3. cPanel → File Manager → `public_html` → Upload `deploy.zip` → Extract (overwrite) → delete zip.
4. Ensure `public_html/api/config.php` exists on the server (see below). It is gitignored and excluded from the zip on purpose.
5. Hard-refresh the site; test the contact form → should arrive at `info@`.
- Stay inside `public_html`. **Never** touch `/home/USER/mail`, `etc`, `.cpanel` — email lives there, separate from the site.
- Domain PHP version set to **8.2** in MultiPHP Manager. A home-level `.htaccess` used to force PHP 5.6 — it was removed
  (the endpoint uses PHP ≥ 7.4 syntax).

### `api/config.php` (create on server; fill the real password there, never commit it)
```php
<?php
return [
    'smtp_host'     => 'mail.tetradesignandconcepts.com',
    'smtp_port'     => 465,
    'smtp_secure'   => 'ssl',
    'smtp_username' => 'info@tetradesignandconcepts.com',
    'smtp_password' => 'PUT_PASSWORD_HERE',
    'from_email'    => 'info@tetradesignandconcepts.com',
    'from_name'     => 'Tetra Website Contact Form',
    'to_email'      => 'info@tetradesignandconcepts.com',
];
```
Fallback if 465/ssl fails: port `587` + `'tls'`.

## Design decisions (owner feedback — respect these)
- **Likes:** dark + purple identity, Syne headings, the 5 s intro, floating pill nav, minimal realistic steel-frame hero, soft lavender washes on light pages, smooth scroll + reveals.
- **Rejected:** editorial light/serif redesign (reverted entirely); cranes in any 3D scene; abstract structures (cable-stayed bridge, diagrid/twisting tower, truss); busy/cluttered wireframes (too many lines); grid/blueprint lines on light backgrounds ("looks like a book with boxes").
- Rule of thumb: realistic, minimal, elegant. Verify visually (Playwright screenshots) before presenting.

## Open items
- Founder feature section on the homepage (owner is a structural engineer, 20 yrs; commercial/residential/industrial/infrastructure; design + supervision + PM). Need his **name + title**; copy to be polished into third person.
- Replace placeholder phone `+256 000 000 000` (in `src/lib/data.ts` and `layout.tsx` JSON-LD).
- Replace Google Search Console placeholder `your-google-verification-code` in `layout.tsx`.
- Optional: compress the two 6–8 MB project JPGs; proper 1200×630 OG image.

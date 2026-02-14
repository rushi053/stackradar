# 🚀 StackRadar - Quick Start Guide

## Development

```bash
cd /Users/rushirajjadeja/Desktop/stackradar
npm run dev
```

Open `http://localhost:3000`

## New Features Usage

### 1. 🔍 Scan Mode (Default)
- Enter any URL (e.g., `stripe.com`, `vercel.com`)
- Press "Scan" or hit Enter
- See 150+ technologies detected across 25 categories
- Look for version badges next to tech names (e.g., `v14.1.0`)

### 2. ⚖️ Compare Mode
- Click "Compare" tab at top
- Enter two URLs side-by-side
- Click "Compare" button
- See:
  - Shared technologies (green section)
  - Unique to Site A (left, blue theme)
  - Unique to Site B (right, purple theme)

### 3. 📚 Scan History
- Automatically saves last 10 scans
- View "Recent Scans" below search (when no results shown)
- Click any history item to instantly view cached results
- Click "Clear" to wipe history

### 4. 🎨 Share & Download
After scanning:
- **Share button:** Copies shareable link to clipboard
  - Share link includes URL parameter for auto-loading
  - OG image generated dynamically for social media
- **Download button:** Exports results as PNG image
  - High-quality 2x resolution
  - Filename: `stackradar-{url}.png`

### 5. ⌨️ Keyboard Shortcuts
- `⌘K` or `Ctrl+K` - Focus search input

## API Endpoints

### Scan Website
```bash
POST http://localhost:3000/api/scan
Content-Type: application/json

{
  "url": "vercel.com"
}
```

### Generate OG Image
```bash
GET http://localhost:3000/api/og?url=vercel.com&techs=Next.js,React,Vercel&count=15
```

Returns PNG image (1200x630)

## What's New

### Technologies Detected (150+)
- **Frameworks:** React, Vue, Next.js, Svelte, Angular, SolidJS, Qwik, HTMX, Alpine.js, Laravel, Django, Rails, Flask, Express...
- **Build Tools:** Webpack, Vite, esbuild, Turbopack, Parcel, Rollup
- **State Management:** Redux, Zustand, MobX, Recoil, Jotai, XState
- **CSS:** Tailwind, Styled Components, Emotion, Sass, UnoCSS
- **Testing:** Cypress, Playwright, Jest
- **CMS:** WordPress, Shopify, Contentful, Strapi, Sanity...
- **Analytics:** GA, PostHog, Heap, FullStory, Mixpanel, Plausible...
- **Hosting:** Vercel, Netlify, AWS, Cloudflare, Fly.io, Render...
- **And 100+ more!**

### New Categories
- Build Tools, State Management, CSS Tools, Testing, Headless CMS
- Database, Monitoring, Email, A/B Testing, Search
- Chat/Support, Video, Social, Consent/Privacy, Performance
- Meta Framework, CMS Plugins

## Testing

```bash
# Build (production)
npm run build

# Test scan API
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"vercel.com"}'

# Test OG image
curl -I "http://localhost:3000/api/og?url=vercel.com&techs=Next.js,React&count=10"
```

## Files Changed

- `/src/app/api/scan/route.ts` - Expanded detection engine
- `/src/app/api/og/route.tsx` - NEW: OG image generation
- `/src/app/page.tsx` - Complete rewrite with all features
- `/package.json` - Added @vercel/og, html2canvas

## Documentation

- `FEATURES_IMPLEMENTED.md` - Detailed feature breakdown
- `UPGRADE_COMPLETE.md` - Comprehensive upgrade report
- `QUICKSTART.md` - This file

## Support

All features tested and working! 🎉

**Tested with:**
- vercel.com ✅
- Build successful ✅
- All features operational ✅

Ready to deploy! 🚀

# StackRadar 🎯

X-ray any website's tech stack in seconds.

## 🚀 Features

- **50+ Technology Detection**: Detects frameworks, hosting providers, CDNs, analytics, fonts, payments, CMS, UI libraries, auth providers, and more
- **Beautiful Dark UI**: Production-quality dark theme with electric blue accents
- **Confidence Indicators**: Visual dots showing detection confidence (high, medium, low)
- **Category Grouping**: Technologies organized by category with emoji icons
- **Share Functionality**: Copy shareable links to scanned results
- **Mobile Responsive**: Works perfectly on all screen sizes
- **Fast & Accurate**: Server-side scanning with comprehensive fingerprinting

## 🛠️ Tech Stack

Built with modern web technologies:
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v3
- Server-side API routes

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔍 How It Works

1. **User Input**: Enter any website URL
2. **Server Fetch**: API route fetches the website with browser-like headers
3. **Pattern Matching**: Analyzes HTTP headers, HTML content, script tags, meta tags, and links
4. **Technology Detection**: Matches against 50+ technology fingerprints
5. **Confidence Scoring**: Assigns confidence levels based on match strength
6. **Category Grouping**: Organizes results by technology category
7. **Beautiful Display**: Renders results in category cards with emoji icons

## 🎨 Categories

- ⚡ **Framework**: Next.js, React, Vue, Angular, Svelte, etc.
- 🏠 **Hosting**: Vercel, Netlify, AWS, Cloudflare Pages, Heroku
- 🌐 **CDN**: Cloudflare, Fastly, AWS CloudFront, Akamai
- 📊 **Analytics**: Google Analytics, PostHog, Mixpanel, Plausible
- 🔤 **Fonts**: Google Fonts, Adobe Fonts, Font Awesome
- 💳 **Payments**: Stripe, Razorpay, PayPal, Paddle
- 📝 **CMS**: WordPress, Shopify, Webflow, Ghost, Contentful
- 🔐 **Auth**: Auth0, Clerk, Supabase, Firebase
- 🎨 **UI Library**: Tailwind CSS, Bootstrap, Material UI, Chakra UI
- 🔧 **Other**: jQuery, GraphQL, Socket.io, Sentry, Intercom

## 📝 API Usage

### POST /api/scan

**Request:**
```json
{
  "url": "stripe.com"
}
```

**Response:**
```json
{
  "categories": {
    "Framework": [
      { "name": "Next.js", "confidence": "high" },
      { "name": "React", "confidence": "high" }
    ],
    "Hosting": [
      { "name": "Vercel", "confidence": "high" }
    ],
    ...
  },
  "url": "https://stripe.com/",
  "scannedAt": "2026-02-14T16:30:00.000Z"
}
```

## 🎯 Detection Patterns

The engine uses multiple detection methods:

- **HTTP Headers**: Server, X-Powered-By, X-Vercel-Id, CDN headers
- **HTML Content**: Meta tags, generator tags, script sources
- **Script Tags**: Technology-specific JavaScript files
- **Link Tags**: Stylesheets, font imports
- **Inline Code**: Technology markers in HTML/JS

## 🌟 Day 1/100

Built as part of the 100 Days of Building challenge by [@rushirajjj](https://twitter.com/rushirajjj) with AI agents.

## 📄 License

MIT

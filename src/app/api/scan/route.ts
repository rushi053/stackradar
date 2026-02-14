import { NextRequest, NextResponse } from 'next/server';

interface Technology {
  name: string;
  confidence: 'high' | 'medium' | 'low';
  version?: string;
}

interface DetectionResult {
  categories: {
    [category: string]: Technology[];
  };
  url: string;
  scannedAt: string;
}

// Detection patterns for each technology
const detectionPatterns: { [key: string]: RegExp[] } = {
  // Frameworks
  'Next.js': [/__next/i, /_next\/static/i, /__NEXT_DATA__/i],
  'React': [/react/i, /__REACT/i, /data-reactroot/i, /data-reactid/i],
  'Vue': [/__vue/i, /vue\.js/i, /data-v-/i, /@vue\//i],
  'Angular': [/ng-version/i, /ng-app/i, /angular/i],
  'Svelte': [/__svelte/i, /svelte/i],
  'Nuxt': [/__nuxt/i, /_nuxt/i],
  'Gatsby': [/gatsby/i, /___gatsby/i],
  'Astro': [/astro/i, /_astro/i],
  'Remix': [/remix/i, /__remix/i],
  'SolidJS': [/solid-js/i, /_solid/i, /solidjs/i],
  'Qwik': [/qwik/i, /@builder\.io\/qwik/i],
  'Ember': [/ember-cli/i, /emberjs/i, /ember\.js/i, /ember-source/i],
  'Backbone': [/backbone\.js/i, /backbone\.min\.js/i, /backbonejs/i],
  'Alpine.js': [/alpine\.js/i, /alpinejs/i, /x-data/i],
  'HTMX': [/htmx/i, /hx-get/i, /hx-post/i],
  'Stimulus': [/stimulus/i, /data-controller/i],
  'Turbo': [/turbo-frame/i, /turbo-stream/i, /hotwired\/turbo/i],
  'Laravel': [/laravel_session/i, /laravel\/framework/i, /x-powered-by.*laravel/i],
  'Django': [/csrfmiddlewaretoken/i, /django\/\d/i, /x-powered-by.*django/i],
  'Rails': [/x-powered-by.*phusion/i, /ruby on rails/i, /rails\/\d/i, /action_controller/i],
  'Flask': [/x-powered-by.*flask/i, /flask\/\d/i, /werkzeug/i],
  'Express': [/x-powered-by.*express/i, /express\/\d/i],
  'Hono': [/hono/i],
  'Elysia': [/elysia/i],
  'WordPress': [/wp-content/i, /wp-includes/i, /wordpress/i],
  'jQuery': [/jquery/i],
  
  // Meta Frameworks
  'SvelteKit': [/sveltekit/i, /__sveltekit/i],
  'Solid Start': [/solid-start/i, /solidstart/i],
  'TanStack Start': [/tanstack\/start/i, /@tanstack\/start/i],
  
  // Build Tools
  'Webpack': [/webpack/i, /webpackJsonp/i],
  'Vite': [/vite/i, /@vite/i, /\.vite/i],
  'esbuild': [/esbuild/i],
  'Turbopack': [/turbopack/i],
  'Parcel': [/parcel/i, /parcel-bundler/i],
  'Rollup': [/rollup/i],
  
  // State Management
  'Redux': [/redux/i, /__REDUX/i],
  'Zustand': [/zustand/i],
  'MobX': [/mobx/i],
  'Recoil': [/recoil/i, /recoiljs/i],
  'Jotai': [/jotai/i],
  'XState': [/xstate/i, /@xstate/i],
  
  // CSS Tools
  'Styled Components': [/styled-components/i, /sc-/i],
  'Emotion': [/emotion/i, /@emotion/i],
  'CSS Modules': [/\.module\.css/i],
  'UnoCSS': [/unocss/i, /@unocss/i],
  'Panda CSS': [/panda.*css/i, /@pandacss/i],
  'Sass': [/\.scss/i, /sass/i],
  'Less': [/\.less/i, /less\.js/i],
  
  // Testing
  'Cypress': [/cypress/i, /\.cypress/i],
  'Playwright': [/playwright/i, /@playwright/i],
  'Jest': [/jest/i],
  
  // Headless CMS
  'Strapi': [/strapi/i],
  'Directus': [/directus/i],
  'Prismic': [/prismic/i, /prismic\.io/i],
  'Storyblok': [/storyblok/i],
  'DatoCMS': [/datocms/i],
  'Hygraph': [/hygraph/i, /graphcms/i],
  
  // Hosting
  'Vercel': [/x-vercel-id/i, /vercel/i],
  'Netlify': [/x-nf-request-id/i, /netlify/i],
  'AWS': [/amazons3/i, /x-amz-/i, /amazonaws/i],
  'Cloudflare Pages': [/cf-ray/i],
  'Heroku': [/heroku/i],
  'Railway': [/railway/i],
  'GitHub Pages': [/github\.io/i],
  'Fly.io': [/fly\.io/i, /fly-request-id/i],
  'Render': [/render\.com/i, /x-render/i],
  'DigitalOcean': [/digitalocean/i, /digitaloceanspaces/i],
  'Linode': [/linode/i],
  'Deno Deploy': [/deno\.land/i, /deno\.dev/i],
  'Supabase': [/supabase\.co/i, /supabase/i],
  
  // CDN
  'Cloudflare': [/cf-ray/i, /cf-cache-status/i, /cloudflare/i],
  'Fastly': [/x-served-by/i, /x-fastly/i, /fastly/i],
  'AWS CloudFront': [/x-amz-cf-id/i, /cloudfront/i],
  'Akamai': [/x-akamai/i, /akamai/i],
  'Bunny CDN': [/bunny\.net/i, /bunnycdn/i],
  'StackPath': [/stackpath/i],
  'KeyCDN': [/keycdn/i],
  'jsDelivr': [/jsdelivr/i, /cdn\.jsdelivr\.net/i],
  'unpkg': [/unpkg\.com/i],
  'cdnjs': [/cdnjs\.cloudflare\.com/i],
  
  // Analytics
  'Google Analytics': [/google-analytics/i, /gtag/i, /ga\.js/i, /analytics\.js/i, /googletagmanager/i, /gtm\.js/i],
  'PostHog': [/posthog/i],
  'Mixpanel': [/mixpanel/i],
  'Plausible': [/plausible\.io/i],
  'Hotjar': [/hotjar/i],
  'Amplitude': [/amplitude/i],
  'Fathom': [/usefathom/i],
  'Segment': [/segment\.com/i, /segment\.io/i],
  'Heap': [/heap/i, /heapanalytics/i],
  'FullStory': [/fullstory/i, /fs\.com/i],
  'LogRocket': [/logrocket/i],
  'Clarity': [/clarity\.ms/i, /c\.clarity\.ms/i],
  'Matomo': [/matomo/i, /piwik/i],
  'Pirsch': [/pirsch/i],
  'Umami': [/umami/i, /cloud\.umami\.is/i],
  
  // Fonts
  'Google Fonts': [/fonts\.googleapis\.com/i, /fonts\.gstatic\.com/i],
  'Adobe Fonts': [/use\.typekit\.net/i, /typekit/i],
  'Font Awesome': [/fontawesome/i, /font-awesome/i],
  
  // Payments
  'Stripe': [/stripe\.com/i, /js\.stripe\.com/i],
  'Razorpay': [/razorpay/i],
  'PayPal': [/paypal\.com\/sdk/i, /paypalobjects/i],
  'Paddle': [/paddle\.com/i],
  'Lemon Squeezy': [/lemonsqueezy/i],
  'Gumroad': [/gumroad/i],
  'Chargebee': [/chargebee/i],
  'Recurly': [/recurly/i],
  'Square': [/squareup\.com/i, /square\.(com|site)/i],
  
  // CMS
  'Shopify': [/cdn\.shopify\.com/i, /shopify/i],
  'Webflow': [/webflow\.com/i, /webflow\.io/i],
  'Squarespace': [/squarespace/i],
  'Ghost': [/ghost\.org/i, /ghost\.io/i],
  'Contentful': [/contentful\.com/i],
  'Sanity': [/sanity\.io/i],
  
  // CMS Plugins
  'WooCommerce': [/woocommerce/i, /wc-/i],
  'Elementor': [/elementor/i],
  'Yoast SEO': [/yoast/i],
  'Contact Form 7': [/contact-form-7/i, /wpcf7/i],
  'ACF': [/advanced-custom-fields/i, /acf/i],
  
  // UI Libraries
  'Tailwind CSS': [/tailwind/i],
  'Bootstrap': [/bootstrap/i],
  'Material UI': [/@mui/i, /material-ui/i, /MuiButton/i],
  'Chakra UI': [/chakra-ui/i],
  'shadcn': [/@radix-ui/i, /radix-ui/i],
  'Ant Design': [/antd/i, /ant-design/i],
  
  // Auth
  'Auth0': [/auth0/i],
  'Clerk': [/clerk\.com/i, /clerk\.js/i, /clerk\.dev/i],
  'Kinde': [/kinde/i],
  'Stytch': [/stytch/i],
  'WorkOS': [/workos/i],
  'NextAuth': [/next-auth/i, /nextauth/i, /__Secure-next-auth/i],
  'Lucia': [/lucia-auth/i],
  
  // Database
  'PlanetScale': [/planetscale/i],
  'Neon': [/neon\.tech/i],
  'MongoDB': [/mongodb/i, /mongo/i],
  'Prisma': [/prisma/i, /@prisma/i],
  'Drizzle': [/drizzle/i, /drizzle-orm/i],
  
  // Monitoring
  'Datadog': [/datadog/i, /datadoghq/i],
  'New Relic': [/newrelic/i, /nr-data/i],
  'Bugsnag': [/bugsnag/i],
  'Rollbar': [/rollbar/i],
  
  // Email
  'Mailchimp': [/mailchimp/i, /list-manage\.com/i],
  'SendGrid': [/sendgrid/i],
  'ConvertKit': [/convertkit/i],
  'Resend': [/resend\.com/i],
  'Mailgun': [/mailgun/i],
  'Beehiiv': [/beehiiv/i],
  
  // A/B Testing
  'Optimizely': [/optimizely/i],
  'LaunchDarkly': [/launchdarkly/i],
  'Split': [/split\.io/i],
  'VWO': [/visualwebsiteoptimizer/i, /vwo\.com/i],
  'Google Optimize': [/optimize\.google/i],
  
  // Chat/Support
  'Intercom': [/intercom/i],
  'Crisp': [/crisp\.chat/i],
  'Drift': [/drift\.com/i, /driftt\.com/i],
  'Zendesk': [/zendesk/i, /zopim/i],
  'Freshdesk': [/freshdesk/i],
  'HubSpot': [/hubspot/i, /hs-scripts/i],
  'Olark': [/olark/i],
  'Tawk.to': [/tawk\.to/i],
  'LiveChat': [/livechatinc/i, /livechat/i],
  
  // Video
  'Wistia': [/wistia/i],
  'Mux': [/mux\.com/i],
  'Loom': [/loom\.com/i],
  'Cloudinary': [/cloudinary/i],
  'Vimeo': [/vimeo/i, /player\.vimeo/i],
  'YouTube': [/youtube\.com/i, /ytimg\.com/i],
  
  // Search
  'Algolia': [/algolia/i, /algolianet/i],
  'Typesense': [/typesense/i],
  'Meilisearch': [/meilisearch/i],
  'ElasticSearch': [/elasticsearch/i, /elastic\.co/i],
  
  // Social
  'Twitter': [/platform\.twitter\.com/i, /twitter\.com\/widgets/i],
  'Facebook SDK': [/connect\.facebook\.net/i, /fb\.me/i],
  'LinkedIn Insight': [/linkedin\.com\/px/i, /snap\.licdn\.com/i],
  'Pinterest': [/pinterest\.com\/js/i],
  'TikTok Pixel': [/tiktok\.com\/i18n\/pixel/i, /analytics\.tiktok/i],
  
  // Consent/Privacy
  'CookieBot': [/cookiebot/i],
  'OneTrust': [/onetrust/i],
  'Termly': [/termly\.io/i],
  'CookieYes': [/cookieyes/i],
  
  // Performance
  'Lighthouse': [/lighthouse/i],
  'Web Vitals': [/web-vitals/i],
  'Partytown': [/partytown/i, /@builder\.io\/partytown/i],
  
  // Other
  'GraphQL': [/graphql/i],
  'Socket.io': [/socket\.io/i],
  'Sentry': [/sentry\.io/i, /@sentry/i],
  'Firebase': [/firebase/i, /firebaseapp\.com/i],
};

// Category mapping
const categoryMap: { [key: string]: string } = {
  'Next.js': 'Framework',
  'React': 'Framework',
  'Vue': 'Framework',
  'Angular': 'Framework',
  'Svelte': 'Framework',
  'Nuxt': 'Framework',
  'Gatsby': 'Framework',
  'Astro': 'Framework',
  'Remix': 'Framework',
  'SolidJS': 'Framework',
  'Qwik': 'Framework',
  'Ember': 'Framework',
  'Backbone': 'Framework',
  'Alpine.js': 'Framework',
  'HTMX': 'Framework',
  'Stimulus': 'Framework',
  'Turbo': 'Framework',
  'Laravel': 'Framework',
  'Django': 'Framework',
  'Rails': 'Framework',
  'Flask': 'Framework',
  'Express': 'Framework',
  'Hono': 'Framework',
  'Elysia': 'Framework',
  'WordPress': 'CMS',
  'jQuery': 'Other',
  
  'SvelteKit': 'Meta Framework',
  'Solid Start': 'Meta Framework',
  'TanStack Start': 'Meta Framework',
  
  'Webpack': 'Build Tools',
  'Vite': 'Build Tools',
  'esbuild': 'Build Tools',
  'Turbopack': 'Build Tools',
  'Parcel': 'Build Tools',
  'Rollup': 'Build Tools',
  
  'Redux': 'State Management',
  'Zustand': 'State Management',
  'MobX': 'State Management',
  'Recoil': 'State Management',
  'Jotai': 'State Management',
  'XState': 'State Management',
  
  'Styled Components': 'CSS Tools',
  'Emotion': 'CSS Tools',
  'CSS Modules': 'CSS Tools',
  'UnoCSS': 'CSS Tools',
  'Panda CSS': 'CSS Tools',
  'Sass': 'CSS Tools',
  'Less': 'CSS Tools',
  
  'Cypress': 'Testing',
  'Playwright': 'Testing',
  'Jest': 'Testing',
  
  'Strapi': 'Headless CMS',
  'Directus': 'Headless CMS',
  'Prismic': 'Headless CMS',
  'Storyblok': 'Headless CMS',
  'DatoCMS': 'Headless CMS',
  'Hygraph': 'Headless CMS',
  
  'Vercel': 'Hosting',
  'Netlify': 'Hosting',
  'AWS': 'Hosting',
  'Cloudflare Pages': 'Hosting',
  'Heroku': 'Hosting',
  'Railway': 'Hosting',
  'GitHub Pages': 'Hosting',
  'Fly.io': 'Hosting',
  'Render': 'Hosting',
  'DigitalOcean': 'Hosting',
  'Linode': 'Hosting',
  'Deno Deploy': 'Hosting',
  'Supabase': 'Hosting',
  
  'Cloudflare': 'CDN',
  'Fastly': 'CDN',
  'AWS CloudFront': 'CDN',
  'Akamai': 'CDN',
  'Bunny CDN': 'CDN',
  'StackPath': 'CDN',
  'KeyCDN': 'CDN',
  'jsDelivr': 'CDN',
  'unpkg': 'CDN',
  'cdnjs': 'CDN',
  
  'Google Analytics': 'Analytics',
  'PostHog': 'Analytics',
  'Mixpanel': 'Analytics',
  'Plausible': 'Analytics',
  'Hotjar': 'Analytics',
  'Amplitude': 'Analytics',
  'Fathom': 'Analytics',
  'Segment': 'Analytics',
  'Heap': 'Analytics',
  'FullStory': 'Analytics',
  'LogRocket': 'Analytics',
  'Clarity': 'Analytics',
  'Matomo': 'Analytics',
  'Pirsch': 'Analytics',
  'Umami': 'Analytics',
  
  'Google Fonts': 'Fonts',
  'Adobe Fonts': 'Fonts',
  'Font Awesome': 'Fonts',
  
  'Stripe': 'Payments',
  'Razorpay': 'Payments',
  'PayPal': 'Payments',
  'Paddle': 'Payments',
  'Lemon Squeezy': 'Payments',
  'Gumroad': 'Payments',
  'Chargebee': 'Payments',
  'Recurly': 'Payments',
  'Square': 'Payments',
  
  'Shopify': 'CMS',
  'Webflow': 'CMS',
  'Squarespace': 'CMS',
  'Ghost': 'CMS',
  'Contentful': 'CMS',
  'Sanity': 'CMS',
  
  'WooCommerce': 'CMS Plugins',
  'Elementor': 'CMS Plugins',
  'Yoast SEO': 'CMS Plugins',
  'Contact Form 7': 'CMS Plugins',
  'ACF': 'CMS Plugins',
  
  'Tailwind CSS': 'UI Library',
  'Bootstrap': 'UI Library',
  'Material UI': 'UI Library',
  'Chakra UI': 'UI Library',
  'shadcn': 'UI Library',
  'Ant Design': 'UI Library',
  
  'Auth0': 'Auth',
  'Clerk': 'Auth',
  'Kinde': 'Auth',
  'Stytch': 'Auth',
  'WorkOS': 'Auth',
  'NextAuth': 'Auth',
  'Lucia': 'Auth',
  
  'PlanetScale': 'Database',
  'Neon': 'Database',
  'MongoDB': 'Database',
  'Prisma': 'Database',
  'Drizzle': 'Database',
  
  'Datadog': 'Monitoring',
  'New Relic': 'Monitoring',
  'Bugsnag': 'Monitoring',
  'Rollbar': 'Monitoring',
  
  'Mailchimp': 'Email',
  'SendGrid': 'Email',
  'ConvertKit': 'Email',
  'Resend': 'Email',
  'Mailgun': 'Email',
  'Beehiiv': 'Email',
  
  'Optimizely': 'A/B Testing',
  'LaunchDarkly': 'A/B Testing',
  'Split': 'A/B Testing',
  'VWO': 'A/B Testing',
  'Google Optimize': 'A/B Testing',
  
  'Intercom': 'Chat/Support',
  'Crisp': 'Chat/Support',
  'Drift': 'Chat/Support',
  'Zendesk': 'Chat/Support',
  'Freshdesk': 'Chat/Support',
  'HubSpot': 'Chat/Support',
  'Olark': 'Chat/Support',
  'Tawk.to': 'Chat/Support',
  'LiveChat': 'Chat/Support',
  
  'Wistia': 'Video',
  'Mux': 'Video',
  'Loom': 'Video',
  'Cloudinary': 'Video',
  'Vimeo': 'Video',
  'YouTube': 'Video',
  
  'Algolia': 'Search',
  'Typesense': 'Search',
  'Meilisearch': 'Search',
  'ElasticSearch': 'Search',
  
  'Twitter': 'Social',
  'Facebook SDK': 'Social',
  'LinkedIn Insight': 'Social',
  'Pinterest': 'Social',
  'TikTok Pixel': 'Social',
  
  'CookieBot': 'Consent/Privacy',
  'OneTrust': 'Consent/Privacy',
  'Termly': 'Consent/Privacy',
  'CookieYes': 'Consent/Privacy',
  
  'Lighthouse': 'Performance',
  'Web Vitals': 'Performance',
  'Partytown': 'Performance',
  
  'GraphQL': 'Other',
  'Socket.io': 'Other',
  'Sentry': 'Other',
  'Firebase': 'Other',
};

// Version extraction patterns
function extractVersion(html: string, techName: string): string | undefined {
  const patterns: { [key: string]: RegExp[] } = {
    'React': [
      /react@([\d.]+)/i,
      /react[\/.-](\d+\.\d+\.\d+)/i,
      /"react"[^\}]*"version"[:\s]+"([\d.]+)"/i,
    ],
    'Vue': [
      /vue@([\d.]+)/i,
      /vue[\/.-](\d+\.\d+\.\d+)/i,
      /"vue"[^\}]*"version"[:\s]+"([\d.]+)"/i,
    ],
    'Next.js': [
      /next@([\d.]+)/i,
      /next\/([\d]+\.[\d]+\.[\d]+)/i,
      /_next\/static\/([\d]+\.[\d]+\.[\d]+)/i,
    ],
    'Angular': [
      /ng-version="([\d.]+)"/i,
      /angular@([\d.]+)/i,
    ],
    'jQuery': [
      /jquery[\/.-](\d+\.\d+\.\d+)/i,
      /jquery@([\d.]+)/i,
    ],
    'WordPress': [
      /<meta name="generator" content="WordPress\s+([\d.]+)"/i,
      /wp-includes\/js\/[^\/]+\.js\?ver=([\d.]+)/i,
    ],
    'Bootstrap': [
      /bootstrap@([\d.]+)/i,
      /bootstrap[\/.-](\d+\.\d+\.\d+)/i,
    ],
    'Gatsby': [
      /gatsby@([\d.]+)/i,
      /<!--\s*Built with Gatsby\s+([\d.]+)/i,
    ],
    'Webpack': [
      /webpack@([\d.]+)/i,
      /webpackJsonp\[.*\].*"version":"([\d.]+)"/i,
    ],
    'Vite': [
      /vite@([\d.]+)/i,
      /@vite\/([\d.]+)/i,
    ],
  };

  const techPatterns = patterns[techName];
  if (!techPatterns) return undefined;

  for (const pattern of techPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return undefined;
}

function detectTechnologies(html: string, headers: Record<string, string>): DetectionResult['categories'] {
  const detected: { [tech: string]: { matches: number; version?: string } } = {};
  const allContent = html.toLowerCase() + ' ' + Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join(' ').toLowerCase();
  
  // Check each technology pattern
  for (const [tech, patterns] of Object.entries(detectionPatterns)) {
    let matches = 0;
    for (const pattern of patterns) {
      if (pattern.test(allContent)) {
        matches++;
      }
    }
    if (matches > 0) {
      detected[tech] = { matches };
      
      // Try to extract version
      const version = extractVersion(html + ' ' + JSON.stringify(headers), tech);
      if (version) {
        detected[tech].version = version;
      }
    }
  }
  
  // Group by category with confidence
  const categories: { [category: string]: Technology[] } = {};
  
  for (const [tech, data] of Object.entries(detected)) {
    const category = categoryMap[tech] || 'Other';
    const confidence: Technology['confidence'] = 
      data.matches >= 3 ? 'high' : 
      data.matches >= 2 ? 'medium' : 
      'low';
    
    if (!categories[category]) {
      categories[category] = [];
    }
    
    const technology: Technology = {
      name: tech,
      confidence,
    };
    
    if (data.version) {
      technology.version = data.version;
    }
    
    categories[category].push(technology);
  }
  
  // Sort technologies within each category by confidence
  for (const category in categories) {
    categories[category].sort((a, b) => {
      const confOrder = { high: 3, medium: 2, low: 1 };
      return confOrder[b.confidence] - confOrder[a.confidence];
    });
  }
  
  return categories;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Fetch the website
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      redirect: 'follow',
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch website: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const html = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    // Detect technologies
    const categories = detectTechnologies(html, headers);
    
    const result: DetectionResult = {
      categories,
      url: targetUrl.toString(),
      scannedAt: new Date().toISOString()
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan website. Please check the URL and try again.' },
      { status: 500 }
    );
  }
}

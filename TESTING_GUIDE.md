# Testing Guide for SEO Pages

## Quick Test URLs

### Stack Pages
```
/stack/stripe.com
/stack/vercel.com
/stack/linear.app
/stack/notion.so
/stack/github.com
```

### Comparison Pages
```
/compare/vercel-vs-netlify
/compare/react-vs-vue
/compare/tailwind-vs-bootstrap
/compare/next-vs-nuxt
/compare/postgresql-vs-mysql
```

### Alternative Pages
```
/alternatives/heroku
/alternatives/wordpress
/alternatives/google-analytics
/alternatives/firebase
/alternatives/bootstrap
```

## Testing Checklist

### ✅ Functionality Tests
- [ ] All pages load without errors
- [ ] Internal links work correctly
- [ ] "Scan any website →" CTA links to homepage
- [ ] Stack pages link to related comparisons
- [ ] Comparison pages link to stack pages
- [ ] Alternative pages link to other alternatives

### ✅ SEO Tests
- [ ] View page source and verify:
  - [ ] Proper `<title>` tag
  - [ ] Meta description present
  - [ ] Open Graph tags present
  - [ ] Twitter Card tags present
  - [ ] Canonical URL set
  - [ ] JSON-LD structured data present and valid
- [ ] Check `/sitemap.xml` includes all new pages
- [ ] Verify heading hierarchy (h1 → h2 → h3)

### ✅ Visual Tests
- [ ] Responsive design works on mobile
- [ ] Dark theme consistent across pages
- [ ] Glass-morphism effects render correctly
- [ ] Hover states work on cards
- [ ] Gradient text animations work
- [ ] Icons render properly

### ✅ Performance Tests
- [ ] Pages load quickly (static generation)
- [ ] No console errors
- [ ] Images load properly
- [ ] Smooth scroll behavior

## Running Tests

### Local Development
```bash
cd /Users/rushirajjadeja/Desktop/stackradar
npm run dev
```

Then visit:
- http://localhost:3000/stack/stripe.com
- http://localhost:3000/compare/vercel-vs-netlify
- http://localhost:3000/alternatives/heroku

### Production Build (already tested)
```bash
npm run build
npm start
```

### Validate Structured Data
1. Visit: https://search.google.com/test/rich-results
2. Enter page URL or paste HTML
3. Verify TechArticle schema is valid

### Check Sitemap
```bash
curl http://localhost:3000/sitemap.xml
```

Should show 47 URLs.

## Common Issues & Fixes

### Issue: Page not found (404)
**Fix:** Run `npm run build` to regenerate static params

### Issue: Import error for data file
**Fix:** Check path alias in `tsconfig.json` - should have `"@/*": ["./src/*"]`

### Issue: Styles not applying
**Fix:** Check `globals.css` is imported in layout.tsx

### Issue: Internal links broken
**Fix:** Verify domain/slug names match data in `seo-pages.ts`

## Next Steps After Testing

1. **Fix any issues** found during testing
2. **Deploy to Vercel/production**
3. **Submit sitemap** to Google Search Console
4. **Monitor** Core Web Vitals
5. **Track** rankings for target keywords

## Sample Test Script

```javascript
// Test internal linking
const pages = [
  '/stack/stripe.com',
  '/compare/vercel-vs-netlify',
  '/alternatives/heroku'
];

pages.forEach(async (page) => {
  const response = await fetch(`http://localhost:3000${page}`);
  console.log(`${page}: ${response.status}`);
});
```

## Lighthouse Audit
Run for SEO, Accessibility, Performance:
```bash
npm install -g lighthouse
lighthouse http://localhost:3000/stack/stripe.com --only-categories=seo,accessibility,performance
```

Target scores:
- **SEO:** 95+
- **Accessibility:** 90+
- **Performance:** 90+ (for static pages)

# StackRadar Pro Waitlist Setup Guide

## 🎯 What's Been Added

### 1. **Waitlist Section**
- Beautiful glassmorphism card design
- Email capture form with validation
- Success state with confirmation message
- Real-time waitlist count from Supabase
- Automatically shows when no scan results are present

### 2. **Supabase Backend**
- API route at `/api/waitlist/route.ts`
- GET endpoint: Returns waitlist count
- POST endpoint: Saves email to database
- Email validation and duplicate handling
- Notification logging (ready for email service integration)

### 3. **Affiliate Alternatives**
- Subtle suggestions under detected technologies:
  - WordPress → "Try Webflow →"
  - Heroku → "Try Vercel →"
  - Google Analytics → "Try Plausible →"
  - Bootstrap → "Try Tailwind CSS →"
- Special card for missing analytics → "Add Plausible Analytics"
- Very subtle styling - small text, muted colors

## 📦 Setup Instructions

### Step 1: Get Your Supabase Anon Key

1. Go to your Supabase project: https://rrnzuefbxnfsrfuictpd.supabase.co
2. Click on "Settings" → "API"
3. Copy the `anon` `public` key

### Step 2: Update Environment Variables

Edit `.env.local` and replace `your_anon_key_here` with your actual key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rrnzuefbxnfsrfuictpd.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
NOTIFY_EMAIL=email@rushiraj.me
```

### Step 3: Create the Supabase Table

1. Go to your Supabase project SQL Editor
2. Copy the contents of `supabase-setup.sql`
3. Paste and run it

Or run this SQL directly:

```sql
-- Create the waitlist table
CREATE TABLE IF NOT EXISTS stackradar_waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stackradar_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON stackradar_waitlist 
FOR INSERT WITH CHECK (true);

-- Allow anonymous count
CREATE POLICY "Allow anonymous count" ON stackradar_waitlist 
FOR SELECT USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stackradar_waitlist_email ON stackradar_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_stackradar_waitlist_created_at ON stackradar_waitlist(created_at DESC);
```

### Step 4: Test It Out

1. The dev server should already be running
2. Visit http://localhost:3000 (or 3001)
3. Scroll down to see the "StackRadar Pro — Coming Soon" section
4. Try joining the waitlist with your email
5. Run a scan to see the affiliate alternatives

## 🎨 Design Features

- **Dark Theme**: Matches existing #0a0a0b background and #141416 cards
- **Glassmorphism**: Premium frosted glass effect with backdrop blur
- **Animations**: Framer Motion entrance animations
- **Icons**: Lucide React icons (Mail, ArrowRight, Check, Sparkles)
- **Responsive**: Works on mobile and desktop
- **Non-intrusive**: Affiliate links are very subtle, not spammy

## 📧 Email Notifications

Currently, the API logs when someone joins the waitlist:

```
[WAITLIST NOTIFICATION] New signup: user@example.com
[WAITLIST NOTIFICATION] Send notification to: email@rushiraj.me
```

### To Add Actual Email Sending:

1. Install an email service (Resend, SendGrid, etc.):
   ```bash
   npm install resend
   ```

2. Add API key to `.env.local`:
   ```env
   RESEND_API_KEY=your_resend_key
   ```

3. Uncomment and update the email code in `/api/waitlist/route.ts`

## 🧪 Testing the Waitlist

1. **Join the waitlist**: Enter an email and submit
2. **Check Supabase**: Go to Table Editor → `stackradar_waitlist`
3. **Try duplicate**: Submit the same email again (should show "You're already on the list!")
4. **Check count**: Refresh the page - the count should update

## 🔗 Affiliate Links

The following technologies will show alternative suggestions:

| Technology | Suggestion | URL |
|-----------|------------|-----|
| WordPress | Try Webflow → | https://webflow.com |
| Heroku | Try Vercel → | https://vercel.com |
| Google Analytics | Try Plausible → | https://plausible.io |
| Bootstrap | Try Tailwind CSS → | https://tailwindcss.com |
| (No Analytics) | Add Plausible Analytics | https://plausible.io |

These appear as very subtle links under the tech badges - small, muted color, not intrusive.

## ✅ What's Working

- ✅ Waitlist section with premium design
- ✅ Email capture and validation
- ✅ Supabase integration (needs API key)
- ✅ Waitlist count display
- ✅ Duplicate email handling
- ✅ Success state animation
- ✅ Affiliate alternative links
- ✅ Special card for missing analytics
- ✅ Mobile responsive
- ✅ Dark theme integration

## 🚀 Next Steps (Optional)

1. **Email Service**: Integrate Resend or SendGrid for actual email notifications
2. **Admin Dashboard**: View all waitlist emails in a dashboard
3. **Export**: Add ability to export waitlist as CSV
4. **More Affiliates**: Add more technology alternatives
5. **A/B Testing**: Test different waitlist copy/designs
6. **Launch Email**: Send notification when Pro launches

## 📝 Files Changed/Created

- ✅ `src/app/api/waitlist/route.ts` - API endpoint
- ✅ `src/app/components/WaitlistSection.tsx` - Waitlist UI component
- ✅ `src/app/page.tsx` - Added waitlist section and affiliate links
- ✅ `src/app/globals.css` - Added glass-premium style
- ✅ `.env.local` - Environment variables (needs your Supabase key)
- ✅ `supabase-setup.sql` - Database setup SQL
- ✅ `package.json` - Added @supabase/supabase-js

---

Built by your AI agent 🤖 | Ready to capture those Pro signups! 🚀

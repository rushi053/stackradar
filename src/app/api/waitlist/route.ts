import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const notifyEmail = process.env.NOTIFY_EMAIL;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * SETUP INSTRUCTIONS:
 * 
 * Run this SQL in your Supabase SQL editor to create the table:
 * 
 * CREATE TABLE stackradar_waitlist (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   email text UNIQUE NOT NULL,
 *   source text DEFAULT 'website',
 *   created_at timestamptz DEFAULT now()
 * );
 * 
 * ALTER TABLE stackradar_waitlist ENABLE ROW LEVEL SECURITY;
 * 
 * CREATE POLICY "Allow anonymous inserts" ON stackradar_waitlist 
 * FOR INSERT WITH CHECK (true);
 * 
 * CREATE POLICY "Allow anonymous count" ON stackradar_waitlist 
 * FOR SELECT USING (true);
 */

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET: Return waitlist count
export async function GET() {
  try {
    const { count, error } = await supabase
      .from('stackradar_waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch waitlist count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add email to waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = 'website' } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Insert into Supabase
    const { data, error } = await supabase
      .from('stackradar_waitlist')
      .insert([{ email: normalizedEmail, source }])
      .select();

    // Check for duplicate email
    if (error) {
      if (error.code === '23505') { // Postgres unique violation code
        return NextResponse.json(
          { error: 'already_exists', message: "You're already on the list!" },
          { status: 409 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      );
    }

    // Log notification (for now, just console.log - can integrate Resend/SendGrid later)
    if (notifyEmail) {
      console.log(`[WAITLIST NOTIFICATION] New signup: ${normalizedEmail}`);
      console.log(`[WAITLIST NOTIFICATION] Send notification to: ${notifyEmail}`);
      // TODO: Integrate email service here
      // await sendEmail({
      //   to: notifyEmail,
      //   subject: 'New StackRadar Pro Waitlist Signup',
      //   text: `New signup: ${normalizedEmail}`,
      // });
    }

    return NextResponse.json({
      success: true,
      message: "You're in! We'll notify you when StackRadar Pro launches.",
      data,
    });
  } catch (error) {
    console.error('Error adding to waitlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

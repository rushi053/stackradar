import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const techs = searchParams.get('techs')?.split(',').filter(Boolean) || [];
    const count = searchParams.get('count') || '0';

    if (!url) {
      return new Response('Missing URL parameter', { status: 400 });
    }

    // Create a shortened display URL
    const displayUrl = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0b',
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            padding: '60px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                marginRight: '20px',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#ffffff',
                letterSpacing: '-0.025em',
              }}
            >
              <span>Stack</span>
              <span style={{ color: '#3b82f6' }}>Radar</span>
            </div>
          </div>

          {/* URL */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(20, 20, 22, 0.8)',
              borderRadius: '16px',
              padding: '24px 40px',
              marginBottom: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: '16px' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span
              style={{
                fontSize: '32px',
                color: '#9ca3af',
                fontWeight: '500',
              }}
            >
              {displayUrl}
            </span>
          </div>

          {/* Tech Count Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '50px',
              padding: '16px 32px',
              border: '2px solid rgba(59, 130, 246, 0.4)',
              marginBottom: '40px',
            }}
          >
            <span
              style={{
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#3b82f6',
              }}
            >
              {count} Technologies Detected
            </span>
          </div>

          {/* Tech List (first 6) */}
          {techs.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '16px',
                maxWidth: '900px',
              }}
            >
              {techs.slice(0, 6).map((tech, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(20, 20, 22, 0.6)',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      marginRight: '12px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '24px',
                      color: '#ffffff',
                      fontWeight: '500',
                    }}
                  >
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Footer - Absolute positioned */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              fontSize: '20px',
              color: '#6b7280',
            }}
          >
            Scan any website's tech stack instantly
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

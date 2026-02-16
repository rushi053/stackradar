import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Globe, 
  Calendar, 
  TrendingUp, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  Home,
} from 'lucide-react';
import { stackPages, comparisons, getAllDomains } from '@/data/seo-pages';

const categoryIcons: { [key: string]: string } = {
  'Framework': '⚛️',
  'Meta Framework': '🎯',
  'Hosting': '☁️',
  'CDN': '🌐',
  'Analytics': '📊',
  'Fonts': '🔤',
  'Payments': '💳',
  'CMS': '📝',
  'Auth': '🔐',
  'UI Library': '🎨',
  'Build Tools': '🔨',
  'CSS Tools': '💅',
  'Database': '🗄️',
  'Monitoring': '👁️',
  'Email': '📧',
  'Video': '🎥',
  'Other': '🔧',
};

interface PageProps {
  params: Promise<{
    domain: string;
  }>;
}

export async function generateStaticParams() {
  return getAllDomains().map((domain) => ({
    domain,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params;
  const page = stackPages.find(p => p.domain === domain);
  
  if (!page) {
    return {
      title: 'Stack Not Found | StackRadar',
    };
  }

  const title = `What Tech Stack Does ${page.displayName} Use? | StackRadar`;
  const description = `Complete tech stack breakdown for ${page.displayName} (${page.domain}): ${page.technologies.map(t => t.name).slice(0, 5).join(', ')} and more. Detected ${page.technologies.length} technologies.`;
  const url = `https://stackradar.rushiraj.me/stack/${domain}`;

  return {
    title,
    description,
    keywords: [
      `${page.displayName} tech stack`,
      `${page.displayName} technology`,
      `what does ${page.displayName} use`,
      `${page.displayName} framework`,
      ...page.technologies.slice(0, 5).map(t => `${page.displayName} ${t.name}`),
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: ['/og-default.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function StackPage({ params }: PageProps) {
  const { domain } = await params;
  const page = stackPages.find(p => p.domain === domain);
  
  if (!page) {
    notFound();
  }

  // Group technologies by category
  const techsByCategory: { [key: string]: typeof page.technologies } = {};
  page.technologies.forEach(tech => {
    if (!techsByCategory[tech.category]) {
      techsByCategory[tech.category] = [];
    }
    techsByCategory[tech.category].push(tech);
  });

  // Find related comparisons
  const relatedComparisons = comparisons.filter(c => 
    page.technologies.some(t => 
      c.slug.toLowerCase().includes(t.name.toLowerCase().replace(/\s+/g, '-'))
    )
  ).slice(0, 3);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `What Tech Stack Does ${page.displayName} Use?`,
    description: page.description,
    url: `https://stackradar.rushiraj.me/stack/${domain}`,
    datePublished: '2026-02-15',
    dateModified: '2026-02-15',
    author: {
      '@type': 'Organization',
      name: 'StackRadar',
    },
    about: {
      '@type': 'SoftwareApplication',
      name: page.displayName,
      url: `https://${domain}`,
      applicationCategory: 'WebApplication',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                <Home className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xl font-bold font-mono">
                Stack<span className="text-accent">Radar</span>
              </span>
            </Link>
            
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white font-semibold smooth flex items-center gap-2"
            >
              Scan any website →
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Tech Stack Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              {page.displayName}'s <span className="gradient-text animate-gradient-shift">Tech Stack</span>
            </h1>
            
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              {page.description} · Powered by {page.technologies.length} technologies
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" />
                <a 
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-accent smooth"
                >
                  {domain} ↗
                </a>
              </div>
              {page.founded && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span className="text-secondary">Founded {page.founded}</span>
                </div>
              )}
              {page.monthlyVisitors && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <span className="text-secondary">{page.monthlyVisitors} monthly visitors</span>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack Grid */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-mono">Detected Technologies</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(techsByCategory).map(([category, techs]) => (
                <div key={category} className="glass p-6 rounded-xl card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{categoryIcons[category] || '🔧'}</span>
                    <div>
                      <h3 className="text-lg font-semibold font-mono">{category}</h3>
                      <p className="text-xs text-secondary">{techs.length} {techs.length === 1 ? 'tool' : 'tools'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {techs.map((tech, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{tech.name}</span>
                          {tech.version && (
                            <span className="text-xs text-secondary font-mono bg-background/60 px-2 py-0.5 rounded border border-white/5">
                              v{tech.version}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-secondary/70">{tech.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Comparisons */}
          {relatedComparisons.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-mono">Related Comparisons</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedComparisons.map((comp) => {
                  const tools = comp.slug.split('-vs-');
                  return (
                    <Link
                      key={comp.slug}
                      href={`/compare/${comp.slug}`}
                      className="glass p-6 rounded-xl hover:border-accent/30 smooth group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-accent">{tools[0]}</span>
                        <span className="text-secondary">vs</span>
                        <span className="font-bold text-accentPurple">{tools[1]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-secondary group-hover:text-accent smooth">
                        <span>Compare features</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Similar Sites */}
          {page.relatedTools && page.relatedTools.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-mono">Similar Sites</h2>
              <div className="flex flex-wrap gap-3">
                {page.relatedTools.map((tool) => {
                  const relatedPage = stackPages.find(p => 
                    p.displayName.toLowerCase() === tool.toLowerCase()
                  );
                  
                  if (relatedPage) {
                    return (
                      <Link
                        key={tool}
                        href={`/stack/${relatedPage.domain}`}
                        className="px-4 py-2 glass rounded-lg hover:border-accent/30 smooth flex items-center gap-2 group"
                      >
                        <span className="font-medium">{tool}</span>
                        <ExternalLink className="w-3 h-3 text-secondary group-hover:text-accent smooth" />
                      </Link>
                    );
                  }
                  
                  return (
                    <div
                      key={tool}
                      className="px-4 py-2 glass rounded-lg"
                    >
                      <span className="font-medium text-secondary">{tool}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="glass p-12 rounded-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold">Want to scan your own website?</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Discover what technologies power any website in seconds. Free and instant.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl smooth"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Scan Any Website →</span>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-secondary">
            <p>© 2026 StackRadar · Built by <a href="https://twitter.com/rushirajjj" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">@rushirajjj</a></p>
          </div>
        </footer>
      </div>
    </>
  );
}

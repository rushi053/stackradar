import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Home,
  Sparkles,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { comparisons, getAllComparisons, stackPages } from '@/data/seo-pages';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllComparisons().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = comparisons.find(c => c.slug === slug);
  
  if (!comparison) {
    return {
      title: 'Comparison Not Found | StackRadar',
    };
  }

  const title = `${comparison.tool1.name} vs ${comparison.tool2.name}: Tech Stack Comparison 2026 | StackRadar`;
  const description = `Detailed comparison of ${comparison.tool1.name} and ${comparison.tool2.name}. ${comparison.tool1.description} vs ${comparison.tool2.description}. Market share, pricing, pros & cons.`;
  const url = `https://stackradar.rushiraj.me/compare/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${comparison.tool1.name} vs ${comparison.tool2.name}`,
      `${comparison.tool1.name} ${comparison.tool2.name} comparison`,
      `${comparison.tool1.name} alternative`,
      `${comparison.tool2.name} alternative`,
      `${comparison.tool1.name} or ${comparison.tool2.name}`,
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

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = comparisons.find(c => c.slug === slug);
  
  if (!comparison) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${comparison.tool1.name} vs ${comparison.tool2.name}: Tech Stack Comparison 2026`,
    description: comparison.verdict,
    url: `https://stackradar.rushiraj.me/compare/${slug}`,
    datePublished: '2026-02-15',
    dateModified: '2026-02-15',
    author: {
      '@type': 'Organization',
      name: 'StackRadar',
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
              <span>Tech Stack Comparison</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="gradient-text animate-gradient-shift">{comparison.tool1.name}</span>
              {' '}vs{' '}
              <span className="text-accentPurple">{comparison.tool2.name}</span>
            </h1>
            
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Complete comparison for 2026: features, pricing, market share, and which one to choose
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-xl border-accent/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-accent">{comparison.tool1.name}</h2>
              </div>
              <p className="text-secondary mb-4">{comparison.tool1.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-secondary" />
                  <span className="text-secondary">{comparison.tool1.pricing}</span>
                </div>
                {comparison.tool1.marketShare && (
                  <div className="flex items-center gap-2">
                    <span className="text-secondary">{comparison.tool1.marketShare} market share</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass p-8 rounded-xl border-accentPurple/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-accentPurple/10 border border-accentPurple/20">
                  <TrendingUp className="w-6 h-6 text-accentPurple" />
                </div>
                <h2 className="text-2xl font-bold text-accentPurple">{comparison.tool2.name}</h2>
              </div>
              <p className="text-secondary mb-4">{comparison.tool2.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-secondary" />
                  <span className="text-secondary">{comparison.tool2.pricing}</span>
                </div>
                {comparison.tool2.marketShare && (
                  <div className="flex items-center gap-2">
                    <span className="text-secondary">{comparison.tool2.marketShare} market share</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-mono">{comparison.tool1.name}</h3>
              
              {/* Pros */}
              <div className="glass p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-accentGreen">
                  <CheckCircle2 className="w-5 h-5" />
                  Pros
                </h4>
                <ul className="space-y-3">
                  {comparison.tool1.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accentGreen flex-shrink-0 mt-0.5" />
                      <span className="text-secondary">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="glass p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  Cons
                </h4>
                <ul className="space-y-3">
                  {comparison.tool1.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Sites */}
              {comparison.tool1.popularSites && comparison.tool1.popularSites.length > 0 && (
                <div className="glass p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent" />
                    Popular Sites Using {comparison.tool1.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comparison.tool1.popularSites.map((site, idx) => {
                      const stackPage = stackPages.find(p => 
                        p.displayName.toLowerCase() === site.toLowerCase()
                      );
                      
                      if (stackPage) {
                        return (
                          <Link
                            key={idx}
                            href={`/stack/${stackPage.domain}`}
                            className="px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-lg text-sm font-medium hover:border-accent/50 smooth"
                          >
                            {site}
                          </Link>
                        );
                      }
                      
                      return (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-background/40 border border-white/5 rounded-lg text-sm font-medium text-secondary"
                        >
                          {site}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Affiliate Link */}
              {comparison.affiliateLinks?.tool1 && (
                <a
                  href={comparison.affiliateLinks.tool1}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="block glass p-6 rounded-xl hover:border-accent/30 smooth group text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-accent font-semibold">
                    <span>Try {comparison.tool1.name}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 smooth" />
                  </div>
                </a>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-mono">{comparison.tool2.name}</h3>
              
              {/* Pros */}
              <div className="glass p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-accentGreen">
                  <CheckCircle2 className="w-5 h-5" />
                  Pros
                </h4>
                <ul className="space-y-3">
                  {comparison.tool2.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-accentGreen flex-shrink-0 mt-0.5" />
                      <span className="text-secondary">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="glass p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  Cons
                </h4>
                <ul className="space-y-3">
                  {comparison.tool2.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Sites */}
              {comparison.tool2.popularSites && comparison.tool2.popularSites.length > 0 && (
                <div className="glass p-6 rounded-xl">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accentPurple" />
                    Popular Sites Using {comparison.tool2.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {comparison.tool2.popularSites.map((site, idx) => {
                      const stackPage = stackPages.find(p => 
                        p.displayName.toLowerCase() === site.toLowerCase()
                      );
                      
                      if (stackPage) {
                        return (
                          <Link
                            key={idx}
                            href={`/stack/${stackPage.domain}`}
                            className="px-3 py-1.5 bg-accentPurple/10 border border-accentPurple/30 rounded-lg text-sm font-medium hover:border-accentPurple/50 smooth"
                          >
                            {site}
                          </Link>
                        );
                      }
                      
                      return (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-background/40 border border-white/5 rounded-lg text-sm font-medium text-secondary"
                        >
                          {site}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Affiliate Link */}
              {comparison.affiliateLinks?.tool2 && (
                <a
                  href={comparison.affiliateLinks.tool2}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="block glass p-6 rounded-xl hover:border-accentPurple/30 smooth group text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-accentPurple font-semibold">
                    <span>Try {comparison.tool2.name}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 smooth" />
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Verdict */}
          <div className="glass p-12 rounded-2xl text-center space-y-6 border-accent/30">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accentGreen/10 border border-accentGreen/20 text-accentGreen text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Our Verdict</span>
            </div>
            <h2 className="text-3xl font-bold">Which Should You Choose?</h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              {comparison.verdict}
            </p>
          </div>

          {/* CTA Section */}
          <div className="glass p-12 rounded-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold">See what real websites use</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Scan any website to discover their full tech stack. Make informed decisions based on what industry leaders use.
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

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Home,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { alternatives, getAllAlternatives } from '@/data/seo-pages';

interface PageProps {
  params: Promise<{
    tool: string;
  }>;
}

export async function generateStaticParams() {
  return getAllAlternatives().map((tool) => ({
    tool,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool } = await params;
  const alternative = alternatives.find(a => a.tool === tool);
  
  if (!alternative) {
    return {
      title: 'Alternatives Not Found | StackRadar',
    };
  }

  const title = `Best ${alternative.displayName} Alternatives 2026 | StackRadar`;
  const description = `Top ${alternative.alternatives.length} alternatives to ${alternative.displayName} for ${alternative.category}. Compare features, pricing, and find the perfect ${alternative.displayName} replacement for your needs.`;
  const url = `https://stackradar.rushiraj.me/alternatives/${tool}`;

  return {
    title,
    description,
    keywords: [
      `${alternative.displayName} alternatives`,
      `${alternative.displayName} replacement`,
      `better than ${alternative.displayName}`,
      `${alternative.displayName} competitors`,
      ...alternative.alternatives.slice(0, 5).map(a => a.name),
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

export default async function AlternativesPage({ params }: PageProps) {
  const { tool } = await params;
  const alternative = alternatives.find(a => a.tool === tool);
  
  if (!alternative) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `Best ${alternative.displayName} Alternatives 2026`,
    description: alternative.description,
    url: `https://stackradar.rushiraj.me/alternatives/${tool}`,
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
              <span>{alternative.category} Alternatives</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Best <span className="gradient-text animate-gradient-shift">{alternative.displayName}</span> Alternatives
            </h1>
            
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              {alternative.description} · Compare {alternative.alternatives.length} top alternatives for 2026
            </p>
          </div>

          {/* Alternatives Grid */}
          <div className="space-y-8">
            {alternative.alternatives.map((alt, idx) => (
              <div 
                key={idx}
                className="glass p-8 rounded-2xl card-hover"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-3xl font-bold">{alt.name}</h2>
                          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-bold">
                            #{idx + 1}
                          </span>
                        </div>
                        <p className="text-secondary text-lg">{alt.description}</p>
                      </div>
                    </div>

                    {/* Pros */}
                    <div>
                      <h3 className="text-sm font-semibold text-secondary/70 uppercase tracking-wide mb-3">
                        Key Features
                      </h3>
                      <ul className="space-y-2">
                        {alt.pros.map((pro, proIdx) => (
                          <li key={proIdx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-accentGreen flex-shrink-0 mt-0.5" />
                            <span className="text-secondary">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Best For */}
                    <div className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-accent mb-1">Best For</h4>
                        <p className="text-secondary">{alt.bestFor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:w-64 space-y-4">
                    {/* Pricing */}
                    <div className="glass p-6 rounded-xl">
                      <div className="flex items-center gap-2 text-secondary mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Pricing</span>
                      </div>
                      <p className="font-semibold">{alt.pricing}</p>
                    </div>

                    {/* CTA Button */}
                    {alt.affiliateUrl ? (
                      <a
                        href={alt.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="block w-full px-6 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl smooth text-center group"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span>Try {alt.name}</span>
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 smooth" />
                        </div>
                      </a>
                    ) : (
                      <div className="w-full px-6 py-4 bg-background/40 border border-white/10 rounded-xl text-center">
                        <span className="font-medium text-secondary">{alt.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="glass p-8 rounded-2xl">
            <h2 className="text-3xl font-bold font-mono mb-6">Quick Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 font-semibold">Alternative</th>
                    <th className="text-left py-4 px-4 font-semibold">Best For</th>
                    <th className="text-left py-4 px-4 font-semibold">Pricing</th>
                  </tr>
                </thead>
                <tbody>
                  {alternative.alternatives.map((alt, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 smooth">
                      <td className="py-4 px-4">
                        <span className="font-medium">{alt.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-secondary text-sm">{alt.bestFor}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-secondary text-sm">{alt.pricing}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Choose Section */}
          <div className="glass p-12 rounded-2xl space-y-6">
            <h2 className="text-3xl font-bold font-mono">How to Choose?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold">Consider Your Budget</h3>
                <p className="text-secondary">
                  Compare pricing tiers and see what features you get at each level. Some alternatives offer free tiers perfect for getting started.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold">Match Your Use Case</h3>
                <p className="text-secondary">
                  Each alternative excels at different things. Pick the one that aligns best with your specific needs and workflow.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-semibold">Try Before Committing</h3>
                <p className="text-secondary">
                  Most tools offer free trials or tiers. Test a few alternatives to find which one fits your team's workflow best.
                </p>
              </div>
            </div>
          </div>

          {/* Related Alternatives */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold font-mono">More Alternatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alternatives
                .filter(a => a.tool !== tool)
                .slice(0, 3)
                .map((alt) => (
                  <Link
                    key={alt.tool}
                    href={`/alternatives/${alt.tool}`}
                    className="glass p-6 rounded-xl hover:border-accent/30 smooth group"
                  >
                    <h3 className="font-bold text-lg mb-2">{alt.displayName} Alternatives</h3>
                    <p className="text-sm text-secondary mb-4">{alt.description}</p>
                    <div className="flex items-center gap-2 text-accent group-hover:gap-3 smooth">
                      <span className="text-sm font-medium">View alternatives</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="glass p-12 rounded-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold">See what real websites use</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Discover which technologies power your favorite websites. Make informed decisions based on real-world usage.
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

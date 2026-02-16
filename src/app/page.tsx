'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Radar,
  Server,
  Globe,
  BarChart3,
  Type,
  CreditCard,
  FileText,
  Shield,
  Palette,
  Wrench,
  Search,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  Hammer,
  Database,
  Mail,
  MessageCircle,
  Video,
  Cookie,
  FlaskConical,
  Zap,
  Package,
  Box,
  Workflow,
  Eye,
  Cloud,
  Download,
  GitCompare,
  Clock,
  Trash2,
  ArrowLeftRight,
  ArrowRight,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { WaitlistSection } from './components/WaitlistSection';

interface Technology {
  name: string;
  confidence: 'high' | 'medium' | 'low';
  version?: string;
}

interface ScanResult {
  categories: {
    [category: string]: Technology[];
  };
  url: string;
  scannedAt: string;
}

interface HistoryItem {
  url: string;
  techCount: number;
  timestamp: number;
  result: ScanResult;
}

type LoadingPhase = 'connecting' | 'analyzing' | 'detecting' | 'complete';
type Mode = 'scan' | 'compare';

const categoryIcons: { [key: string]: React.ElementType } = {
  'Framework': Radar,
  'Meta Framework': Workflow,
  'Hosting': Server,
  'CDN': Globe,
  'Analytics': BarChart3,
  'Fonts': Type,
  'Payments': CreditCard,
  'CMS': FileText,
  'CMS Plugins': Package,
  'Auth': Shield,
  'UI Library': Palette,
  'Build Tools': Hammer,
  'State Management': Box,
  'CSS Tools': Palette,
  'Testing': FlaskConical,
  'Headless CMS': FileText,
  'Database': Database,
  'Monitoring': Eye,
  'Email': Mail,
  'A/B Testing': FlaskConical,
  'Search': Search,
  'Chat/Support': MessageCircle,
  'Video': Video,
  'Social': Share2,
  'Consent/Privacy': Cookie,
  'Performance': Zap,
  'Other': Wrench,
};

// Affiliate alternatives mapping (subtle suggestions)
// Note: URLs with #affiliate-[name] are placeholders — replace with actual affiliate links after signup
const affiliateAlternatives: { [key: string]: { text: string; url: string } } = {
  // Hosting alternatives
  'Heroku': { text: 'Try Vercel', url: '#affiliate-vercel' },
  'AWS': { text: 'Try DigitalOcean', url: '#affiliate-digitalocean' },
  'GitHub Pages': { text: 'Try Netlify', url: '#affiliate-netlify' },
  'Render': { text: 'Try Railway', url: '#affiliate-railway' },
  
  // Analytics alternatives
  'Google Analytics': { text: 'Try Plausible Analytics', url: '#affiliate-plausible' },
  'Hotjar': { text: 'Try Plausible Analytics', url: '#affiliate-plausible' },
  'Mixpanel': { text: 'Try PostHog', url: '#affiliate-posthog' },
  
  // CMS alternatives
  'WordPress': { text: 'Try Webflow', url: '#affiliate-webflow' },
  'Squarespace': { text: 'Try Webflow', url: '#affiliate-webflow' },
  
  // UI Library alternatives
  'Bootstrap': { text: 'Try Tailwind CSS', url: 'https://tailwindcss.com' },
  'Material UI': { text: 'Try Tailwind CSS', url: 'https://tailwindcss.com' },
  
  // CDN alternatives
  'AWS CloudFront': { text: 'Try Cloudflare', url: '#affiliate-cloudflare' },
  'Fastly': { text: 'Try Cloudflare', url: '#affiliate-cloudflare' },
  
  // Monitoring alternatives
  'New Relic': { text: 'Try Datadog', url: '#affiliate-datadog' },
  'Bugsnag': { text: 'Try Sentry', url: '#affiliate-sentry' },
  
  // Payment alternatives
  'PayPal': { text: 'Try Stripe', url: 'https://stripe.com' }, // Note: Stripe has no affiliate program
  
  // Database alternatives
  'MongoDB': { text: 'Try Supabase', url: '#affiliate-supabase' },
  'PlanetScale': { text: 'Try Neon', url: '#affiliate-neon' },
};

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Toast Component
function Toast({ 
  message, 
  type = 'success', 
  onClose 
}: { 
  message: string; 
  type?: 'success' | 'error'; 
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border ${
        type === 'success'
          ? 'bg-accentGreen/20 border-accentGreen/30 text-accentGreen'
          : 'bg-red-500/20 border-red-500/30 text-red-400'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <p className="font-medium">{message}</p>
    </motion.div>
  );
}

// Confidence Badge Component
function ConfidenceBadge({ confidence }: { confidence: Technology['confidence'] }) {
  const config = {
    high: {
      label: 'High',
      color: 'bg-accentGreen/20 text-accentGreen border-accentGreen/30',
    },
    medium: {
      label: 'Medium',
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    },
    low: {
      label: 'Low',
      color: 'bg-secondary/20 text-secondary border-secondary/30',
    },
  };

  const { label, color } = config[confidence];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {label}
    </motion.div>
  );
}

// Tech Badge Component
function TechBadge({ name, confidence, version }: Technology) {
  const alternative = affiliateAlternatives[name];
  
  return (
    <motion.div variants={itemVariants} className="space-y-1">
      <div className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-white/5 hover:border-accent/30 smooth group">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-accent/60 flex-shrink-0 group-hover:text-accent smooth" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{name}</span>
            {version && (
              <span className="text-xs text-secondary font-mono bg-background/60 px-2 py-0.5 rounded border border-white/5">
                v{version}
              </span>
            )}
          </div>
        </div>
        <ConfidenceBadge confidence={confidence} />
      </div>
      
      {/* Subtle affiliate alternative */}
      {alternative && (
        <motion.a
          href={alternative.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 px-3 text-[10px] text-secondary/60 hover:text-accent/80 smooth"
        >
          <ArrowRight className="w-2.5 h-2.5" />
          <span>{alternative.text} →</span>
        </motion.a>
      )}
    </motion.div>
  );
}

// Loading State Component
function LoadingState({ phase }: { phase: LoadingPhase }) {
  const phases = [
    { key: 'connecting' as LoadingPhase, label: 'Connecting...', icon: Globe },
    { key: 'analyzing' as LoadingPhase, label: 'Analyzing headers...', icon: Search },
    { key: 'detecting' as LoadingPhase, label: 'Detecting technologies...', icon: Radar },
  ];

  const currentPhaseIndex = phases.findIndex(p => p.key === phase);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-md mx-auto"
    >
      <div className="glass p-8 rounded-2xl text-center space-y-6">
        {/* Radar Animation */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-accent/20" />
          <div className="absolute inset-2 rounded-full border-2 border-accent/30" />
          <div className="absolute inset-4 rounded-full border-2 border-accent/40" />
          
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-accent/40 to-transparent"
            style={{ transformOrigin: 'center' }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="absolute top-1/2 left-1/2 w-1 h-12 -mt-12 -ml-0.5 bg-accent blur-sm" />
          </motion.div>
          
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Radar className="w-8 h-8 text-accent" />
          </motion.div>
        </div>

        {/* Phase Indicators */}
        <div className="space-y-3">
          {phases.map((p, index) => {
            const Icon = p.icon;
            const isActive = index === currentPhaseIndex;
            const isComplete = index < currentPhaseIndex;

            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 text-sm ${
                  isActive
                    ? 'text-accent font-medium'
                    : isComplete
                    ? 'text-accentGreen'
                    : 'text-secondary/50'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`} />
                )}
                <span>{p.label}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-accentPurple to-accent rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentPhaseIndex + 1) / phases.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Result Card Component
function ResultCard({ 
  category, 
  technologies, 
  index 
}: { 
  category: string; 
  technologies: Technology[]; 
  index: number;
}) {
  const Icon = categoryIcons[category] || Wrench;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      className="glass p-6 rounded-xl card-hover group"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 group-hover:border-accent/40 smooth group-hover:shadow-glow-sm">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold font-mono mb-1">{category}</h3>
          <p className="text-xs text-secondary">
            {technologies.length} {technologies.length === 1 ? 'technology' : 'technologies'}
          </p>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {technologies.map((tech, idx) => (
          <TechBadge key={idx} {...tech} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Compare Result Component
function CompareResults({ resultA, resultB }: { resultA: ScanResult; resultB: ScanResult }) {
  // Get all unique technologies from both results
  const allTechsA = new Set<string>();
  const allTechsB = new Set<string>();
  
  Object.values(resultA.categories).forEach(techs => 
    techs.forEach(t => allTechsA.add(t.name))
  );
  Object.values(resultB.categories).forEach(techs => 
    techs.forEach(t => allTechsB.add(t.name))
  );
  
  const sharedTechs = [...allTechsA].filter(t => allTechsB.has(t));
  const uniqueToA = [...allTechsA].filter(t => !allTechsB.has(t));
  const uniqueToB = [...allTechsB].filter(t => !allTechsA.has(t));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold font-mono">Comparison Results</h2>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span>{allTechsA.size} technologies</span>
          </div>
          <ArrowLeftRight className="w-4 h-4 text-secondary" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accentPurple" />
            <span>{allTechsB.size} technologies</span>
          </div>
        </div>
      </div>

      {/* Shared Technologies */}
      {sharedTechs.length > 0 && (
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accentGreen" />
            Shared Technologies ({sharedTechs.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {sharedTechs.map((tech, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-accentGreen/10 border border-accentGreen/30 rounded-lg text-sm font-medium text-accentGreen"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site A */}
        <div className="glass p-6 rounded-2xl border-accent/30">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-accent" />
            <div>
              <h3 className="font-bold text-accent">{resultA.url}</h3>
              <p className="text-xs text-secondary">{allTechsA.size} technologies</p>
            </div>
          </div>
          {uniqueToA.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-secondary mb-2">Unique to this site:</h4>
              <div className="space-y-2">
                {uniqueToA.map((tech, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 bg-background/40 border border-white/5 rounded-lg text-sm"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Site B */}
        <div className="glass p-6 rounded-2xl border-accentPurple/30">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-accentPurple" />
            <div>
              <h3 className="font-bold text-accentPurple">{resultB.url}</h3>
              <p className="text-xs text-secondary">{allTechsB.size} technologies</p>
            </div>
          </div>
          {uniqueToB.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-secondary mb-2">Unique to this site:</h4>
              <div className="space-y-2">
                {uniqueToB.map((tech, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-2 bg-background/40 border border-white/5 rounded-lg text-sm"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<Mode>('scan');
  const [url, setUrl] = useState('');
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('connecting');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [compareResultA, setCompareResultA] = useState<ScanResult | null>(null);
  const [compareResultB, setCompareResultB] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stackradar-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // Save to history
  const saveToHistory = (result: ScanResult) => {
    const techCount = Object.values(result.categories).reduce((acc, techs) => acc + techs.length, 0);
    const newItem: HistoryItem = {
      url: result.url,
      techCount,
      timestamp: Date.now(),
      result,
    };

    const newHistory = [newItem, ...history.filter(h => h.url !== result.url)].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('stackradar-history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('stackradar-history');
    setToast({ message: 'History cleared', type: 'success' });
  };

  const scanUrl = async (targetUrl: string): Promise<ScanResult> => {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: targetUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to scan website');
    }

    return data;
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setLoadingPhase('connecting');

    // Simulate loading phases
    const phases: LoadingPhase[] = ['connecting', 'analyzing', 'detecting'];
    let phaseIndex = 0;
    const phaseInterval = setInterval(() => {
      phaseIndex++;
      if (phaseIndex < phases.length) {
        setLoadingPhase(phases[phaseIndex]);
      }
    }, 800);

    try {
      const data = await scanUrl(url);

      clearInterval(phaseInterval);
      setLoadingPhase('complete');
      
      setTimeout(() => {
        setResult(data);
        saveToHistory(data);
        setToast({ message: 'Scan complete!', type: 'success' });
      }, 300);
    } catch (err) {
      clearInterval(phaseInterval);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setToast({ 
        message: err instanceof Error ? err.message : 'An error occurred', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlA || !urlB) return;

    setLoading(true);
    setError('');
    setCompareResultA(null);
    setCompareResultB(null);
    setLoadingPhase('connecting');

    const phases: LoadingPhase[] = ['connecting', 'analyzing', 'detecting'];
    let phaseIndex = 0;
    const phaseInterval = setInterval(() => {
      phaseIndex++;
      if (phaseIndex < phases.length) {
        setLoadingPhase(phases[phaseIndex]);
      }
    }, 800);

    try {
      const [dataA, dataB] = await Promise.all([
        scanUrl(urlA),
        scanUrl(urlB),
      ]);

      clearInterval(phaseInterval);
      setLoadingPhase('complete');
      
      setTimeout(() => {
        setCompareResultA(dataA);
        setCompareResultB(dataB);
        saveToHistory(dataA);
        saveToHistory(dataB);
        setToast({ message: 'Comparison complete!', type: 'success' });
      }, 300);
    } catch (err) {
      clearInterval(phaseInterval);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setToast({ 
        message: err instanceof Error ? err.message : 'An error occurred', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (result) {
      const allTechs = Object.values(result.categories)
        .flat()
        .map(t => t.name)
        .slice(0, 10);
      const techCount = Object.values(result.categories).reduce((acc, techs) => acc + techs.length, 0);
      
      const ogUrl = `/api/og?url=${encodeURIComponent(result.url)}&techs=${encodeURIComponent(allTechs.join(','))}&count=${techCount}`;
      const shareUrl = `${window.location.origin}?url=${encodeURIComponent(result.url)}`;
      
      navigator.clipboard.writeText(shareUrl);
      setToast({ message: 'Share link copied to clipboard!', type: 'success' });
    }
  };

  const handleDownloadImage = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#0a0a0b',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `stackradar-${result?.url || 'scan'}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      setToast({ message: 'Image downloaded!', type: 'success' });
    } catch (err) {
      console.error('Download error:', err);
      setToast({ message: 'Failed to download image', type: 'error' });
    }
  };

  const getTotalTechCount = () => {
    if (!result) return 0;
    return Object.values(result.categories).reduce((acc, techs) => acc + techs.length, 0);
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('url-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check for URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      setUrl(urlParam);
      // Auto-scan could be triggered here if desired
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <Radar className="w-5 h-5 text-accent" />
            </div>
            <span className="text-xl font-bold font-mono">
              Stack<span className="text-accent">Radar</span>
            </span>
          </motion.div>
          
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            href="https://twitter.com/rushirajjj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-white/10 hover:border-accent/30 smooth text-sm font-medium group"
          >
            <span>Built by <span className="text-accent">@rushirajjj</span></span>
            <ExternalLink className="w-3.5 h-3.5 text-secondary group-hover:text-accent smooth" />
          </motion.a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-7xl w-full space-y-12">
          {/* Hero Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6 max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                Stack<span className="gradient-text animate-gradient-shift">Radar</span>
              </h1>
              <p className="text-xl md:text-2xl text-secondary font-light">
                X-ray any website's tech stack in seconds
              </p>
            </motion.div>

            {/* Mode Toggle */}
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setMode('scan');
                  setResult(null);
                  setCompareResultA(null);
                  setCompareResultB(null);
                }}
                className={`px-6 py-2.5 rounded-xl font-semibold smooth flex items-center gap-2 ${
                  mode === 'scan'
                    ? 'bg-accent text-white'
                    : 'bg-background/40 border border-white/10 hover:border-accent/30'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Scan</span>
              </button>
              <button
                onClick={() => {
                  setMode('compare');
                  setResult(null);
                  setCompareResultA(null);
                  setCompareResultB(null);
                }}
                className={`px-6 py-2.5 rounded-xl font-semibold smooth flex items-center gap-2 ${
                  mode === 'compare'
                    ? 'bg-accent text-white'
                    : 'bg-background/40 border border-white/10 hover:border-accent/30'
                }`}
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare</span>
              </button>
            </motion.div>

            {/* Search Forms */}
            {mode === 'scan' ? (
              <motion.form 
                variants={itemVariants}
                onSubmit={handleScan} 
                className="max-w-2xl mx-auto"
              >
                <div className="relative">
                  <div className={`relative group ${isFocused && !loading ? 'shadow-glow-md' : ''} smooth rounded-2xl`}>
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-hover:text-accent smooth z-10" />
                    <input
                      id="url-input"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Enter URL (e.g., stripe.com)"
                      className="w-full pl-14 pr-28 sm:pr-36 py-5 glass rounded-2xl text-lg focus:border-accent/50 focus:ring-2 focus:ring-accent/20 smooth placeholder:text-secondary/50"
                      disabled={loading}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-background/80 border border-white/10 rounded text-xs text-secondary font-mono">
                        ⌘K
                      </kbd>
                      <motion.button
                        type="submit"
                        disabled={loading || !url}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 sm:px-6 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-secondary/20 disabled:cursor-not-allowed text-white font-semibold rounded-xl smooth flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Scanning</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            <span>Scan</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.form>
            ) : (
              <motion.form
                variants={itemVariants}
                onSubmit={handleCompare}
                className="max-w-4xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent z-10" />
                    <input
                      type="text"
                      value={urlA}
                      onChange={(e) => setUrlA(e.target.value)}
                      placeholder="First website"
                      className="w-full pl-12 pr-4 py-4 glass rounded-xl focus:border-accent/50 focus:ring-2 focus:ring-accent/20 smooth placeholder:text-secondary/50"
                      disabled={loading}
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accentPurple z-10" />
                    <input
                      type="text"
                      value={urlB}
                      onChange={(e) => setUrlB(e.target.value)}
                      placeholder="Second website"
                      className="w-full pl-12 pr-4 py-4 glass rounded-xl focus:border-accentPurple/50 focus:ring-2 focus:ring-accentPurple/20 smooth placeholder:text-secondary/50"
                      disabled={loading}
                    />
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={loading || !urlA || !urlB}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 mx-auto px-8 py-3 bg-accent hover:bg-accent/90 disabled:bg-secondary/20 disabled:cursor-not-allowed text-white font-semibold rounded-xl smooth flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Comparing</span>
                    </>
                  ) : (
                    <>
                      <GitCompare className="w-4 h-4" />
                      <span>Compare</span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Hint */}
            {!result && !compareResultA && !loading && !error && (
              <motion.p
                variants={itemVariants}
                className="text-sm text-secondary/70"
              >
                Try: vercel.com, stripe.com, linear.app, github.com
              </motion.p>
            )}
          </motion.div>

          {/* History Section */}
          {!result && !compareResultA && !loading && !error && history.length > 0 && mode === 'scan' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary" />
                  <h3 className="text-lg font-semibold">Recent Scans</h3>
                </div>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-secondary hover:text-red-400 smooth"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {history.map((item, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setUrl(item.url);
                      setResult(item.result);
                    }}
                    className="glass p-4 rounded-xl hover:border-accent/30 smooth text-left group"
                  >
                    <div className="flex items-center gap-3">
                      {getFaviconUrl(item.url) && (
                        <img
                          src={getFaviconUrl(item.url)!}
                          alt=""
                          className="w-8 h-8 rounded border border-white/10"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-accent smooth">
                          {item.url}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-secondary mt-1">
                          <span>{item.techCount} techs</span>
                          <span>•</span>
                          <span>{formatTimestamp(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Waitlist Section - Show when no results */}
          {!result && !compareResultA && !loading && !error && mode === 'scan' && (
            <WaitlistSection />
          )}

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {loading && <LoadingState phase={loadingPhase} />}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto"
              >
                <div className="glass p-6 rounded-2xl border-red-500/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-400 mb-1">Scan Failed</h3>
                      <p className="text-sm text-red-400/80">{error}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compare Results */}
          <AnimatePresence mode="wait">
            {compareResultA && compareResultB && (
              <CompareResults resultA={compareResultA} resultB={compareResultB} />
            )}
          </AnimatePresence>

          {/* Single Scan Results */}
          <AnimatePresence mode="wait">
            {result && mode === 'scan' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
                ref={resultRef}
              >
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-7xl mx-auto">
                  <div className="flex items-center gap-4">
                    {getFaviconUrl(result.url) && (
                      <img
                        src={getFaviconUrl(result.url)!}
                        alt="Site favicon"
                        className="w-10 h-10 rounded-lg border border-white/10"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl md:text-3xl font-bold font-mono">
                          Tech Stack Detected
                        </h2>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 text-sm font-bold"
                        >
                          {getTotalTechCount()}
                        </motion.span>
                      </div>
                      <p className="text-secondary text-sm mt-1 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" />
                        {result.url}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownloadImage}
                      className="glass px-4 py-2.5 rounded-xl hover:border-accent/30 smooth flex items-center gap-2 text-sm font-medium group"
                    >
                      <Download className="w-4 h-4 text-secondary group-hover:text-accent smooth" />
                      <span>Download</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="glass px-4 py-2.5 rounded-xl hover:border-accent/30 smooth flex items-center gap-2 text-sm font-medium group"
                    >
                      <Share2 className="w-4 h-4 text-secondary group-hover:text-accent smooth" />
                      <span>Share</span>
                    </motion.button>
                  </div>
                </div>

                {/* Results Grid */}
                {Object.keys(result.categories).length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto"
                  >
                    <div className="glass p-12 rounded-2xl text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Search className="w-8 h-8 text-secondary/50" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No technologies detected</h3>
                      <p className="text-secondary">
                        The website might be using custom or minimal tech stack, or the site couldn't be accessed.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
                  >
                    {Object.entries(result.categories)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([category, technologies], index) => (
                        <ResultCard
                          key={category}
                          category={category}
                          technologies={technologies}
                          index={index}
                        />
                      ))}
                    
                    {/* Special cards for missing/recommended technologies */}
                    {!result.categories['Analytics'] && (
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: Object.keys(result.categories).length * 0.05 }}
                        className="glass p-6 rounded-xl border-secondary/20"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                            <BarChart3 className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold font-mono mb-1">Analytics</h3>
                            <p className="text-xs text-secondary/70">
                              No analytics detected
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <a
                            href="#affiliate-plausible"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-lg bg-background/40 border border-white/5 hover:border-accent/30 smooth group"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-secondary/60 group-hover:text-accent smooth" />
                            <span className="text-sm font-medium text-secondary/70 group-hover:text-accent smooth flex-1">
                              Add Plausible Analytics
                            </span>
                            <ExternalLink className="w-3 h-3 text-secondary/60 group-hover:text-accent smooth" />
                          </a>
                          <p className="text-[10px] text-secondary/50 px-3">
                            Privacy-friendly, lightweight alternative to Google Analytics
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Recommended: CDN if using cloud hosting without CDN */}
                    {(result.categories['Hosting'] && !result.categories['CDN']) && (
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: (Object.keys(result.categories).length + 1) * 0.05 }}
                        className="glass p-6 rounded-xl border-secondary/20"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                            <Globe className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold font-mono mb-1">CDN</h3>
                            <p className="text-xs text-secondary/70">
                              Recommended: Add a CDN
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <a
                            href="#affiliate-cloudflare"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-lg bg-background/40 border border-white/5 hover:border-accent/30 smooth group"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-secondary/60 group-hover:text-accent smooth" />
                            <span className="text-sm font-medium text-secondary/70 group-hover:text-accent smooth flex-1">
                              Add Cloudflare CDN
                            </span>
                            <ExternalLink className="w-3 h-3 text-secondary/60 group-hover:text-accent smooth" />
                          </a>
                          <p className="text-[10px] text-secondary/50 px-3">
                            Speed up your site globally with edge caching
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Recommended: Monitoring if not detected */}
                    {!result.categories['Monitoring'] && Object.keys(result.categories).length > 3 && (
                      <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: (Object.keys(result.categories).length + 2) * 0.05 }}
                        className="glass p-6 rounded-xl border-secondary/20"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                            <Eye className="w-5 h-5 text-secondary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold font-mono mb-1">Monitoring</h3>
                            <p className="text-xs text-secondary/70">
                              Recommended: Add error tracking
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <a
                            href="#affiliate-sentry"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 rounded-lg bg-background/40 border border-white/5 hover:border-accent/30 smooth group"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-secondary/60 group-hover:text-accent smooth" />
                            <span className="text-sm font-medium text-secondary/70 group-hover:text-accent smooth flex-1">
                              Add Sentry Monitoring
                            </span>
                            <ExternalLink className="w-3 h-3 text-secondary/60 group-hover:text-accent smooth" />
                          </a>
                          <p className="text-[10px] text-secondary/50 px-3">
                            Catch errors before your users report them
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary">
          <p>
            © 2026 StackRadar
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com/rushirajjj"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent smooth"
            >
              @rushirajjj
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

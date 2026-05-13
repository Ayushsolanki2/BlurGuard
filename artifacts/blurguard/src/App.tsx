import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { 
  Shield, 
  Smartphone, 
  BarChart2, 
  Zap, 
  Settings, 
  Home, 
  ChevronRight, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Award, 
  ArrowLeft,
  Search,
  Bell,
  Palette,
  Database,
  Plus,
  Target,
  Sparkles,
  Lock,
  Unlock,
  Layers,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Star,
  CheckCircle2,
  ZapOff,
  UserPlus,
  Fingerprint,
  Cpu,
  User,
  Camera,
  X
} from 'lucide-react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from '@workspace/api-client-react';
import { cn } from './lib/utils';
import { BlurGuardSettings, isNative } from './lib/native-settings';
import { motion, AnimatePresence, LayoutGroup, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import type { UsageResponse, FocusModeResponse, InsightsResponse } from '@workspace/api-zod';

const queryClient = new QueryClient();

// Types for new features
type Theme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

const THEMES: Theme[] = [
  { id: 'midnight', name: 'Midnight Indigo', primary: 'bg-gradient-to-br from-indigo-600/30 to-purple-600/20', secondary: 'bg-gradient-to-br from-purple-600/25 to-pink-600/15', accent: 'text-indigo-400' },
  { id: 'emerald', name: 'Emerald Forest', primary: 'bg-gradient-to-br from-emerald-600/30 to-teal-600/20', secondary: 'bg-gradient-to-br from-teal-600/25 to-cyan-600/15', accent: 'text-emerald-400' },
  { id: 'sunset', name: 'Cyber Sunset', primary: 'bg-gradient-to-br from-rose-600/30 to-orange-600/20', secondary: 'bg-gradient-to-br from-orange-600/25 to-yellow-600/15', accent: 'text-rose-400' },
  { id: 'ocean', name: 'Deep Ocean', primary: 'bg-gradient-to-br from-blue-600/30 to-cyan-600/20', secondary: 'bg-gradient-to-br from-cyan-600/25 to-sky-600/15', accent: 'text-blue-400' }
];

export default function App() {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showProfileCreator, setShowProfileCreator] = useState(false);
  const [permissions, setPermissions] = useState({ usage: false, notifications: false });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingApp(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {isLoadingApp && <SplashScreen key="splash" />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-indigo-500/30 selection:text-white">
        {/* Cinematic Ambient Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className={cn("absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[160px]", activeTheme.primary)} 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.12, 0.1]
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 1 }}
            className={cn("absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[160px]", activeTheme.secondary)} 
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        {/* Mobile Viewport Container */}
        <div className="relative mx-auto w-full max-w-md min-h-screen flex flex-col z-10 border-x border-white/5 bg-[#020203]/40 backdrop-blur-[2px]">
          <Header profile={userProfile} />
          <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
            <AnimatePresence mode="wait">
              <Switch>
                <Route path="/">
                  <PageWrapper>
                    {!userProfile ? (
                      <WelcomeScreen onCreate={() => setShowProfileCreator(true)} />
                    ) : (
                      <Dashboard profile={userProfile} permissions={permissions} />
                    )}
                  </PageWrapper>
                </Route>
                <Route path="/analytics">
                  <PageWrapper><AnalyticsPage /></PageWrapper>
                </Route>
                <Route path="/focus">
                  <PageWrapper><FocusModePage theme={activeTheme} /></PageWrapper>
                </Route>
                <Route path="/settings">
                  <PageWrapper>
                    <SettingsPage 
                      activeTheme={activeTheme} 
                      onThemeChange={setActiveTheme} 
                      profile={userProfile}
                      permissions={permissions}
                      setPermissions={setPermissions}
                    />
                  </PageWrapper>
                </Route>
              </Switch>
            </AnimatePresence>
          </main>
          <BottomNav theme={activeTheme} />
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showProfileCreator && (
            <ProfileCreator 
              onComplete={(p) => {
                setUserProfile(p);
                setShowProfileCreator(false);
              }} 
              onClose={() => setShowProfileCreator(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </QueryClientProvider>
  );
}

function WelcomeScreen({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 px-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 rounded-[32px] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.1)]"
      >
        <UserPlus className="w-12 h-12 text-indigo-400" />
      </motion.div>
      <div className="space-y-3">
        <h2 className="text-4xl font-black tracking-tighter">Your Digital Oasis</h2>
        <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-[280px]">
          Create your profile to start tracking your focus and reclaiming your time.
        </p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCreate}
        className="w-full py-5 rounded-[28px] bg-white text-zinc-900 font-black tracking-widest uppercase text-xs shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
      >
        Initialize Profile
      </motion.button>
    </div>
  );
}

function ProfileCreator({ onComplete, onClose }: { onComplete: (p: any) => void, onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('Productivity');

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova'
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#020203]/90 backdrop-blur-xl p-8 flex items-center justify-center"
    >
      <motion.div 
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-sm glass rounded-[48px] p-10 border-white/10 relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-10">
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-500", s <= step ? "bg-indigo-500" : "bg-white/5")} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter">Who are you?</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Enter your matrix alias</p>
                </div>
                <input 
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Username..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-black text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
                />
                <button onClick={() => name && setStep(2)} className="w-full py-5 rounded-3xl bg-indigo-500 text-white font-black tracking-widest uppercase text-xs">Continue</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter">Choose Persona</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Pick your digital avatar</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {avatars.map(url => (
                    <button 
                      key={url}
                      onClick={() => setSelectedAvatar(url)}
                      className={cn("relative rounded-[32px] overflow-hidden border-2 transition-all p-1", selectedAvatar === url ? "border-indigo-500" : "border-transparent bg-white/5")}
                    >
                      <img src={url} className="w-full h-full" alt="Avatar" />
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(3)} className="w-full py-5 rounded-3xl bg-indigo-500 text-white font-black tracking-widest uppercase text-xs">Select Avatar</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tighter">Primary Goal</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">What are we optimizing?</p>
                </div>
                <div className="space-y-3">
                  {['Productivity', 'Digital Detox', 'Deep Work', 'Mental Balance'].map(g => (
                    <button 
                      key={g}
                      onClick={() => setGoal(g)}
                      className={cn("w-full py-5 rounded-2xl border text-sm font-black uppercase tracking-tight transition-all", goal === g ? "bg-white text-zinc-900 border-white" : "glass border-white/5 text-zinc-500")}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <button onClick={() => onComplete({ name, avatar: selectedAvatar, goal })} className="w-full py-5 rounded-3xl bg-indigo-500 text-white font-black tracking-widest uppercase text-xs shadow-[0_0_30px_rgba(99,102,241,0.4)]">Complete Protocol</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-[#020203] flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-conic from-indigo-500/20 via-transparent to-transparent blur-[100px]" 
        />
      </div>

      <motion.div 
        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
        className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-[0_0_80px_rgba(99,102,241,0.5)] mb-10 relative group"
      >
        <Shield className="w-16 h-16 text-white drop-shadow-2xl" />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-[40px] bg-white opacity-20 blur-xl"
        />
      </motion.div>

      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-black text-white tracking-tighter"
        >
          BlurGuard
        </motion.h1>
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.6 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-3 justify-center"
        >
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-white/40" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">AI Focus Engine</span>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-white/40" />
        </motion.div>
      </div>
      
      <div className="absolute bottom-20 w-64 h-[2px] bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        />
      </div>
    </motion.div>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 1.02 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="p-6"
    >
      {children}
    </motion.div>
  );
}

function Magnetic({ children, strength = 0.4 }: { children: React.ReactNode, strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

function Header({ profile }: { profile: any }) {
  const [location, setLocation] = useLocation();
  
  return (
    <header className="sticky top-0 z-[40] glass-dark px-6 py-5 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-4">
        <Magnetic strength={0.2}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation('/')}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] border border-white/10 cursor-pointer overflow-hidden relative group"
          >
            <Shield className="w-6 h-6 text-white relative z-10" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-conic from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </motion.div>
        </Magnetic>
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white leading-none text-glow">BlurGuard</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Active Protect</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
          whileTap={{ scale: 0.9 }}
          className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020203]" />
        </motion.button>
        
        {profile && (
          <Magnetic strength={0.3}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocation('/settings')}
              className="w-11 h-11 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden group"
            >
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
            </motion.button>
          </Magnetic>
        )}
      </div>
    </header>
  );
}

function BottomNav({ theme }: { theme: Theme }) {
  const [location, setLocation] = useLocation();

  const navItems = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/analytics', icon: BarChart2, label: 'Stats' },
    { id: '/focus', icon: Zap, label: 'Focus' },
    { id: '/settings', icon: Settings, label: 'Menu' }
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#020203]/80 backdrop-blur-[24px] border-t border-white/5 px-8 py-6 flex items-center justify-between z-[50] rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
      {navItems.map((item) => {
        const isActive = location === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setLocation(item.id)}
            className="relative group flex flex-col items-center gap-1.5 transition-all outline-none"
          >
            <motion.div 
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "p-3 rounded-2xl transition-all duration-500 relative z-10 overflow-hidden",
                isActive ? cn(theme.accent, "bg-white/5") : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <item.icon className={cn("w-6 h-6 transition-transform duration-500 relative z-10", isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "")} />
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent blur-md"
                />
              )}
            </motion.div>
            
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest transition-all duration-500",
              isActive ? "text-white opacity-100 translate-y-0" : "text-zinc-500 opacity-0 -translate-y-2 group-hover:opacity-50 group-hover:translate-y-0"
            )}>
              {item.label}
            </span>

            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className={cn("absolute -bottom-2 w-2 h-2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]", theme.accent.replace('text', 'bg'))}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function Dashboard({ profile, permissions }: { profile: any, permissions: any }) {
  const [, setLocation] = useLocation();
  const [showAddApp, setShowAddApp] = useState(false);
  const [simulatingBreach, setSimulatingBreach] = useState<string | null>(null);

  const achievements = [
    { name: 'Flow State', desc: '4h deep work', icon: Zap, unlocked: true },
    { name: 'Early Bird', desc: 'Morning focus', icon: Sparkles, unlocked: true },
    { name: 'Focus Master', desc: '7 day streak', icon: Award, unlocked: false },
    { name: 'Silent Night', desc: 'No late usage', icon: Moon, unlocked: false }
  ];

  const activeApps = [
    { name: 'Instagram', minutes: 135, limit: 120, color: 'from-pink-500 to-rose-500', icon: Smartphone, activity: 'Critical' },
    { name: 'YouTube', minutes: 90, limit: 100, color: 'from-red-600 to-red-800', icon: Activity, activity: 'Near Limit' },
    { name: 'WhatsApp', minutes: 45, limit: 60, color: 'from-emerald-500 to-teal-600', icon: Bell, activity: 'Normal' },
    { name: 'LinkedIn', minutes: 22, limit: 30, color: 'from-blue-600 to-indigo-700', icon: Target, activity: 'Low' }
  ];

  const { data: usageData, isLoading: usageLoading } = useQuery<UsageResponse>({
    queryKey: ['usage'],
    queryFn: async () => {
      try {
        const res = await fetch('http://localhost:5000/api/usage');
        return res.json();
      } catch (e) {
        return { totalMinutes: 342, dailyLimit: 480, percentage: 71, productivityScore: 82 };
      }
    },
  });

  if (usageLoading || !usageData) {
    return <LoadingState />;
  }

  const { totalMinutes, percentage } = usageData;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return (
    <div className="space-y-8">
      {/* Greeting Section */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
        <h2 className="text-3xl font-black tracking-tighter">Hello, {profile.name}</h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
          Focusing on <span className="text-indigo-400">{profile.goal}</span>
        </p>
      </motion.div>

      {/* Dynamic Progress Header */}
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Daily Focus Quests</span>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" /> 2 milestones left
            </h4>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white">{percentage}%</span>
          </div>
        </div>
        <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          />
        </div>
      </motion.section>

      {/* Hero Stats */}
      <Magnetic strength={0.05}>
        <motion.section className="premium-border relative w-full rounded-[48px] bg-gradient-to-br from-zinc-900/60 via-indigo-950/40 to-purple-950/30 border border-white/10 p-8 flex items-center justify-between group shadow-2xl overflow-hidden">
          {/* Animated Background Gradient */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 blur-2xl"
          />
          
          <div className="relative z-10 space-y-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl w-fit shadow-[0_8px_20px_rgba(99,102,241,0.2)]"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Elite Level</span>
            </motion.div>
            <div className="flex items-baseline gap-1">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl font-black tracking-tighter bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent"
              >
                {hours}
              </motion.span>
              <span className="text-3xl font-black text-white/40 mr-3">h</span>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-7xl font-black tracking-tighter bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent"
              >
                {minutes}
              </motion.span>
              <span className="text-3xl font-black text-white/40">m</span>
            </div>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xs font-bold text-emerald-400 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full w-fit"
            >
              <TrendingUp className="w-4 h-4" /> Usage down by 14%
            </motion.p>
          </div>
          <motion.div 
            className="relative z-10 w-32 h-32"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-full h-full transform -rotate-90 filter drop-shadow-lg" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="44" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
               <motion.circle
                initial={{ strokeDashoffset: 276 }}
                animate={{ strokeDashoffset: 276 - (276 * percentage) / 100 }}
                cx="50" cy="50" r="44" fill="transparent" stroke="url(#heroGrad)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray="276"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </motion.section>
      </Magnetic>

      {/* Badges Section */}
      <section className="space-y-5">
        <h3 className="text-xl font-black text-white flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-400" /> Hall of Fame
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8, boxShadow: item.unlocked ? '0_20px_40px_rgba(217,119,6,0.3)' : '0_0px_0px_rgba(0,0,0,0)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "premium-border glass rounded-[32px] p-5 border flex flex-col gap-3 transition-all relative overflow-hidden",
                item.unlocked ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-amber-500/5" : "border-white/5 opacity-40 grayscale"
              )}
            >
              {item.unlocked && (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl"
                />
              )}
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative z-10", item.unlocked ? "bg-amber-500/20 text-amber-400 shadow-[0_0_20px_rgba(217,119,6,0.3)]" : "bg-white/5 text-zinc-500")}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-white text-sm">{item.name}</h4>
                <p className="text-[10px] font-bold text-zinc-500">{item.desc}</p>
              </div>
              {item.unlocked && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                  className="absolute top-4 right-4 z-10"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-lg" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* App List - Dynamic Perimeter with Blur Guard */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-white flex items-center gap-3">
            <Layers className="w-6 h-6 text-indigo-400" /> App Perimeter
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-zinc-500 uppercase">Auto-Blur</span>
            <div className="w-8 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center px-1">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAddApp(true)}
              className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/40 transition-all"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {!permissions.usage ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[40px] p-10 text-center space-y-6 border border-dashed border-white/10">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/5 animate-pulse">
              <Lock className="w-8 h-8 text-zinc-500" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-white">Access Required</h4>
              <p className="text-xs font-medium text-zinc-500 max-w-[200px] mx-auto leading-relaxed">
                Grant usage permission in Settings to activate the real-time BlurGuard.
              </p>
            </div>
            <button
              onClick={() => setLocation('/settings')}
              className="px-6 py-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500/30 transition-all"
            >
              Open Settings
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <LayoutGroup>
              {activeApps.map((app, i) => {
                const isOverLimit = app.minutes >= app.limit;
                const blurAmount = isOverLimit ? Math.min((app.minutes - app.limit) * 0.5, 20) : 0;
                
                return (
                  <motion.div 
                    layout 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={app.name} 
                    className="relative group"
                  >
                    <div 
                      className={cn(
                        "premium-border glass rounded-[36px] p-5 flex items-center gap-5 border transition-all duration-500 hover:border-white/20 group-hover:shadow-[0_0_40px_rgba(99,102,241,0.2)]",
                        isOverLimit && "border-rose-500/40 bg-gradient-to-r from-rose-500/10 to-rose-500/5 shadow-[0_0_40px_rgba(244,63,94,0.15)]"
                      )}
                      style={{ filter: simulatingBreach === app.name ? 'blur(12px)' : `blur(${blurAmount}px)` }}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg transition-all", app.color)}
                      >
                        <app.icon className="w-7 h-7" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-white">{app.name}</h4>
                          {isOverLimit && (
                            <motion.span 
                              animate={{ 
                                scale: [1, 1.05, 1],
                                boxShadow: ['0_0_0_rgba(244,63,94,0.5)', '0_0_20px_rgba(244,63,94,0.8)', '0_0_0_rgba(244,63,94,0.5)']
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="text-[8px] px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black uppercase"
                            >
                              BLURRED
                            </motion.span>
                          )}
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (app.minutes / app.limit) * 100)}%` }}
                            className={cn(
                              "h-full rounded-full",
                              isOverLimit ? "bg-gradient-to-r from-rose-500 to-rose-600" : "bg-gradient-to-r from-indigo-500 to-purple-500"
                            )}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 mt-1.5">{app.minutes}m / {app.limit}m limit</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setSimulatingBreach(simulatingBreach === app.name ? null : app.name)}
                        className="w-10 h-10 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/10 hover:border-indigo-500/50"
                      >
                        <Zap className={cn("w-5 h-5 transition-colors", simulatingBreach === app.name && "text-amber-400 fill-amber-400")} />
                      </motion.button>
                    </div>

                    {/* Slow Blur Overlay Simulation */}
                    <AnimatePresence>
                      {(isOverLimit || simulatingBreach === app.name) && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 rounded-[36px] pointer-events-none flex items-center justify-center bg-[#020203]/30 backdrop-blur-[4px] border border-rose-500/30"
                        >
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.1, 1],
                              opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex flex-col items-center gap-2"
                          >
                            <Shield className="w-6 h-6 text-rose-500 drop-shadow-lg" />
                            <span className="text-[8px] font-black text-rose-400 uppercase tracking-[0.3em]">Breach Detected</span>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </LayoutGroup>
          </div>
        )}
      </section>

      {/* Add App Modal */}
      <AnimatePresence>
        {showAddApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[#020203]/90 backdrop-blur-xl flex items-end justify-center"
            onClick={() => setShowAddApp(false)}
          >
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-t-[48px] p-8 border border-white/10 border-b-0 space-y-6"
            >
              <div className="w-12 h-1 rounded-full bg-white/20 mx-auto" />
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white tracking-tighter">Add to Perimeter</h3>
                <button onClick={() => setShowAddApp(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 pb-4">
                {['Snapchat', 'Reddit', 'TikTok', 'Twitter', 'Netflix', 'Discord'].map((app) => (
                  <motion.button
                    key={app}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddApp(false)}
                    className="w-full glass rounded-[24px] p-5 flex items-center gap-5 border border-white/5 hover:border-indigo-500/30 transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-6 h-6 text-zinc-400" />
                    </div>
                    <span className="font-black text-white flex-1">{app}</span>
                    <Plus className="w-5 h-5 text-indigo-400" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalyticsPage() {
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/productivity-insights')
      .then((r) => r.json())
      .then((data) => { setInsights(data); setInsightsLoading(false); })
      .catch(() => {
        setInsights({
          mostDistractingHours: 'After 11 PM',
          screenTimeChange: '+22% increase today',
          focusSuggestion: 'Focus mode improved productivity by 18%. Consider locking Instagram after 10 PM.',
        });
        setInsightsLoading(false);
      });
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const barValues = [45, 75, 40, 95, 60, 85, 55];

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-black text-white tracking-tighter">Usage Matrix</h2>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">This Week</span>
        </div>
        <div className="glass rounded-[40px] p-8 h-72 flex items-end justify-between gap-3 relative overflow-hidden border border-white/5">
          <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_20%,rgba(255,255,255,0.5)_20%,rgba(255,255,255,0.5)_20.5%)]" />
          {barValues.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 justify-end h-full group">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${val}%`, opacity: 1 }}
                transition={{ delay: i * 0.07, type: 'spring', damping: 20, stiffness: 80 }}
                whileHover={{ scaleY: 1.05 }}
                className={cn(
                  "w-full rounded-t-3xl shadow-lg relative overflow-hidden cursor-pointer transition-all group-hover:shadow-2xl",
                  val >= 90 ? 'bg-gradient-to-t from-rose-600 via-rose-500 to-red-400 shadow-rose-500/30 group-hover:shadow-rose-500/50' : 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-400 shadow-indigo-500/30 group-hover:shadow-indigo-500/50'
                )}
              >
                {val >= 90 && (
                  <motion.div
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"
                  />
                )}
              </motion.div>
              <span className="text-[9px] font-black text-zinc-600 group-hover:text-zinc-400 transition-colors">{days[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Daily Avg', value: '4h 12m', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Pickups', value: '84x', icon: Smartphone, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Stability', value: '92%', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Limit Reach', value: '12%', icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-[32px] p-6 space-y-4 border border-white/5"
          >
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center', stat.bg)}>
              <stat.icon className={cn('w-6 h-6', stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase">{stat.label}</p>
              <h4 className="text-2xl font-black text-white">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <section className="space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-amber-400" /> AI Insights
        </h3>
        {insightsLoading ? (
          <div className="glass rounded-[40px] p-8 border border-white/5 flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm font-black text-zinc-500">Analyzing your patterns...</p>
          </div>
        ) : insights ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[40px] p-8 space-y-6 border border-amber-500/10 bg-amber-500/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Peak Distraction</p>
                <h4 className="text-lg font-black text-white">{insights.mostDistractingHours}</h4>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Screen Time</p>
                <h4 className={cn('text-lg font-black', insights.screenTimeChange.startsWith('+') ? 'text-rose-400' : 'text-emerald-400')}>
                  {insights.screenTimeChange}
                </h4>
              </div>
            </div>
            <div className="h-px bg-white/5" />
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">AI Suggestion</p>
              <p className="text-sm font-medium text-zinc-300 leading-relaxed">{insights.focusSuggestion}</p>
            </div>
          </motion.div>
        ) : null}
      </section>
    </div>
  );
}

function FocusModePage({ theme }: { theme: Theme }) {
  const [isActive, setIsActive] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState(false);
  const [timer, setTimer] = useState(1500); // 25 mins
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [blockedApps, setBlockedApps] = useState(['Instagram', 'YouTube']);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      if (timer === 0) setIsRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timer]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimer(1500);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10">
      {/* Mode Selector */}
      <div className="flex p-1.5 bg-zinc-900 rounded-[24px] border border-white/5">
        <button 
          onClick={() => setPomodoroMode(false)}
          className={cn("flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all", !pomodoroMode ? "bg-white text-zinc-900 shadow-xl" : "text-zinc-500")}
        >
          Shield
        </button>
        <button 
          onClick={() => setPomodoroMode(true)}
          className={cn("flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all", pomodoroMode ? "bg-white text-zinc-900 shadow-xl" : "text-zinc-500")}
        >
          Pomodoro
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!pomodoroMode ? (
          <motion.section 
            key="shield"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "relative rounded-[48px] p-12 text-center transition-all duration-1000 overflow-hidden",
              isActive ? "bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-600 shadow-[0_0_80px_rgba(99,102,241,0.5)]" : "glass border-white/10 bg-gradient-to-br from-zinc-900/50 to-zinc-900/30"
            )}
          >
            {isActive && (
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent blur-3xl"
              />
            )}
            <div className="relative z-10 space-y-8 flex flex-col items-center">
              <motion.div 
                animate={{ 
                  scale: isActive ? [1, 1.15, 1] : 1,
                  boxShadow: isActive ? ['0_0_20px_rgba(255,255,255,0.2)', '0_0_60px_rgba(255,255,255,0.4)', '0_0_20px_rgba(255,255,255,0.2)'] : '0_0_0px_rgba(255,255,255,0)'
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={cn("w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl border-2", isActive ? "bg-white text-indigo-600 border-white/30" : "bg-white/10 border-white/20 text-zinc-500")}
              >
                {isActive ? <Lock className="w-10 h-10" /> : <Unlock className="w-10 h-10" />}
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tighter">{isActive ? 'The Void' : 'Unlocked'}</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{isActive ? 'All distractions neutralized' : 'Ready to focus'}</p>
              </div>
              <button 
                onClick={() => setIsActive(!isActive)}
                className={cn("relative w-32 h-16 rounded-full p-2 border transition-all shadow-lg", isActive ? "bg-white/20 border-white/40 shadow-white/30" : "bg-white/10 border-white/20")}
              >
                <motion.div 
                  layout 
                  animate={{ x: isActive ? 64 : 0 }} 
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={cn("w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all", isActive ? "bg-white" : "bg-indigo-500")}
                >
                  <Zap className={cn("w-6 h-6 transition-colors", isActive ? "text-indigo-600 fill-indigo-600" : "text-white fill-white")} />
                </motion.div>
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.section 
            key="pomo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="premium-border rounded-[48px] p-12 text-center bg-gradient-to-br from-zinc-900/60 via-purple-950/30 to-zinc-900/60 shadow-2xl border border-white/5 overflow-hidden relative"
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-indigo-500/10 blur-2xl"
            />
            <div className="relative z-10 space-y-10 flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-lg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                  <motion.circle 
                    cx="50" cy="50" r="45" fill="transparent" stroke="url(#pomoGrad)" strokeWidth="6" strokeLinecap="round" 
                    strokeDasharray="283" 
                    animate={{ strokeDashoffset: 283 - (283 * timer) / 1500 }}
                    transition={{ duration: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="pomoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-5xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">{formatTime(timer)}</span>
              </div>
              
              <div className="flex items-center gap-6">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetTimer} 
                  className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/10 hover:border-white/30" 
                  title="Reset"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTimer}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white via-white to-white/90 text-zinc-900 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)] font-black"
                >
                  {isRunning ? <Pause className="w-8 h-8 fill-zinc-900" /> : <Play className="w-8 h-8 fill-zinc-900 ml-1" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setTimer(1500); setIsRunning(false); setSessionCount((c) => c + 1); }}
                  className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-zinc-400 hover:text-amber-400 transition-all border border-white/10 hover:border-amber-500/30"
                  title="Skip session"
                >
                  <ZapOff className="w-6 h-6" />
                </motion.button>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                Session {sessionCount + 1} &middot; {isRunning ? 'In Progress' : timer === 1500 ? 'Ready' : 'Paused'}
              </p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white flex items-center gap-3">
            <Target className="w-6 h-6 text-rose-500" /> Blocked Apps
          </h3>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{blockedApps.length} active</span>
        </div>
        <div className="space-y-3">
          {['Instagram', 'YouTube', 'TikTok', 'Twitter'].map((app) => {
            const isBlocked = blockedApps.includes(app);
            return (
              <motion.div layout key={app} className={cn('glass rounded-[32px] p-5 flex items-center justify-between border transition-all', isBlocked ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-white/5')}>
                <div className="flex items-center gap-5">
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center transition-all', isBlocked ? 'bg-indigo-500/20' : 'bg-zinc-800')}>
                    <Smartphone className={cn('w-6 h-6 transition-colors', isBlocked ? 'text-indigo-400' : 'text-zinc-500')} />
                  </div>
                  <div>
                    <h4 className="font-black text-white">{app}</h4>
                    <p className="text-[10px] font-bold text-zinc-500">{isBlocked ? 'Blocked during focus' : 'Allowed'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setBlockedApps((prev) => isBlocked ? prev.filter((a) => a !== app) : [...prev, app])}
                  className={cn('w-12 h-7 rounded-full flex items-center px-1 transition-all duration-300', isBlocked ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/10')}
                >
                  <motion.div layout animate={{ x: isBlocked ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} className="w-5 h-5 rounded-full bg-white shadow-lg" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function VerifyAccountModal({ onClose }: any) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [debugOtp, setDebugOtp] = useState('');

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const sendOtp = async () => {
    if (!email.includes('@')) {
      setError('Invalid email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log('OTP Response:', data);
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setStep('otp');
      setTimer(600);
      // If OTP is returned (development mode), display it
      if (data.otp) {
        setDebugOtp(data.otp);
        setError(`OTP Code: ${data.otp}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Enter all 6 digits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setError('✓ Account verified successfully!');
      setTimeout(() => onClose(), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#020203]/90 backdrop-blur-xl p-8 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-sm glass rounded-[48px] p-10 border-white/10 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter">Verify Account</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Enter your email for verification</p>
              </div>
              <input 
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg font-black text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
              />
              {error && <p className="text-rose-400 text-sm font-bold">{error}</p>}
              <button 
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-5 rounded-3xl bg-indigo-500 text-white font-black tracking-widest uppercase text-xs disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter">Enter OTP</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Check your email for the code</p>
              </div>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInput(i, e.target.value)}
                    className="w-12 h-12 text-center bg-white/5 border border-white/10 rounded-xl text-2xl font-black text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                ))}
              </div>
              {debugOtp && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">Dev Mode - Your Code:</p>
                  <p className="text-2xl font-black text-amber-300 tracking-[0.4em]">{debugOtp}</p>
                </motion.div>
              )}
              {error && !error.includes('✓') && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center"
                >
                  <p className="text-xs font-black text-amber-300">{error}</p>
                </motion.div>
              )}
              <div className="text-center text-sm text-zinc-500 font-bold">
                {timer > 0 ? `Expires in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}` : 'Code expired'}
              </div>
              {error && <p className={`text-sm font-bold ${error.includes('✓') ? 'text-emerald-400' : 'text-rose-400'}`}>{error}</p>}
              <button 
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-5 rounded-3xl bg-indigo-500 text-white font-black tracking-widest uppercase text-xs disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button 
                onClick={() => { setStep('email'); setError(''); setOtp(['', '', '', '', '', '']); setDebugOtp(''); }}
                className="w-full py-3 rounded-2xl glass text-white font-black tracking-widest uppercase text-xs border border-white/10"
              >
                Change Email
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function SettingsPage({ activeTheme, onThemeChange, profile, permissions, setPermissions }: any) {
  const [features, setFeatures] = useState({ privacy: false, alerts: true });
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const requestPermission = async (type: 'usage' | 'notifications') => {
    if (isNative()) {
      try {
        if (type === 'usage') {
          // Opens Android's "Usage Access" special permissions screen
          await BlurGuardSettings.openUsageAccessSettings();
        } else {
          // Opens the app-specific notification channel settings
          await BlurGuardSettings.openNotificationSettings();
        }
      } catch (e) {
        console.warn('Failed to open native settings:', e);
      }
    }
    // On web this just marks it as granted immediately for demo purposes
    setPermissions({ ...permissions, [type]: true });
  };

  return (
    <div className="space-y-8 pb-10">
      {profile && (
        <section className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="relative">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-[-10px] rounded-[48px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-500 blur-lg opacity-30" />
            <div className="relative w-32 h-32 rounded-[40px] p-1 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl overflow-hidden">
              <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-[38px] bg-zinc-900" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter">{profile.name}</h2>
            <p className={cn("text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mt-3 border inline-block", activeTheme.accent, "bg-white/5 border-white/10")}>{profile.goal} Mode</p>
          </div>
        </section>
      )}

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2">Security & Re-authentication</h3>
        <Magnetic strength={0.2}>
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowVerifyModal(true)}
            className="w-full py-5 rounded-[32px] bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black tracking-widest uppercase text-xs shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Verify Account
          </motion.button>
        </Magnetic>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2">Access & Permissions</h3>
        <div className="glass rounded-[40px] overflow-hidden">
          <PermissionItem 
            icon={Fingerprint} 
            title="Usage Access" 
            subtitle="Required to track app time" 
            granted={permissions.usage}
            onGrant={() => requestPermission('usage')}
          />
          <PermissionItem 
            icon={Bell} 
            title="Notifications" 
            subtitle="Alerts for focus milestones" 
            granted={permissions.notifications}
            onGrant={() => requestPermission('notifications')}
            isLast
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2">Visual Aura</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((theme) => (
            <Magnetic key={theme.id} strength={0.1}>
              <button 
                onClick={() => onThemeChange(theme)}
                className={cn(
                  "w-full p-4 rounded-3xl border flex flex-col items-start gap-2 transition-all",
                  activeTheme.id === theme.id ? "bg-white text-zinc-900 border-white" : "glass text-zinc-400 border-white/5 hover:border-white/20"
                )}
              >
                <div className={cn("w-8 h-8 rounded-xl", theme.primary.replace('bg-', 'bg-').replace('/20', ''))} />
                <span className="text-[10px] font-black uppercase tracking-tight">{theme.name}</span>
              </button>
            </Magnetic>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2">System Config</h3>
        <div className="glass rounded-[40px] overflow-hidden">
          <SettingToggle icon={Shield} title="Privacy Cloak" active={features.privacy} onToggle={() => setFeatures({...features, privacy: !features.privacy})} />
          <SettingToggle icon={Bell} title="Neural Alerts" active={features.alerts} onToggle={() => setFeatures({...features, alerts: !features.alerts})} isLast />
        </div>
      </div>

      <Magnetic strength={0.2}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => window.location.reload()} className="w-full py-6 rounded-[32px] glass border-rose-500/20 text-rose-500 font-black tracking-widest uppercase text-xs shadow-[0_0_30px_rgba(244,63,94,0.1)]">
          Terminate Matrix
        </motion.button>
      </Magnetic>

      <AnimatePresence>
        {showVerifyModal && <VerifyAccountModal onClose={() => setShowVerifyModal(false)} />}
      </AnimatePresence>
    </div>
  );
}

function PermissionItem({ icon: Icon, title, subtitle, granted, onGrant, isLast }: any) {
  return (
    <div className={cn("p-6 flex items-center justify-between hover:bg-white/5 transition-colors", !isLast && "border-b border-white/5")}>
      <div className="flex items-center gap-5">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", granted ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-zinc-500")}>
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <h4 className="font-black text-white text-lg leading-none mb-1.5">{title}</h4>
          <p className="text-[11px] font-medium text-zinc-500">{subtitle}</p>
        </div>
      </div>
      <Magnetic strength={0.3}>
        <button 
          onClick={onGrant}
          disabled={granted}
          className={cn(
            "px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
            granted ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] active:scale-95"
          )}
        >
          {granted ? 'Granted' : 'Allow'}
        </button>
      </Magnetic>
    </div>
  );
}

function SettingToggle({ icon: Icon, title, active, onToggle, isLast }: any) {
  return (
    <div className={cn("p-6 flex items-center justify-between hover:bg-white/5 transition-colors", !isLast && "border-b border-white/5")}>
      <div className="flex items-center gap-5">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", active ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-zinc-500")}>
          <Icon className="w-7 h-7" />
        </div>
        <h4 className="font-black text-white text-lg">{title}</h4>
      </div>
      <button onClick={onToggle} className={cn("w-14 h-8 rounded-full flex items-center px-1.5 transition-all", active ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-white/10")}>
        <motion.div layout animate={{ x: active ? 24 : 0 }} className="w-5 h-5 rounded-full bg-white shadow-xl" />
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 relative">
      {/* Animated Background */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
      />
      
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative w-24 h-24">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
          >
            <div className="inset-0 rounded-full bg-[#020203]" />
          </motion.div>
          <motion.div
            animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-2 rounded-full border-2 border-indigo-500/40"
          />
          <Activity className="absolute inset-0 m-auto w-10 h-10 text-indigo-400 animate-pulse drop-shadow-lg" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Synchronizing Matrix...</p>
          <motion.div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ height: ['8px', '20px', '8px'] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Moon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  );
}

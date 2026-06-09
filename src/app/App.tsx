import { useState, type ReactNode } from 'react';
import { Home as HomeIcon, Camera, User, Mic } from 'lucide-react';
import { Home } from './components/Home';
import { Memories } from './components/Memories';
import { Profile } from './components/Profile';
import { VoiceNotes } from './components/VoiceNotes';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// MARKER-MAKE-KIT-INVOKED

type Screen = 'home' | 'voice' | 'memories' | 'profile';

const NAV_ITEMS: { id: Screen; icon: ReactNode; label: string }[] = [
  { id: 'home', icon: <HomeIcon className="w-5 h-5" />, label: 'Notes' },
  { id: 'voice', icon: <Mic className="w-5 h-5" />, label: 'Voice' },
  { id: 'memories', icon: <Camera className="w-5 h-5" />, label: 'Memories' },
  { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
];

function AppShell() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const { resolvedTheme } = useTheme();

  return (
    <div
      className={`size-full flex flex-col max-w-md mx-auto relative ${resolvedTheme === 'dark' ? 'dark' : ''}`}
      style={{ background: 'var(--app-bg)', transition: 'background 0.3s ease' }}
    >
      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeScreen === 'home' && <Home />}
        {activeScreen === 'voice' && <VoiceNotes />}
        {activeScreen === 'memories' && <Memories />}
        {activeScreen === 'profile' && <Profile />}
      </div>

      {/* Floating Bottom Navigation */}
      <div className="px-4 pb-4 pt-1 flex-shrink-0">
        <nav
          className="rounded-[28px] flex items-center justify-around px-2 py-2"
          style={{
            background: 'var(--app-nav)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--app-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          {NAV_ITEMS.map(({ id, icon, label }) => {
            const active = activeScreen === id;
            return (
              <button
                key={id}
                onClick={() => setActiveScreen(id)}
                className="flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all"
                style={{
                  background: active ? 'var(--app-pink-surface)' : 'transparent',
                  minWidth: 64,
                }}
              >
                <span
                  style={{
                    color: active ? 'var(--app-pink)' : 'var(--app-dimmed)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {icon}
                </span>
                <span
                  className="text-[11px]"
                  style={{
                    color: active ? 'var(--app-pink)' : 'var(--app-dimmed)',
                    fontWeight: active ? 600 : 400,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}

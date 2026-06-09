import { useState, type ReactNode } from 'react';
import { Copy, Bell, LogOut, Trash2, ChevronRight, Heart, Sun, Moon, Smartphone, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type ThemeMode = 'dark' | 'light' | 'system';

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: ReactNode }[] = [
  { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { id: 'system', label: 'System', icon: <Smartphone className="w-4 h-4" /> },
];

function SettingRow({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div
      className="rounded-2xl px-4 py-4 flex items-center gap-3"
      style={{
        background: 'var(--app-card)',
        border: '1px solid var(--app-border)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--app-pink-surface)', color: 'var(--app-pink)' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
          {title}
        </div>
        {subtitle && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>
            {subtitle}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
      style={{
        background: value
          ? 'linear-gradient(135deg, #F8C8DC 0%, #F4A6C1 100%)'
          : 'var(--app-border)',
      }}
    >
      <div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
        style={{ transform: value ? 'translateX(26px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

export function Profile() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [voiceStorage, setVoiceStorage] = useState(true);
  const [copied, setCopied] = useState(false);

  const userName = 'You';
  const pairCode = 'LOVE-2024';

  const copyCode = () => {
    navigator.clipboard.writeText(pairCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const daysTogther = Math.floor(
    (Date.now() - new Date('2026-05-24').getTime()) / 86400000
  );

  return (
    <div className="flex-1 overflow-auto pb-4">
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>
          Profile
        </h1>
      </div>

      {/* User Info Card */}
      <div className="px-6 mb-6">
        <div
          className="rounded-3xl p-6 text-center"
          style={{
            background: 'var(--app-pink-surface)',
            border: '1px solid var(--app-pink-border)',
            boxShadow: '0 8px 32px rgba(248,200,220,0.12)',
          }}
        >
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, #F8C8DC 0%, #F4A6C1 100%)',
            }}
          >
            👤
          </div>
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: 'var(--app-text)' }}
          >
            {userName}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--app-muted)' }}>
            Connected with Car ❤️
          </p>

          {/* Anniversary counter */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'var(--app-card)',
              border: '1px solid var(--app-pink-border)',
            }}
          >
            <Heart
              className="w-4 h-4"
              style={{ color: 'var(--app-pink)', fill: 'var(--app-pink)' }}
            />
            <span className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
              {daysTogther} days together
            </span>
          </div>
        </div>
      </div>

      {/* Pair Code */}
      <div className="px-6 mb-6">
        <div
          className="rounded-3xl px-5 py-4 flex items-center justify-between"
          style={{
            background: 'var(--app-card)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--app-muted)' }}>
              Your Pair Code
            </div>
            <div
              className="text-xl font-mono font-bold"
              style={{ color: 'var(--app-pink)' }}
            >
              {pairCode}
            </div>
          </div>
          <button
            onClick={copyCode}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--app-pink-surface)' }}
          >
            {copied ? (
              <Check className="w-4 h-4" style={{ color: 'var(--app-pink)' }} />
            ) : (
              <Copy className="w-4 h-4" style={{ color: 'var(--app-pink)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Theme Section */}
      <div className="px-6 mb-5">
        <h3 className="text-sm font-semibold mb-3 px-1" style={{ color: 'var(--app-muted)' }}>
          APPEARANCE
        </h3>
        <div
          className="rounded-3xl p-4"
          style={{
            background: 'var(--app-card)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div className="text-sm font-medium mb-3" style={{ color: 'var(--app-text)' }}>
            Theme
          </div>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl text-xs font-medium transition-all"
                  style={{
                    background: active ? 'var(--app-pink-surface)' : 'var(--app-overlay)',
                    border: active
                      ? '1.5px solid var(--app-pink)'
                      : '1.5px solid transparent',
                    color: active ? 'var(--app-pink)' : 'var(--app-muted)',
                  }}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-6 mb-5">
        <h3 className="text-sm font-semibold mb-3 px-1" style={{ color: 'var(--app-muted)' }}>
          SETTINGS
        </h3>
        <div className="space-y-2">
          <SettingRow
            icon={<Bell className="w-4 h-4" />}
            title="Notifications"
            subtitle="Get notified of new notes"
            right={<Toggle value={notifications} onChange={setNotifications} />}
          />
          <SettingRow
            icon={<span className="text-base">🎤</span>}
            title="Voice Notes Storage"
            subtitle="Auto-save recordings"
            right={<Toggle value={voiceStorage} onChange={setVoiceStorage} />}
          />
          <SettingRow
            icon={<span className="text-base">🔒</span>}
            title="Privacy Settings"
            right={<ChevronRight className="w-4 h-4" style={{ color: 'var(--app-dimmed)' }} />}
          />
          <SettingRow
            icon={<span className="text-base">🔗</span>}
            title="Change Partner Code"
            right={<ChevronRight className="w-4 h-4" style={{ color: 'var(--app-dimmed)' }} />}
          />
          <SettingRow
            icon={<span className="text-base">💌</span>}
            title="Greeting Preferences"
            subtitle="Morning · Afternoon · Evening"
            right={<ChevronRight className="w-4 h-4" style={{ color: 'var(--app-dimmed)' }} />}
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="px-6 mb-4 space-y-2">
        <button
          className="w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-[0.98]"
          style={{
            background: 'rgba(255,59,48,0.08)',
            border: '1px solid rgba(255,59,48,0.2)',
          }}
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-red-400">Sign Out</span>
        </button>
        <button
          className="w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-[0.98]"
          style={{
            background: 'rgba(255,59,48,0.04)',
            border: '1px solid rgba(255,59,48,0.12)',
          }}
        >
          <Trash2 className="w-4 h-4 text-red-400 opacity-60" />
          <span className="text-sm text-red-400 opacity-60">Delete Account</span>
        </button>
      </div>

      <div className="px-6 py-4 text-center">
        <p className="text-xs" style={{ color: 'var(--app-dimmed)' }}>
          Our Notes v1.0.0 · Made with ❤️ for two
        </p>
      </div>
    </div>
  );
}

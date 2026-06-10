import { useState, type ReactNode } from 'react';
import { Copy, Bell, BellOff, LogOut, Trash2, ChevronRight, Heart, Sun, Moon, Smartphone, Check } from 'lucide-react';
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
      className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
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
        <div className="text-sm font-medium" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-body)' }}>
          {title}
        </div>
        {subtitle && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--app-muted)', fontFamily: 'var(--font-body)' }}>
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
        minHeight: 24,
        minWidth: 48,
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
  // Notification settings — single source of truth (moved from dashboard)
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifNewNotes, setNotifNewNotes] = useState(true);
  const [notifQuickSend, setNotifQuickSend] = useState(true);
  const [notifVoiceNotes, setNotifVoiceNotes] = useState(false);

  const [voiceStorage, setVoiceStorage] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showNotifSection, setShowNotifSection] = useState(false);

  const pairCode = 'LOVE-2024';

  const copyCode = () => {
    navigator.clipboard.writeText(pairCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const daysTogether = Math.floor(
    (Date.now() - new Date('2026-05-24').getTime()) / 86400000
  );

  return (
    <div className="flex-1 overflow-auto pb-4">
      {/* Header */}
      <div className="px-5 pt-9 pb-5">
        <h1
          className="text-3xl font-bold"
          style={{ color: 'var(--app-text)', fontFamily: 'var(--font-heading)' }}
        >
          Profile
        </h1>
      </div>

      {/* User Info Card */}
      <div className="px-5 mb-5">
        <div
          className="rounded-3xl p-6 text-center"
          style={{
            background: 'var(--app-pink-surface)',
            border: '1px solid var(--app-pink-border)',
            boxShadow: '0 8px 32px rgba(248,200,220,0.12)',
          }}
        >
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
            style={{ color: 'var(--app-text)', fontFamily: 'var(--font-heading)' }}
          >
            You
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--app-muted)', fontFamily: 'var(--font-body)' }}>
            Connected with Cx ❤️
          </p>

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
            <span className="text-sm font-semibold" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-body)' }}>
              {daysTogether} days together
            </span>
          </div>
        </div>
      </div>

      {/* Pair Code */}
      <div className="px-5 mb-5">
        <div
          className="rounded-3xl px-5 py-4 flex items-center justify-between"
          style={{
            background: 'var(--app-card)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div>
            <div className="text-xs mb-1" style={{ color: 'var(--app-muted)', fontFamily: 'var(--font-body)' }}>
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
            style={{ background: 'var(--app-pink-surface)', minHeight: 44, minWidth: 44 }}
          >
            {copied ? (
              <Check className="w-4 h-4" style={{ color: 'var(--app-pink)' }} />
            ) : (
              <Copy className="w-4 h-4" style={{ color: 'var(--app-pink)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="px-5 mb-5">
        <h3 className="text-xs font-semibold mb-3 px-1 tracking-wider" style={{ color: 'var(--app-muted)', fontFamily: 'var(--font-body)' }}>
          APPEARANCE
        </h3>
        <div
          className="rounded-3xl p-4"
          style={{
            background: 'var(--app-card)',
            border: '1px solid var(--app-border)',
          }}
        >
          <div className="text-sm font-medium mb-3" style={{ color: 'var(--app-text)', fontFamily: 'var(--font-body)' }}>
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
                    fontFamily: 'var(--font-body)',
                    minHeight: 64,
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

      {/* Notifications Section — sole location for notification settings */}
      <div className="px-5 mb-5">
        <h3 className="text-xs font-semibold mb-3 px-1 tracking-wider" style={{ color: 'var(--app-muted)', fontFamily: 'var(--font-body)' }}>
          NOTIFICATIONS
        </h3>
        <div className="space-y-2">
          <SettingRow
            icon={notifEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            title="Enable Notifications"
            subtitle={notifEnabled ? 'You will receive alerts' : 'All notifications off'}
            right={<Toggle value={notifEnabled} onChange={setNotifEnabled} />}
          />
          {notifEnabled && (
            <>
              <SettingRow
                icon={<span className="text-base">💌</span>}
                title="New Notes"
                subtitle="When Cx leaves you a note"
                right={<Toggle value={notifNewNotes} onChange={setNotifNewNotes} />}
              />
              <SettingRow
                icon={<span className="text-base">⚡</span>}
                title="Quick Send"
                subtitle="Love you, Miss you, etc."
                right={<Toggle value={notifQuickSend} onChange={setNotifQuickSend} />}
              />
              <SettingRow
                icon={<span className="text-base">🎤</span>}
                title="Voice Notes"
                subtitle="When a new voice note arrives"
                right={<Toggle value={notifVoiceNotes} onChange={setNotifVoiceNotes} />}
              />
            </>
          )}
        </div>
      </div>

      {/* General Settings */}
      <div className="px-5 mb-5">
        <h3 className="text-xs font-semibold mb-3 px-1 tracking-wider" style={{ color: 'var(--app-muted)', fontFamily: 'var(--font-body)' }}>
          SETTINGS
        </h3>
        <div className="space-y-2">
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
      <div className="px-5 mb-4 space-y-2">
        <button
          className="w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-[0.98]"
          style={{
            background: 'rgba(255,59,48,0.08)',
            border: '1px solid rgba(255,59,48,0.2)',
            minHeight: 52,
          }}
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium text-red-400" style={{ fontFamily: 'var(--font-body)' }}>Sign Out</span>
        </button>
        <button
          className="w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2 transition-all hover:opacity-80 active:scale-[0.98]"
          style={{
            background: 'rgba(255,59,48,0.04)',
            border: '1px solid rgba(255,59,48,0.12)',
            minHeight: 52,
          }}
        >
          <Trash2 className="w-4 h-4 text-red-400 opacity-60" />
          <span className="text-sm text-red-400 opacity-60" style={{ fontFamily: 'var(--font-body)' }}>Delete Account</span>
        </button>
      </div>

      <div className="px-5 py-4 text-center">
        <p className="text-xs" style={{ color: 'var(--app-dimmed)', fontFamily: 'var(--font-body)' }}>
          Our Notes v1.0.0 · Made with ❤️ for two
        </p>
      </div>
    </div>
  );
}

export function Notification() {
  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Lock Screen Notification
        </h2>
        <div
          className="rounded-3xl p-5 shadow-2xl"
          style={{ background: '#F8C8DC' }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: '#1A1A1A' }}
            >
              💌
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-black">💌 New Note from Cx</h3>
                <span className="text-xs text-black/60">now</span>
              </div>
              <p className="text-black text-sm leading-relaxed">
                "I miss you baby ❤️"
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-6">
          Swipe to open • Press for more
        </p>
      </div>
    </div>
  );
}
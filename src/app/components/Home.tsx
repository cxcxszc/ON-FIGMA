import { useState, useEffect } from 'react';
import { ChevronDown, Send, Paperclip, Smile } from 'lucide-react';

interface Note {
  id: string;
  from: string;
  content: string;
  time: string;
  reactions: { emoji: string; count: number }[];
}

const QUICK_MESSAGES = [
  '❤️ Love you',
  '🥺 Miss you',
  '🌸 Thinking of you',
  '☕ Check in',
  '💤 Rest well',
];

const PARTNER_NOTES: Note[] = [
  {
    id: 'p1',
    from: 'Cx',
    content: 'hiii baby ko, can u pls check all the buttons if working aside sa voice note kasi I\'m still working on it hehe. ty! I love you soooo much 🫶🫶',
    time: '5:25 PM',
    reactions: [
      { emoji: '❤️', count: 3 },
      { emoji: '🥹', count: 1 },
    ],
  },
  {
    id: 'p2',
    from: 'Cx',
    content: 'Thank you for last night. It was perfect.',
    time: 'Yesterday',
    reactions: [
      { emoji: '❤️', count: 5 },
      { emoji: '😘', count: 2 },
    ],
  },
  {
    id: 'p3',
    from: 'Cx',
    content: "Can't wait to see you this weekend baby 💕",
    time: '2 days ago',
    reactions: [{ emoji: '❤️', count: 4 }],
  },
];

const MY_NOTES: Note[] = [
  {
    id: 'm1',
    from: 'You',
    content: 'Good luck today, baby. You got this 💪',
    time: '5:30 AM',
    reactions: [{ emoji: '🥹', count: 2 }],
  },
  {
    id: 'm2',
    from: 'You',
    content: "Can't stop thinking about you ☁️",
    time: 'Yesterday',
    reactions: [
      { emoji: '❤️', count: 4 },
      { emoji: '🌸', count: 1 },
    ],
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good Night';
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
}

function usePresence(isOnline: boolean, lastSeenDate?: Date) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const update = () => {
      if (isOnline) {
        setLabel('online');
        return;
      }
      if (!lastSeenDate) {
        setLabel('offline');
        return;
      }
      const diffMs = Date.now() - lastSeenDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMs / 3600000);

      if (diffMins < 1) {
        setLabel('last seen just now');
      } else if (diffMins < 60) {
        setLabel(`last seen ${diffMins} minute${diffMins === 1 ? '' : 's'} ago`);
      } else if (diffHrs < 6) {
        setLabel(`last seen ${diffHrs} hour${diffHrs === 1 ? '' : 's'} ago`);
      } else {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const sameDay = (a: Date, b: Date) =>
          a.getFullYear() === b.getFullYear() &&
          a.getMonth() === b.getMonth() &&
          a.getDate() === b.getDate();

        const timeStr = lastSeenDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        if (sameDay(lastSeenDate, today)) {
          setLabel(`last seen today at ${timeStr}`);
        } else if (sameDay(lastSeenDate, yesterday)) {
          setLabel(`last seen yesterday at ${timeStr}`);
        } else {
          setLabel(`last seen ${lastSeenDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}`);
        }
      }
    };

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [isOnline, lastSeenDate]);

  return label;
}

function ONLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #F8C8DC 0%, #F4A6C1 100%)',
        }}
      >
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <path
            d="M2 2L2 14M2 2L7 14M7 14L12 2M12 2L12 14"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 8C14.5 4.96 16.5 2 18 2C19.5 2 19.5 4.96 19.5 8C19.5 11.04 19.5 14 18 14C16.5 14 14.5 11.04 14.5 8Z"
            stroke="white"
            strokeWidth="2.2"
          />
        </svg>
      </div>
      <div>
        <div
          className="text-base font-bold tracking-tight leading-none"
          style={{ color: 'var(--app-text)', fontFamily: 'var(--font-heading)' }}
        >
          Our Notes
        </div>
        <div className="text-[11px] leading-none mt-0.5" style={{ color: 'var(--app-pink)' }}>
          for two ♡
        </div>
      </div>
    </div>
  );
}

export function Home() {
  const [selectedTab, setSelectedTab] = useState<'my' | 'partner'>('partner');
  const [isWidgetMinimized, setIsWidgetMinimized] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [notes, setNotes] = useState({ partner: PARTNER_NOTES, my: MY_NOTES });
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  // Simulated presence — replace with real Firebase presence data
  const partnerIsOnline = false;
  const partnerLastSeen = new Date(Date.now() - 5 * 60 * 1000); // 5 mins ago for demo
  const presenceLabel = usePresence(partnerIsOnline, partnerLastSeen);

  const partnerName = 'Cx';
  const displayedNotes = selectedTab === 'partner' ? notes.partner : notes.my;

  const sendQuick = (msg: string) => {
    setSentMessage(msg);
    setTimeout(() => setSentMessage(null), 1800);
  };

  const sendNote = () => {
    if (!noteInput.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      from: 'You',
      content: noteInput.trim(),
      time: 'just now',
      reactions: [],
    };
    setNotes((prev) => ({ ...prev, my: [newNote, ...prev.my] }));
    setNoteInput('');
    setSelectedTab('my');
  };

  const addReaction = (noteId: string, emoji: string, tab: 'partner' | 'my') => {
    setNotes((prev) => ({
      ...prev,
      [tab]: prev[tab].map((n) =>
        n.id !== noteId
          ? n
          : {
              ...n,
              reactions: n.reactions.find((r) => r.emoji === emoji)
                ? n.reactions.map((r) =>
                    r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                  )
                : [...n.reactions, { emoji, count: 1 }],
            }
      ),
    }));
  };

  return (
    <div className="flex-1 overflow-auto pb-4">
      {/* Header — logo + partner presence (replaces settings icon) */}
      <div className="px-5 pt-9 pb-4">
        <div className="flex items-start justify-between">
          <ONLogo />
          {/* Partner presence chip (replaces settings icon) */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: 'var(--app-overlay)',
              border: '1px solid var(--app-border)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: partnerIsOnline ? '#34C759' : '#9CA3AF' }}
            />
            <span className="text-xs font-medium" style={{ color: 'var(--app-muted)' }}>
              {partnerName} · {presenceLabel}
            </span>
          </div>
        </div>

        {/* Greeting */}
        <div className="mt-4">
          <p
            className="text-2xl font-bold"
            style={{ color: 'var(--app-text)', fontFamily: 'var(--font-heading)' }}
          >
            {getGreeting()} ♡
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: partnerIsOnline ? '#34C759' : '#9CA3AF' }}
            />
            <span className="text-sm" style={{ color: 'var(--app-muted)' }}>
              {partnerName} is {presenceLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Latest Note Widget */}
      {!isWidgetMinimized ? (
        <div className="px-5 mb-5">
          <div
            className="relative rounded-3xl p-5 overflow-hidden"
            style={{
              background: 'var(--app-pink-surface)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--app-pink-border)',
              boxShadow: '0 8px 32px rgba(248,200,220,0.18)',
            }}
          >
            <button
              onClick={() => setIsWidgetMinimized(true)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full transition-colors"
              style={{ background: 'var(--app-overlay)' }}
            >
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--app-muted)' }} />
            </button>

            <div className="text-xs mb-2.5 font-medium tracking-wide uppercase" style={{ color: 'var(--app-muted)' }}>
              Latest Note
            </div>
            <p
              className="text-base mb-3 font-medium leading-snug"
              style={{ color: 'var(--app-text)', fontFamily: 'var(--font-heading)', lineHeight: 1.5 }}
            >
              "{PARTNER_NOTES[0].content.slice(0, 80)}{PARTNER_NOTES[0].content.length > 80 ? '…' : ''}"
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: 'var(--app-pink)' }}>
                From {partnerName}
              </span>
              <span className="text-xs" style={{ color: 'var(--app-dimmed)' }}>
                {PARTNER_NOTES[0].time}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-5 mb-4">
          <button
            onClick={() => setIsWidgetMinimized(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all hover:opacity-80"
            style={{
              background: 'var(--app-pink-surface)',
              border: '1px solid var(--app-pink-border)',
              color: 'var(--app-pink)',
            }}
          >
            <span>💌</span>
            <span>Show latest note</span>
          </button>
        </div>
      )}

      {/* Quick Send */}
      <div className="px-5 mb-5">
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: 'var(--app-text)', fontFamily: 'var(--font-body)' }}
        >
          Quick Send
        </h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_MESSAGES.map((msg, i) => (
            <button
              key={i}
              onClick={() => sendQuick(msg)}
              className="px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'var(--app-pink-surface)',
                color: 'var(--app-pink)',
                border: '1px solid var(--app-pink-border)',
                fontFamily: 'var(--font-body)',
                minHeight: 44,
              }}
            >
              {msg}
            </button>
          ))}
        </div>
        {sentMessage && (
          <div
            className="mt-3 px-4 py-2 rounded-full text-sm inline-flex items-center gap-2 animate-pulse"
            style={{
              background: 'var(--app-pink-surface)',
              color: 'var(--app-pink)',
            }}
          >
            ✓ Sent: {sentMessage}
          </div>
        )}
      </div>

      {/* Leave a Note — moved above notes feed */}
      <div className="px-5 mb-5">
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: 'var(--app-text)', fontFamily: 'var(--font-body)' }}
        >
          Leave a Note
        </h3>
        <div
          className="rounded-3xl p-4"
          style={{
            background: 'var(--app-card)',
            border: '1px solid var(--app-border)',
          }}
        >
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder={`Write something for ${partnerName}… 💌`}
            className="w-full bg-transparent border-none outline-none resize-none mb-3"
            rows={3}
            style={{
              color: 'var(--app-text)',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              lineHeight: 1.6,
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button style={{ color: 'var(--app-dimmed)' }}>
                <Paperclip className="w-5 h-5" />
              </button>
              <button style={{ color: 'var(--app-dimmed)' }}>
                <Smile className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={sendNote}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F8C8DC 0%, #F4A6C1 100%)',
                opacity: noteInput.trim() ? 1 : 0.55,
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                minHeight: 44,
              }}
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div
          className="inline-flex rounded-2xl p-1"
          style={{ background: 'var(--app-overlay)' }}
        >
          {(['partner', 'my'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className="px-5 py-2 rounded-xl text-sm transition-all"
              style={{
                background: selectedTab === tab ? 'var(--app-pink)' : 'transparent',
                color: selectedTab === tab ? 'white' : 'var(--app-muted)',
                fontWeight: selectedTab === tab ? 600 : 400,
                fontFamily: 'var(--font-body)',
                minHeight: 40,
              }}
            >
              {tab === 'partner' ? `${partnerName}'s Notes` : 'My Notes'}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Feed */}
      <div className="px-5 space-y-3 mb-4">
        {displayedNotes.map((note) => (
          <div
            key={note.id}
            className="rounded-3xl p-5"
            style={{
              background: 'var(--app-card)',
              border: '1px solid var(--app-pink-border)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💌</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--app-pink)', fontFamily: 'var(--font-body)' }}>
                From {note.from}
              </span>
            </div>
            <p
              className="text-[15px] mb-4 leading-relaxed"
              style={{ color: 'var(--app-text)', fontFamily: 'var(--font-body)' }}
            >
              {note.content}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {note.reactions.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => addReaction(note.id, r.emoji, selectedTab)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm hover:scale-105 transition-all"
                    style={{
                      background: 'var(--app-pink-surface)',
                      border: '1px solid var(--app-pink-border)',
                      minHeight: 36,
                    }}
                  >
                    <span>{r.emoji}</span>
                    <span style={{ color: 'var(--app-muted)' }}>{r.count}</span>
                  </button>
                ))}
                {['❤️', '🥹', '😘'].map((e) => (
                  <button
                    key={e}
                    onClick={() => addReaction(note.id, e, selectedTab)}
                    className="px-2 py-1.5 rounded-full text-sm opacity-30 hover:opacity-70 transition-all"
                    style={{ background: 'var(--app-overlay)', minHeight: 36 }}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <span className="text-xs ml-2" style={{ color: 'var(--app-dimmed)' }}>
                {note.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
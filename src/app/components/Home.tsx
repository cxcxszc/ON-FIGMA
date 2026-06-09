import { useState } from 'react';
import { Settings, ChevronDown, Send, Paperclip, Smile } from 'lucide-react';

interface Note {
  id: string;
  from: string;
  content: string;
  time: string;
  reactions: { emoji: string; count: number }[];
}

const QUICK_MESSAGES = [
  '❤️ I Love You',
  '🥺 Miss You',
  '🌸 Thinking of You',
  '☕ Have You Eaten?',
  '💤 Rest Well',
];

const PARTNER_NOTES: Note[] = [
  {
    id: 'p1',
    from: 'Car',
    content: 'I miss you already.',
    time: '5:45 AM',
    reactions: [
      { emoji: '❤️', count: 3 },
      { emoji: '🥹', count: 1 },
    ],
  },
  {
    id: 'p2',
    from: 'Car',
    content: 'Thank you for last night. It was perfect.',
    time: 'Yesterday',
    reactions: [
      { emoji: '❤️', count: 5 },
      { emoji: '😘', count: 2 },
    ],
  },
  {
    id: 'p3',
    from: 'Car',
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

function ONLogo() {
  return (
    <div className="flex items-center gap-2">
      {/* Minimalist ON mark */}
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
          style={{ color: 'var(--app-text)' }}
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

  const partnerName = 'Car';
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
      {/* Header */}
      <div className="px-6 pt-10 pb-5">
        <div className="flex items-start justify-between">
          <ONLogo />
          <button
            className="p-2 rounded-full transition-colors"
            style={{
              background: 'var(--app-overlay)',
            }}
          >
            <Settings className="w-5 h-5" style={{ color: 'var(--app-muted)' }} />
          </button>
        </div>

        <div className="mt-5">
          <p className="text-2xl font-bold" style={{ color: 'var(--app-text)' }}>
            {getGreeting()} ❤️
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#34C759' }}
            />
            <span className="text-sm" style={{ color: 'var(--app-muted)' }}>
              {partnerName} is online
            </span>
          </div>
        </div>
      </div>

      {/* Floating Love Widget */}
      {!isWidgetMinimized ? (
        <div className="px-6 mb-6">
          <div
            className="relative rounded-3xl p-6 overflow-hidden"
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
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
              style={{ background: 'var(--app-overlay)' }}
            >
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--app-muted)' }} />
            </button>

            <div className="text-sm mb-3" style={{ color: 'var(--app-muted)' }}>
              💌 Latest Note
            </div>
            <p
              className="text-xl mb-4 font-semibold leading-snug"
              style={{ color: 'var(--app-text)' }}
            >
              "Good luck today, baby."
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--app-pink)' }}>
                From {partnerName}
              </span>
              <span className="text-sm" style={{ color: 'var(--app-dimmed)' }}>
                5:30 AM
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 mb-4">
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
      <div className="px-6 mb-7">
        <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--app-text)' }}>
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

      {/* Tabs */}
      <div className="px-6 mb-5">
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
              }}
            >
              {tab === 'partner' ? `${partnerName}'s Notes` : 'My Notes'}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Feed */}
      <div className="px-6 space-y-4 mb-6">
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
              <span className="text-xl">💌</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--app-pink)' }}>
                From {note.from}
              </span>
            </div>
            <p className="text-base mb-4 leading-relaxed" style={{ color: 'var(--app-text)' }}>
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
                    style={{ background: 'var(--app-overlay)' }}
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

      {/* Create Note */}
      <div className="px-6 mb-2">
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
            placeholder={`Leave a note for ${partnerName}... 💌`}
            className="w-full bg-transparent border-none outline-none resize-none mb-3"
            rows={3}
            style={{
              color: 'var(--app-text)',
              fontSize: 15,
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
                opacity: noteInput.trim() ? 1 : 0.6,
              }}
            >
              <span className="text-sm">Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

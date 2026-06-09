import { useState } from 'react';
import { Calendar, X } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  date: string;
  image: string;
  caption: string;
  reactions: { emoji: string; count: number }[];
}

const MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'First Date',
    date: 'May 24, 2026',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
    caption: 'Best night of my life 💕',
    reactions: [
      { emoji: '❤️', count: 12 },
      { emoji: '😍', count: 8 },
    ],
  },
  {
    id: '2',
    title: 'Coffee Date',
    date: 'May 30, 2026',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    caption: 'Our favorite spot ☕',
    reactions: [
      { emoji: '☕', count: 5 },
      { emoji: '❤️', count: 7 },
    ],
  },
  {
    id: '3',
    title: 'Sunset Together',
    date: 'June 2, 2026',
    image: 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=800&q=80',
    caption: 'Watching the sunset with you 🌅',
    reactions: [
      { emoji: '🌅', count: 9 },
      { emoji: '💕', count: 15 },
    ],
  },
  {
    id: '4',
    title: 'Movie Night',
    date: 'June 5, 2026',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    caption: 'Cozy nights together 🍿',
    reactions: [
      { emoji: '🎬', count: 4 },
      { emoji: '❤️', count: 6 },
    ],
  },
];

export function Memories() {
  const [memories, setMemories] = useState(MEMORIES);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMemory = memories.find((m) => m.id === selectedId);

  const addReaction = (id: string, emoji: string) => {
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const exists = m.reactions.find((r) => r.emoji === emoji);
        return {
          ...m,
          reactions: exists
            ? m.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              )
            : [...m.reactions, { emoji, count: 1 }],
        };
      })
    );
  };

  return (
    <div className="flex-1 overflow-auto pb-4 relative">
      {/* Header */}
      <div className="px-6 pt-10 pb-5">
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--app-text)' }}>
          📸 Our Memories
        </h1>
        <p className="text-sm" style={{ color: 'var(--app-muted)' }}>
          Beautiful moments we've shared
        </p>
      </div>

      {/* Memory Cards */}
      <div className="px-6 space-y-5 mb-6">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="rounded-3xl overflow-hidden"
            style={{
              background: 'var(--app-card)',
              border: '1px solid var(--app-border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            {/* Image */}
            <button
              className="relative w-full aspect-[4/3] overflow-hidden block"
              onClick={() => setSelectedId(memory.id)}
            >
              <img
                src={memory.image}
                alt={memory.title}
                className="w-full h-full object-cover transition-transform hover:scale-[1.02]"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)',
                }}
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-lg leading-none mb-1">{memory.title}</h3>
                <div className="flex items-center gap-1.5 opacity-80">
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs">{memory.date}</span>
                </div>
              </div>
            </button>

            {/* Content */}
            <div className="px-5 py-4">
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--app-muted)' }}>
                {memory.caption}
              </p>
              <div
                className="flex items-center gap-2 pt-3"
                style={{ borderTop: '1px solid var(--app-border)' }}
              >
                {memory.reactions.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => addReaction(memory.id, r.emoji)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105"
                    style={{
                      background: 'var(--app-pink-surface)',
                      border: '1px solid var(--app-pink-border)',
                    }}
                  >
                    <span>{r.emoji}</span>
                    <span style={{ color: 'var(--app-pink)' }}>{r.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Memory */}
      <div className="px-6 pb-2">
        <button
          className="w-full py-4 rounded-3xl font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: 'linear-gradient(135deg, #F8C8DC 0%, #F4A6C1 100%)',
          }}
        >
          + Add New Memory
        </button>
      </div>

      {/* Photo Detail Modal */}
      {selectedMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSelectedId(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden"
            style={{ background: 'var(--app-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3]">
              <img
                src={selectedMemory.image}
                alt={selectedMemory.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.5)' }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--app-text)' }}>
                {selectedMemory.title}
              </h3>
              <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--app-muted)' }}>
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-sm">{selectedMemory.date}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--app-muted)' }}>
                {selectedMemory.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

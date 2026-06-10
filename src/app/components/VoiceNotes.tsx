'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Trash2, Heart, Mic, Square, Loader2, AlertCircle } from 'lucide-react';

// ─── Cloudinary config (replace with your own) ───────────────────────
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'demo';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? 'ml_default';

interface VoiceNote {
  id: string;
  from: string;
  duration: string;
  durationSecs: number;
  time: string;
  waveform: number[];
  isFavorite: boolean;
  reactions: number;
  audioUrl?: string;
  isUploading?: boolean;
  uploadError?: string;
}

const mockWaveform = (seed: number, bars = 40) =>
  Array.from({ length: bars }, (_, i) => {
    const v = Math.sin(i * 0.4 + seed) * 0.4 + Math.sin(i * 0.9 + seed * 2) * 0.3 + 0.3;
    return Math.max(0.08, Math.min(1, v));
  });

const INITIAL_NOTES: VoiceNote[] = [
  {
    id: '1',
    from: 'Cx',
    duration: '0:38',
    durationSecs: 38,
    time: '8:12 PM',
    waveform: mockWaveform(1.2),
    isFavorite: true,
    reactions: 3,
  },
  {
    id: '2',
    from: 'Cx',
    duration: '1:04',
    durationSecs: 64,
    time: '2:45 PM',
    waveform: mockWaveform(2.7),
    isFavorite: false,
    reactions: 5,
  },
];

async function uploadToCloudinary(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', blob, `voice_${Date.now()}.webm`);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('resource_type', 'video'); // audio is under 'video' in Cloudinary

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    { method: 'POST', body: formData }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'Upload failed');
  }
  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

function Waveform({
  bars,
  progress,
  isPlaying,
}: {
  bars: number[];
  progress: number;
  isPlaying: boolean;
}) {
  return (
    <div className="flex items-center gap-[2px] h-10 flex-1">
      {bars.map((h, i) => {
        const ratio = i / bars.length;
        const played = ratio <= progress;
        return (
          <div
            key={i}
            className="rounded-full flex-shrink-0 transition-all duration-75"
            style={{
              width: 3,
              height: `${h * 100}%`,
              background: played ? 'var(--app-pink)' : 'var(--app-border)',
              opacity: isPlaying && played ? 1 : played ? 0.85 : 0.4,
            }}
          />
        );
      })}
    </div>
  );
}

function RecordingWaveform({ isRecording }: { isRecording: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(28).fill(0.08));

  useEffect(() => {
    if (!isRecording) {
      setBars(Array(28).fill(0.08));
      return;
    }
    const interval = setInterval(() => {
      setBars((prev) => {
        const next = [...prev.slice(1)];
        next.push(Math.random() * 0.8 + 0.15);
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="flex items-center gap-[3px] h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-75"
          style={{
            width: 3,
            height: `${h * 100}%`,
            background: isRecording ? 'var(--app-pink)' : 'var(--app-border)',
          }}
        />
      ))}
    </div>
  );
}

export function VoiceNotes() {
  const [notes, setNotes] = useState<VoiceNote[]>(INITIAL_NOTES);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Playback (real audio if URL exists, simulated otherwise) ────────
  const startPlay = (note: VoiceNote) => {
    if (playingId === note.id) {
      stopPlay(note.id);
      return;
    }
    stopPlay(playingId ?? undefined);

    if (note.audioUrl) {
      // Real audio playback
      let audio = audioRefs.current[note.id];
      if (!audio) {
        audio = new Audio(note.audioUrl);
        audioRefs.current[note.id] = audio;
      }
      audio.currentTime = (progresses[note.id] ?? 0) * note.durationSecs;
      audio.play().catch(() => {});
      setPlayingId(note.id);

      audio.ontimeupdate = () => {
        const p = audio.currentTime / note.durationSecs;
        setProgresses((prev) => ({ ...prev, [note.id]: Math.min(p, 1) }));
      };
      audio.onended = () => {
        setProgresses((prev) => ({ ...prev, [note.id]: 0 }));
        setPlayingId(null);
      };
    } else {
      // Simulated playback for demo notes without audio
      setPlayingId(note.id);
      const start = (progresses[note.id] ?? 0) * note.durationSecs;
      let elapsed = start;
      playIntervalRef.current = setInterval(() => {
        elapsed += 0.1;
        const p = elapsed / note.durationSecs;
        if (p >= 1) {
          setProgresses((prev) => ({ ...prev, [note.id]: 0 }));
          setPlayingId(null);
          if (playIntervalRef.current) clearInterval(playIntervalRef.current);
          return;
        }
        setProgresses((prev) => ({ ...prev, [note.id]: p }));
      }, 100);
    }
  };

  const stopPlay = (id?: string) => {
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    if (id && audioRefs.current[id]) {
      audioRefs.current[id].pause();
    }
    setPlayingId(null);
  };

  // ─── Recording ───────────────────────────────────────────────────────
  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Pick best supported MIME type (iOS Safari prefers mp4)
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
        .find((t) => MediaRecorder.isTypeSupported(t)) ?? '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(250); // collect data every 250ms for real-time waveform
      setIsRecording(true);
      setRecordSecs(0);
      recordIntervalRef.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Microphone access denied';
      setMicError(`Could not access microphone: ${msg}`);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    setIsRecording(false);

    const recorder = mediaRecorderRef.current;
    const durationSecs = recordSecs;
    setRecordSecs(0);

    const mins = Math.floor(durationSecs / 60);
    const secs = durationSecs % 60;
    const durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    const tempId = Date.now().toString();
    const newNote: VoiceNote = {
      id: tempId,
      from: 'You',
      duration: durationStr,
      durationSecs,
      time: 'just now',
      waveform: mockWaveform(Math.random() * 5),
      isFavorite: false,
      reactions: 0,
      isUploading: true,
    };

    setNotes((prev) => [newNote, ...prev]);

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      // Stop all tracks
      recorder.stream.getTracks().forEach((t) => t.stop());

      try {
        const audioUrl = await uploadToCloudinary(blob);
        setNotes((prev) =>
          prev.map((n) =>
            n.id === tempId ? { ...n, audioUrl, isUploading: false } : n
          )
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setNotes((prev) =>
          prev.map((n) =>
            n.id === tempId
              ? { ...n, isUploading: false, uploadError: msg }
              : n
          )
        );
      }
    };

    recorder.stop();
  };

  const formatRecordTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (playingId === id) stopPlay(id);
  };

  return (
    <div className="flex-1 overflow-auto pb-36 relative">
      {/* Header */}
      <div className="px-5 pt-8 pb-5">
        <h1
          className="text-3xl mb-1"
          style={{ color: 'var(--app-text)', fontWeight: 700, fontFamily: 'var(--font-heading)' }}
        >
          🎤 Voice Notes
        </h1>
        <p style={{ color: 'var(--app-muted)', fontSize: 14, fontFamily: 'var(--font-body)' }}>
          Saved voice memories from Cx
        </p>
      </div>

      {/* Mic error banner */}
      {micError && (
        <div className="px-5 mb-4">
          <div
            className="flex items-start gap-3 rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(255,59,48,0.08)',
              border: '1px solid rgba(255,59,48,0.2)',
            }}
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400" style={{ fontFamily: 'var(--font-body)' }}>{micError}</p>
          </div>
        </div>
      )}

      {/* Voice Note Cards */}
      <div className="px-5 space-y-4">
        {notes.map((note) => {
          const playing = playingId === note.id;
          const progress = progresses[note.id] ?? 0;

          return (
            <div
              key={note.id}
              className="rounded-3xl p-5"
              style={{
                background: 'var(--app-card)',
                border: '1px solid var(--app-pink-border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              }}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎤</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--app-pink)', fontFamily: 'var(--font-body)' }}
                  >
                    Voice Note · {note.from}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleFavorite(note.id)}
                    className="transition-all hover:scale-110"
                    style={{ minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Heart
                      className="w-4 h-4"
                      style={{
                        color: note.isFavorite ? '#F8C8DC' : 'var(--app-dimmed)',
                        fill: note.isFavorite ? '#F8C8DC' : 'none',
                      }}
                    />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="transition-all hover:scale-110"
                    style={{ minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: 'var(--app-dimmed)' }} />
                  </button>
                </div>
              </div>

              {/* Upload state */}
              {note.isUploading && (
                <div className="flex items-center gap-2 mb-3" style={{ color: 'var(--app-muted)' }}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>Uploading…</span>
                </div>
              )}
              {note.uploadError && (
                <div className="flex items-center gap-2 mb-3 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs" style={{ fontFamily: 'var(--font-body)' }}>Upload failed — tap to retry</span>
                </div>
              )}

              {/* Waveform + Play */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => !note.isUploading && startPlay(note)}
                  disabled={note.isUploading}
                  className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: note.isUploading
                      ? 'var(--app-overlay)'
                      : 'linear-gradient(135deg, #F8C8DC 0%, #F4A6C1 100%)',
                    minWidth: 44,
                    minHeight: 44,
                  }}
                >
                  {note.isUploading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : playing ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  )}
                </button>
                <Waveform bars={note.waveform} progress={progress} isPlaying={playing} />
                <span
                  className="text-xs flex-shrink-0 tabular-nums"
                  style={{ color: 'var(--app-muted)', fontFamily: 'var(--font-body)' }}
                >
                  {note.duration}
                </span>
              </div>

              {/* Bottom row */}
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: '1px solid var(--app-border)' }}
              >
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105"
                  style={{
                    background: 'var(--app-pink-surface)',
                    border: '1px solid var(--app-pink-border)',
                    color: 'var(--app-pink)',
                    fontFamily: 'var(--font-body)',
                    minHeight: 36,
                  }}
                  onClick={() =>
                    setNotes((prev) =>
                      prev.map((n) =>
                        n.id === note.id ? { ...n, reactions: n.reactions + 1 } : n
                      )
                    )
                  }
                >
                  <Heart className="w-3.5 h-3.5" style={{ fill: 'var(--app-pink)', color: 'var(--app-pink)' }} />
                  <span>{note.reactions > 0 ? note.reactions : 'React'}</span>
                </button>
                <span className="text-xs" style={{ color: 'var(--app-dimmed)', fontFamily: 'var(--font-body)' }}>
                  {note.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record button area */}
      <div
        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-6 flex flex-col items-center gap-3 z-20"
        style={{ pointerEvents: 'none' }}
      >
        {isRecording && (
          <div
            className="rounded-2xl px-6 py-3 flex items-center gap-4"
            style={{
              background: 'var(--app-card)',
              border: '1px solid var(--app-pink-border)',
              boxShadow: '0 8px 32px rgba(248,200,220,0.2)',
              pointerEvents: 'auto',
            }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#FF3B30' }} />
            <RecordingWaveform isRecording={isRecording} />
            <span
              className="tabular-nums text-sm font-semibold"
              style={{ color: 'var(--app-pink)', fontFamily: 'var(--font-body)' }}
            >
              {formatRecordTime(recordSecs)}
            </span>
          </div>
        )}

        <button
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerLeave={() => isRecording && stopRecording()}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90"
          style={{
            background: isRecording
              ? 'linear-gradient(135deg, #FF6B6B 0%, #FF3B30 100%)'
              : 'linear-gradient(135deg, #F8C8DC 0%, #F4A6C1 100%)',
            boxShadow: isRecording
              ? '0 0 0 8px rgba(255,59,48,0.2)'
              : '0 8px 24px rgba(248,200,220,0.4)',
            pointerEvents: 'auto',
          }}
        >
          {isRecording ? (
            <Square className="w-6 h-6 text-white" fill="white" />
          ) : (
            <Mic className="w-7 h-7 text-white" />
          )}
        </button>
        <span
          className="text-xs"
          style={{ color: 'var(--app-muted)', pointerEvents: 'none', fontFamily: 'var(--font-body)' }}
        >
          {isRecording ? 'Release to send' : 'Hold to record'}
        </span>
      </div>
    </div>
  );
}
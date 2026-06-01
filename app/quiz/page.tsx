'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Session {
  birthYear: number;
  nativeEng: boolean;
  isProlific?: boolean;
  seenFileIds: string[];
  sessionId: string;
}

interface BatchFile {
  fileId: string;
}

interface BatchResult {
  fileId: string;
  userRating: number;
  trueScore: number;
  points: number;
}

const LABELS: Record<number, string> = {
  1: 'Definitely Straight',
  2: 'Bi with Female preference',
  3: 'Evenly Bi',
  4: 'Bi with Male preference',
  5: 'Definitely Gay',
};

function calcPoints(userRating: number, trueScore: number): number {
  const diff = Math.abs(userRating - trueScore);
  if (diff === 0) return 1;
  if (diff === 1) return 0.5;
  return 0;
}

type Phase = 'loading' | 'rating' | 'results' | 'empty';

export default function QuizPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [batch, setBatch] = useState<BatchFile[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [collected, setCollected] = useState<{ fileId: string; rating: number }[]>([]);
  const [phase, setPhase] = useState<Phase>('loading');
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [batchNumber, setBatchNumber] = useState(1);
  const [timeOnSpeaker, setTimeOnSpeaker] = useState(0);

  useEffect(() => {
    setTimeOnSpeaker(0);
    const interval = setInterval(() => setTimeOnSpeaker(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [currentIdx]);

  useEffect(() => {
    const raw = localStorage.getItem('gaydar_session');
    if (!raw) {
      router.replace('/');
      return;
    }
    const s: Session = JSON.parse(raw);
    setSession(s);
    fetchBatch(s.seenFileIds);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchBatch(seenIds: string[]) {
    setPhase('loading');
    const param = seenIds.length > 0 ? `?seen=${seenIds.join(',')}` : '';
    const res = await fetch(`/api/batch${param}`);
    const data: BatchFile[] = await res.json();
    if (data.length === 0) {
      setPhase('empty');
      return;
    }
    setBatch(data);
    setCurrentIdx(0);
    setSelectedRating(null);
    setCollected([]);
    setPhase('rating');
  }

  function handleNext() {
    if (selectedRating === null) return;
    const newCollected = [...collected, { fileId: batch[currentIdx].fileId, rating: selectedRating }];

    if (currentIdx < batch.length - 1) {
      setCollected(newCollected);
      setCurrentIdx(i => i + 1);
      setSelectedRating(null);
    } else {
      submitBatch(newCollected);
    }
  }

  async function submitBatch(finalCollected: { fileId: string; rating: number }[]) {
    if (!session) return;
    const res = await fetch('/api/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ratings: finalCollected,
        birthYear: session.birthYear,
        nativeEng: session.nativeEng,
        isProlific: session.isProlific ?? false,
        sessionId: session.sessionId,
      }),
    });
    const scores: { fileId: string; trueScore: number }[] = await res.json();
    const scoreMap = Object.fromEntries(scores.map(s => [s.fileId, s.trueScore]));

    const results: BatchResult[] = finalCollected.map(r => ({
      fileId: r.fileId,
      userRating: r.rating,
      trueScore: scoreMap[r.fileId] ?? 0,
      points: calcPoints(r.rating, scoreMap[r.fileId] ?? 0),
    }));

    const newTotal = totalScore + results.reduce((sum, r) => sum + r.points, 0);
    setTotalScore(newTotal);
    setBatchResults(results);

    const newSeen = [...session.seenFileIds, ...finalCollected.map(r => r.fileId)];
    const newSession = { ...session, seenFileIds: newSeen };
    setSession(newSession);
    localStorage.setItem('gaydar_session', JSON.stringify(newSession));

    setPhase('results');
  }

  function handleContinue() {
    if (!session) return;
    setBatchNumber(n => n + 1);
    fetchBatch(session.seenFileIds);
  }

  function handleDone() {
    const totalRated = session?.seenFileIds.length ?? 0;
    const prolificParam = session?.isProlific ? '&prolific=true' : '';
    router.replace(`/done?score=${totalScore}&total=${totalRated}${prolificParam}`);
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Loading...</p>
      </div>
    );
  }

  // ── All files exhausted ──────────────────────────────────────────────────
  if (phase === 'empty') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-semibold mb-2">You've heard them all!</h2>
          <p className="text-zinc-500 text-sm mb-6">You rated all 50 speakers. Impressive.</p>
          <button
            onClick={handleDone}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            See My Final Score
          </button>
        </div>
      </div>
    );
  }

  // ── Batch results ────────────────────────────────────────────────────────
  if (phase === 'results') {
    const batchScore = batchResults.reduce((s, r) => s + r.points, 0);
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-1">Batch {batchNumber} Results</h2>
          <p className="text-zinc-500 text-sm mb-6">
            You scored <strong>{batchScore}</strong> / {batchResults.length} this round
          </p>

          <div className="space-y-2 mb-8">
            {batchResults.map((r, i) => (
              <div
                key={r.fileId}
                className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-800">Speaker {i + 1}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    You: {LABELS[r.userRating]} · Actual: {LABELS[r.trueScore]}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    r.points === 1
                      ? 'text-green-600'
                      : r.points === 0.5
                      ? 'text-amber-500'
                      : 'text-red-400'
                  }`}
                >
                  +{r.points}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-zinc-400 mb-6">
            Running total: <strong className="text-zinc-700">{totalScore}</strong> pts
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleContinue}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Next Batch →
            </button>
            <button
              onClick={handleDone}
              className="flex-1 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 py-3 rounded-lg font-medium transition-colors"
            >
              I&apos;m Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Rating ───────────────────────────────────────────────────────────────
  const current = batch[currentIdx];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-lg">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-zinc-400">
            Batch {batchNumber} · Speaker {currentIdx + 1} of {batch.length}
          </p>
          <div className="flex gap-1.5">
            {batch.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i < currentIdx
                    ? 'bg-indigo-600'
                    : i === currentIdx
                    ? 'bg-indigo-300'
                    : 'bg-zinc-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Audio player */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-5">
          <p className="text-center text-sm font-medium text-zinc-500 mb-4">
            Speaker {currentIdx + 1}
          </p>
          {/* key forces remount (and reset) when the speaker changes */}
          <audio
            key={current.fileId}
            src={`/audio/${current.fileId}.mp3`}
            controls
            autoPlay
            className="w-full"
          />
          <p className="text-center text-xs text-zinc-400 mt-3">
            Listen as many times as you like before rating
          </p>
        </div>

        {/* Rating buttons */}
        <div className="space-y-2 mb-5">
          <p className="text-sm font-medium text-zinc-700 mb-3">
            How does this person sound to you?
          </p>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setSelectedRating(n)}
              className={`w-full py-3 px-4 rounded-xl border text-left text-sm transition-colors ${
                selectedRating === n
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-zinc-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 text-zinc-700'
              }`}
            >
              <span className="font-semibold">{n}</span>
              <span className="ml-2 opacity-80">— {LABELS[n]}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedRating === null || timeOnSpeaker < 5}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white py-3 rounded-xl font-medium transition-colors"
        >
          {currentIdx < batch.length - 1 ? 'Next Speaker →' : 'Submit Batch'}
        </button>
      </div>
    </div>
  );
}

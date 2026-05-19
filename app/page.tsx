'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [birthYear, setBirthYear] = useState('');
  const [nativeEng, setNativeEng] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1920 || year > 2010) {
      setError('Please enter a valid birth year (1920–2010).');
      return;
    }
    if (nativeEng === null) {
      setError('Please select your English background.');
      return;
    }
    const session = { birthYear: year, nativeEng, seenFileIds: [], sessionId: crypto.randomUUID() };
    localStorage.setItem('gaydar_session', JSON.stringify(session));
    router.push('/quiz');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
        <h1 className="text-3xl font-bold mb-1 text-zinc-900">Test Your Gaydar</h1>
        <p className="text-zinc-400 text-sm mb-7">A voice perception experiment</p>

        <div className="space-y-3 text-sm text-zinc-600 mb-8 leading-relaxed">
          <p>
            Can you tell if someone is gay or straight just from their voice? This short quiz
            is part of a research study on the <em>gay voice</em> — how listeners perceive
            sexuality from speech patterns alone.
          </p>
          <p>
            You'll listen to short audio clips and rate each speaker on a scale from
            1 (Definitely Straight) to 5 (Definitely Gay). After every five clips, you'll
            see how you did — then you can keep going or stop whenever you like.
          </p>
          <p>
            All speakers consented to their voices being used in this research.
            No names or identifying details are revealed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              What year were you born?
            </label>
            <input
              type="number"
              value={birthYear}
              onChange={e => setBirthYear(e.target.value)}
              placeholder="e.g. 1995"
              min={1920}
              max={2010}
              className="w-full border border-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Is English your native language?
            </label>
            <div className="flex gap-3">
              {([{ label: 'Yes', value: true }, { label: 'No', value: false }] as const).map(opt => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setNativeEng(opt.value)}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    nativeEng === opt.value
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-zinc-300 text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors mt-2"
          >
            Start Quiz →
          </button>
        </form>

        <p className="text-xs text-zinc-400 mt-6 text-center">
          Your responses are anonymous and used only for research purposes.
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [birthYear, setBirthYear] = useState('');
  const [raterRace, setRaterRace] = useState('');
  const [nativeEng, setNativeEng] = useState<boolean | null>(null);
  const [isStraight, setIsStraight] = useState<boolean | null>(null);
  const [isProlific, setIsProlific] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const year = parseInt(birthYear);
    const isTestMode = year === -1;
    if (!isTestMode && (isNaN(year) || year < 1920 || year > 2010)) {
      setError('Please enter a valid birth year (1920–2010).');
      return;
    }
    if (!isTestMode && raterRace === '') {
      setError('Please enter your race.');
      return;
    }
    if (!isTestMode && nativeEng === null) {
      setError('Please select your English background.');
      return;
    }
    if (!isTestMode && isProlific === null) {
      setError('Please answer the Prolific question.');
      return;
    }
    if (!isTestMode && isStraight === null) {
      setError('Please indicate your sexual orientation');
      return;
    }
    const session = { birthYear: year, nativeEng: isTestMode ? true : nativeEng, isProlific: isTestMode ? false : isProlific, raterRace: isTestMode ? '' : raterRace, isStraight: isTestMode ? true : isStraight, seenFileIds: [], sessionId: crypto.randomUUID() };
    localStorage.setItem('gaydar_session', JSON.stringify(session));
    router.push('/quiz');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #f0f0ff 0%, #faf5ff 50%, #eff6ff 100%)' }}>
      <div className="w-full max-w-lg">
        {/* Header accent */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11a3 3 0 116 0" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Test Your Gaydar</h1>
          <p className="text-zinc-500 mt-1 text-sm tracking-wide uppercase font-medium">A voice perception experiment</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
          {/* Info section */}
          <div className="px-8 pt-8 pb-6 space-y-3 text-[15px] text-zinc-600 leading-relaxed border-b border-zinc-100">
            <p>
              Can you tell if someone is gay or straight just from their voice? This short quiz
              is part of a research study on the <em className="text-zinc-800 not-italic font-medium">gay voice</em> — how
              listeners perceive sexuality from speech patterns alone.
            </p>
            <p>
              You'll listen to short audio clips and rate each speaker on a scale from
              <strong className="text-zinc-800 font-semibold"> 1 (Definitely Straight)</strong> to
              <strong className="text-zinc-800 font-semibold"> 5 (Definitely Gay)</strong>. After every
              five clips, you'll see how you did — then keep going or stop whenever you like.
            </p>
            <p className="text-sm text-zinc-400">
              All speakers consented to their voices being used in this research.
              No names or identifying details are revealed.
            </p>
          </div>

          {/* Form section */}
          <div className="px-8 py-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  What year were you born?
                </label>
                <input
                  type="number"
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value)}
                  placeholder="e.g. 1995"
                  min={-1}
                  max={2010}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2">
                  What race do you identify as?
                </label>
                <input
                  type="text"
                  value={raterRace}
                  onChange={e => setRaterRace(e.target.value)}
                  placeholder="In as much or as little detail as you prefer"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2.5">
                  Is English your native language?
                </label>
                <div className="flex gap-3">
                  {([{ label: 'Yes', value: true }, { label: 'No', value: false }] as const).map(opt => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setNativeEng(opt.value)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        nativeEng === opt.value
                          ? 'text-white shadow-md shadow-indigo-200'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                      style={nativeEng === opt.value
                        ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }
                        : {}}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2.5">
                  Are you completing this for Prolific?{' '}
                  <span className="font-normal text-zinc-400">(If you don&apos;t know what that is, mark No.)</span>
                </label>
                <div className="flex gap-3">
                  {([{ label: 'Yes', value: true }, { label: 'No', value: false }] as const).map(opt => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setIsProlific(opt.value)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        isProlific === opt.value
                          ? 'text-white shadow-md shadow-indigo-200'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                      style={isProlific === opt.value
                        ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }
                        : {}}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-2.5">
                  Do you identify as straight?
                </label>
                <div className="flex gap-3">
                  {([{ label: 'Yes', value: true }, { label: 'No', value: false }] as const).map(opt => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setIsStraight(opt.value)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        isStraight === opt.value
                          ? 'text-white shadow-md shadow-indigo-200'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                      style={isStraight === opt.value
                        ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }
                        : {}}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full text-white py-3.5 rounded-xl font-bold text-base transition-all hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                Start Quiz →
              </button>
            </form>

            <p className="text-xs text-zinc-400 mt-5 text-center">
              Your responses are anonymous and used only for research purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

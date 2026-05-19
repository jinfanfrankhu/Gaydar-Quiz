import Link from 'next/link';

export default async function DonePage({
  searchParams,
}: {
  searchParams: Promise<{ score?: string; total?: string }>;
}) {
  const params = await searchParams;
  const score = parseFloat(params.score ?? '0');
  const total = parseInt(params.total ?? '0');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 text-center">
        <div className="text-5xl mb-4">🏆</div>
        <h1 className="text-2xl font-bold mb-1 text-zinc-900">That&apos;s a wrap!</h1>
        <p className="text-zinc-500 text-sm mb-8">
          You rated {total} speaker{total !== 1 ? 's' : ''}.
        </p>

        {total > 0 && (
          <div className="bg-zinc-50 rounded-xl p-6 mb-8">
            <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wide">Your total score</p>
            <p className="text-5xl font-bold text-indigo-600">{score}</p>
            <p className="text-sm text-zinc-400 mt-1">out of {total} possible points</p>
            <p className="text-xs text-zinc-400 mt-3">
              +1 for exact · +0.5 for one off
            </p>
          </div>
        )}

        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          Thanks for participating. Your responses help us understand how listeners perceive
          sexuality from voice — and whether factors like age or language background play a role.
        </p>

        <Link
          href="/"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Start over
        </Link>
      </div>
    </div>
  );
}

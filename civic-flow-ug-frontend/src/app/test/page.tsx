export default function TestPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-300">CivicFlow Test</p>
            <h1 className="mt-2 text-3xl font-semibold">Tailwind Test Page</h1>
          </div>
          <nav className="hidden gap-4 text-sm text-slate-200 md:flex">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#" className="hover:text-white">Complaints</a>
            <a href="#" className="hover:text-white">Track</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
        <section className="rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900">Tailwind is working if you see this layout</h2>
            <p className="mt-3 text-slate-600">
              The test page uses Tailwind utility classes for layout, spacing, colors, and typography.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Grid card</h3>
              <p className="mt-2 text-sm text-slate-600">If Tailwind is working, this card uses spacing and rounded corners.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Button style</h3>
              <button className="mt-4 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Test button
              </button>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Responsive layout</h3>
              <p className="mt-2 text-sm text-slate-600">This page is built only for the test route and should show Tailwind classes.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

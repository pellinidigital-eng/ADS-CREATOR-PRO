"use client";

type HeroProps = {
  onGenerateClick: () => void;
  onPreviewClick: () => void;
};

const trustItems = ["Nessuna esperienza richiesta", "Output copiabili", "Pensato per mobile", "Meta, TikTok e Instagram"];
const badges = ["Meta Ads", "TikTok", "Instagram", "Reels", "Canva", "HeyGen", "InVideo"];

export function Hero({ onGenerateClick, onPreviewClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-normal text-indigo-700 shadow-sm">
            Tool pratico per Meta, TikTok e Instagram Ads
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
            Crea testi e script per le tue ads senza partire dal foglio bianco
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Inserisci prodotto, pubblico e offerta: Ads Creator PRO genera hook, headline, testi Meta Ads, CTA,
            script video e prompt creativi pronti da adattare.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
            Da un'idea confusa a copy pubblicitari pronti da testare su Meta, TikTok e Instagram.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onGenerateClick}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-base font-black text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5"
            >
              Genera la mia ads
            </button>
            <button
              onClick={onPreviewClick}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-black text-slate-800 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              Guarda cosa ottieni
            </button>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-black uppercase text-indigo-700">Preview output</p>
              <h2 className="mt-1 text-xl font-black text-slate-950">Campagna pronta da testare</h2>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">Pronta</span>
          </div>

          <div className="mt-4 space-y-3">
            <PreviewBlock label="Hook" value="Il tuo prodotto non è il problema. Forse è il messaggio." />
            <PreviewBlock label="Primary text" value="Trasforma un'idea confusa in una base pubblicitaria chiara da testare." />
            <PreviewBlock label="Headline" value="Da idea ad ads pronta" />
            <PreviewBlock label="CTA" value="Prepara il test" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span key={badge} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-900">{value}</p>
    </div>
  );
}

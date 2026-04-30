"use client";

import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";

type HeroProps = {
  onGenerateClick: () => void;
  onPreviewClick: () => void;
};

const trustItems = [
  "Nessuna esperienza richiesta",
  "Output copiabili",
  "Pensato per mobile",
  "Ideale per prodotti digitali e piccoli business"
];

const toolBadges = ["Meta Ads", "TikTok", "Instagram", "Reels", "Canva", "HeyGen", "InVideo"];

export function Hero({ onGenerateClick, onPreviewClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8faff_46%,#eef2ff_100%)]">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-indigo-100/60 to-transparent" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-3 py-1.5 text-xs font-black text-indigo-700 shadow-sm sm:text-sm">
            <Sparkles className="h-4 w-4" />
            Tool pratico per Meta, TikTok e Instagram Ads
          </div>

          <h1 className="max-w-3xl text-[2.35rem] font-black leading-[1.04] tracking-normal text-slate-950 sm:text-5xl lg:text-[4rem]">
            Crea testi e script per le tue ads senza partire dal foglio bianco
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Inserisci prodotto, pubblico e offerta: Ads Creator PRO genera hook, headline, testi Meta Ads, CTA,
            script video e prompt creativi pronti da adattare.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onGenerateClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 font-black text-white shadow-[0_18px_45px_rgba(79,70,229,0.24)] transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Genera la mia ads
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onPreviewClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-black text-slate-900 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
            >
              <PlayCircle className="h-5 w-5" />
              Guarda cosa ottieni
            </button>
          </div>

          <div className="mt-6 grid gap-2 text-sm font-semibold text-slate-600 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {toolBadges.map((badge) => (
              <span key={badge} className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="relative rounded-[24px] border border-slate-200 bg-white/90 p-3 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="rounded-[20px] border border-slate-800/80 bg-slate-950 p-4 text-white sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-indigo-200">Preview output</p>
                <h2 className="mt-1 text-lg font-black">Campagna pronta da testare</h2>
              </div>
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-100">Consigliata</span>
            </div>

            <div className="space-y-3">
              <PreviewItem label="Hook" value="Il tuo prodotto non è il problema. Forse è il messaggio." accent="text-indigo-200" />
              <PreviewItem
                label="Primary text"
                value="Trasforma un’idea confusa in una base pubblicitaria chiara da testare."
                accent="text-violet-200"
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase text-blue-100">Headline</p>
                  <p className="mt-2 text-lg font-black">Da idea ad ads pronta</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-indigo-500 p-4">
                  <p className="text-xs font-bold uppercase text-indigo-50">CTA</p>
                  <p className="mt-2 text-lg font-black">Prepara il test</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewItem({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className={`text-xs font-bold uppercase ${accent}`}>{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 sm:text-base">{value}</p>
    </div>
  );
}

"use client";

import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

type HeroProps = {
  onGenerateClick: () => void;
  onPreviewClick: () => void;
};

export function Hero({ onGenerateClick, onPreviewClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" />
            Ads Creator PRO
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
            Ads Creator PRO: genera testi e script per le tue pubblicità
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold text-slate-700 sm:text-xl">
            Crea testi, hook e script video per le tue pubblicità in pochi secondi.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Da un’idea confusa a copy pubblicitari pronti da testare su Meta, TikTok e Instagram.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onGenerateClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-black"
            >
              Genera la mia pubblicità
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onPreviewClick}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line bg-white px-5 py-3 font-bold text-ink transition hover:border-blue-200 hover:text-blue-700"
            >
              <PlayCircle className="h-5 w-5" />
              Vedi cosa crea il tool
            </button>
          </div>
        </div>

        <div className="relative rounded-lg border border-line bg-white p-4 shadow-soft">
          <div className="rounded-md bg-slate-950 p-4 text-white">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-bold">Campagna pronta</span>
              <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-100">Meta + Reels</span>
            </div>
            <div className="space-y-3">
              <div className="rounded-md bg-white/10 p-3">
                <p className="text-xs uppercase text-blue-200">Hook</p>
                <p className="mt-1 font-semibold">Hai già l’offerta. Ti manca il messaggio.</p>
              </div>
              <div className="rounded-md bg-white/10 p-3">
                <p className="text-xs uppercase text-violet-200">Primary text</p>
                <p className="mt-1 text-sm leading-6">
                  Trasforma un’idea confusa in una base pronta da testare, senza partire dal foglio bianco.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-blue-500 p-3">
                  <p className="text-xs text-blue-50">Headline</p>
                  <p className="mt-1 font-bold">Copy pronto</p>
                </div>
                <div className="rounded-md bg-violet-500 p-3">
                  <p className="text-xs text-violet-50">CTA</p>
                  <p className="mt-1 font-bold">Prepara il test</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

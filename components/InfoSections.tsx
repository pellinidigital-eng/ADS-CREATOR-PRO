import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  Clapperboard,
  FileText,
  HelpCircle,
  Layers3,
  MousePointerClick,
  PenLine,
  Sparkles,
  UsersRound
} from "lucide-react";
import type { ReactNode } from "react";

const obtainCards = [
  { title: "Testi Meta Ads da adattare", icon: FileText },
  { title: "Headline e descrizioni brevi", icon: PenLine },
  { title: "Hook per video ads", icon: Sparkles },
  { title: "Script per video da 8, 15 e 30 secondi", icon: Clapperboard },
  { title: "Angoli di vendita da testare", icon: Layers3 },
  { title: "Prompt Canva, HeyGen e InVideo", icon: Boxes },
  { title: "Idee creative per visual e video", icon: BadgeCheck }
];

const audienceCards = [
  "Creator",
  "Freelance",
  "Piccoli business",
  "Ecommerce",
  "Infoproduttori",
  "Social media manager principianti",
  "Chi vuole testare ads senza partire da zero"
];

const faqs = [
  {
    question: "Serve esperienza con Meta Ads?",
    answer: "No, il tool ti aiuta a creare una base pronta da testare."
  },
  {
    question: "Posso usarlo anche per TikTok?",
    answer: "Sì, genera hook e script adatti a TikTok, Reels e video brevi."
  },
  {
    question: "Genera campagne già perfette?",
    answer: "No, genera basi strategiche da testare e migliorare."
  },
  {
    question: "Posso usarlo per prodotti digitali?",
    answer: "Sì, è pensato soprattutto per prodotti digitali, servizi, creator e piccoli business."
  },
  {
    question: "Posso copiare i testi?",
    answer: "Sì, puoi copiare singole sezioni o tutto l’output."
  },
  {
    question: "Il tool pubblica automaticamente le ads?",
    answer: "No. Il tool genera testi, script e idee creative da copiare e adattare nelle tue campagne."
  }
];

const steps = [
  ["1", "Inserisci prodotto, pubblico e offerta"],
  ["2", "Scegli piattaforma, tono e obiettivo"],
  ["3", "Copia testi, script e prompt da testare"]
];

export function InfoSections() {
  return (
    <div className="space-y-14 sm:space-y-16">
      <section id="cosa-ottieni">
        <SectionHeading
          icon={<CheckCircle2 className="h-6 w-6 text-indigo-600" />}
          title="Cosa ottieni"
          subtitle="Output pratici, copiabili e pensati per test reali, non per riempire una pagina."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {obtainCards.map(({ title, icon: Icon }) => (
            <div key={title} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-black leading-6 text-slate-950">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          icon={<MousePointerClick className="h-6 w-6 text-violet-600" />}
          title="Come funziona"
          subtitle="Tre passaggi semplici per passare dal briefing alla prima campagna da testare."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(([number, text]) => (
            <div key={number} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 font-black text-white">
                {number}
              </span>
              <p className="font-black leading-6 text-slate-900">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          icon={<UsersRound className="h-6 w-6 text-indigo-600" />}
          title="Per chi è"
          subtitle="Per chi vuole creare una prima base di copy senza partire ogni volta da zero."
        />
        <div className="flex flex-wrap gap-2">
          {audienceCards.map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          icon={<HelpCircle className="h-6 w-6 text-violet-600" />}
          title="FAQ"
          subtitle="Le risposte rapide prima di usare il tool per la prossima campagna."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-black text-slate-950">{faq.question}</h3>
              <p className="mt-2 leading-6 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.20)] sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-black uppercase text-indigo-200">Primo test più ordinato</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Trasforma l’idea in copy, script e prompt pronti da adattare.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-300">
              Compila il form, scegli l’output essenziale e copia la campagna pronta da testare.
            </p>
          </div>
          <a
            href="#generator"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-6 py-3 font-black text-slate-950 transition hover:bg-indigo-50"
          >
            Genera Ads
          </a>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">{icon}</div>
      <div>
        <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl leading-6 text-slate-600">{subtitle}</p>
      </div>
    </div>
  );
}

import { CheckCircle2, HelpCircle, MousePointerClick, UsersRound } from "lucide-react";

const obtainCards = [
  "Testi Meta Ads pronti da adattare",
  "Headline e descrizioni brevi",
  "Hook per video ads",
  "Script per video da 8, 15 e 30 secondi",
  "Angoli di vendita da testare",
  "Prompt per Canva, Heygen e InVideo",
  "Idee creative per visual e video"
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
  }
];

export function InfoSections() {
  return (
    <div className="space-y-16">
      <section id="cosa-ottieni">
        <div className="mb-6 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-ink sm:text-3xl">Cosa ottieni</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {obtainCards.map((item) => (
            <div key={item} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <p className="font-bold text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <MousePointerClick className="h-6 w-6 text-violet-600" />
          <h2 className="text-2xl font-black text-ink sm:text-3xl">Come funziona</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1", "Inserisci offerta, pubblico, problema e beneficio."],
            ["2", "Scegli tono, piattaforma, obiettivo e tipo di output."],
            ["3", "Genera testi, script, CTA e prompt pronti da adattare."]
          ].map(([number, text]) => (
            <div key={number} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-ink font-black text-white">
                {number}
              </span>
              <p className="font-semibold leading-6 text-slate-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <UsersRound className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-black text-ink sm:text-3xl">Per chi è</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {audienceCards.map((item) => (
            <div key={item} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <p className="font-bold text-ink">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-3">
          <HelpCircle className="h-6 w-6 text-violet-600" />
          <h2 className="text-2xl font-black text-ink sm:text-3xl">FAQ</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h3 className="font-black text-ink">{faq.question}</h3>
              <p className="mt-2 leading-6 text-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-ink p-6 text-white shadow-soft sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-black sm:text-3xl">Pronto a trasformare l’idea in copy testabile?</h2>
            <p className="mt-3 max-w-2xl text-slate-300">
              Compila il form e crea una base strategica per Meta, TikTok, Instagram e campagne sponsorizzate.
            </p>
          </div>
          <a
            href="#generator"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-5 py-3 font-black text-ink transition hover:bg-blue-50"
          >
            Genera Ads
          </a>
        </div>
      </section>
    </div>
  );
}

"use client";

import { Copy, Download, Printer, RefreshCcw, Trash2 } from "lucide-react";
import type { GeneratedAdsOutput, PromptCanva, SalesAngle, VideoScript } from "@/types/ads";

type OutputSectionProps = {
  output: GeneratedAdsOutput | null;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
  onCopyAll: () => void;
  onRegenerate: () => void;
  onReset: () => void;
  onDownload: () => void;
};

const asBullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

export function outputToText(output: GeneratedAdsOutput): string {
  const parts = [
    "Ads Creator PRO - Output generato",
    `Generato il: ${output.generatedAt}`,
    "",
    "ANALISI RAPIDA DELL'ANGOLO DI VENDITA",
    `Problema percepito: ${output.quickAnalysis.perceivedProblem}`,
    `Desiderio nascosto: ${output.quickAnalysis.hiddenDesire}`,
    `Promessa pubblicitaria: ${output.quickAnalysis.adPromise}`,
    `Leva emotiva principale: ${output.quickAnalysis.emotionalLever}`,
    `Possibile obiezione: ${output.quickAnalysis.possibleObjection}`,
    `Risposta all'obiezione: ${output.quickAnalysis.objectionAnswer}`,
    "",
    "5 ANGOLI DI VENDITA",
    output.salesAngles
      .map((angle) => `${angle.type} - ${angle.title}\n${angle.explanation}\nEsempio: ${angle.example}`)
      .join("\n\n"),
    "",
    "5 PRIMARY TEXT PER META ADS",
    asBullets(output.primaryTexts),
    "",
    "10 HEADLINE",
    asBullets(output.headlines),
    "",
    "5 DESCRIZIONI BREVI",
    asBullets(output.descriptions),
    "",
    "10 HOOK PER VIDEO ADS",
    `Problema:\n${asBullets(output.videoHooks.problem)}`,
    `Desiderio:\n${asBullets(output.videoHooks.desire)}`,
    `Provocatori:\n${asBullets(output.videoHooks.provocative)}`,
    `Curiosità:\n${asBullets(output.videoHooks.curiosity)}`,
    "",
    "SCRIPT VIDEO DA 8 SECONDI",
    scriptsToText(output.scripts8),
    "",
    "SCRIPT VIDEO DA 15 SECONDI",
    scriptsToText(output.scripts15),
    "",
    "SCRIPT VIDEO DA 30 SECONDI",
    scriptsToText(output.scripts30),
    "",
    "CTA VARIATIONS",
    `Vendita diretta:\n${asBullets(output.ctas.directSale)}`,
    `WhatsApp/DM:\n${asBullets(output.ctas.whatsappDm)}`,
    `Download/acquisto digitale:\n${asBullets(output.ctas.digitalDownload)}`,
    `Urgenza:\n${asBullets(output.ctas.urgency)}`,
    `Retargeting:\n${asBullets(output.ctas.retargeting)}`,
    "",
    "PROMPT CANVA",
    output.canvaPrompts.map(canvaToText).join("\n\n"),
    "",
    "PROMPT HEYGEN",
    asBullets(output.heygenPrompts),
    "",
    "PROMPT INVIDEO",
    asBullets(output.invideoPrompts),
    "",
    "IDEE CREATIVE PER ADS",
    output.creativeIdeas.map((idea) => `- ${idea.category}: ${idea.idea}`).join("\n"),
    "",
    "CAMPAGNA PRONTA DA TESTARE",
    `Primary text: ${output.readyCampaign.primaryText}`,
    `Headline: ${output.readyCampaign.headline}`,
    `Descrizione: ${output.readyCampaign.description}`,
    `Script video consigliato: ${output.readyCampaign.videoScript}`,
    `Prompt Canva consigliato: ${output.readyCampaign.canvaPrompt}`,
    `CTA finale: ${output.readyCampaign.finalCta}`,
    "",
    "Nota: I testi generati sono una base strategica da testare. Le performance dipendono da offerta, creatività, pubblico, budget e landing page."
  ];

  return parts.join("\n");
}

function scriptsToText(scripts: VideoScript[]) {
  return scripts.map((script) => `${script.title} (${script.duration})\n${asBullets(script.steps)}`).join("\n\n");
}

function canvaToText(prompt: PromptCanva) {
  return `${prompt.title}\nFormato: ${prompt.format}\nStile: ${prompt.style}\nTesto visual: ${prompt.visualText}\nElementi: ${prompt.elements}\nAtmosfera: ${prompt.mood}\nCTA visual: ${prompt.visualCta}`;
}

function Card({
  id,
  title,
  children,
  text,
  copiedKey,
  onCopy
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  text: string;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-lg font-black text-ink">{title}</h3>
        <button
          onClick={() => onCopy(id, text)}
          className="no-print inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
        >
          <Copy className="h-4 w-4" />
          {copiedKey === id ? "Copiato!" : "Copia sezione"}
        </button>
      </div>
      {children}
    </section>
  );
}

export function OutputSection({
  output,
  copiedKey,
  onCopy,
  onCopyAll,
  onRegenerate,
  onReset,
  onDownload
}: OutputSectionProps) {
  if (!output) {
    return (
      <div
        id="output-preview"
        className="rounded-lg border border-dashed border-slate-300 bg-white/80 p-6 text-center shadow-sm"
      >
        <p className="text-lg font-black text-ink">Qui apparirà la tua campagna.</p>
        <p className="mt-2 text-muted">
          Compila il form e genera testi, hook, script, CTA, prompt visual e una campagna pronta da copiare.
        </p>
      </div>
    );
  }

  return (
    <div id="output-preview" className="print-area space-y-5">
      <div className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-blue-700">Output generato</p>
            <h2 className="mt-1 text-2xl font-black text-ink">La tua campagna pubblicitaria</h2>
            <p className="mt-1 text-sm text-muted">Generato il {output.generatedAt}</p>
          </div>
          <div className="no-print grid grid-cols-2 gap-2 sm:flex">
            <button onClick={onCopyAll} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-bold text-white">
              <Copy className="h-4 w-4" />
              {copiedKey === "all" ? "Copiato!" : "Copia tutto"}
            </button>
            <button onClick={onDownload} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700">
              <Download className="h-4 w-4" />
              TXT
            </button>
            <button onClick={() => window.print()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700">
              <Printer className="h-4 w-4" />
              PDF
            </button>
            <button onClick={onRegenerate} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700">
              <RefreshCcw className="h-4 w-4" />
              Rigenera
            </button>
            <button onClick={onReset} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-bold text-slate-700">
              <Trash2 className="h-4 w-4" />
              Svuota form
            </button>
          </div>
        </div>
      </div>

      <Card
        id="quick"
        title="1. Analisi rapida dell’angolo di vendita"
        copiedKey={copiedKey}
        onCopy={onCopy}
        text={Object.values(output.quickAnalysis).join("\n")}
      >
        <dl className="grid gap-3">
          {[
            ["Problema percepito", output.quickAnalysis.perceivedProblem],
            ["Desiderio nascosto", output.quickAnalysis.hiddenDesire],
            ["Promessa pubblicitaria", output.quickAnalysis.adPromise],
            ["Leva emotiva principale", output.quickAnalysis.emotionalLever],
            ["Possibile obiezione", output.quickAnalysis.possibleObjection],
            ["Risposta all’obiezione", output.quickAnalysis.objectionAnswer]
          ].map(([label, value]) => (
            <div key={label} className="rounded-md bg-slate-50 p-3">
              <dt className="text-sm font-black text-ink">{label}</dt>
              <dd className="mt-1 leading-6 text-slate-700">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card id="angles" title="2. 5 angoli di vendita" copiedKey={copiedKey} onCopy={onCopy} text={output.salesAngles.map((a) => `${a.type}: ${a.title}\n${a.explanation}\n${a.example}`).join("\n\n")}>
        <div className="grid gap-3">
          {output.salesAngles.map((angle: SalesAngle) => (
            <article key={angle.type} className="rounded-md bg-slate-50 p-3">
              <p className="text-sm font-black text-blue-700">{angle.type}</p>
              <h4 className="mt-1 font-black text-ink">{angle.title}</h4>
              <p className="mt-2 leading-6 text-slate-700">{angle.explanation}</p>
              <p className="mt-2 rounded-md bg-white p-3 text-sm leading-6 text-slate-700">{angle.example}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card id="primary" title="3. 5 primary text per Meta Ads" copiedKey={copiedKey} onCopy={onCopy} text={asBullets(output.primaryTexts)}>
        <List items={output.primaryTexts} />
      </Card>

      <Card id="headlines" title="4. 10 headline" copiedKey={copiedKey} onCopy={onCopy} text={asBullets(output.headlines)}>
        <TagList items={output.headlines} />
      </Card>

      <Card id="descriptions" title="5. 5 descrizioni brevi" copiedKey={copiedKey} onCopy={onCopy} text={asBullets(output.descriptions)}>
        <TagList items={output.descriptions} />
      </Card>

      <Card id="hooks" title="6. 10 hook per video ads" copiedKey={copiedKey} onCopy={onCopy} text={outputToHooksText(output)}>
        <div className="grid gap-4 md:grid-cols-2">
          <HookGroup title="Hook problema" items={output.videoHooks.problem} />
          <HookGroup title="Hook desiderio" items={output.videoHooks.desire} />
          <HookGroup title="Hook provocatori" items={output.videoHooks.provocative} />
          <HookGroup title="Hook curiosità" items={output.videoHooks.curiosity} />
        </div>
      </Card>

      <ScriptCards id="scripts8" title="7. Script video da 8 secondi" scripts={output.scripts8} copiedKey={copiedKey} onCopy={onCopy} />
      <ScriptCards id="scripts15" title="8. Script video da 15 secondi" scripts={output.scripts15} copiedKey={copiedKey} onCopy={onCopy} />
      <ScriptCards id="scripts30" title="9. Script video da 30 secondi" scripts={output.scripts30} copiedKey={copiedKey} onCopy={onCopy} />

      <Card id="ctas" title="10. CTA variations" copiedKey={copiedKey} onCopy={onCopy} text={outputToCtasText(output)}>
        <div className="grid gap-3 md:grid-cols-2">
          <HookGroup title="Vendita diretta" items={output.ctas.directSale} />
          <HookGroup title="WhatsApp/DM" items={output.ctas.whatsappDm} />
          <HookGroup title="Download/acquisto digitale" items={output.ctas.digitalDownload} />
          <HookGroup title="Urgenza" items={output.ctas.urgency} />
          <HookGroup title="Retargeting" items={output.ctas.retargeting} />
        </div>
      </Card>

      <Card id="canva" title="11. Prompt Canva" copiedKey={copiedKey} onCopy={onCopy} text={output.canvaPrompts.map(canvaToText).join("\n\n")}>
        <div className="grid gap-3">
          {output.canvaPrompts.map((prompt) => (
            <article key={prompt.title} className="rounded-md bg-slate-50 p-3 leading-6 text-slate-700">
              <h4 className="font-black text-ink">{prompt.title}</h4>
              <p><strong>Formato:</strong> {prompt.format}</p>
              <p><strong>Stile:</strong> {prompt.style}</p>
              <p><strong>Testo:</strong> {prompt.visualText}</p>
              <p><strong>Elementi:</strong> {prompt.elements}</p>
              <p><strong>Atmosfera:</strong> {prompt.mood}</p>
              <p><strong>CTA:</strong> {prompt.visualCta}</p>
            </article>
          ))}
        </div>
      </Card>

      <Card id="heygen" title="12. Prompt Heygen" copiedKey={copiedKey} onCopy={onCopy} text={asBullets(output.heygenPrompts)}>
        <List items={output.heygenPrompts} />
      </Card>

      <Card id="invideo" title="13. Prompt InVideo" copiedKey={copiedKey} onCopy={onCopy} text={asBullets(output.invideoPrompts)}>
        <List items={output.invideoPrompts} />
      </Card>

      <Card id="creative" title="14. Idee creative per ads" copiedKey={copiedKey} onCopy={onCopy} text={output.creativeIdeas.map((idea) => `${idea.category}: ${idea.idea}`).join("\n")}>
        <div className="grid gap-3 sm:grid-cols-2">
          {output.creativeIdeas.map((idea) => (
            <div key={`${idea.category}-${idea.idea}`} className="rounded-md bg-slate-50 p-3">
              <p className="text-sm font-black text-blue-700">{idea.category}</p>
              <p className="mt-1 leading-6 text-slate-700">{idea.idea}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card id="ready" title="15. Campagna pronta da testare" copiedKey={copiedKey} onCopy={onCopy} text={Object.values(output.readyCampaign).join("\n")}>
        <div className="space-y-3 rounded-md bg-slate-950 p-4 text-white">
          <Ready label="Primary text migliore" value={output.readyCampaign.primaryText} />
          <Ready label="Headline migliore" value={output.readyCampaign.headline} />
          <Ready label="Descrizione migliore" value={output.readyCampaign.description} />
          <Ready label="Script video consigliato" value={output.readyCampaign.videoScript} />
          <Ready label="Prompt Canva consigliato" value={output.readyCampaign.canvaPrompt} />
          <Ready label="CTA finale" value={output.readyCampaign.finalCta} />
        </div>
      </Card>

      <p className="rounded-lg border border-line bg-white p-4 text-sm leading-6 text-muted">
        I testi generati sono una base strategica da testare. Le performance dipendono da offerta, creatività, pubblico, budget e landing page.
      </p>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="rounded-md bg-slate-50 p-3 leading-6 text-slate-700">
          {item}
        </li>
      ))}
    </ul>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800">
          {item}
        </span>
      ))}
    </div>
  );
}

function HookGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <h4 className="font-black text-ink">{title}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="leading-6 text-slate-700">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ScriptCards({
  id,
  title,
  scripts,
  copiedKey,
  onCopy
}: {
  id: string;
  title: string;
  scripts: VideoScript[];
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <Card id={id} title={title} copiedKey={copiedKey} onCopy={onCopy} text={scriptsToText(scripts)}>
      <div className="grid gap-3">
        {scripts.map((script) => (
          <article key={script.title} className="rounded-md bg-slate-50 p-3">
            <h4 className="font-black text-ink">{script.title} <span className="text-sm text-muted">({script.duration})</span></h4>
            <ul className="mt-2 space-y-2">
              {script.steps.map((step) => (
                <li key={step} className="leading-6 text-slate-700">{step}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Card>
  );
}

function Ready({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/10 p-3">
      <p className="text-sm font-black text-blue-200">{label}</p>
      <p className="mt-1 leading-6">{value}</p>
    </div>
  );
}

function outputToHooksText(output: GeneratedAdsOutput) {
  return [
    `Hook problema:\n${asBullets(output.videoHooks.problem)}`,
    `Hook desiderio:\n${asBullets(output.videoHooks.desire)}`,
    `Hook provocatori:\n${asBullets(output.videoHooks.provocative)}`,
    `Hook curiosità:\n${asBullets(output.videoHooks.curiosity)}`
  ].join("\n\n");
}

function outputToCtasText(output: GeneratedAdsOutput) {
  return [
    `Vendita diretta:\n${asBullets(output.ctas.directSale)}`,
    `WhatsApp/DM:\n${asBullets(output.ctas.whatsappDm)}`,
    `Download/acquisto digitale:\n${asBullets(output.ctas.digitalDownload)}`,
    `Urgenza:\n${asBullets(output.ctas.urgency)}`,
    `Retargeting:\n${asBullets(output.ctas.retargeting)}`
  ].join("\n\n");
}

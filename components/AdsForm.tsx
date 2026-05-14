"use client";

import type { ReactNode } from "react";
import type { AdsFormInput, Aggressiveness, CampaignGoal, OutputType, Platform, Tone } from "@/types/ads";

type AdsFormProps = {
  value: AdsFormInput;
  isLoading: boolean;
  validationMessage: string | null;
  onChange: (value: AdsFormInput) => void;
  onSubmit: () => void;
  onReset: () => void;
};

const toneOptions: Tone[] = [
  "Diretto e persuasivo",
  "Amichevole e semplice",
  "Urgente e promozionale",
  "Premium e professionale",
  "Empatico e motivazionale",
  "Provocatorio ma elegante"
];

const platformOptions: Platform[] = ["Meta Ads", "TikTok Ads", "Instagram Reels", "Facebook Feed", "Tutte"];
const aggressivenessOptions: Aggressiveness[] = ["Soft", "Medio", "Forte"];
const campaignOptions: CampaignGoal[] = [
  "Vendita diretta",
  "Lead",
  "Traffico alla landing",
  "Messaggi WhatsApp/DM",
  "Lancio prodotto",
  "Retargeting"
];

const outputOptions: OutputType[] = [
  "Testi Meta Ads",
  "Headline",
  "Descrizioni",
  "Hook video",
  "Script video 8 secondi",
  "Script video 15 secondi",
  "Script video 30 secondi",
  "Angoli di vendita",
  "CTA",
  "Prompt Canva",
  "Prompt Heygen",
  "Prompt InVideo",
  "Idee creative per visual"
];

const essentialOutputs: OutputType[] = [
  "Testi Meta Ads",
  "Headline",
  "Hook video",
  "Script video 15 secondi",
  "CTA",
  "Prompt Canva"
];

export function AdsForm({ value, isLoading, validationMessage, onChange, onSubmit, onReset }: AdsFormProps) {
  const update = <K extends keyof AdsFormInput>(key: K, fieldValue: AdsFormInput[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const toggleOutput = (option: OutputType) => {
    const next = value.outputTypes.includes(option)
      ? value.outputTypes.filter((item) => item !== option)
      : [...value.outputTypes, option];
    update("outputTypes", next);
  };

  return (
    <section id="generator" className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="mb-6">
        <p className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase text-indigo-700">
          Generatore
        </p>
        <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">Crea la tua ads</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Compila i dati principali. Più sei specifico, migliore sarà l'output.
        </p>
      </div>

      {validationMessage ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">
          {validationMessage}
        </div>
      ) : null}

      <div className="space-y-5">
        <FormBlock title="1. Offerta">
          <TextField label="Cosa vuoi promuovere?" placeholder="Es. corso online, prodotto digitale, consulenza..." value={value.productType} onChange={(v) => update("productType", v)} />
          <TextField label="Nome del prodotto o servizio" placeholder="Es. Generatore Contenuti Social PRO" value={value.productName} onChange={(v) => update("productName", v)} />
          <TextField label="Prezzo/offerta" placeholder="Es. 10,99€ invece di 29€ solo per il lancio" value={value.offer} onChange={(v) => update("offer", v)} />
        </FormBlock>

        <FormBlock title="2. Cliente">
          <TextField label="A chi vuoi venderlo?" placeholder="Es. creator principianti, piccoli business, freelance..." value={value.targetAudience} onChange={(v) => update("targetAudience", v)} />
          <TextArea label="Quale problema risolve?" placeholder="Es. non sanno cosa pubblicare, non riescono a vendere online..." value={value.mainProblem} onChange={(v) => update("mainProblem", v)} />
          <TextArea label="Cosa vuole ottenere il cliente?" placeholder="Es. creare contenuti più velocemente, trovare clienti..." value={value.audienceDesire} onChange={(v) => update("audienceDesire", v)} />
          <TextField label="Beneficio più forte" placeholder="Es. genera idee pronte in pochi secondi" value={value.mainBenefit} onChange={(v) => update("mainBenefit", v)} />
        </FormBlock>

        <FormBlock title="3. Campagna">
          <SelectField label="Tono comunicativo" value={value.tone} options={toneOptions} onChange={(v) => update("tone", v as Tone)} />
          <SelectField label="Piattaforma principale" value={value.platform} options={platformOptions} onChange={(v) => update("platform", v as Platform)} />
          <SelectField label="Livello aggressività copy" value={value.aggressiveness} options={aggressivenessOptions} onChange={(v) => update("aggressiveness", v as Aggressiveness)} />
          <SelectField label="Obiettivo campagna" value={value.campaignGoal} options={campaignOptions} onChange={(v) => update("campaignGoal", v as CampaignGoal)} />
        </FormBlock>

        <FormBlock title="4. Output">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => update("outputTypes", outputOptions)} className="min-h-11 rounded-2xl border border-slate-200 px-4 text-sm font-black text-slate-700">
              Seleziona tutto
            </button>
            <button type="button" onClick={() => update("outputTypes", essentialOutputs)} className="min-h-11 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 text-sm font-black text-indigo-700">
              Output essenziale
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {outputOptions.map((option) => (
              <label key={option} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={value.outputTypes.includes(option)}
                  onChange={() => toggleOutput(option)}
                  className="h-4 w-4 accent-indigo-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </FormBlock>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="min-h-14 w-full rounded-2xl bg-slate-950 px-5 py-3 text-base font-black text-white shadow-lg shadow-slate-900/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Generazione in corso..." : "Genera Ads"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
        >
          Svuota form
        </button>
        <p className="text-center text-xs leading-5 text-slate-500">
          Consiglio: parti con l'output essenziale se stai usando il tool da smartphone.
        </p>
      </div>
    </section>
  );
}

function FormBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
      <h3 className="mb-4 text-sm font-black uppercase text-slate-700">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function TextField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

function TextArea({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

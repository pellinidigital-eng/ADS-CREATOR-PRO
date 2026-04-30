"use client";

import { Eraser, Wand2 } from "lucide-react";
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
    <section id="generator" className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-6">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-blue-700">Generatore</p>
        <h2 className="mt-1 text-2xl font-black text-ink sm:text-3xl">Crea la tua ads</h2>
        <p className="mt-2 text-muted">Inserisci i dati principali: il tool userà fallback intelligenti per il resto.</p>
      </div>

      {validationMessage ? (
        <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-900">
          {validationMessage}
        </div>
      ) : null}

      <div className="grid gap-4">
        <Field
          label="Cosa vuoi promuovere?"
          value={value.productType}
          onChange={(text) => update("productType", text)}
          placeholder="Es. corso online, prodotto digitale, consulenza, ecommerce, servizio locale…"
        />
        <Field
          label="Nome del prodotto o servizio"
          value={value.productName}
          onChange={(text) => update("productName", text)}
          placeholder="Es. Generatore Contenuti Social PRO"
        />
        <Field
          label="A chi vuoi venderlo?"
          value={value.targetAudience}
          onChange={(text) => update("targetAudience", text)}
          placeholder="Es. creator principianti, piccoli business, freelance, mamme, estetiste…"
        />
        <Field
          label="Quale problema risolve?"
          value={value.mainProblem}
          onChange={(text) => update("mainProblem", text)}
          placeholder="Es. non sanno cosa pubblicare, non riescono a vendere online, perdono tempo…"
        />
        <Field
          label="Cosa vuole ottenere il cliente?"
          value={value.audienceDesire}
          onChange={(text) => update("audienceDesire", text)}
          placeholder="Es. creare contenuti più velocemente, trovare clienti, vendere senza stress…"
        />
        <Field
          label="Beneficio più forte"
          value={value.mainBenefit}
          onChange={(text) => update("mainBenefit", text)}
          placeholder="Es. genera idee pronte in pochi secondi"
        />
        <Field
          label="Prezzo/offerta"
          value={value.offer}
          onChange={(text) => update("offer", text)}
          placeholder="Es. 10,99€ invece di 29€ solo per il lancio"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Tono comunicativo" value={value.tone} options={toneOptions} onChange={(text) => update("tone", text as Tone)} />
          <Select label="Piattaforma principale" value={value.platform} options={platformOptions} onChange={(text) => update("platform", text as Platform)} />
          <Select label="Livello di aggressività copy" value={value.aggressiveness} options={aggressivenessOptions} onChange={(text) => update("aggressiveness", text as Aggressiveness)} />
          <Select label="Obiettivo della campagna" value={value.campaignGoal} options={campaignOptions} onChange={(text) => update("campaignGoal", text as CampaignGoal)} />
        </div>

        <div>
          <p className="mb-3 text-sm font-black text-ink">Tipo di output desiderato</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {outputOptions.map((option) => (
              <label
                key={option}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200"
              >
                <input
                  type="checkbox"
                  checked={value.outputTypes.includes(option)}
                  onChange={() => toggleOutput(option)}
                  className="h-4 w-4 accent-blue-600"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 font-black text-white shadow-soft transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Wand2 className="h-5 w-5" />
            {isLoading ? "Sto generando…" : "Genera Ads"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-line bg-white px-5 py-3 font-black text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
          >
            <Eraser className="h-5 w-5" />
            Svuota form
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-md border border-line bg-white px-3 py-3 text-ink outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-md border border-line bg-white px-3 py-3 text-ink outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

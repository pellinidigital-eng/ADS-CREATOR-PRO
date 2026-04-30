"use client";

import { CheckSquare, Eraser, Layers3, Megaphone, MousePointer2, UserRound, Wand2 } from "lucide-react";
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
        <p className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-black uppercase tracking-normal text-indigo-700">
          Generatore
        </p>
        <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">Crea la tua ads</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Compila i dati principali. Più sei specifico, migliore sarà l’output.
        </p>
      </div>

      {validationMessage ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
          {validationMessage}
        </div>
      ) : null}

      <div className="space-y-4">
        <FormBlock icon={<Megaphone className="h-5 w-5" />} title="1. Offerta" note="Descrivi cosa vuoi vendere e con quale proposta.">
          <Field
            label="Cosa vuoi promuovere?"
            value={value.productType}
            onChange={(text) => update("productType", text)}
            placeholder="Es. corso online, prodotto digitale, consulenza, ecommerce…"
          />
          <Field
            label="Nome del prodotto o servizio"
            value={value.productName}
            onChange={(text) => update("productName", text)}
            placeholder="Es. Da Zero a Digitale"
          />
          <Field
            label="Prezzo/offerta"
            value={value.offer}
            onChange={(text) => update("offer", text)}
            placeholder="Es. 10,99€ invece di 29€ per il lancio"
          />
        </FormBlock>

        <FormBlock icon={<UserRound className="h-5 w-5" />} title="2. Cliente" note="Più il problema è specifico, più gli hook saranno forti.">
          <Field
            label="A chi vuoi venderlo?"
            value={value.targetAudience}
            onChange={(text) => update("targetAudience", text)}
            placeholder="Es. creator principianti, freelance, piccoli business…"
          />
          <Field
            label="Quale problema risolve?"
            value={value.mainProblem}
            onChange={(text) => update("mainProblem", text)}
            placeholder="Es. vogliono partire online ma non sanno da dove iniziare"
          />
          <Field
            label="Cosa vuole ottenere il cliente?"
            value={value.audienceDesire}
            onChange={(text) => update("audienceDesire", text)}
            placeholder="Es. creare un primo prodotto digitale con una guida step by step"
          />
          <Field
            label="Beneficio più forte"
            value={value.mainBenefit}
            onChange={(text) => update("mainBenefit", text)}
            placeholder="Es. passare da idea confusa a piano chiaro"
          />
        </FormBlock>

        <FormBlock icon={<MousePointer2 className="h-5 w-5" />} title="3. Campagna" note="Scegli il contesto: il copy cambierà tono, CTA e formato.">
          <div className="grid gap-3 md:grid-cols-2">
            <Select label="Tono comunicativo" value={value.tone} options={toneOptions} onChange={(text) => update("tone", text as Tone)} />
            <Select label="Piattaforma principale" value={value.platform} options={platformOptions} onChange={(text) => update("platform", text as Platform)} />
            <Select label="Livello aggressività copy" value={value.aggressiveness} options={aggressivenessOptions} onChange={(text) => update("aggressiveness", text as Aggressiveness)} />
            <Select label="Obiettivo campagna" value={value.campaignGoal} options={campaignOptions} onChange={(text) => update("campaignGoal", text as CampaignGoal)} />
          </div>
        </FormBlock>

        <FormBlock icon={<Layers3 className="h-5 w-5" />} title="4. Output" note="Da smartphone puoi partire dall’essenziale e rigenerare dopo.">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => update("outputTypes", outputOptions)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-800"
            >
              <CheckSquare className="h-4 w-4 text-indigo-600" />
              Seleziona tutto
            </button>
            <button
              type="button"
              onClick={() => update("outputTypes", essentialOutputs)}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-3 py-2 text-sm font-black text-white"
            >
              Output essenziale
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {outputOptions.map((option) => (
              <label
                key={option}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/30"
              >
                <input
                  type="checkbox"
                  checked={value.outputTypes.includes(option)}
                  onChange={() => toggleOutput(option)}
                  className="h-5 w-5 shrink-0 accent-indigo-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </FormBlock>

        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onSubmit}
              disabled={isLoading}
              className="inline-flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-base font-black text-white shadow-[0_18px_40px_rgba(79,70,229,0.22)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Wand2 className="h-5 w-5" />
              {isLoading ? "Sto generando…" : "Genera Ads"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              <Eraser className="h-5 w-5" />
              Svuota form
            </button>
          </div>
          <p className="mt-3 text-center text-xs font-semibold leading-5 text-slate-500">
            Consiglio: parti con l’output essenziale se stai usando il tool da smartphone.
          </p>
        </div>
      </div>
    </section>
  );
}

function FormBlock({
  icon,
  title,
  note,
  children
}: {
  icon: ReactNode;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{note}</p>
        </div>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
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
      <span className="mb-2 block text-sm font-black text-slate-900">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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
      <span className="mb-2 block text-sm font-black text-slate-900">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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

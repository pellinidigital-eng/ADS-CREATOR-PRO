"use client";

import { useRef, useState } from "react";
import { AdsForm } from "@/components/AdsForm";
import { Hero } from "@/components/Hero";
import { InfoSections } from "@/components/InfoSections";
import { OutputSection, outputToText } from "@/components/OutputSection";
import { createEmptyInput, generateAds } from "@/lib/adGenerator";
import type { AdsFormInput, GeneratedAdsOutput } from "@/types/ads";

export default function Home() {
  const [form, setForm] = useState<AdsFormInput>(() => createEmptyInput());
  const [output, setOutput] = useState<GeneratedAdsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);

  const scrollToGenerator = () => {
    document.getElementById("generator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToOutput = () => {
    document.getElementById("output-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validate = () => {
    const required = [form.productType, form.targetAudience, form.mainProblem, form.mainBenefit];
    return required.every((item) => item.trim().length > 0);
  };

  const handleGenerate = () => {
    if (!validate()) {
      setValidationMessage("Compila almeno prodotto, pubblico, problema e beneficio per ottenere un output più preciso.");
      scrollToGenerator();
      return;
    }

    setValidationMessage(null);
    setIsLoading(true);
    window.setTimeout(() => {
      setOutput(generateAds(form));
      setIsLoading(false);
      window.setTimeout(scrollToOutput, 80);
    }, 800);
  };

  const handleReset = () => {
    setForm(createEmptyInput());
    setOutput(null);
    setValidationMessage(null);
    setCopiedKey(null);
  };

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1600);
  };

  const handleCopyAll = async () => {
    if (!output) return;
    await copyText("all", outputToText(output));
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([outputToText(output)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ads-creator-pro-output.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <Hero onGenerateClick={scrollToGenerator} onPreviewClick={scrollToOutput} />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="lg:sticky lg:top-5 lg:self-start">
          <AdsForm
            value={form}
            isLoading={isLoading}
            validationMessage={validationMessage}
            onChange={setForm}
            onSubmit={handleGenerate}
            onReset={handleReset}
          />
        </div>

        <div ref={outputRef}>
          {isLoading ? (
            <div className="rounded-lg border border-line bg-white p-8 text-center shadow-soft">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
              <p className="mt-5 text-lg font-black text-ink">Sto creando angoli, hook e script da testare…</p>
              <p className="mt-2 text-muted">Sto variando tono, CTA e strutture per evitare testi ripetitivi.</p>
            </div>
          ) : (
            <OutputSection
              output={output}
              copiedKey={copiedKey}
              onCopy={copyText}
              onCopyAll={handleCopyAll}
              onRegenerate={handleGenerate}
              onReset={handleReset}
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <InfoSections />
      </div>
    </main>
  );
}

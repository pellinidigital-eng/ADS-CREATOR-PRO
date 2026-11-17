import type {
  AdsFormInput,
  CreativeIdea,
  GeneratedAdsOutput,
  PromptCanva,
  SalesAngle,
  VideoScript
} from "@/types/ads";

const allOutputs: AdsFormInput["outputTypes"] = [
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

const clean = (value: string) => value.trim().replace(/\s+/g, " ");
const lowerFirst = (value: string) => (value ? value.charAt(0).toLowerCase() + value.slice(1) : value);

function pickBase(input: AdsFormInput) {
  const productType = clean(input.productType) || "offerta";
  const productName = clean(input.productName) || productType;
  const audience = clean(input.targetAudience) || "persone interessate a questa soluzione";
  const problem = clean(input.mainProblem) || "non sanno da dove iniziare";
  const desire = clean(input.audienceDesire) || "ottenere un risultato più chiaro e organizzato";
  const benefit = clean(input.mainBenefit) || "partire da una base pronta da adattare";
  const offer = clean(input.offer);

  return {
    productType,
    productName,
    audience: lowerFirst(audience),
    problem: lowerFirst(problem),
    desire: lowerFirst(desire),
    benefit: lowerFirst(benefit),
    offer
  };
}

function makeAngles(base: ReturnType<typeof pickBase>): SalesAngle[] {
  return [
    { type: "Problema", title: "Problema dichiarato", explanation: `Il pubblico ${base.audience} segnala: ${base.problem}.`, example: `Se ${base.problem}, scopri ${base.productName}: ${base.benefit}.` },
    { type: "Beneficio", title: "Vantaggio concreto", explanation: `Metti in evidenza il beneficio indicato: ${base.benefit}.`, example: `${base.productName}: ${base.benefit}.` },
    { type: "Desiderio", title: "Risultato desiderato", explanation: `Collega il messaggio al desiderio: ${base.desire}.`, example: `Vuoi ${base.desire}? Scopri ${base.productName}.` },
    { type: "Pubblico", title: "A chi è rivolto", explanation: `Parla direttamente a ${base.audience}.`, example: `Per ${base.audience}: ${base.productName}.` },
    { type: "Offerta", title: "Condizioni dichiarate", explanation: base.offer ? `Condizioni indicate dal cliente: ${base.offer}.` : "Nessuna offerta specifica dichiarata.", example: base.offer ? `${base.productName}. ${base.offer}` : `${base.productName}. Scopri i dettagli.` }
  ];
}

function makePrimaryTexts(base: ReturnType<typeof pickBase>): string[] {
  return [
    `Se ${base.problem}, scopri ${base.productName}: ${base.benefit}. Pensato per ${base.audience}.`,
    `${base.productName} si rivolge a ${base.audience}. Il problema: ${base.problem}. Il beneficio: ${base.benefit}.`,
    `Vuoi ${base.desire}? Valuta ${base.productName}: ${base.benefit}.`,
    `Per ${base.audience} che affronta ${base.problem}: scopri ${base.productName}.`,
    `${base.productName}: ${base.benefit}. ${base.offer || "Scopri i dettagli prima di scegliere."}`
  ];
}

function makeHeadlines(base: ReturnType<typeof pickBase>): string[] {
  return [
    base.productName,
    `Scopri ${base.productName}`,
    `Per ${base.audience}`,
    `Problema: ${base.problem}`,
    `Obiettivo: ${base.desire}`,
    `${base.productName}: ${base.benefit}`,
    `Un vantaggio: ${base.benefit}`,
    `Valuta ${base.productName}`,
    `A chi serve ${base.productName}?`,
    `I dettagli di ${base.productName}`
  ].map((value) => value.length > 70 ? value.slice(0, 67).trimEnd() + "..." : value);
}

function makeDescriptions(base: ReturnType<typeof pickBase>): string[] {
  return [
    `${base.productName}: ${base.benefit}`,
    `Pensato per ${base.audience}`,
    `Per chi vuole ${base.desire}`,
    `Scopri ${base.productName}`,
    `Problema: ${base.problem}`
  ];
}

function makeHooks(base: ReturnType<typeof pickBase>) {
  return {
    problem: [`Ti capita che ${base.problem}?`, `Se ${base.problem}, scopri una possibile soluzione.`, `Per ${base.audience}: come affrontare ${base.problem}?`],
    desire: [`Vuoi ${base.desire}?`, `Cosa cambierebbe se riuscissi a ${base.desire}?`, `Scopri ${base.productName}: ${base.benefit}.`],
    provocative: [`Il problema è davvero ${base.problem}?`, `Quanto conta ${base.benefit} per ${base.audience}?`],
    curiosity: [`Conosci già ${base.productName}?`, `Ecco cosa offre ${base.productName} a ${base.audience}.`]
  };
}

function makeScript(title: string, duration: VideoScript["duration"], steps: string[]): VideoScript {
  return { title, duration, steps };
}

function makeScripts(base: ReturnType<typeof pickBase>) {
  const scripts8: VideoScript[] = [
    makeScript("Problema e prodotto", "8s", [
      `0–2s: mostra una situazione collegata al problema "${base.problem}".`,
      `2–4s: testo a schermo: "${base.productName}".`,
      `4–6s: evidenzia il beneficio dichiarato: "${base.benefit}".`,
      `6–8s: invito a scoprire ${base.productName} senza promesse non verificate.`
    ]),
    makeScript("Desiderio del pubblico", "8s", [
      `0–2s: domanda per ${base.audience}: "Vuoi ${base.desire}?"`,
      `2–4s: mostra ${base.productName} in un contesto realistico.`,
      `4–6s: testo: "${base.benefit}".`,
      "6–8s: CTA: 'Scopri i dettagli'."
    ])
  ];
  const scripts15: VideoScript[] = [
    makeScript("Problema, soluzione, invito", "15s", [
      `0–3s: hook sul problema dichiarato: "${base.problem}".`,
      `3–6s: mostra una situazione riconoscibile per ${base.audience}.`,
      `6–11s: presenta ${base.productName} e il beneficio "${base.benefit}" senza aggiungere risultati inventati.`,
      `11–15s: invita a scoprire ${base.productName}.`
    ]),
    makeScript("Obiettivo concreto", "15s", [
      `0–3s: apri con il desiderio "${base.desire}".`,
      `3–7s: presenta ${base.productName} a ${base.audience}.`,
      `7–12s: illustra il beneficio dichiarato "${base.benefit}" con una scena dimostrabile.`,
      "12–15s: CTA: 'Scopri come funziona'."
    ])
  ];
  const scripts30: VideoScript[] = [
    makeScript("Storia del cliente", "30s", [
      `0–5s: mostra una situazione quotidiana di ${base.audience}, senza inventare testimonianze.`,
      `5–10s: descrivi il problema "${base.problem}".`,
      `10–17s: presenta ${base.productName} e il suo utilizzo reale.`,
      `17–24s: collega il beneficio dichiarato "${base.benefit}" al desiderio "${base.desire}".`,
      "24–30s: CTA: 'Scopri i dettagli', senza urgenza o sconti inventati."
    ]),
    makeScript("Dimostrazione del prodotto", "30s", [
      `0–6s: domanda diretta a ${base.audience} sul problema "${base.problem}".`,
      `6–13s: inquadra ${base.productName} in uso, solo se è disponibile una dimostrazione reale.`,
      `13–21s: spiega il beneficio dichiarato "${base.benefit}".`,
      `21–26s: richiama il risultato desiderato "${base.desire}" senza garantirlo.`,
      "26–30s: CTA: 'Valuta se fa per te'."
    ])
  ];
  return { scripts8, scripts15, scripts30 };
}

function makeCtas(base: ReturnType<typeof pickBase>) {
  const name = base.productName;
  return {
    directSale: [`Scopri ${name}`, `Richiedi informazioni su ${name}`, "Verifica disponibilità e dettagli"],
    whatsappDm: [`Chiedi informazioni su ${name}`, `Scrivici per conoscere ${name}`, "Parla con noi"],
    digitalDownload: [`Scopri come ottenere ${name}`, `Consulta i dettagli di ${name}`, "Verifica il formato disponibile"],
    urgency: [`Scopri ${name}`, "Verifica le condizioni attuali", "Richiedi informazioni"],
    retargeting: [`Riscopri ${name}`, `Valuta il beneficio: ${base.benefit}`, "Rivedi i dettagli"]
  };
}

function makeCanvaPrompts(base: ReturnType<typeof pickBase>): PromptCanva[] {
  return [
    {
      title: "Problema e soluzione",
      format: "1080x1350 feed Meta/Instagram",
      style: "Layout pulito, testo leggibile e fotografie autentiche del prodotto",
      visualText: `${base.productName}: ${base.benefit}`,
      elements: `Visual reale di ${base.productName}; evidenziare il problema "${base.problem}" senza inventare prima/dopo`,
      mood: "Credibile e coerente con l'attività",
      visualCta: `Scopri ${base.productName}`
    },
    {
      title: "Il prodotto per il suo pubblico",
      format: "1080x1920 Stories/Reels",
      style: "Composizione verticale accessibile con pochi elementi e buon contrasto",
      visualText: `Per ${base.audience}: ${base.productName}`,
      elements: `Mostrare ${base.productName} in un contesto reale per ${base.audience}; non simulare recensioni`,
      mood: "Diretto e autentico",
      visualCta: "Scopri i dettagli"
    },
    {
      title: "Beneficio verificabile",
      format: "1200x628 Facebook Feed",
      style: "Layout editoriale semplice con headline e immagine pertinente",
      visualText: base.benefit,
      elements: `Immagine reale di ${base.productName}; riportare solo condizioni di offerta confermate`,
      mood: "Chiaro e affidabile",
      visualCta: `Valuta ${base.productName}`
    }
  ];
}

function makeCreativeIdeas(base: ReturnType<typeof pickBase>): CreativeIdea[] {
  return [
    { category: "Faceless", idea: `Mostra una situazione reale collegata a "${base.problem}" e presenta ${base.productName}.` },
    { category: "Faceless", idea: `Carosello per ${base.audience}: problema, beneficio "${base.benefit}", invito a scoprire ${base.productName}.` },
    { category: "Faceless", idea: `Tre dettagli verificabili di ${base.productName} con immagini autentiche.` },
    { category: "Dimostrazione", idea: `Mostra ${base.productName} in uso, solo se una dimostrazione reale è disponibile.` },
    { category: "Dimostrazione", idea: `Spiega come ${base.productName} può contribuire a "${base.desire}" senza promettere risultati garantiti.` },
    { category: "Domande frequenti", idea: `Rispondi a un dubbio reale di ${base.audience} su ${base.productName}.` },
    { category: "Prova reale", idea: `Mostra un caso verificabile relativo a ${base.productName}; non inventare testimonianze.` },
    { category: "Confronto", idea: `Confronta il problema "${base.problem}" con il beneficio dichiarato "${base.benefit}".` }
  ];
}

export function generateAds(input: AdsFormInput): GeneratedAdsOutput {
  const base = pickBase(input);
  const salesAngles = makeAngles(base);
  const primaryTexts = makePrimaryTexts(base);
  const headlines = makeHeadlines(base);
  const descriptions = makeDescriptions(base);
  const videoHooks = makeHooks(base);
  const scripts = makeScripts(base);
  const ctas = makeCtas(base);
  const canvaPrompts = makeCanvaPrompts(base);
  const heygenPrompts = [
    `Crea un video avatar per ${base.audience} sul prodotto ${base.productName}. Apri con il problema "${base.problem}", illustra soltanto il beneficio dichiarato "${base.benefit}" e invita a scoprire i dettagli. Tono: ${input.tone}. Non inventare testimonianze o risultati.`,
    `Video breve per ${base.audience}: presenta ${base.productName}, collega il desiderio "${base.desire}" al beneficio "${base.benefit}" senza promettere risultati garantiti. CTA: Scopri ${base.productName}.`
  ];
  const invideoPrompts = [
    `Video ads per ${base.productName}: scena iniziale sul problema "${base.problem}", poi riprese autentiche del prodotto, beneficio "${base.benefit}" e CTA finale. Non usare immagini di altri prodotti.`,
    `Reels in tre scene rivolto a ${base.audience}: problema "${base.problem}", dimostrazione reale di ${base.productName} se disponibile, desiderio "${base.desire}" e invito a informarsi. Evita dati e sconti inventati.`
  ];
  const creativeIdeas = makeCreativeIdeas(base);
  // La CTA della campagna pronta deve rispettare l'obiettivo scelto, non
  // proporre sempre una vendita diretta a chi vuole contatti o traffico.
  const goalCta: Record<AdsFormInput["campaignGoal"], string> = {
    "Vendita diretta": ctas.directSale[0],
    "Lead": `Richiedi informazioni su ${base.productName}`,
    "Traffico alla landing": `Scopri i dettagli di ${base.productName}`,
    "Messaggi WhatsApp/DM": ctas.whatsappDm[0],
    "Lancio prodotto": `Scopri ${base.productName}`,
    "Retargeting": ctas.retargeting[0]
  };

  return {
    quickAnalysis: {
      perceivedProblem: `Per ${base.audience}, il problema dichiarato è: ${base.problem}.`,
      hiddenDesire: `Risultato desiderato: ${base.desire}.`,
      adPromise: `${base.productName}: ${base.benefit}. Verificare che il beneficio sia supportato da prove.`,
      emotionalLever: `Collegare il problema "${base.problem}" al desiderio "${base.desire}".`,
      possibleObjection: `Il beneficio "${base.benefit}" potrebbe richiedere dettagli o prove.`,
      objectionAnswer: `Verificare i dettagli di ${base.productName} prima di pubblicare annunci.`
    },
    salesAngles,
    primaryTexts,
    headlines,
    descriptions,
    videoHooks,
    scripts8: scripts.scripts8,
    scripts15: scripts.scripts15,
    scripts30: scripts.scripts30,
    ctas,
    canvaPrompts,
    heygenPrompts,
    invideoPrompts,
    creativeIdeas,
    readyCampaign: {
      primaryText: primaryTexts[0],
      headline: headlines[0],
      description: descriptions[0],
      videoScript: scripts.scripts15[0].steps.join(" "),
      canvaPrompt: canvaPrompts[0].visualText,
      finalCta: goalCta[input.campaignGoal]
    },
    generatedAt: new Date().toLocaleString("it-IT")
  };
}

export function createEmptyInput(): AdsFormInput {
  return {
    productType: "",
    productName: "",
    targetAudience: "",
    mainProblem: "",
    audienceDesire: "",
    mainBenefit: "",
    offer: "",
    tone: "Diretto e persuasivo",
    platform: "Meta Ads",
    aggressiveness: "Medio",
    campaignGoal: "Vendita diretta",
    outputTypes: allOutputs
  };
}

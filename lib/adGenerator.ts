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
  const offer = clean(input.offer) || "offerta disponibile";

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
    { type: "Offerta", title: "Condizioni dichiarate", explanation: `Non inventare sconti o disponibilità: ${base.offer}.`, example: `${base.productName}. ${base.offer === "offerta disponibile" ? "Scopri i dettagli dell'offerta." : base.offer}` }
  ];
}

function makePrimaryTexts(base: ReturnType<typeof pickBase>): string[] {
  return [
    `Se ${base.problem}, scopri ${base.productName}: ${base.benefit}. Pensato per ${base.audience}.`,
    `${base.productName} si rivolge a ${base.audience}. Il problema: ${base.problem}. Il beneficio: ${base.benefit}.`,
    `Vuoi ${base.desire}? Valuta ${base.productName}: ${base.benefit}.`,
    `Per ${base.audience} che affronta ${base.problem}: scopri ${base.productName}.`,
    `${base.productName}: ${base.benefit}. ${base.offer === "offerta disponibile" ? "Scopri i dettagli prima di scegliere." : base.offer}`
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

function makeCtas() {
  return {
    directSale: ["Prepara la tua campagna", "Crea la prima bozza", "Accedi alla base pronta"],
    whatsappDm: ["Scrivimi per partire", "Chiedi il link del tool", "Mandami la tua offerta"],
    digitalDownload: ["Scarica e adatta i testi", "Accedi al tool digitale", "Parti dal template operativo"],
    urgency: ["Usa il prezzo lancio", "Prepara il test oggi", "Blocca l'accesso al tool"],
    retargeting: ["Riparti da una bozza chiara", "Torna alla tua campagna", "Rivedi gli angoli da testare"]
  };
}

function makeCanvaPrompts(base: ReturnType<typeof pickBase>): PromptCanva[] {
  return [
    {
      title: "Visual prima/dopo",
      format: "1080x1350 feed Meta/Instagram",
      style: "Pulito, premium, con sfondo chiaro e accento blu/viola",
      visualText: "Da idea confusa ad ads pronta",
      elements: "Due colonne: appunti disordinati a sinistra, card ordinata a destra",
      mood: "Professionale, pratico, rassicurante",
      visualCta: "Prepara il test"
    },
    {
      title: "Mockup campagna",
      format: "1080x1920 Stories/Reels",
      style: "Dashboard verticale con card bianche e testi leggibili",
      visualText: "Hook, headline, CTA e script in un unico output",
      elements: "Telefono, card output, spunte verdi, badge piattaforme",
      mood: "Moderno e concreto",
      visualCta: "Crea la tua bozza"
    },
    {
      title: "Offerta chiara",
      format: "1200x628 Facebook Feed",
      style: "Layout editoriale con headline forte e mini elenco",
      visualText: base.benefit,
      elements: "Titolo, tre bullet, prezzo/offerta se presente",
      mood: "Semplice, diretto, credibile",
      visualCta: "Scopri la base pronta"
    }
  ];
}

function makeCreativeIdeas(): CreativeIdea[] {
  return [
    { category: "Faceless", idea: "Mostra una schermata con appunti confusi che diventa una campagna ordinata." },
    { category: "Faceless", idea: "Usa solo mani, tastiera e overlay testuali con hook e CTA." },
    { category: "Faceless", idea: "Crea un carosello con problema, errore comune, soluzione e CTA." },
    { category: "Screen recording", idea: "Registra la compilazione del form e il risultato finale generato." },
    { category: "Screen recording", idea: "Zoom su headline, primary text e script video già divisi in sezioni." },
    { category: "Screen recording", idea: "Mostra il prima/dopo tra documento vuoto e output completo." },
    { category: "Testimonianza/risultato", idea: "Video parlato: racconta come hai ottenuto una prima bozza più ordinata." },
    { category: "Testimonianza/risultato", idea: "Mostra tre varianti create e spiega quale testeresti per prima." },
    { category: "Prima/dopo", idea: "Prima: frase generica. Dopo: hook, beneficio e CTA più chiari." },
    { category: "Prima/dopo", idea: "Prima: mille idee sparse. Dopo: una campagna pronta da adattare." }
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
  const ctas = makeCtas();
  const canvaPrompts = makeCanvaPrompts(base);
  const heygenPrompts = [
    `Parla in modo naturale a ${base.audience}. Apri con il blocco principale, presenta ${base.productName} come base pratica da adattare e chiudi con una CTA concreta.`,
    `Crea un video avatar breve: problema reale, promessa prudente, esempio di output e invito a preparare la prima campagna. Tono ${input.tone.toLowerCase()}.`
  ];
  const invideoPrompts = [
    "Video ads breve e dinamico: ritmo veloce, scene con documento vuoto, appunti sparsi, output ordinato, testi overlay grandi e CTA finale.",
    "Crea un video in stile Reels: 3 scene, musica pulita, transizioni leggere, focus su hook, headline, CTA e prompt creativi generati."
  ];
  const creativeIdeas = makeCreativeIdeas();

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
      finalCta: ctas.directSale[0]
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

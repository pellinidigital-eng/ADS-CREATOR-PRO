import type {
  AdsFormInput,
  CreativeIdea,
  GeneratedAdsOutput,
  PromptCanva,
  SalesAngle,
  VideoScript
} from "@/types/ads";

const pick = <T,>(items: T[], seed: number, offset = 0): T =>
  items[Math.abs(seed + offset) % items.length];

const rotate = <T,>(items: T[], seed: number): T[] => {
  const start = Math.abs(seed) % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
};

const hashInput = (input: AdsFormInput): number => {
  const raw = `${JSON.stringify(input)}-${Date.now()}-${Math.random()}`;
  return raw.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const clean = (value: string | undefined, fallback: string): string =>
  value?.trim() ? value.trim() : fallback;

const sentenceCase = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const brief = (value: string, fallback: string): string => clean(value, fallback).replace(/\.$/, "");

const limit = (text: string, max: number): string =>
  text.length <= max ? text : `${text.slice(0, max - 1).trim()}…`;

const productFallbacks = [
  "un'offerta digitale",
  "un servizio pronto da promuovere",
  "un prodotto pensato per vendere online"
];

const desireFallbacks = [
  "ottenere una base pronta da testare",
  "capire cosa dire per farsi scegliere",
  "lanciare senza restare bloccati sulla pagina bianca"
];

const hookProblemPatterns = [
  "Stai pubblicando, ma il messaggio non fa muovere nessuno.",
  "Il problema non è l'offerta. È come la presenti nei primi secondi.",
  "Hai un prodotto valido, ma il copy sembra scritto in fretta.",
  "La tua ads non deve piacere a tutti. Deve parlare al cliente giusto.",
  "Prima di aumentare il budget, sistema il messaggio."
];

const hookDesirePatterns = [
  "Trasforma un'idea confusa in una pubblicità testabile.",
  "Parti da una base chiara, poi migliora con i dati.",
  "Scrivi meno da zero e testa più angoli.",
  "Dai al tuo pubblico un motivo concreto per fermarsi.",
  "Costruisci una campagna prima di perdere tempo sui dettagli."
];

const hookComparisonPatterns = [
  "Prima: pagina bianca. Dopo: messaggi pronti da provare.",
  "Da prodotto fermo a campagna pronta per il primo test.",
  "Meno frasi generiche, più angoli concreti.",
  "Non cambiare tutto: cambia il modo in cui lo racconti."
];

const hookCuriosityPatterns = [
  "Hai già l'offerta, ti manca il messaggio.",
  "Questa è la parte che molti saltano prima di lanciare.",
  "Il tuo cliente non compra il prodotto: compra il prossimo passo.",
  "Un buon annuncio inizia prima della grafica."
];

const ctaSoft = [
  "Crea la tua prima versione",
  "Prepara una base da testare",
  "Prova un angolo nuovo oggi",
  "Parti da un messaggio più chiaro"
];

const ctaStrong = [
  "Genera la campagna e mettila alla prova",
  "Scrivi l'annuncio prima di lanciare",
  "Trasforma l'offerta in copy testabile",
  "Porta online una versione più forte"
];

const ctaRetargeting = [
  "Riparti da un messaggio più preciso",
  "Rivedi l'offerta con un nuovo angolo",
  "Torna sulla campagna con copy migliori",
  "Dai una seconda chance al tuo lancio"
];

const ctaWhatsapp = [
  "Scrivici e ricevi il percorso più adatto",
  "Mandaci un messaggio con la tua offerta",
  "Apri la chat e capiamo da dove partire",
  "Parliamone in DM, senza giri inutili"
];

const headlineShort = [
  "Copy pronto da testare",
  "Ads più chiare",
  "Hook che fermano",
  "Messaggi meno piatti",
  "Prima ads pronta"
];

const headlineResult = [
  "Da idea a campagna",
  "Più angoli da provare",
  "Meno tempo sul copy",
  "Annunci più concreti",
  "Base pronta al lancio"
];

const headlineUrgency = [
  "Lancia con più chiarezza",
  "Sistema il copy oggi",
  "Prima di spendere budget",
  "Rendi testabile l'offerta"
];

const toneHints: Record<string, string[]> = {
  "Diretto e persuasivo": ["senza giri di parole", "con una promessa chiara"],
  "Amichevole e semplice": ["con tono naturale", "senza tecnicismi"],
  "Urgente e promozionale": ["prima del prossimo lancio", "con ritmo deciso"],
  "Premium e professionale": ["con percezione curata", "con un messaggio ordinato"],
  "Empatico e motivazionale": ["partendo dal blocco reale", "con tono incoraggiante"],
  "Provocatorio ma elegante": ["mettendo in discussione il copy attuale", "con una frizione intelligente"]
};

function buildContext(input: AdsFormInput, seed: number) {
  const productType = brief(input.productType, pick(productFallbacks, seed));
  const productName = brief(input.productName, sentenceCase(productType));
  const audience = brief(input.targetAudience, "persone che vogliono promuovere meglio la propria offerta");
  const problem = brief(input.mainProblem, "perdono tempo a scrivere annunci poco chiari");
  const desire = brief(input.audienceDesire, pick(desireFallbacks, seed, 2));
  const benefit = brief(input.mainBenefit, "creare una prima versione pronta da testare");
  const offer = brief(input.offer, "un'offerta semplice da provare");
  const toneHint = pick(toneHints[input.tone], seed, 3);
  const platform = input.platform === "Tutte" ? "Meta, TikTok e Instagram" : input.platform;
  const campaignGoal = input.campaignGoal.toLowerCase();
  const outputFocus = input.outputTypes.length
    ? input.outputTypes.slice(0, 4).join(", ")
    : "testi, hook, script e CTA";
  const intensity =
    input.aggressiveness === "Soft"
      ? "con pressione leggera e rassicurante"
      : input.aggressiveness === "Forte"
        ? "con una spinta più decisa, ma credibile"
        : "con equilibrio tra chiarezza e persuasione";

  return {
    productType,
    productName,
    audience,
    problem,
    desire,
    benefit,
    offer,
    toneHint,
    platform,
    campaignGoal,
    outputFocus,
    intensity
  };
}

function quickAnalysis(input: AdsFormInput, seed: number): GeneratedAdsOutput["quickAnalysis"] {
  const c = buildContext(input, seed);

  return {
    perceivedProblem: `Il pubblico sente che ${c.problem}, ma spesso non sa quale messaggio testare per sbloccare l'attenzione.`,
    hiddenDesire: `Non vuole solo ${c.productType}: vuole ${c.desire} senza sentirsi inesperto o dipendente da un'agenzia.`,
    adPromise: `${c.productName} aiuta ${c.audience} a ${c.benefit}, con una base concreta per ${c.platform} e per un obiettivo di ${c.campaignGoal}.`,
    emotionalLever: `La leva principale è il sollievo: passare dal dubbio al primo test pubblicitario ${c.toneHint}, ${c.intensity}.`,
    possibleObjection: `“E se non fosse adatto alla mia offerta o al mio tono?”`,
    objectionAnswer: `Il punto non è avere la campagna perfetta al primo colpo, ma creare varianti credibili da adattare, confrontare e migliorare. Focus richiesto: ${c.outputFocus}.`
  };
}

function salesAngles(input: AdsFormInput, seed: number): SalesAngle[] {
  const c = buildContext(input, seed);
  const templates = [
    {
      type: "Angolo problema",
      title: `Quando il problema è il messaggio`,
      explanation: `Parte dal blocco concreto di ${c.audience}: ${c.problem}.`,
      example: `Il tuo prodotto può essere valido, ma se l'annuncio resta vago il cliente scorre oltre. ${c.productName} ti dà una base più chiara da testare.`
    },
    {
      type: "Angolo velocità",
      title: `Dalla bozza al test in meno tempo`,
      explanation: `Valorizza il beneficio pratico: ${c.benefit}.`,
      example: `Prima di passare ore sul copy, genera hook, headline e script pensati per ${c.platform}. Poi scegli cosa provare davvero.`
    },
    {
      type: "Angolo semplicità",
      title: `Copy pubblicitario senza linguaggio complicato`,
      explanation: `Rassicura chi non ha esperienza marketing e vuole partire con ordine.`,
      example: `Non ti serve parlare come un'agenzia. Ti serve un messaggio semplice, specifico e pronto per il primo test.`
    },
    {
      type: "Angolo risultato",
      title: `Più angoli da confrontare`,
      explanation: `Promette una base strategica realistica, non risultati garantiti.`,
      example: `Con ${c.productName} crei varianti diverse per capire quale promessa, hook o CTA merita budget, soprattutto se l'obiettivo è ${c.campaignGoal}.`
    },
    {
      type: "Angolo confronto prima/dopo",
      title: `Da idea confusa a campagna pronta`,
      explanation: `Mostra il passaggio mentale più desiderabile.`,
      example: `Prima hai solo appunti sparsi. Dopo hai testi, script e visual prompt coerenti con ${c.offer}, ${c.toneHint}.`
    }
  ];

  return rotate(templates, seed);
}

function primaryTexts(input: AdsFormInput, seed: number): string[] {
  const c = buildContext(input, seed);
  const items = [
    `Hai ${c.productType}, ma il copy non convince? Crea hook e testi pronti da testare.`,
    `Prima di lanciare su ${c.platform}, prepara messaggi chiari per ${c.audience}.`,
    `Riduci il tempo sul foglio bianco: ${c.productName} crea copy e script da adattare.`,
    `Il tuo pubblico vuole ${c.desire}. Parti da un annuncio che lo dica meglio.`,
    `${c.benefit}: una base concreta per promuovere ${c.productName} con più ordine.`,
    `${c.offer}: raccontala ${c.toneHint}, senza frasi vuote.`
  ];
  return rotate(items, seed).map((item) => limit(item, 132));
}

function headlines(input: AdsFormInput, seed: number): string[] {
  const c = buildContext(input, seed);
  const custom = [
    `${c.productName}: parti ora`,
    `Il copy non deve bloccarti`,
    `Prima il messaggio`,
    `La tua ads ha un angolo?`,
    `Per ${c.audience}`,
    `Riparti con un test`,
    `Nuova base per retargeting`,
    `Da offerta a copy`,
    `Meno dubbi, più varianti`,
    `Hook pronti da provare`
  ];

  return rotate([...custom, ...headlineShort, ...headlineResult, ...headlineUrgency], seed)
    .slice(0, 10)
    .map((item) => limit(item, 40));
}

function descriptions(input: AdsFormInput, seed: number): string[] {
  const c = buildContext(input, seed);
  const items = [
    "Base pronta da testare",
    "Hook, copy e script",
    "Parti con più chiarezza",
    `Per ${limit(c.platform, 16)}`,
    "Adatta, prova, migliora"
  ];
  return rotate(items, seed).map((item) => limit(item, 30));
}

function videoHooks(input: AdsFormInput, seed: number): GeneratedAdsOutput["videoHooks"] {
  const c = buildContext(input, seed);
  return {
    problem: rotate(
      [
        `Stai promuovendo ${c.productName}, ma il copy non si ferma in testa.`,
        `Se ${c.audience} non capisce subito il valore, scorre oltre.`,
        `${sentenceCase(c.problem)}? Il messaggio va reso più specifico.`,
        ...hookProblemPatterns
      ],
      seed
    ).slice(0, 3),
    desire: rotate(
      [
        `Vuoi ${c.desire}? Parti dal messaggio, non dalla grafica.`,
        `Immagina di avere già hook, headline e script da scegliere.`,
        `${sentenceCase(c.benefit)} senza partire da zero.`,
        ...hookDesirePatterns
      ],
      seed
    ).slice(0, 3),
    provocative: rotate(
      [
        `Il tuo prodotto non è il problema. Il copy forse sì.`,
        `Non aumentare budget su un messaggio che non hai testato.`,
        ...hookComparisonPatterns
      ],
      seed
    ).slice(0, 2),
    curiosity: rotate(
      [
        `Prima di lanciare ${c.productName}, controlla questo.`,
        `C'è una frase che può cambiare il primo test.`,
        ...hookCuriosityPatterns
      ],
      seed
    ).slice(0, 2)
  };
}

function scripts8(input: AdsFormInput, seed: number): VideoScript[] {
  const c = buildContext(input, seed);
  const scripts: VideoScript[] = [
    {
      title: "Foglio bianco",
      duration: "8s",
      steps: [
        `Scena 1: schermata vuota con testo “Cosa scrivo nell'ads?”`,
        `Scena 2: compare il problema: ${c.problem}.`,
        `Scena 3: mostra ${c.productName} che genera hook e CTA.`,
        `Scena 4: “Crea la tua prima ads da testare.”`
      ]
    },
    {
      title: "Prima del lancio",
      duration: "8s",
      steps: [
        `Scena 1: countdown “Prima di mettere budget…”`,
        `Scena 2: elenco rapido di copy vaghi cancellati.`,
        `Scena 3: ${c.benefit} per ${c.platform}.`,
        `Scena 4: “Genera varianti e scegli cosa provare per ${c.campaignGoal}.”`
      ]
    },
    {
      title: "Messaggio più chiaro",
      duration: "8s",
      steps: [
        `Scena 1: testo grande “Hai già l'offerta.”`,
        `Scena 2: “Ti manca un angolo che parli a ${c.audience}.”`,
        `Scena 3: output con headline, hook e script.`,
        `Scena 4: “Parti da una base pronta.”`
      ]
    }
  ];
  return rotate(scripts, seed);
}

function scripts15(input: AdsFormInput, seed: number): VideoScript[] {
  const c = buildContext(input, seed);
  const scripts: VideoScript[] = [
    {
      title: "Angolo chiaro",
      duration: "15s",
      steps: [
        `Apertura: “Il tuo annuncio non deve spiegare tutto. Deve far capire perché fermarsi.”`,
        `Problema: ${sentenceCase(c.problem)} e il copy resta troppo generico.`,
        `Promessa: ${c.productName} crea angoli, headline e CTA per ${c.platform}.`,
        `Dimostrazione: mostra 3 varianti generate dallo stesso prodotto.`,
        `CTA finale: “Prepara la tua prossima ads con una base più chiara, ${c.intensity}.”`
      ]
    },
    {
      title: "Tempo risparmiato",
      duration: "15s",
      steps: [
        `Apertura: “Quante bozze scarti prima di pubblicare?”`,
        `Problema: chi vende a ${c.audience} spesso perde tempo sul messaggio.`,
        `Promessa: ${c.benefit} senza formule da fuffa.`,
        `Dimostrazione: mostra hook, primary text e script in sequenza, con tono ${c.toneHint}.`,
        `CTA finale: “Genera, adatta e testa la versione migliore.”`
      ]
    },
    {
      title: "Offerta più leggibile",
      duration: "15s",
      steps: [
        `Apertura: “La tua offerta può essere buona e sembrare comunque debole.”`,
        `Problema: se non dici bene ${c.desire}, il cliente non collega il valore.`,
        `Promessa: crea messaggi coerenti con ${c.offer}.`,
        `Dimostrazione: prima copy vago, dopo messaggio specifico.`,
        `CTA finale: “Trasforma l'idea in una campagna testabile.”`
      ]
    }
  ];
  return rotate(scripts, seed);
}

function scripts30(input: AdsFormInput, seed: number): VideoScript[] {
  const c = buildContext(input, seed);
  const scripts: VideoScript[] = [
    {
      title: "Scenario reale",
      duration: "30s",
      steps: [
        `Hook: “Prima di dire che le ads non funzionano, guarda il messaggio.”`,
        `Problema concreto: molti ${c.audience} partono da un prodotto valido, ma raccontano tutto in modo troppo generico per un obiettivo di ${c.campaignGoal}.`,
        `Mini storia: apri il gestore ads, hai budget, visual e offerta. Poi ti blocchi sulla frase iniziale.`,
        `Soluzione: con ${c.productName} generi primary text, headline, hook video e script pensati per ${c.platform}.`,
        `Perché funziona: non promette magie; ti dà varianti da testare e migliorare con dati reali.`,
        `CTA: “Crea la tua prima campagna pronta da provare.”`
      ]
    },
    {
      title: "Dal dubbio al test",
      duration: "30s",
      steps: [
        `Hook: “Il cliente non deve capire quanto hai lavorato. Deve capire perché gli serve ora.”`,
        `Problema concreto: ${c.problem}, quindi l'annuncio non aggancia il desiderio giusto.`,
        `Mini storia: hai scritto tre versioni, ma sembrano tutte simili e poco specifiche.`,
        `Soluzione: inserisci prodotto, pubblico, problema, beneficio e offerta: ${c.productName} costruisce angoli e script coerenti con ${c.offer}.`,
        `Perché funziona: ti costringe a collegare promessa, obiezione, CTA e formato creativo.`,
        `CTA: “Genera una base, adattala al tuo tono e mettila in test.”`
      ]
    }
  ];
  return rotate(scripts, seed);
}

function ctas(input: AdsFormInput, seed: number): GeneratedAdsOutput["ctas"] {
  const c = buildContext(input, seed);
  return {
    directSale: rotate([...ctaStrong, `Sblocca ${c.benefit} per la tua offerta`, `Metti alla prova ${c.offer} con un copy più chiaro`], seed).slice(0, 3),
    whatsappDm: rotate([...ctaWhatsapp, `Scrivici “ADS” e partiamo dal tuo caso`], seed).slice(0, 2),
    digitalDownload: rotate(
      [
        `Scarica la base e crea la tua prossima campagna`,
        `Porta ${c.productName} nel tuo prossimo ${c.campaignGoal}`,
        `Prendi il file e inizia dal primo angolo`
      ],
      seed
    ).slice(0, 2),
    urgency: rotate(
      [
        `Prima del prossimo test, sistema il messaggio`,
        `Prepara il copy prima di mettere budget su ${c.platform}`,
        `Crea varianti oggi e scegli cosa lanciare`
      ],
      seed
    ).slice(0, 3),
    retargeting: rotate([...ctaRetargeting, `Hai già visto l'offerta: ora prova l'angolo giusto`], seed).slice(0, 2)
  };
}

function canvaPrompts(input: AdsFormInput, seed: number): PromptCanva[] {
  const c = buildContext(input, seed);
  const prompts: PromptCanva[] = [
    {
      title: "Visual problema-soluzione",
      format: "1080x1350 per Meta e Instagram Feed",
      style: "premium pulito, fondo chiaro, accento blu e nero, gerarchia forte",
      visualText: `“${limit(c.problem, 46)}” + “${limit(c.benefit, 42)}”`,
      elements: "mockup dashboard, freccia prima/dopo, piccole etichette con hook e CTA",
      mood: "professionale, concreto, rassicurante",
      visualCta: "Crea la tua ads"
    },
    {
      title: "Checklist prima del lancio",
      format: "1080x1920 per Stories, Reels e TikTok",
      style: "editoriale moderno con blocchi bianchi e dettagli viola",
      visualText: "“Prima di lanciare: hook, promessa, CTA”",
      elements: "checklist, evidenziatore, screenshot sfocato dell'output, pulsante grafico",
      mood: "pratico, rapido, orientato all'azione",
      visualCta: "Prepara il test"
    },
    {
      title: "Confronto copy vago vs copy testabile",
      format: "1200x628 per Facebook Feed e landing",
      style: "split layout pulito, sinistra grigio chiaro, destra blu intenso",
      visualText: "“Da frasi vaghe a messaggi da provare”",
      elements: "due colonne, esempio headline cancellata, nuova headline evidenziata",
      mood: "chiaro, deciso, credibile",
      visualCta: "Genera varianti"
    }
  ];
  return rotate(prompts, seed);
}

function heygenPrompts(input: AdsFormInput, seed: number): string[] {
  const c = buildContext(input, seed);
  const items = [
    `Parla in modo naturale e diretto. “Se vendi ${c.productType} a ${c.audience}, il problema spesso non è l'offerta: è il messaggio. Con ${c.productName} crei hook, headline e script da testare su ${c.platform}, partendo da ${c.benefit}. Provalo come base per il tuo prossimo lancio.”`,
    `Video avatar, tono credibile. “Prima di mettere budget, assicurati che il copy dica una cosa precisa: perché il cliente dovrebbe fermarsi. Inserisci prodotto, pubblico e problema: ${c.productName} trasforma l'idea in testi e script pronti da adattare.”`
  ];
  return rotate(items.map((item) => limit(item, 420)), seed);
}

function invideoPrompts(input: AdsFormInput, seed: number): string[] {
  const c = buildContext(input, seed);
  const prompts = [
    `Crea un video ads dinamico da 15 secondi per ${c.platform}. Ritmo veloce, tagli puliti, musica elettronica leggera. Scene: foglio bianco, copy vago cancellato, output di ${c.productName}, 3 headline in overlay. Testi overlay: “Hai già l'offerta”, “Ti manca il messaggio”, “Genera varianti da testare”. CTA finale: “Prepara la tua ads”.`,
    `Crea un video verticale da 20 secondi per ${c.audience}. Ritmo medio, stile premium chiaro, musica motivante ma sobria. Scene: persona al laptop, checklist advertising, schermate con hook e script. Overlay: “${limit(c.problem, 45)}”, “${limit(c.benefit, 45)}”, “Da idea a campagna”. CTA finale: “Crea la prima versione”.`
  ];
  return rotate(prompts, seed);
}

function creativeIdeas(input: AdsFormInput, seed: number): CreativeIdea[] {
  const c = buildContext(input, seed);
  const ideas: CreativeIdea[] = [
    { category: "Faceless", idea: `Mani su laptop: da appunti confusi a 5 headline per ${c.productName}.` },
    { category: "Faceless", idea: `B-roll di scrivania con overlay “Il copy non deve partire da zero”.` },
    { category: "Faceless", idea: `Checklist animata: problema, promessa, hook, CTA per ${c.platform}.` },
    { category: "Screen recording", idea: `Compilazione rapida del form con dati reali e output che appare sezione per sezione.` },
    { category: "Screen recording", idea: `Zoom su 3 primary text diversi creati per ${c.audience}.` },
    { category: "Screen recording", idea: `Prima/dopo tra una headline vaga e una più specifica sul beneficio: ${c.benefit}.` },
    { category: "Testimonianza/risultato", idea: `Creator racconta: “Avevo l'offerta, mi mancavano angoli da testare”.` },
    { category: "Testimonianza/risultato", idea: `Mini caso: in 10 minuti sono usciti hook, CTA e script per un primo test.` },
    { category: "Comparativa prima/dopo", idea: `Split screen: copy generico a sinistra, campagna pronta da testare a destra.` },
    { category: "Comparativa prima/dopo", idea: `Dal problema “${limit(c.problem, 35)}” alla promessa pubblicitaria chiara.` }
  ];
  return rotate(ideas, seed);
}

export function generateAds(input: AdsFormInput): GeneratedAdsOutput {
  const seed = hashInput(input);
  const generatedPrimaryTexts = primaryTexts(input, seed);
  const generatedHeadlines = headlines(input, seed);
  const generatedDescriptions = descriptions(input, seed);
  const generatedScripts15 = scripts15(input, seed);
  const generatedCanva = canvaPrompts(input, seed);
  const generatedCtas = ctas(input, seed);

  return {
    quickAnalysis: quickAnalysis(input, seed),
    salesAngles: salesAngles(input, seed),
    primaryTexts: generatedPrimaryTexts,
    headlines: generatedHeadlines,
    descriptions: generatedDescriptions,
    videoHooks: videoHooks(input, seed),
    scripts8: scripts8(input, seed),
    scripts15: generatedScripts15,
    scripts30: scripts30(input, seed),
    ctas: generatedCtas,
    canvaPrompts: generatedCanva,
    heygenPrompts: heygenPrompts(input, seed),
    invideoPrompts: invideoPrompts(input, seed),
    creativeIdeas: creativeIdeas(input, seed),
    readyCampaign: {
      primaryText: generatedPrimaryTexts[0],
      headline: generatedHeadlines[0],
      description: generatedDescriptions[0],
      videoScript: generatedScripts15[0].steps.join(" "),
      canvaPrompt: `${generatedCanva[0].format}. ${generatedCanva[0].style}. Testo: ${generatedCanva[0].visualText}. CTA: ${generatedCanva[0].visualCta}.`,
      finalCta: pick([...generatedCtas.directSale, ...generatedCtas.digitalDownload, ...ctaSoft], seed)
    },
    generatedAt: new Intl.DateTimeFormat("it-IT", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date())
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
    platform: "Tutte",
    aggressiveness: "Medio",
    campaignGoal: "Vendita diretta",
    outputTypes: [
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
    ]
  };
}

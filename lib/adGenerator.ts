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
    {
      type: "Angolo problema",
      title: "Partire dal blocco reale",
      explanation: `Mostra il momento in cui il pubblico si ferma perché ${base.problem}.`,
      example: `Prima di creare nuovi contenuti, chiarisci il messaggio che deve convincere il tuo pubblico.`
    },
    {
      type: "Angolo velocità",
      title: "Ridurre il tempo di partenza",
      explanation: `Posiziona ${base.productName} come una scorciatoia pratica per arrivare prima a una bozza utile.`,
      example: `Passa da appunti sparsi a una prima campagna pronta da sistemare e testare.`
    },
    {
      type: "Angolo semplicità",
      title: "Meno confusione, più ordine",
      explanation: `Fai percepire che l'utente non deve diventare esperto per iniziare a scrivere meglio.`,
      example: `Segui una struttura semplice: problema, promessa, prova e invito all'azione.`
    },
    {
      type: "Angolo risultato",
      title: "Una base concreta da testare",
      explanation: `Il beneficio non è una promessa garantita, ma una base più chiara da adattare alla campagna.`,
      example: `Crea hook, headline e script video senza ripartire ogni volta dal foglio bianco.`
    },
    {
      type: "Angolo confronto prima/dopo",
      title: "Da idea confusa a messaggio ordinato",
      explanation: `Confronta lo stato iniziale con un output più leggibile, pratico e pronto da rifinire.`,
      example: `Prima: tante idee scollegate. Dopo: un messaggio pubblicitario con direzione chiara.`
    }
  ];
}

function makePrimaryTexts(base: ReturnType<typeof pickBase>): string[] {
  return [
    `Vuoi promuovere ${base.productName} ma il messaggio non è ancora chiaro? Parti da hook, testo e CTA già strutturati.`,
    `Il problema spesso non è l'offerta: è spiegare in modo semplice perché vale la pena provarla.`,
    `Prima di spendere budget, trasforma ${base.productType} in una campagna più ordinata e facile da testare.`,
    `Hai un pubblico preciso e un beneficio forte? Usa una base pronta per scrivere annunci meno generici.`,
    `Da idea confusa a prima bozza pubblicitaria: prepara testi, headline e script da adattare.`
  ];
}

function makeHeadlines(base: ReturnType<typeof pickBase>): string[] {
  return [
    "Da idea ad ads pronta",
    "Parti senza foglio bianco",
    "Crea testi più chiari",
    "Hook e script da testare",
    "Meno confusione, più copy",
    "Prepara la tua campagna",
    "Messaggi pronti da adattare",
    "Scrivi ads con più ordine",
    base.productName.length <= 34 ? base.productName : "La prima bozza è pronta",
    "Testa nuove angolazioni"
  ];
}

function makeDescriptions(): string[] {
  return [
    "Base pronta da adattare",
    "Hook, copy e CTA",
    "Per Meta, TikTok e Reels",
    "Script video inclusi",
    "Prompt creativi inclusi"
  ];
}

function makeHooks(base: ReturnType<typeof pickBase>) {
  return {
    problem: [
      `Stai promuovendo, ma il messaggio resta confuso?`,
      `Il pubblico capisce davvero perché dovrebbe scegliere te?`,
      `Prima di lanciare, guarda se il tuo copy è chiaro.`
    ],
    desire: [
      `Da appunti sparsi a una campagna più ordinata.`,
      `Crea una prima bozza senza perdere ore sul testo.`,
      `Trasforma il beneficio in un messaggio più semplice.`
    ],
    provocative: [
      `Il tuo prodotto potrebbe non essere il problema. Il messaggio sì.`,
      `Una buona offerta spiegata male sembra meno forte.`
    ],
    curiosity: [
      `Ecco cosa controllare prima di pubblicare una nuova ads.`,
      `Tre blocchi possono rendere il tuo annuncio più chiaro.`
    ]
  };
}

function makeScript(title: string, duration: VideoScript["duration"], steps: string[]): VideoScript {
  return { title, duration, steps };
}

function makeScripts(base: ReturnType<typeof pickBase>) {
  const scripts8: VideoScript[] = [
    makeScript("Foglio bianco", "8s", [
      "Scena 1: schermo vuoto, testo a schermo: 'Non sai cosa scrivere?'",
      "Scena 2: appunti disordinati, voice over: 'Hai l'offerta, ma manca il messaggio.'",
      "Scena 3: comparsa del tool, testo: 'Hook, headline e CTA in ordine.'",
      "Scena 4: CTA: 'Prepara la tua prima campagna.'"
    ]),
    makeScript("Prima del lancio", "8s", [
      "Scena 1: calendario con data lancio, testo: 'Prima di pubblicare...'",
      "Scena 2: evidenzia problema e beneficio.",
      "Scena 3: mostra una bozza di ads generata.",
      "Scena 4: CTA: 'Crea una base da testare.'"
    ]),
    makeScript("Messaggio chiaro", "8s", [
      "Scena 1: persona al telefono, testo: 'L'ads non deve essere complicata.'",
      "Scena 2: tre blocchi: hook, promessa, CTA.",
      "Scena 3: output ordinato sullo schermo.",
      "Scena 4: CTA: 'Parti da qui.'"
    ])
  ];

  const scripts15: VideoScript[] = [
    makeScript("Da idea a campagna", "15s", [
      "Apertura: 'Hai un prodotto da promuovere ma non sai da quale frase partire?'",
      `Problema: il pubblico sente che ${base.problem}.`,
      `Promessa: ${base.productName} ti aiuta a creare una prima base di copy da adattare.`,
      "Esempio: mostra hook, headline, script video e prompt Canva.",
      "CTA finale: 'Prepara la tua campagna da testare.'"
    ]),
    makeScript("Meno teoria", "15s", [
      "Apertura: 'Non ti serve un altro documento vuoto.'",
      "Problema: troppe idee rallentano la scrittura.",
      "Promessa: parti da angoli e testi già ordinati.",
      "Dimostrazione: scorri tre varianti di headline.",
      "CTA finale: 'Crea la tua prima bozza pubblicitaria.'"
    ]),
    makeScript("Copy più concreto", "15s", [
      "Apertura: 'Un annuncio generico costa attenzione.'",
      "Problema: il beneficio non viene spiegato in modo chiaro.",
      `Promessa: trasforma ${base.productType} in messaggi più semplici da testare.`,
      "Esempio: hook problema, primary text e CTA specifica.",
      "CTA finale: 'Genera varianti da adattare.'"
    ])
  ];

  const scripts30: VideoScript[] = [
    makeScript("Scenario realistico", "30s", [
      "Hook: 'Hai preparato l'offerta, ma ti blocchi quando devi scrivere l'annuncio?'",
      "Problema concreto: parti da frasi troppo generiche o copi formule viste altrove.",
      "Mini storia: apri il computer, provi tre headline, nessuna sembra davvero collegata al pubblico.",
      `Soluzione: ${base.productName} organizza problema, beneficio, hook, CTA e script in una base unica.`,
      "Perché funziona: ti dà una struttura da rifinire, non una promessa automatica.",
      "CTA: 'Crea una campagna pronta da adattare e testare.'"
    ]),
    makeScript("Metodo semplice", "30s", [
      "Hook: 'Prima di cambiare creatività, controlla il messaggio.'",
      `Problema concreto: se ${base.audience} non capisce il valore, anche una buona offerta può sembrare debole.`,
      "Mini storia: molte ads falliscono già nei primi secondi perché non hanno un hook chiaro.",
      "Soluzione: genera più angoli, headline, testi brevi, script video e prompt creativi.",
      "Perché funziona: puoi confrontare varianti diverse invece di puntare tutto su una sola idea.",
      "CTA: 'Prepara il tuo prossimo test pubblicitario.'"
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
  const descriptions = makeDescriptions();
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
      perceivedProblem: `Il pubblico non cerca solo ${base.productType}: vuole superare il blocco iniziale e capire cosa comunicare per primo.`,
      hiddenDesire: `Il desiderio reale è ${base.desire}, senza dover diventare esperto di advertising.`,
      adPromise: `${base.productName} aiuta a trasformare un'idea confusa in una prima base pubblicitaria da adattare e testare.`,
      emotionalLever: "Chiarezza: ridurre la sensazione di partire ogni volta da zero.",
      possibleObjection: "Potrebbe sembrare un output troppo generico o poco adatto alla propria offerta.",
      objectionAnswer: `Per questo il tool usa prodotto, pubblico, problema, beneficio e offerta per creare varianti più specifiche.`
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

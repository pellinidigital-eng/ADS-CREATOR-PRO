import type {
  AdsFormInput,
  CreativeIdea,
  GeneratedAdsOutput,
  PromptCanva,
  SalesAngle,
  VideoScript
} from "@/types/ads";

type NormalizedInput = {
  productName: string;
  productType: string;
  normalizedProblem: string;
  normalizedDesire: string;
  normalizedBenefit: string;
  normalizedOffer: string;
  normalizedAudience: string;
  productCategory: "digital" | "service" | "ecommerce" | "local" | "general";
  emotionalAngle: string;
  practicalAngle: string;
  platformLabel: string;
  goalLabel: string;
  toneLabel: string;
  ctaTheme: string;
  visualSubject: string;
};

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

const compact = (value: string): string => value.trim().replace(/\s+/g, " ").replace(/\.$/, "");

const sentenceCase = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const limit = (text: string, max: number): string => {
  const cleaned = cleanCopy(text);
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max - 1).trim()}…`;
};

const hasAny = (value: string, words: string[]) => {
  const lower = value.toLowerCase();
  return words.some((word) => lower.includes(word));
};

const bannedReplacements: Array<[RegExp, string]> = [
  [/frizione intelligente/gi, "domanda scomoda ma utile"],
  [/sbloccare l'attenzione/gi, "far capire subito il valore"],
  [/sbloccare l’attenzione/gi, "far capire subito il valore"],
  [/leva emotiva principale/gi, "motivo che spinge all'azione"],
  [/soluzione perfetta/gi, "percorso pratico"],
  [/business al livello successivo/gi, "lavoro più chiaro e ordinato"],
  [/occasione da non perdere/gi, "momento giusto per iniziare"],
  [/risultati garantiti/gi, "risultati da costruire con test reali"],
  [/guadagna subito/gi, "inizia con aspettative realistiche"],
  [/soldi facili/gi, "entrate costruite con metodo"],
  [/base concreta per (Meta Ads|TikTok Ads|Instagram Reels|Facebook Feed|Meta, TikTok e Instagram)/gi, "messaggio pronto da adattare"],
  [/con una spinta più decisa, ma credibile/gi, "con tono deciso e realistico"],
  [/porta il tuo brand al livello successivo/gi, "rendi più chiaro ciò che vendi"],
  [/migliora il tuo business/gi, "rendi più semplice il prossimo passo"]
];

export function cleanCopy(text: string): string {
  return bannedReplacements
    .reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text)
    .replace(/\s+/g, " ")
    .replace(/\s([,.!?;:])/g, "$1")
    .trim();
}

function categoryFrom(input: AdsFormInput): NormalizedInput["productCategory"] {
  const raw = `${input.productType} ${input.productName} ${input.targetAudience} ${input.mainProblem} ${input.audienceDesire}`.toLowerCase();

  if (hasAny(raw, ["digitale", "online", "corso", "infoprodotto", "creator", "vendere online", "prodotto digitale", "tutorial"])) {
    return "digital";
  }

  if (hasAny(raw, ["consulenza", "servizio", "freelance", "coach", "agenzia"])) return "service";
  if (hasAny(raw, ["ecommerce", "shop", "negozio online", "prodotto fisico"])) return "ecommerce";
  if (hasAny(raw, ["locale", "ristorante", "studio", "centro", "estetista", "palestra"])) return "local";
  return "general";
}

function interpretProblem(rawProblem: string, category: NormalizedInput["productCategory"], audience: string): string {
  const problem = compact(rawProblem);
  const lower = problem.toLowerCase();

  if (!problem) {
    if (category === "digital") return "ha idee sparse, ma non sa trasformarle in una prima offerta digitale";
    return "sa di dover promuovere l'offerta, ma fatica a trovare un messaggio chiaro";
  }

  if (hasAny(lower, ["entrata", "extra", "guadagn", "soldi", "reddito", "monetizz"])) {
    return "vorrebbe creare un'entrata extra online, ma non sa da quale idea partire né come renderla vendibile";
  }

  if (hasAny(lower, ["creare", "lanciare", "vendere", "ottenere", "avere", "trovare", "costruire"]) && !hasAny(lower, ["non", "fatica", "problema", "blocc", "confus", "perde"])) {
    if (category === "digital") return "vuole partire online, ma si perde tra idee, tutorial e passi poco chiari";
    return `vuole arrivare al risultato, ma non ha ancora un percorso semplice da seguire`;
  }

  if (hasAny(lower, ["non so", "non sa", "confus", "blocc", "da dove", "zero"])) {
    return problem;
  }

  if (hasAny(lower, ["tempo", "ore", "settimane"])) {
    return "perde tempo tra tentativi, consigli sparsi e decisioni che rimanda";
  }

  return problem.startsWith("non") || problem.startsWith("fatica")
    ? problem
    : `${audience} vive questo blocco: ${problem}`;
}

function interpretDesire(rawDesire: string, category: NormalizedInput["productCategory"]): string {
  const desire = compact(rawDesire);
  const lower = desire.toLowerCase();

  if (!desire) {
    if (category === "digital") return "creare qualcosa di proprio online con un percorso semplice";
    return "capire il prossimo passo senza perdersi in tentativi casuali";
  }

  if (hasAny(lower, ["step by step", "passo passo", "guida", "corso", "metodo", "percorso"])) {
    return "avere una guida semplice e ordinata da seguire passo dopo passo";
  }

  if (hasAny(lower, ["prodotto digitale", "infoprodotto", "vendere online"])) {
    return "trasformare una prima idea in un prodotto digitale chiaro e presentabile";
  }

  if (hasAny(lower, ["clienti", "lead", "contatti"])) {
    return "attirare persone più interessate con un messaggio meno generico";
  }

  return desire;
}

function interpretBenefit(rawBenefit: string, category: NormalizedInput["productCategory"]): string {
  const benefit = compact(rawBenefit);
  const lower = benefit.toLowerCase();

  if (!benefit) {
    if (category === "digital") return "passare da un'idea vaga a un primo piano d'azione";
    return "preparare una prima versione chiara da adattare e testare";
  }

  if (hasAny(lower, ["idee", "pochi secondi", "velocemente", "rapidamente"])) {
    return "passare rapidamente da un'idea confusa a una prima direzione chiara";
  }

  if (hasAny(lower, ["step", "passo", "guida", "metodo"])) {
    return "seguire un percorso ordinato invece di improvvisare";
  }

  if (hasAny(lower, ["tempo", "risparmia"])) {
    return "ridurre il tempo perso tra bozze, dubbi e tentativi poco ordinati";
  }

  return benefit;
}

function normalizeAudience(rawAudience: string, category: NormalizedInput["productCategory"]): string {
  const audience = compact(rawAudience);
  if (audience) return audience;
  if (category === "digital") return "creator, freelance e principianti che vogliono partire online";
  if (category === "service") return "professionisti e freelance che vendono servizi";
  if (category === "ecommerce") return "persone che gestiscono un ecommerce o uno shop online";
  if (category === "local") return "piccoli business locali";
  return "persone che vogliono promuovere meglio la propria offerta";
}

function normalizeOffer(rawOffer: string, productName: string): string {
  const offer = compact(rawOffer);
  if (!offer) return `${productName} come percorso pratico per iniziare`;
  if (hasAny(offer, ["€", "euro", "lancio", "sconto", "invece"])) return offer;
  return `${offer}, presentata come passo pratico per iniziare`;
}

export function normalizeInput(input: AdsFormInput): NormalizedInput {
  const productCategory = categoryFrom(input);
  const productType = compact(input.productType) || (productCategory === "digital" ? "percorso digitale" : "offerta");
  const productName = compact(input.productName) || sentenceCase(productType);
  const normalizedAudience = normalizeAudience(input.targetAudience, productCategory);
  const normalizedProblem = interpretProblem(input.mainProblem, productCategory, normalizedAudience);
  const normalizedDesire = interpretDesire(input.audienceDesire, productCategory);
  const normalizedBenefit = interpretBenefit(input.mainBenefit, productCategory);
  const normalizedOffer = normalizeOffer(input.offer, productName);
  const platformLabel = input.platform === "Tutte" ? "Meta, TikTok e Instagram" : input.platform;
  const goalLabel = input.campaignGoal.toLowerCase();
  const toneLabel = input.tone.toLowerCase();

  const emotionalAngle =
    productCategory === "digital"
      ? "ridurre la confusione e sentirsi finalmente guidati nel primo passo online"
      : "sentirsi più sicuri perché il messaggio diventa semplice da capire";

  const practicalAngle =
    productCategory === "digital"
      ? "trasformare una prima idea in un percorso o prodotto digitale da presentare"
      : "costruire messaggi più chiari da usare in una campagna reale";

  const ctaTheme =
    productCategory === "digital"
      ? "primo prodotto digitale"
      : goalLabel.includes("messaggi")
        ? "conversazione"
        : "primo test pubblicitario";

  const visualSubject =
    productCategory === "digital"
      ? "idea, appunti e mockup del prodotto digitale"
      : "offerta, messaggio e anteprima dell'annuncio";

  return {
    productName,
    productType,
    normalizedProblem,
    normalizedDesire,
    normalizedBenefit,
    normalizedOffer,
    normalizedAudience,
    productCategory,
    emotionalAngle,
    practicalAngle,
    platformLabel,
    goalLabel,
    toneLabel,
    ctaTheme,
    visualSubject
  };
}

function isDigital(c: NormalizedInput) {
  return c.productCategory === "digital";
}

function quickAnalysis(input: AdsFormInput): GeneratedAdsOutput["quickAnalysis"] {
  const c = normalizeInput(input);

  return {
    perceivedProblem: isDigital(c)
      ? `Il pubblico non cerca solo un corso: vuole capire come partire online senza perdersi tra mille consigli diversi.`
      : `Il pubblico non ha bisogno di un'altra frase ad effetto: ha bisogno di capire perché questa offerta risolve un problema reale.`,
    hiddenDesire: `Vuole ${c.normalizedDesire}, con la sensazione di avere un percorso chiaro e non l'ennesima promessa vaga.`,
    adPromise: isDigital(c)
      ? `${c.productName} aiuta ${c.normalizedAudience} a passare da idea confusa a primo prodotto digitale con passi ordinati. Offerta da comunicare: ${c.normalizedOffer}.`
      : `${c.productName} aiuta ${c.normalizedAudience} a collegare problema, promessa e prossimo passo in modo più chiaro. Offerta da comunicare: ${c.normalizedOffer}.`,
    emotionalLever: `Il punto emotivo è togliere confusione: il cliente vuole sentirsi capace di iniziare, anche se oggi non ha ancora un piano preciso.`,
    possibleObjection: `“E se parto da zero o non so ancora quale idea scegliere?”`,
    objectionAnswer: isDigital(c)
      ? `Il messaggio deve rassicurare: non serve avere tutto pronto, serve un percorso pratico per scegliere una prima direzione e costruirla con ordine.`
      : `Il messaggio deve chiarire che non si parte dalla campagna perfetta, ma da una prima versione ragionata da adattare e testare.`
  };
}

function salesAngles(input: AdsFormInput, seed: number): SalesAngle[] {
  const c = normalizeInput(input);

  const digitalAngles: SalesAngle[] = [
    {
      type: "Angolo problema",
      title: "Troppe idee, nessuna direzione",
      explanation: `Parla a chi vuole partire online ma resta bloccato tra opzioni, tutorial e dubbi.`,
      example: `Vuoi creare qualcosa di tuo online, ma non sai da quale idea partire? ${c.productName} ti guida passo dopo passo verso il tuo primo prodotto digitale.`
    },
    {
      type: "Angolo velocità",
      title: "Prima direzione chiara",
      explanation: `Non promette scorciatoie: promette meno dispersione e più ordine nel primo passo.`,
      example: `Prima di perdere settimane tra consigli sparsi, segui un percorso pratico per capire cosa creare, come strutturarlo e come presentarlo.`
    },
    {
      type: "Angolo semplicità",
      title: "Partire senza complicare tutto",
      explanation: `Rende accessibile il tema prodotto digitale anche a chi parte da zero.`,
      example: `Non devi essere un esperto per iniziare. Ti serve una guida semplice che trasformi un'idea in un percorso vendibile.`
    },
    {
      type: "Angolo risultato",
      title: "Dal pensiero al primo prodotto",
      explanation: `Mostra un risultato concreto e realistico: una prima offerta da costruire.`,
      example: `${c.productName} ti aiuta a mettere ordine: idea, pubblico, promessa e primo prodotto da presentare.`
    },
    {
      type: "Angolo confronto prima/dopo",
      title: "Da confusione a piano",
      explanation: `Fa vedere il passaggio da appunti sparsi a percorso chiaro.`,
      example: `Prima hai mille idee aperte. Dopo hai una direzione, una struttura e il prossimo passo per iniziare online.`
    }
  ];

  const generalAngles: SalesAngle[] = [
    {
      type: "Angolo problema",
      title: "Il messaggio oggi non è abbastanza chiaro",
      explanation: `Parte dal problema interpretato: ${c.normalizedProblem}.`,
      example: `Se il cliente non capisce subito perché dovrebbe fermarsi, l'offerta passa inosservata. ${c.productName} aiuta a renderla più leggibile.`
    },
    {
      type: "Angolo velocità",
      title: "Meno tempo tra bozze e tentativi",
      explanation: `Valorizza il vantaggio pratico senza sembrare miracoloso.`,
      example: `Invece di riscrivere lo stesso annuncio dieci volte, parti da messaggi già orientati a problema, promessa e CTA.`
    },
    {
      type: "Angolo semplicità",
      title: "Copy semplice, non superficiale",
      explanation: `Fa capire che il messaggio può essere diretto anche quando l'offerta è articolata.`,
      example: `Il cliente non deve decifrare la tua offerta. Deve capire in pochi secondi cosa cambia per lui.`
    },
    {
      type: "Angolo risultato",
      title: "Più varianti da testare",
      explanation: `Porta l'attenzione su angoli diversi, utili per ${c.goalLabel}.`,
      example: `${c.productName} ti dà più direzioni da provare: problema, desiderio, prima/dopo e obiezione principale.`
    },
    {
      type: "Angolo confronto prima/dopo",
      title: "Da copy vago a messaggio vendibile",
      explanation: `Mostra il miglioramento percepito senza promettere performance garantite.`,
      example: `Prima: frasi belle ma deboli. Dopo: un messaggio più specifico, adatto a una campagna reale.`
    }
  ];

  return rotate(isDigital(c) ? digitalAngles : generalAngles, seed);
}

function primaryTexts(input: AdsFormInput, seed: number): string[] {
  const c = normalizeInput(input);

  const digital = [
    `Vuoi creare un prodotto digitale ma non sai da dove partire? ${c.productName} ti guida passo dopo passo.`,
    `Hai idee, ma nessun piano chiaro? Segui un percorso semplice per costruire il tuo primo prodotto digitale.`,
    `Non ti serve complicare tutto. Parti da una guida pratica e trasforma una prima idea in qualcosa di tuo.`,
    `Vuoi iniziare online con un progetto tuo? ${c.productName} ti aiuta a mettere ordine e partire dal primo passo.`,
    `Prima di perdere settimane tra video e consigli sparsi, segui un metodo ordinato per iniziare.`
  ];

  const general = [
    `Il problema non è solo promuovere: è spiegare bene perché scegliere ${c.productName}. Parti da un messaggio più chiaro.`,
    `Se il tuo pubblico vive questo blocco, ${c.normalizedProblem}, serve un annuncio che arrivi subito al punto.`,
    `Hai un'offerta valida? Rendila più semplice da capire con testi, hook e CTA pensati per un primo test.`,
    `Prima di investire budget, sistema promessa e messaggio. ${c.normalizedOffer} merita un copy più chiaro.`,
    `Il cliente deve capire cosa cambia per lui. Parti da copy più specifici, non da frasi già sentite.`
  ];

  return rotate(isDigital(c) ? digital : general, seed).map((item) => limit(item, 132));
}

function headlines(input: AdsFormInput, seed: number): string[] {
  const c = normalizeInput(input);

  const digital = [
    "Parti dal tuo primo prodotto",
    "Da idea a prodotto digitale",
    "Crea il tuo primo digitale",
    "Non sai da dove iniziare?",
    "Inizia senza confusione",
    "Guida pratica per partire",
    "Il primo passo è qui",
    "Trasforma l'idea in offerta",
    "Meno tutorial, più direzione",
    `${limit(c.productName, 28)}`
  ];

  const general = [
    "Messaggio più chiaro",
    "Prima sistema il copy",
    "Rendi l'offerta leggibile",
    "Più angoli da testare",
    "Hook pronti da provare",
    "Annunci meno vaghi",
    "Copy per il primo test",
    "Dai forma alla promessa",
    "CTA più specifiche",
    `${limit(c.productName, 32)}`
  ];

  return rotate(isDigital(c) ? digital : general, seed).slice(0, 10).map((item) => limit(item, 40));
}

function descriptions(input: AdsFormInput, seed: number): string[] {
  const c = normalizeInput(input);
  const items = isDigital(c)
    ? ["Guida pratica", "Parti da zero", "Metodo ordinato", "Prima idea chiara", "Percorso step by step"]
    : ["Copy da adattare", "Più chiarezza", "Primo test pronto", "Hook e CTA", "Messaggi vendibili"];

  return rotate(items, seed).map((item) => limit(item, 30));
}

function videoHooks(input: AdsFormInput, seed: number): GeneratedAdsOutput["videoHooks"] {
  const c = normalizeInput(input);

  if (isDigital(c)) {
    return {
      problem: rotate(
        [
          "Vuoi vendere online ma non sai cosa creare?",
          "Hai mille idee e nessuna direzione chiara?",
          "Stai guardando tutorial, ma non stai costruendo nulla."
        ],
        seed
      ),
      desire: rotate(
        [
          "Immagina di avere il primo prodotto digitale già strutturato.",
          "Da una semplice idea può nascere qualcosa di tuo.",
          "Parti online con un percorso che ti dice cosa fare dopo."
        ],
        seed
      ),
      provocative: rotate(
        [
          "Il problema non è partire da zero. È partire senza metodo.",
          "Non ti manca un'altra idea. Ti manca una direzione."
        ],
        seed
      ),
      curiosity: rotate(
        [
          "Prima di scegliere cosa vendere online, guarda questo.",
          "Il primo prodotto digitale nasce da una scelta semplice."
        ],
        seed
      )
    };
  }

  return {
    problem: rotate(
      [
        "Il tuo annuncio spiega troppo e convince poco?",
        "Se il cliente non capisce subito il valore, scorre oltre.",
        "Hai un'offerta valida, ma il messaggio resta debole?"
      ],
      seed
    ),
    desire: rotate(
      [
        "Un buon annuncio parte da una promessa chiara.",
        "Trasforma l'offerta in un messaggio più facile da scegliere.",
        "Dai al cliente un motivo concreto per fermarsi."
      ],
      seed
    ),
    provocative: rotate(
      [
        "Il prodotto non è sempre il problema. A volte è come lo racconti.",
        "Prima di aumentare budget, rendi il copy più specifico."
      ],
      seed
    ),
    curiosity: rotate(
      [
        "Prima di lanciare la prossima ads, controlla questo.",
        "C'è una domanda che il tuo annuncio deve risolvere subito."
      ],
      seed
    )
  };
}

function scripts8(input: AdsFormInput, seed: number): VideoScript[] {
  const c = normalizeInput(input);

  const digital: VideoScript[] = [
    {
      title: "Primo prodotto digitale",
      duration: "8s",
      steps: [
        `Scena 1: persona davanti al PC. Testo a schermo: "Vuoi vendere online ma non sai cosa creare?" Voice over: "Hai voglia di partire, ma non sai da dove iniziare."`,
        `Scena 2: appunti confusi sullo schermo. Testo: "Troppe idee, zero direzione". Voice over: "Il rischio è perdere settimane tra consigli sparsi."`,
        `Scena 3: mockup di ${c.productName}. Testo: "${c.productName}". Voice over: "Qui segui un percorso semplice e ordinato."`,
        `Scena 4: schermata finale. Testo: "Parti dal tuo primo prodotto digitale". Voice over: "Inizia dal primo passo concreto."`
      ]
    },
    {
      title: "Da idea a direzione",
      duration: "8s",
      steps: [
        `Scena 1: zoom su una nota con scritto "idea". Testo: "Hai un'idea?" Voice over: "Un'idea da sola non basta."`,
        `Scena 2: tre frecce confuse. Testo: "Cosa creo? Per chi? Come lo vendo?" Voice over: "Serve una direzione."`,
        `Scena 3: anteprima del percorso. Testo: "Metodo step by step". Voice over: "${c.productName} ti aiuta a ordinarla."`,
        `Scena 4: CTA a schermo. Testo: "Crea la tua prima idea digitale". Voice over: "Parti con il percorso guidato."`
      ]
    },
    {
      title: "Stop tutorial infiniti",
      duration: "8s",
      steps: [
        `Scena 1: scroll infinito di video. Testo: "Ancora tutorial?" Voice over: "Guardare video non significa partire."`,
        `Scena 2: persona che chiude le schede. Testo: "Serve un piano". Voice over: "Ti serve un ordine semplice."`,
        `Scena 3: mockup corso. Testo: "${c.productName}". Voice over: "Segui i passaggi e costruisci la tua prima offerta."`,
        `Scena 4: CTA. Testo: "Inizia senza confusione". Voice over: "Accedi alla guida pratica."`
      ]
    }
  ];

  const general: VideoScript[] = [
    {
      title: "Messaggio più chiaro",
      duration: "8s",
      steps: [
        `Scena 1: annuncio con testo vago. Testo: "Il copy non convince?" Voice over: "A volte l'offerta è buona, ma il messaggio non arriva."`,
        `Scena 2: evidenzia problema e promessa. Testo: "Problema + promessa". Voice over: "Prima chiarisci cosa cambia per il cliente."`,
        `Scena 3: schermata con output. Testo: "Hook, headline, CTA". Voice over: "${c.productName} ti dà varianti da adattare."`,
        `Scena 4: CTA. Testo: "Prepara il primo test". Voice over: "Parti da un messaggio più specifico."`
      ]
    },
    {
      title: "Prima del budget",
      duration: "8s",
      steps: [
        `Scena 1: cursore su budget ads. Testo: "Prima di spendere". Voice over: "Prima di aumentare budget, guarda il copy."`,
        `Scena 2: copy generico barrato. Testo: "Troppo vago". Voice over: "Il cliente deve capire subito il valore."`,
        `Scena 3: nuove headline. Testo: "Più angoli". Voice over: "Genera direzioni diverse da testare."`,
        `Scena 4: CTA. Testo: "Crea la tua ads". Voice over: "Prepara una versione più chiara."`
      ]
    },
    {
      title: "Offerta leggibile",
      duration: "8s",
      steps: [
        `Scena 1: pagina offerta. Testo: "Si capisce subito?" Voice over: "Il cliente non deve indovinare."`,
        `Scena 2: zoom su promessa. Testo: "Una promessa chiara". Voice over: "Serve una frase che dica cosa cambia."`,
        `Scena 3: output del tool. Testo: "Copy pronto da adattare". Voice over: "${c.productName} costruisce la prima base."`,
        `Scena 4: CTA. Testo: "Metti il messaggio in test". Voice over: "Usalo per il prossimo lancio."`
      ]
    }
  ];

  return rotate(isDigital(c) ? digital : general, seed);
}

function scripts15(input: AdsFormInput, seed: number): VideoScript[] {
  const c = normalizeInput(input);

  const digital: VideoScript[] = [
    {
      title: "Percorso pratico",
      duration: "15s",
      steps: [
        `Apertura: testo a schermo "Vuoi creare qualcosa online?" Voice over: "Se hai idee ma non sai da quale partire, non sei l'unico."`,
        `Problema: scena con appunti e video salvati. Voice over: "Il problema è la confusione: troppi consigli, nessun piano."`,
        `Promessa: mostra ${c.productName}. Voice over: "Questo percorso ti aiuta a scegliere una direzione e costruire il primo prodotto digitale."`,
        `Esempio: overlay "idea, pubblico, promessa, offerta". Voice over: "Un passo alla volta, senza complicare tutto."`,
        `CTA finale: testo "Inizia dal tuo primo prodotto". Voice over: "Accedi alla guida pratica e parti da qui."`
      ]
    },
    {
      title: "Da zero a digitale",
      duration: "15s",
      steps: [
        `Apertura: testo "Parti da zero?" Voice over: "Non ti serve avere già tutto chiaro."`,
        `Problema: schermata con domande aperte. Voice over: "Ti serve capire cosa creare, per chi e con quale promessa."`,
        `Promessa: mockup corso. Voice over: "${c.productName} ti guida passo dopo passo."`,
        `Esempio: mostra una mappa semplice. Voice over: "Così passi da idea vaga a prima offerta."`,
        `CTA finale: testo "Crea la tua prima idea digitale". Voice over: "Parti con il percorso step by step."`
      ]
    },
    {
      title: "Meno tutorial",
      duration: "15s",
      steps: [
        `Apertura: testo "Basta salvare video". Voice over: "Se continui a salvare tutorial, ma non parti mai, forse ti manca una guida."`,
        `Problema: persona indecisa davanti al PC. Voice over: "La confusione ti fa rimandare."`,
        `Promessa: mostra ${c.productName}. Voice over: "Qui trovi un percorso pratico per costruire qualcosa di tuo online."`,
        `Esempio: overlay "primo passo, struttura, offerta". Voice over: "Semplice, ordinato, applicabile."`,
        `CTA finale: testo "Inizia senza confusione". Voice over: "Accedi e costruisci il tuo primo digitale."`
      ]
    }
  ];

  const general: VideoScript[] = [
    {
      title: "Copy meno vago",
      duration: "15s",
      steps: [
        `Apertura: testo "Il tuo annuncio convince?" Voice over: "Un'offerta buona può sembrare debole se il messaggio è troppo generico."`,
        `Problema: evidenzia frasi vaghe. Voice over: "Il cliente deve capire problema, beneficio e prossimo passo."`,
        `Promessa: mostra ${c.productName}. Voice over: "Genera testi, hook e CTA più facili da adattare."`,
        `Esempio: overlay prima/dopo. Voice over: "Da frase vaga a messaggio più specifico."`,
        `CTA finale: testo "Prepara il primo test". Voice over: "Crea una versione più chiara."`
      ]
    },
    {
      title: "Prima del lancio",
      duration: "15s",
      steps: [
        `Apertura: testo "Prima di lanciare". Voice over: "Prima di mettere budget, controlla se il copy dice davvero qualcosa."`,
        `Problema: scena gestore ads. Voice over: "Se la promessa è debole, anche il visual fa più fatica."`,
        `Promessa: output con headline. Voice over: "${c.productName} ti aiuta a trovare angoli diversi."`,
        `Esempio: mostra tre headline. Voice over: "Così puoi testare messaggi, non solo grafiche."`,
        `CTA finale: testo "Crea la tua ads". Voice over: "Parti da copy più specifici."`
      ]
    },
    {
      title: "Cliente giusto",
      duration: "15s",
      steps: [
        `Apertura: testo "Parli al cliente giusto?" Voice over: "Un annuncio non deve parlare a tutti."`,
        `Problema: pubblico generico barrato. Voice over: "Deve far sentire chiamata la persona giusta."`,
        `Promessa: mostra messaggi generati. Voice over: "Costruisci varianti intorno a problema, desiderio e obiezione."`,
        `Esempio: overlay "hook, promessa, CTA". Voice over: "Tre pezzi semplici, ma decisivi."`,
        `CTA finale: testo "Metti il messaggio in test". Voice over: "Genera la tua prossima versione."`
      ]
    }
  ];

  return rotate(isDigital(c) ? digital : general, seed);
}

function scripts30(input: AdsFormInput, seed: number): VideoScript[] {
  const c = normalizeInput(input);

  const digital: VideoScript[] = [
    {
      title: "Video parlato naturale",
      duration: "30s",
      steps: [
        `Hook: testo a schermo "Vuoi creare un prodotto digitale?" Voice over: "Se vuoi iniziare online ma non sai cosa creare, il problema non è la mancanza di idee."`,
        `Problema concreto: scena con appunti e tab aperte. Voice over: "Il problema è che hai troppe informazioni sparse e nessun percorso da seguire."`,
        `Mini storia: voice over: "Magari salvi video, prendi appunti, cambi idea ogni giorno e alla fine non costruisci niente."`,
        `Soluzione: mostra mockup di ${c.productName}. Voice over: "Questo percorso ti aiuta a scegliere una direzione, definire il pubblico e costruire la prima offerta digitale."`,
        `Perché funziona: overlay "idea, struttura, offerta". Voice over: "Non promette scorciatoie: ti dà ordine e passaggi pratici."`,
        `CTA: testo "Parti dal tuo primo prodotto digitale". Voice over: "Accedi alla guida pratica e inizia dal primo passo."`
      ]
    },
    {
      title: "Scenario principiante",
      duration: "30s",
      steps: [
        `Hook: testo "Parti da zero?" Voice over: "Partire da zero non è il problema. Il problema è partire senza una sequenza chiara."`,
        `Problema concreto: scena persona davanti al PC. Voice over: "Quando non sai cosa creare, per chi venderlo e come strutturarlo, tutto sembra più grande di quello che è."`,
        `Mini storia: voice over: "Così rimandi, guardi altri contenuti e resti fermo alla fase dell'idea."`,
        `Soluzione: mostra ${c.productName}. Voice over: "Con ${c.productName} segui un percorso pratico per trasformare un'idea in un primo prodotto digitale."`,
        `Perché funziona: overlay "pochi passaggi, più chiarezza". Voice over: "Ti aiuta a decidere, non solo a raccogliere informazioni."`,
        `CTA: testo "Inizia senza confusione". Voice over: "Parti con il percorso step by step."`
      ]
    }
  ];

  const general: VideoScript[] = [
    {
      title: "Copy da testare",
      duration: "30s",
      steps: [
        `Hook: testo "Le ads non partono dal budget". Voice over: "Prima del budget, c'è una cosa da chiarire: il messaggio."`,
        `Problema concreto: scena annuncio generico. Voice over: "Se il cliente legge una frase vaga, non capisce perché dovrebbe fermarsi."`,
        `Mini storia: voice over: "Succede spesso: offerta buona, visual curato, ma copy che potrebbe andare bene per chiunque."`,
        `Soluzione: mostra ${c.productName}. Voice over: "Il tool costruisce primary text, headline, hook e CTA intorno a problema, beneficio e obiezione."`,
        `Perché funziona: overlay "più varianti, test più chiari". Voice over: "Così confronti angoli diversi invece di cambiare parole a caso."`,
        `CTA: testo "Prepara il primo test". Voice over: "Genera una versione più chiara e adattala alla tua offerta."`
      ]
    },
    {
      title: "Offerta leggibile",
      duration: "30s",
      steps: [
        `Hook: testo "Il cliente capisce cosa vendi?" Voice over: "Il tuo annuncio non deve sembrare creativo a tutti i costi. Deve far capire il valore."`,
        `Problema concreto: scena con testo lungo. Voice over: "Quando il messaggio è confuso, il cliente non arriva nemmeno alla CTA."`,
        `Mini storia: voice over: "Magari hai scritto tanto, ma manca una promessa semplice e un prossimo passo chiaro."`,
        `Soluzione: mostra output di ${c.productName}. Voice over: "Parti da testi e script pensati per rendere l'offerta più leggibile."`,
        `Perché funziona: overlay "problema, promessa, CTA". Voice over: "Sono tre punti semplici, ma cambiano la qualità del test."`,
        `CTA: testo "Crea la tua ads". Voice over: "Prepara un messaggio più specifico prima del prossimo lancio."`
      ]
    }
  ];

  return rotate(isDigital(c) ? digital : general, seed);
}

function ctas(input: AdsFormInput, seed: number): GeneratedAdsOutput["ctas"] {
  const c = normalizeInput(input);

  if (isDigital(c)) {
    return {
      directSale: rotate(["Inizia dal tuo primo prodotto", "Accedi alla guida pratica", "Parti con il percorso step by step"], seed),
      whatsappDm: rotate(["Scrivi “DIGITALE” e capiamo da quale idea partire", "Mandaci la tua idea e troviamo il primo passo"], seed),
      digitalDownload: rotate(["Crea la tua prima idea digitale", `Sblocca ${c.productName}`, "Prepara il tuo primo prodotto"], seed).slice(0, 2),
      urgency: rotate(["Prima di perdere altre settimane, scegli una direzione", "Inizia senza confusione", "Trasforma gli appunti in un primo piano"], seed),
      retargeting: rotate(["Riparti dal primo passo concreto", "Hai già l'idea: ora mettila in ordine"], seed)
    };
  }

  return {
    directSale: rotate(["Prepara il primo test", "Crea un messaggio più chiaro", "Rendi l'offerta più vendibile"], seed),
    whatsappDm: rotate(["Scrivici e partiamo dalla tua offerta", "Mandaci il prodotto e troviamo l'angolo giusto"], seed),
    digitalDownload: rotate(["Scarica la base e adattala alla tua campagna", "Crea testi e script per il prossimo lancio"], seed),
    urgency: rotate(["Sistema il copy prima di mettere budget", "Prepara la campagna prima del lancio", "Scegli l'angolo da testare oggi"], seed),
    retargeting: rotate(["Torna con un messaggio più specifico", "Riprova con un angolo più chiaro"], seed)
  };
}

function canvaPrompts(input: AdsFormInput, seed: number): PromptCanva[] {
  const c = normalizeInput(input);
  const prompts: PromptCanva[] = [
    {
      title: "Visual problema-soluzione",
      format: "1080x1350 per Meta e Instagram Feed",
      style: "premium pulito, fondo chiaro, accento blu e nero, gerarchia forte",
      visualText: isDigital(c) ? "“Da idea confusa a primo prodotto digitale”" : `“${limit(c.normalizedProblem, 46)}”`,
      elements: `${c.visualSubject}, freccia prima/dopo, etichette brevi`,
      mood: "professionale, concreto, rassicurante",
      visualCta: isDigital(c) ? "Parti dal primo prodotto" : "Prepara il primo test"
    },
    {
      title: "Checklist prima del lancio",
      format: "1080x1920 per Stories, Reels e TikTok",
      style: "editoriale moderno con blocchi bianchi e dettagli viola",
      visualText: isDigital(c) ? "“Idea, pubblico, offerta”" : "“Problema, promessa, CTA”",
      elements: "checklist, evidenziatore, mockup del percorso o dell'output",
      mood: "pratico, rapido, orientato all'azione",
      visualCta: isDigital(c) ? "Inizia senza confusione" : "Crea la tua ads"
    },
    {
      title: "Confronto prima/dopo",
      format: "1200x628 per Facebook Feed e landing",
      style: "split layout pulito, sinistra grigio chiaro, destra blu intenso",
      visualText: isDigital(c) ? "“Da mille idee a una direzione”" : "“Da copy vago a messaggio chiaro”",
      elements: "due colonne, appunti confusi a sinistra, percorso ordinato a destra",
      mood: "chiaro, deciso, credibile",
      visualCta: isDigital(c) ? "Accedi alla guida" : "Genera varianti"
    }
  ];
  return rotate(prompts, seed);
}

function heygenPrompts(input: AdsFormInput, seed: number): string[] {
  const c = normalizeInput(input);
  const items = isDigital(c)
    ? [
        `Parla in modo naturale. “Vuoi creare un prodotto digitale ma non sai da dove partire? ${c.productName} ti guida passo dopo passo: scegli una direzione, metti ordine nelle idee e costruisci la tua prima offerta. Non serve avere tutto chiaro: serve iniziare dal primo passo giusto.”`,
        `Video avatar credibile. “Se continui a guardare tutorial ma non costruisci nulla, forse ti manca un percorso. Con ${c.productName} parti da zero e trasformi un'idea in un primo prodotto digitale, senza perderti tra mille consigli.”`
      ]
    : [
        `Parla in modo diretto. “Prima di lanciare una campagna, chiarisci il messaggio. ${c.productName} ti aiuta a creare primary text, headline, hook e CTA più specifici, così puoi testare un annuncio meno generico e più facile da capire.”`,
        `Video avatar naturale. “Un'offerta può essere valida e sembrare debole se il copy non spiega bene il valore. Parti da problema, promessa e CTA: ${c.productName} ti aiuta a creare una prima versione da adattare.”`
      ];

  return rotate(items.map((item) => limit(item, 420)), seed);
}

function invideoPrompts(input: AdsFormInput, seed: number): string[] {
  const c = normalizeInput(input);
  const prompts = isDigital(c)
    ? [
        `Crea un video verticale da 15 secondi. Ritmo rapido ma pulito. Scene: persona al PC, appunti confusi, mockup di ${c.productName}, checklist "idea, pubblico, offerta". Overlay: "Vuoi vendere online?", "Troppe idee?", "Parti dal primo prodotto digitale". Musica moderna e sobria. CTA finale: "Accedi alla guida pratica".`,
        `Crea un video ads da 20 secondi per Reels/TikTok. Scene semplici: scroll di tutorial, persona che chiude le schede, percorso step by step, schermata finale. Overlay: "Meno confusione", "Più direzione", "Da idea a prodotto". CTA finale: "Inizia senza confusione".`
      ]
    : [
        `Crea un video ads dinamico da 15 secondi per ${c.platformLabel}. Scene: annuncio vago, promessa evidenziata, output con headline e CTA, schermata finale. Overlay: "Il copy è chiaro?", "Problema + promessa", "Prepara il primo test". Musica moderna e leggera. CTA finale: "Crea la tua ads".`,
        `Crea un video verticale da 20 secondi. Ritmo medio, stile premium chiaro. Scene: offerta su laptop, copy barrato, nuove varianti, CTA finale. Overlay: "Non cambiare solo visual", "Testa un angolo diverso", "Rendi l'offerta leggibile".`
      ];

  return rotate(prompts, seed);
}

function creativeIdeas(input: AdsFormInput, seed: number): CreativeIdea[] {
  const c = normalizeInput(input);
  const ideas: CreativeIdea[] = isDigital(c)
    ? [
        { category: "Faceless", idea: `Scrivania con appunti: da "mille idee" a una mappa semplice per il primo prodotto digitale.` },
        { category: "Faceless", idea: `B-roll al PC con overlay: "Non ti manca un'altra idea, ti manca una direzione".` },
        { category: "Faceless", idea: `Checklist animata: idea, pubblico, promessa, prima offerta.` },
        { category: "Screen recording", idea: `Mostra il percorso di ${c.productName} e zoom sui passaggi principali.` },
        { category: "Screen recording", idea: `Da appunti sparsi a struttura del primo prodotto digitale.` },
        { category: "Screen recording", idea: `Creazione di una prima offerta con titoli e moduli ordinati.` },
        { category: "Testimonianza/risultato", idea: `Persona racconta: "Avevo idee, ma non sapevo quale trasformare in prodotto".` },
        { category: "Testimonianza/risultato", idea: `Mini risultato: da confusione iniziale a prima direzione chiara.` },
        { category: "Comparativa prima/dopo", idea: `Prima: tutorial salvati. Dopo: percorso step by step.` },
        { category: "Comparativa prima/dopo", idea: `Prima: idea vaga. Dopo: pubblico, promessa e prima offerta.` }
      ]
    : [
        { category: "Faceless", idea: `Schermata con copy vago barrato e nuova promessa più specifica.` },
        { category: "Faceless", idea: `B-roll di laptop con overlay: "Prima sistema il messaggio".` },
        { category: "Faceless", idea: `Checklist animata: problema, beneficio, obiezione, CTA.` },
        { category: "Screen recording", idea: `Generazione di primary text e headline per ${c.productName}.` },
        { category: "Screen recording", idea: `Zoom su 3 angoli diversi per la stessa offerta.` },
        { category: "Screen recording", idea: `Prima/dopo tra frase generica e messaggio più vendibile.` },
        { category: "Testimonianza/risultato", idea: `Cliente racconta: "Avevo l'offerta, ma non sapevo come raccontarla".` },
        { category: "Testimonianza/risultato", idea: `Mini caso: da annuncio confuso a primo test ordinato.` },
        { category: "Comparativa prima/dopo", idea: `Prima: copy lungo e debole. Dopo: promessa chiara e CTA specifica.` },
        { category: "Comparativa prima/dopo", idea: `Prima: un solo messaggio. Dopo: 5 angoli da testare.` }
      ];

  return rotate(ideas, seed);
}

function cleanOutput(output: GeneratedAdsOutput): GeneratedAdsOutput {
  return {
    ...output,
    quickAnalysis: {
      perceivedProblem: cleanCopy(output.quickAnalysis.perceivedProblem),
      hiddenDesire: cleanCopy(output.quickAnalysis.hiddenDesire),
      adPromise: cleanCopy(output.quickAnalysis.adPromise),
      emotionalLever: cleanCopy(output.quickAnalysis.emotionalLever),
      possibleObjection: cleanCopy(output.quickAnalysis.possibleObjection),
      objectionAnswer: cleanCopy(output.quickAnalysis.objectionAnswer)
    },
    salesAngles: output.salesAngles.map((angle) => ({
      ...angle,
      title: cleanCopy(angle.title),
      explanation: cleanCopy(angle.explanation),
      example: cleanCopy(angle.example)
    })),
    primaryTexts: output.primaryTexts.map(cleanCopy),
    headlines: output.headlines.map(cleanCopy),
    descriptions: output.descriptions.map(cleanCopy),
    videoHooks: {
      problem: output.videoHooks.problem.map(cleanCopy),
      desire: output.videoHooks.desire.map(cleanCopy),
      provocative: output.videoHooks.provocative.map(cleanCopy),
      curiosity: output.videoHooks.curiosity.map(cleanCopy)
    },
    scripts8: output.scripts8.map(cleanScript),
    scripts15: output.scripts15.map(cleanScript),
    scripts30: output.scripts30.map(cleanScript),
    ctas: {
      directSale: output.ctas.directSale.map(cleanCopy),
      whatsappDm: output.ctas.whatsappDm.map(cleanCopy),
      digitalDownload: output.ctas.digitalDownload.map(cleanCopy),
      urgency: output.ctas.urgency.map(cleanCopy),
      retargeting: output.ctas.retargeting.map(cleanCopy)
    },
    canvaPrompts: output.canvaPrompts.map((prompt) => ({
      ...prompt,
      title: cleanCopy(prompt.title),
      style: cleanCopy(prompt.style),
      visualText: cleanCopy(prompt.visualText),
      elements: cleanCopy(prompt.elements),
      mood: cleanCopy(prompt.mood),
      visualCta: cleanCopy(prompt.visualCta)
    })),
    heygenPrompts: output.heygenPrompts.map(cleanCopy),
    invideoPrompts: output.invideoPrompts.map(cleanCopy),
    creativeIdeas: output.creativeIdeas.map((idea) => ({ ...idea, idea: cleanCopy(idea.idea) })),
    readyCampaign: {
      primaryText: cleanCopy(output.readyCampaign.primaryText),
      headline: cleanCopy(output.readyCampaign.headline),
      description: cleanCopy(output.readyCampaign.description),
      videoScript: cleanCopy(output.readyCampaign.videoScript),
      canvaPrompt: cleanCopy(output.readyCampaign.canvaPrompt),
      finalCta: cleanCopy(output.readyCampaign.finalCta)
    }
  };
}

function cleanScript(script: VideoScript): VideoScript {
  return { ...script, title: cleanCopy(script.title), steps: script.steps.map(cleanCopy) };
}

export function generateAds(input: AdsFormInput): GeneratedAdsOutput {
  const seed = hashInput(input);
  const normalized = normalizeInput(input);
  const generatedPrimaryTexts = primaryTexts(input, seed);
  const generatedHeadlines = headlines(input, seed);
  const generatedDescriptions = descriptions(input, seed);
  const generatedScripts8 = scripts8(input, seed);
  const generatedScripts15 = scripts15(input, seed);
  const generatedScripts30 = scripts30(input, seed);
  const generatedCanva = canvaPrompts(input, seed);
  const generatedCtas = ctas(input, seed);
  const bestScript = isDigital(normalized) ? generatedScripts8[0] : generatedScripts15[0];
  const bestCta = isDigital(normalized)
    ? generatedCtas.directSale[0] || "Inizia dal tuo primo prodotto"
    : generatedCtas.urgency[0] || "Prepara il primo test";

  return cleanOutput({
    quickAnalysis: quickAnalysis(input),
    salesAngles: salesAngles(input, seed),
    primaryTexts: generatedPrimaryTexts,
    headlines: generatedHeadlines,
    descriptions: generatedDescriptions,
    videoHooks: videoHooks(input, seed),
    scripts8: generatedScripts8,
    scripts15: generatedScripts15,
    scripts30: generatedScripts30,
    ctas: generatedCtas,
    canvaPrompts: generatedCanva,
    heygenPrompts: heygenPrompts(input, seed),
    invideoPrompts: invideoPrompts(input, seed),
    creativeIdeas: creativeIdeas(input, seed),
    readyCampaign: {
      primaryText: generatedPrimaryTexts[0],
      headline: generatedHeadlines[0],
      description: generatedDescriptions[0],
      videoScript: bestScript.steps.join(" "),
      canvaPrompt: `${generatedCanva[0].format}. ${generatedCanva[0].style}. Testo: ${generatedCanva[0].visualText}. CTA: ${generatedCanva[0].visualCta}.`,
      finalCta: bestCta
    },
    generatedAt: new Intl.DateTimeFormat("it-IT", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date())
  });
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

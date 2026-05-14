import type {
  ABTestSuggestion,
  AdsFormInput,
  ComplianceNote,
  CreativeIdea,
  GeneratedAdsOutput,
  PromptCanva,
  SalesAngle,
  VideoScript
} from "@/types/ads";

type ProductCategory =
  | "digital"
  | "service"
  | "ecommerce"
  | "local"
  | "finance"
  | "wellness"
  | "beauty"
  | "saas"
  | "food"
  | "creative"
  | "general";

type AwarenessLevel = "unaware" | "problem" | "solution" | "product" | "retargeting";
type CreativeType = "screen-recording" | "founder-demo" | "faceless" | "ugc" | "before-after" | "checklist" | "testimonial";

type NormalizedInput = {
  productName: string;
  productType: string;
  productReference: string;
  normalizedProblem: string;
  normalizedDesire: string;
  normalizedBenefit: string;
  normalizedOffer: string;
  normalizedAudience: string;
  audienceShort: string;
  productCategory: ProductCategory;
  emotionalAngle: string;
  practicalAngle: string;
  platformLabel: string;
  goalLabel: string;
  toneLabel: string;
  ctaTheme: string;
  visualSubject: string;
  isVague: boolean;
  vagueSignals: string[];
};

type GenerationPlan = {
  seed: number;
  angle: string;
  awareness: AwarenessLevel;
  creativeType: CreativeType;
  structure: string;
  promiseFrame: string;
  visualFrame: string;
};

const sessionMemory = {
  headlines: [] as string[],
  ctas: [] as string[],
  hooks: [] as string[],
  angles: [] as string[],
  scripts: [] as string[],
  structures: [] as string[]
};

const MEMORY_LIMIT = 260;

const bannedReplacements: Array<[RegExp, string]> = [
  [/frizione intelligente/gi, "domanda utile"],
  [/sbloccare l['’]attenzione/gi, "far capire subito il valore"],
  [/leva emotiva principale/gi, "motivo che spinge all'azione"],
  [/soluzione perfetta/gi, "percorso pratico"],
  [/porta (il tuo )?business al livello successivo/gi, "rendi più chiaro ciò che vendi"],
  [/occasione (da non perdere|imperdibile)/gi, "momento utile per iniziare"],
  [/risultati garantiti/gi, "risultati da verificare con test reali"],
  [/guadagna subito/gi, "inizia con aspettative realistiche"],
  [/soldi facili/gi, "entrate costruite con metodo"],
  [/copy pronto in modo magico/gi, "copy strutturato da adattare"],
  [/campagna perfetta/gi, "prima versione da testare"],
  [/ads profittevoli garantite/gi, "ads da testare con dati reali"],
  [/ROAS garantito/gi, "performance da misurare"],
  [/vendite sicure/gi, "vendite da costruire con test e ottimizzazione"],
  [/successo automatico/gi, "processo più ordinato"],
  [/annuncio infallibile/gi, "annuncio più chiaro da validare"],
  [/conversioni assicurate/gi, "conversioni da misurare"],
  [/dimagrisci in \d+ giorni/gi, "migliora le tue abitudini con un percorso graduale"],
  [/diventa ricco/gi, "costruisci un percorso economico più consapevole"],
  [/esplodere le vendite/gi, "rendere il messaggio più chiaro da testare"],
  [/stai sbagliando tutto/gi, "potresti partire da un messaggio più ordinato"]
];

const riskyPatterns: Array<[RegExp, string]> = [
  [/sei stanco di essere ([^?.,]+)/gi, "Per chi vuole affrontare questo tema con un approccio più organizzato"],
  [/sei (grasso|sovrappeso|povero|disperato|fallito)/gi, "Vuoi migliorare la situazione con un percorso più ordinato"],
  [/non riesci a vendere/gi, "fatichi a comunicare il valore dell'offerta"],
  [/guadagna\s?[\d.]+€?[^.,]*/gi, "costruisci un percorso economico con aspettative realistiche"],
  [/metodo garantito/gi, "metodo pratico da testare"],
  [/risultato garantito/gi, "risultato da validare con test reali"],
  [/prima\/dopo incredibile/gi, "confronto tra situazione iniziale e percorso proposto"],
  [/trasformazione sicura/gi, "miglioramento progressivo"],
  [/cura definitiva/gi, "supporto da valutare con professionisti qualificati"]
];

const categoryKeywords: Record<ProductCategory, string[]> = {
  digital: ["digitale", "corso", "online", "infoprodotto", "creator", "template", "shopify", "contenuti", "caption", "hook"],
  service: ["consulenza", "servizio", "freelance", "coach", "agenzia", "fotografo"],
  ecommerce: ["ecommerce", "shop", "abbigliamento", "prodotto fisico", "beauty", "bundle"],
  local: ["locale", "centro", "studio", "ristorante", "estetica", "palestra"],
  finance: ["finanziario", "invest", "trading", "risparmio", "credito", "mutuo"],
  wellness: ["personal trainer", "nutrizionista", "fitness", "salute", "dimagr", "routine"],
  beauty: ["beauty", "skincare", "estetico", "estetista", "makeup", "trattamento"],
  saas: ["software", "saas", "tool", "app", "dashboard", "crm"],
  food: ["ristorante", "bar", "pizzeria", "food", "menu", "prenotazione"],
  creative: ["fotografo", "design", "grafica", "canva", "visual", "portfolio"],
  general: []
};

const strategicAngles = [
  "foglio bianco",
  "prima direzione chiara",
  "meno tentativi casuali",
  "messaggio più specifico",
  "prima versione da testare",
  "obiezione principale",
  "prima/dopo moderato",
  "checklist prima del lancio",
  "demo del risultato",
  "errore comune",
  "tempo risparmiato",
  "percorso step by step",
  "angolo educativo",
  "prova pratica",
  "retargeting soft",
  "offerta più leggibile",
  "nodo del pubblico",
  "confronto tra opzioni",
  "contenuto salvabile",
  "mini scenario quotidiano",
  " founder story",
  "screen recording",
  "low ticket semplice",
  "da confusione a piano"
];

const awarenessLevels: AwarenessLevel[] = ["unaware", "problem", "solution", "product", "retargeting"];
const creativeTypes: CreativeType[] = ["screen-recording", "founder-demo", "faceless", "ugc", "before-after", "checklist", "testimonial"];

const openingPatterns = [
  "Prima di {action}, chiarisci {asset}.",
  "Il punto non è {surface}. È {realIssue}.",
  "Quando {audience} si blocca, spesso manca {asset}.",
  "{scenario}: ecco dove nasce un annuncio più credibile.",
  "Non serve partire da zero: serve {asset} abbastanza chiaro da testare.",
  "Se {realIssue}, l'annuncio deve semplificare il prossimo passo.",
  "Una buona creatività parte da {asset}, non da una frase decorativa.",
  "Il cliente non deve indovinare: deve capire {benefit}.",
  "Prima del budget viene una domanda: {question}.",
  "Meno parole generiche, più contesto: {scenario}."
];

const headlinePatterns = [
  "Da idea a test chiaro",
  "Prima versione pronta",
  "Meno dubbi, più direzione",
  "Il messaggio prima del budget",
  "Parti con più chiarezza",
  "Una base da adattare",
  "Hook e script più ordinati",
  "Trasforma l'idea in ads",
  "Dai forma alla promessa",
  "Copia, adatta, testa",
  "Prima chiarisci l'offerta",
  "Più angoli da provare",
  "Non partire dal vuoto",
  "Creatività più semplice",
  "Il primo test parte qui",
  "Rendi l'offerta leggibile",
  "Meno template, più contesto",
  "Bozza strategica pronta",
  "Dalla confusione al copy",
  "Una campagna più ordinata"
];

const digitalHeadlines = [
  "Parti dal tuo primo prodotto",
  "Da idea a prodotto digitale",
  "Crea il tuo primo digitale",
  "Non sai da dove iniziare?",
  "Inizia senza confusione",
  "Guida pratica per partire",
  "Il primo passo è qui",
  "Meno tutorial, più direzione",
  "Da confusione a offerta chiara",
  "Idea, nicchia, primi contenuti",
  "Costruisci qualcosa di tuo",
  "Primo prodotto, più ordine",
  "Dai forma alla tua idea",
  "Parti senza mille tutorial",
  "Una guida per iniziare"
];

const ctaBank = [
  "Prepara il primo test",
  "Crea una bozza da adattare",
  "Parti da un messaggio più chiaro",
  "Genera varianti da confrontare",
  "Costruisci la tua prima versione",
  "Metti ordine nella campagna",
  "Copia una base e adattala",
  "Scegli l'angolo da provare",
  "Prepara hook e CTA",
  "Crea materiali per il lancio",
  "Parti dal prossimo test",
  "Rendi l'offerta più leggibile",
  "Trasforma l'idea in copy",
  "Prepara script e visual",
  "Crea una campagna ordinata",
  "Lavora su una nuova variante",
  "Apri una bozza più chiara",
  "Genera la prima direzione",
  "Adatta il copy alla tua offerta",
  "Porta il messaggio in test"
];

const digitalCtas = [
  "Inizia dal tuo primo prodotto",
  "Accedi alla guida pratica",
  "Crea la tua prima idea digitale",
  "Parti con il percorso step by step",
  "Prepara il tuo primo prodotto",
  "Metti ordine tra idea e offerta",
  "Costruisci la prima direzione",
  "Trasforma gli appunti in piano",
  "Parti senza confusione",
  "Dai forma alla prima offerta"
];

const descriptionBank = [
  "Bozza da adattare",
  "Primo test più chiaro",
  "Hook, copy e CTA",
  "Varianti da provare",
  "Prompt e script inclusi",
  "Base strategica",
  "Output copiabili",
  "Messaggio più ordinato",
  "Creatività da testare",
  "Piano più leggibile"
];

const headlineNouns = [
  "idea", "offerta", "messaggio", "hook", "script", "campagna", "brief", "visual", "proposta", "promessa",
  "prima bozza", "direzione", "CTA", "contenuto", "test", "lancio", "angolo", "copy", "scenario", "percorso"
];

const headlineVerbs = [
  "chiarisci", "prepara", "ordina", "trasforma", "rendi leggibile", "metti in test", "semplifica", "struttura",
  "adatta", "confronta", "riscrivi", "porta in bozza", "dai forma a", "scegli", "costruisci"
];

const headlineFrames = [
  "{verb} la tua {noun}",
  "{noun} più chiara",
  "prima {noun} da testare",
  "meno confusione sulla {noun}",
  "da {noun} vaga a bozza",
  "{noun}: il primo passo",
  "una {noun} più ordinata",
  "{verb} prima del budget"
];

const ctaVerbs = [
  "prepara", "crea", "adatta", "copia", "genera", "ordina", "scegli", "confronta", "struttura", "porta in test",
  "riscrivi", "metti a fuoco", "trasforma", "semplifica", "costruisci"
];

const ctaObjects = [
  "la prima bozza", "un nuovo hook", "la CTA", "lo script", "il prompt visual", "la campagna", "il messaggio",
  "l'angolo", "la promessa", "il brief", "il primo test", "la variante", "il copy", "la creatività"
];

const hookFrames = [
  "Prima di {action}, guarda {asset}.",
  "Il blocco non è {surface}: è {realIssue}.",
  "Hai {scenario}? Parti da {asset}.",
  "Se {problem}, prova a cambiare {asset}.",
  "Una ads debole spesso nasce da {realIssue}.",
  "Non serve più rumore: serve {asset}.",
  "La prima domanda non è creativa. È: {question}",
  "Quando il brief è vago, parti da {asset}.",
  "Questo è il punto che molti saltano prima del lancio.",
  "Prima il messaggio. Poi il visual."
];

const complianceDefaults: ComplianceNote[] = [
  {
    topic: "Policy platform",
    note: "Controlla sempre che il copy sia coerente con le policy della piattaforma prima di pubblicare."
  },
  {
    topic: "Promesse",
    note: "Evita claim assoluti: presenta l'output come base da testare, non come promessa certa di performance."
  },
  {
    topic: "Attributi personali",
    note: "Non accusare direttamente l'utente o fare leva su caratteristiche personali sensibili."
  }
];

const abTestDefaults: ABTestSuggestion[] = [
  {
    test: "Hook problema vs hook desiderio",
    why: "Aiuta a capire se il pubblico reagisce meglio al blocco attuale o al risultato desiderato."
  },
  {
    test: "Visual screen recording vs visual faceless",
    why: "Confronta un contenuto dimostrativo con una creatività più semplice e veloce da produrre."
  },
  {
    test: "CTA soft vs CTA diretta",
    why: "Misura se l'utente ha bisogno di più rassicurazione o è già pronto al prossimo passo."
  }
];

const compact = (value: string): string => value.trim().replace(/\s+/g, " ").replace(/\.$/, "");
const lowerFirst = (value: string): string => value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
const sentenceCase = (value: string): string => value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const hasAny = (value: string, words: string[]) => {
  const lower = value.toLowerCase();
  return words.some((word) => lower.includes(word));
};

const hashInput = (input: AdsFormInput): number => {
  const raw = `${JSON.stringify(input)}-${Date.now()}-${Math.random()}`;
  return raw.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const pick = <T,>(items: T[], seed: number, offset = 0): T => items[Math.abs(seed + offset) % items.length];

function remember(bucket: keyof typeof sessionMemory, values: string[]) {
  sessionMemory[bucket].push(...values.map((value) => simplify(value)));
  if (sessionMemory[bucket].length > MEMORY_LIMIT) {
    sessionMemory[bucket] = sessionMemory[bucket].slice(-MEMORY_LIMIT);
  }
}

function simplify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a: string, b: string): number {
  const aWords = new Set(simplify(a).split(" ").filter(Boolean));
  const bWords = new Set(simplify(b).split(" ").filter(Boolean));
  if (!aWords.size || !bWords.size) return 0;
  const overlap = [...aWords].filter((word) => bWords.has(word)).length;
  return overlap / Math.max(aWords.size, bWords.size);
}

function uniqueBySimilarity(items: string[], memory: string[], minDistance = 0.62): string[] {
  const selected: string[] = [];

  for (const item of items.map(cleanCopy)) {
    const isDuplicate = selected.some((prev) => similarity(prev, item) > minDistance);
    const inMemory = memory.some((prev) => similarity(prev, item) > minDistance);
    if (!isDuplicate && !inMemory) selected.push(item);
  }

  for (const item of items.map(cleanCopy)) {
    if (!selected.some((prev) => similarity(prev, item) > minDistance)) selected.push(item);
  }
  return selected.filter((item) => !memory.some((prev) => similarity(prev, item) > minDistance));
}

function rotate<T>(items: T[], seed: number): T[] {
  const start = Math.abs(seed) % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function fillFromPatterns(patterns: string[], c: NormalizedInput, plan: GenerationPlan): string[] {
  return patterns.map((pattern, index) =>
    cleanCopy(
      pattern
        .replaceAll("{product}", c.productReference)
        .replaceAll("{productName}", c.productName)
        .replaceAll("{audience}", c.audienceShort)
        .replaceAll("{problem}", c.normalizedProblem)
        .replaceAll("{desire}", c.normalizedDesire)
        .replaceAll("{benefit}", c.normalizedBenefit)
        .replaceAll("{offer}", c.normalizedOffer)
        .replaceAll("{asset}", pick(["una promessa chiara", "un angolo da testare", "una prima bozza", "una CTA coerente"], plan.seed, index))
        .replaceAll("{surface}", pick(["la grafica", "il budget", "la piattaforma", "l'idea"], plan.seed, index + 3))
        .replaceAll("{realIssue}", pick(["il messaggio che resta troppo vago", "la promessa poco concreta", "il primo passo non abbastanza chiaro"], plan.seed, index + 5))
        .replaceAll("{scenario}", pick(["pagina bianca", "bozze sparse", "annuncio pronto ma poco chiaro", "lancio vicino"], plan.seed, index + 8))
        .replaceAll("{action}", pick(["mettere budget", "aprire Canva", "registrare un video", "scrivere una nuova headline"], plan.seed, index + 11))
        .replaceAll("{question}", pick(["cosa deve capire il cliente?", "qual è il primo passo?", "quale promessa è più credibile?"], plan.seed, index + 14))
    )
  );
}

function expandHeadlines(c: NormalizedInput, plan: GenerationPlan): string[] {
  const generated: string[] = [];

  headlineFrames.forEach((frame, frameIndex) => {
    headlineNouns.forEach((noun, nounIndex) => {
      const verb = pick(headlineVerbs, plan.seed, frameIndex + nounIndex);
      generated.push(
        frame
          .replaceAll("{verb}", verb)
          .replaceAll("{noun}", noun)
      );
    });
  });

  if (isDigital(c)) {
    generated.push(
      "idea, nicchia, offerta",
      "dai forma al digitale",
      "primo prodotto in bozza",
      "meno tutorial, più piano",
      "contenuti prima del lancio"
    );
  }

  if (c.productCategory === "local") generated.push("prenota con più chiarezza", "messaggio locale più forte", "fatti scegliere meglio");
  if (c.productCategory === "finance") generated.push("scelte più ordinate", "prima capisci, poi decidi", "messaggio più prudente");
  if (c.productCategory === "wellness") generated.push("routine più sostenibile", "piccoli passi più chiari", "percorso senza estremi");

  return generated.map(sentenceCase);
}

function expandCtas(c: NormalizedInput, plan: GenerationPlan): string[] {
  const generated: string[] = [];
  ctaVerbs.forEach((verb, verbIndex) => {
    ctaObjects.forEach((object, objectIndex) => {
      generated.push(`${sentenceCase(verb)} ${object}`);
      if ((verbIndex + objectIndex + plan.seed) % 3 === 0) generated.push(`${sentenceCase(verb)} ${object} da testare`);
      if ((verbIndex + objectIndex + plan.seed) % 5 === 0) generated.push(`${sentenceCase(verb)} ${object} per il prossimo lancio`);
    });
  });

  if (isDigital(c)) generated.push(...digitalCtas, "Dai forma alla prima offerta", "Crea il primo piano digitale", "Metti ordine tra idea e nicchia");
  return generated;
}

function expandHooks(c: NormalizedInput, plan: GenerationPlan): string[] {
  return fillFromPatterns(hookFrames, c, plan).concat(
    headlineNouns.map((noun, index) => cleanCopy(`Prima di cambiare ${noun}, chiarisci il messaggio.`)),
    ctaObjects.map((object) => cleanCopy(`Non partire da ${object}: parti dal problema reale.`)),
    isDigital(c)
      ? ["Hai idee salvate ovunque, ma nessuna offerta pronta?", "Il primo prodotto digitale nasce da una scelta, non da altri tutorial."]
      : ["Il cliente non deve decifrare la tua offerta.", "Un test utile parte da una promessa leggibile."]
  );
}

export function cleanCopy(text: string): string {
  return [...bannedReplacements, ...riskyPatterns]
    .reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text)
    .replace(/\b(compra|acquista ora|scopri di più|provalo ora)\b/gi, (match) => {
      const map: Record<string, string> = {
        compra: "valuta",
        "acquista ora": "accedi al percorso",
        "scopri di più": "guarda il prossimo passo",
        "provalo ora": "crea una prima versione"
      };
      return map[match.toLowerCase()] || match;
    })
    .replace(/\s+/g, " ")
    .replace(/\s([,.!?;:])/g, "$1")
    .replace(/\?\./g, "?")
    .replace(/!\./g, "!")
    .trim();
}

function categoryFrom(input: AdsFormInput): ProductCategory {
  const raw = `${input.productType} ${input.productName} ${input.targetAudience} ${input.mainProblem} ${input.audienceDesire} ${input.mainBenefit}`.toLowerCase();

  const order: ProductCategory[] = ["finance", "wellness", "beauty", "food", "saas", "creative", "ecommerce", "local", "digital", "service"];
  return order.find((category) => hasAny(raw, categoryKeywords[category])) || "general";
}

function normalizeAudience(rawAudience: string, category: ProductCategory): string {
  const audience = compact(rawAudience);
  if (audience.length > 3) return lowerFirst(audience);

  const fallbacks: Record<ProductCategory, string> = {
    digital: "creator, freelance e principianti che vogliono partire online",
    service: "professionisti che vogliono spiegare meglio il proprio servizio",
    ecommerce: "persone che acquistano online e cercano un motivo chiaro per scegliere",
    local: "clienti locali che valutano un servizio pratico e vicino",
    finance: "persone interessate a gestire meglio decisioni economiche con prudenza",
    wellness: "persone che vogliono migliorare la propria routine con più metodo",
    beauty: "persone che cercano una routine beauty più ordinata e consapevole",
    saas: "team e professionisti che vogliono semplificare un flusso di lavoro",
    food: "clienti locali che scelgono dove mangiare in base a esperienza e praticità",
    creative: "persone o business che vogliono valorizzare meglio il proprio progetto",
    general: "persone che vogliono capire meglio il valore dell'offerta"
  };

  return fallbacks[category];
}

function interpretProblem(rawProblem: string, category: ProductCategory): string {
  const problem = compact(rawProblem);
  const lower = problem.toLowerCase();

  if (!problem || problem.length < 8) {
    const fallbacks: Record<ProductCategory, string> = {
      digital: "ha idee sparse, ma non sa trasformarle in una prima offerta digitale",
      service: "fatica a spiegare il valore del servizio in modo semplice",
      ecommerce: "vede molte alternative simili e ha bisogno di un motivo concreto per scegliere",
      local: "rimanda la scelta perché non capisce subito cosa rende utile il servizio",
      finance: "vuole più chiarezza prima di prendere decisioni economiche",
      wellness: "fatica a mantenere una routine organizzata e sostenibile",
      beauty: "non sa quale soluzione inserire nella propria routine senza confusione",
      saas: "perde tempo in un processo manuale che potrebbe essere più ordinato",
      food: "sceglie all'ultimo momento e ha bisogno di un motivo semplice per prenotare",
      creative: "non riesce a presentare il valore del lavoro in modo immediato",
      general: "sa di dover comunicare meglio l'offerta, ma non sa da dove partire"
    };
    return fallbacks[category];
  }

  if (hasAny(lower, ["entrata", "extra", "guadagn", "soldi", "reddito", "monetizz"])) {
    return "vorrebbe creare un'entrata extra online, ma non sa da quale idea partire né come renderla sostenibile";
  }

  if (hasAny(lower, ["creare", "lanciare", "vendere", "ottenere", "avere", "trovare", "costruire"]) && !hasAny(lower, ["non", "fatica", "blocc", "confus", "perde", "diffic"])) {
    if (category === "digital") return "vuole partire online, ma si perde tra idee, tutorial e passi poco chiari";
    return "vuole arrivare al risultato, ma non ha ancora un percorso semplice da seguire";
  }

  return lowerFirst(problem);
}

function interpretDesire(rawDesire: string, category: ProductCategory): string {
  const desire = compact(rawDesire);
  const lower = desire.toLowerCase();

  if (!desire || desire.length < 8) {
    const fallbacks: Record<ProductCategory, string> = {
      digital: "creare qualcosa di proprio online con una guida semplice",
      service: "ricevere richieste più qualificate grazie a un messaggio più chiaro",
      ecommerce: "scegliere un prodotto con più fiducia e meno dubbi",
      local: "capire rapidamente perché prenotare o contattare il business",
      finance: "valutare opzioni economiche con più ordine e prudenza",
      wellness: "seguire un percorso più organizzato e sostenibile",
      beauty: "trovare una soluzione adatta alla propria routine",
      saas: "ridurre passaggi manuali e lavorare con più ordine",
      food: "vivere un'esperienza piacevole senza perdere tempo nella scelta",
      creative: "vedere esempi concreti e capire lo stile del lavoro",
      general: "capire il prossimo passo senza perdersi in alternative simili"
    };
    return fallbacks[category];
  }

  if (hasAny(lower, ["step by step", "passo passo", "guida", "corso", "metodo", "percorso"])) {
    return "avere una guida semplice e ordinata da seguire passo dopo passo";
  }

  if (hasAny(lower, ["prodotto digitale", "infoprodotto", "vendere online"])) {
    return "trasformare una prima idea in un prodotto digitale chiaro e presentabile";
  }

  return lowerFirst(desire);
}

function interpretBenefit(rawBenefit: string, category: ProductCategory): string {
  const benefit = compact(rawBenefit);
  const normalized = benefit.replace(/^aiuta\s+a\s+/i, "").replace(/^permette\s+di\s+/i, "");
  const lower = normalized.toLowerCase();

  if (!normalized || normalized.length < 8) {
    return category === "digital"
      ? "passare da un'idea vaga a una prima direzione chiara"
      : "creare una prima versione più chiara da adattare e testare";
  }

  if (hasAny(lower, ["idee", "pochi secondi", "velocemente", "rapidamente"])) {
    return "passare rapidamente da un'idea confusa a una prima direzione chiara";
  }

  if (hasAny(lower, ["step", "passo", "guida", "metodo"])) {
    return "seguire un percorso ordinato invece di improvvisare";
  }

  return lowerFirst(normalized);
}

function normalizeOffer(rawOffer: string, productName: string): string {
  const offer = compact(rawOffer);
  if (!offer) return `${productName} come percorso pratico da valutare`;
  if (hasAny(offer, ["€", "euro", "lancio", "sconto", "invece"])) return offer;
  return `${offer}, presentata come prossimo passo pratico`;
}

function productReference(productName: string, productType: string, seed: number) {
  const references = [
    productName,
    "il percorso",
    "la soluzione",
    "questa offerta",
    productType.includes("tool") ? "il tool" : "la proposta"
  ];
  return pick(references.filter(Boolean), seed);
}

function qualityScore(input: AdsFormInput): GeneratedAdsOutput["inputQualityScore"] {
  const fields = [input.productType, input.productName, input.targetAudience, input.mainProblem, input.audienceDesire, input.mainBenefit, input.offer];
  const filled = fields.filter((field) => compact(field).length >= 8).length;
  const specificity = fields.reduce((sum, field) => sum + Math.min(compact(field).split(" ").length, 12), 0);
  const score = Math.min(100, Math.round(filled * 10 + specificity * 1.5));
  const suggestions: string[] = [];

  if (compact(input.targetAudience).split(" ").length < 3) suggestions.push("Specifica meglio il pubblico: ruolo, livello di esperienza o situazione attuale.");
  if (compact(input.mainProblem).split(" ").length < 5) suggestions.push("Descrivi un problema concreto, non solo una categoria di prodotto.");
  if (compact(input.mainBenefit).split(" ").length < 4) suggestions.push("Aggiungi un beneficio pratico e verificabile, senza promettere risultati certi.");

  return {
    score,
    label: score >= 78 ? "Brief forte" : score >= 55 ? "Brief utilizzabile" : "Brief da arricchire",
    suggestions: suggestions.length ? suggestions : ["Brief abbastanza chiaro: genera 2/3 varianti e confronta gli angoli migliori."]
  };
}

export function normalizeInput(input: AdsFormInput): NormalizedInput {
  const productCategory = categoryFrom(input);
  const productType = compact(input.productType) || (productCategory === "digital" ? "percorso digitale" : "offerta");
  const productName = compact(input.productName) || sentenceCase(productType);
  const normalizedAudience = normalizeAudience(input.targetAudience, productCategory);
  const normalizedProblem = interpretProblem(input.mainProblem, productCategory);
  const normalizedDesire = interpretDesire(input.audienceDesire, productCategory);
  const normalizedBenefit = interpretBenefit(input.mainBenefit, productCategory);
  const normalizedOffer = normalizeOffer(input.offer, productName);
  const platformLabel = input.platform === "Tutte" ? "Meta, TikTok e Instagram" : input.platform;
  const goalLabel = input.campaignGoal.toLowerCase();
  const toneLabel = input.tone.toLowerCase();
  const isVague = qualityScore(input).score < 55;
  const vagueSignals = qualityScore(input).suggestions;

  const emotionalAngle = productCategory === "digital"
    ? "ridurre confusione e dare una prima direzione concreta"
    : "rendere il prossimo passo più chiaro e meno rischioso";

  const practicalAngle = productCategory === "digital"
    ? "mettere in ordine idea, pubblico, promessa e primi contenuti"
    : "costruire un messaggio da testare con creatività semplici";

  return {
    productName,
    productType,
    productReference: productReference(productName, productType, hashInput(input)),
    normalizedProblem,
    normalizedDesire,
    normalizedBenefit,
    normalizedOffer,
    normalizedAudience,
    audienceShort: normalizedAudience.length > 70 ? "il pubblico giusto" : normalizedAudience,
    productCategory,
    emotionalAngle,
    practicalAngle,
    platformLabel,
    goalLabel,
    toneLabel,
    ctaTheme: productCategory === "digital" ? "primo passo digitale" : "primo test",
    visualSubject: productCategory === "digital" ? "appunti, idea e primo piano d'azione" : "offerta, promessa e creatività",
    isVague,
    vagueSignals
  };
}

function buildPlan(input: AdsFormInput, seed: number): GenerationPlan {
  const angle = pick(strategicAngles, seed);
  return {
    seed,
    angle,
    awareness: pick(awarenessLevels, seed, 5),
    creativeType: pick(creativeTypes, seed, 11),
    structure: pick(["problema-prospettiva-azione", "scenario-dimostrazione-cta", "errore-soluzione-test", "checklist-passo-successivo", "obiezione-risposta-soft"], seed, 17),
    promiseFrame: pick(["chiarezza", "ordine", "primo passo", "meno dispersione", "variante da testare"], seed, 23),
    visualFrame: pick(["screen recording", "mockup risultato", "checklist visuale", "b-roll scrivania", "dashboard/output"], seed, 29)
  };
}

function isDigital(c: NormalizedInput) {
  return c.productCategory === "digital";
}

function adPromiseFor(c: NormalizedInput, plan: GenerationPlan): string {
  const digital = [
    `${c.productName} aiuta chi parte da zero a trasformare idee sparse in una prima direzione digitale, con passaggi semplici da seguire.`,
    `${c.productName} è pensato per chi vuole creare qualcosa online senza perdersi tra tutorial, dubbi e appunti lasciati a metà.`,
    `${c.productName} porta ordine tra idea, pubblico e offerta, così il primo prodotto digitale diventa più facile da presentare.`,
    `Il messaggio centrale: passare da confusione a primo piano d'azione, senza promettere scorciatoie o risultati automatici.`
  ];

  const general = [
    `${c.productName} aiuta a trasformare un'offerta difficile da spiegare in un messaggio più chiaro da testare.`,
    `La promessa credibile è rendere più leggibili problema, beneficio e prossimo passo prima di lanciare la campagna.`,
    `Il tool non sostituisce il test: prepara varianti più ordinate per capire quale angolo merita attenzione.`,
    `Il messaggio centrale: meno frasi generiche, più contesto utile per chi deve valutare l'offerta.`
  ];

  return pick(isDigital(c) ? digital : general, plan.seed);
}

function limit(text: string, max: number) {
  const cleaned = cleanCopy(text);
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max - 1).trim()}…`;
}

function reduceProductRepetition(text: string, c: NormalizedInput): string {
  const product = c.productName.trim();
  if (!product || product.length < 4) return text;
  const escaped = product.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let count = 0;

  return text.replace(new RegExp(escaped, "gi"), (match) => {
    count += 1;
    if (count === 1) return match;
    return pick(["il percorso", "il tool", "questa offerta", "la soluzione"], count);
  });
}

function finalizeItems(items: string[], c: NormalizedInput, bucket: keyof typeof sessionMemory, count: number, maxLength?: number) {
  const cleaned = uniqueBySimilarity(
    items.map((item) => reduceProductRepetition(cleanCopy(item), c)),
    sessionMemory[bucket],
    0.58
  ).map((item) => (maxLength ? limit(item, maxLength) : item));

  const selected = cleaned.slice(0, count);
  if (selected.length < count) {
    const fallbacks = fallbackItems(bucket, c, sessionMemory[bucket].length + selected.length)
      .map((item) => (maxLength ? limit(item, maxLength) : item));
    for (const fallback of fallbacks) {
      if (selected.length >= count) break;
      if (!selected.some((item) => similarity(item, fallback) > 0.52)) selected.push(fallback);
    }
  }
  let guard = 0;
  while (selected.length < count && guard < 20) {
    const fallback = maxLength
      ? limit(`${fallbackItems(bucket, c, guard)[guard % fallbackItems(bucket, c, guard).length]} ${guard + 1}`, maxLength)
      : `${fallbackItems(bucket, c, guard)[guard % fallbackItems(bucket, c, guard).length]} ${guard + 1}`;
    selected.push(fallback);
    guard += 1;
  }
  remember(bucket, selected);
  return selected;
}

function fallbackItems(bucket: keyof typeof sessionMemory, c: NormalizedInput, offset: number): string[] {
  const contexts = [
    "prima del budget",
    "per il prossimo test",
    "da adattare oggi",
    "con più chiarezza",
    "senza partire da zero",
    "per una bozza migliore",
    "prima del lancio",
    "con angolo diverso",
    "per il pubblico giusto",
    "da confrontare"
  ];
  const context = (index: number) => contexts[(offset + index) % contexts.length];

  if (bucket === "headlines") {
    return headlineNouns.flatMap((noun, index) => [
      `${sentenceCase(noun)} ${context(index)}`,
      `Nuova ${noun} ${context(index + 2)}`,
      `${sentenceCase(noun)} più chiara ${index % 2 === 0 ? "" : "ora"}`.trim()
    ]);
  }

  if (bucket === "ctas") {
    return ctaObjects.flatMap((object, index) => [
      `${sentenceCase(pick(ctaVerbs, offset, index))} ${object} ${context(index)}`,
      `${sentenceCase(pick(ctaVerbs, offset, index + 3))} ${object}`
    ]);
  }

  if (bucket === "hooks") {
    return headlineNouns.flatMap((noun, index) => [
      `Prima di lavorare su ${noun}, chiarisci il prossimo passo.`,
      `Se ${noun} resta vaga, il test ti dirà poco.`,
      `Una buona bozza parte da ${context(index)}.`
    ]);
  }

  return [
    `Lavora su ${c.practicalAngle} ${context(1)}.`,
    `Costruisci una variante ${context(2)}.`,
    `Parti da ${c.emotionalAngle} ${context(3)}.`,
    `Trasforma il brief in una bozza ${context(4)}.`,
    `Prepara un messaggio più leggibile ${context(5)}.`,
    `Crea una variante con un angolo diverso ${context(6)}.`,
    `Mostra il prossimo passo in modo più concreto ${context(7)}.`,
    `Usa problema, promessa e CTA come struttura ${context(8)}.`
  ];
}

function quickAnalysis(input: AdsFormInput, plan: GenerationPlan): GeneratedAdsOutput["quickAnalysis"] {
  const c = normalizeInput(input);

  return {
    perceivedProblem: c.isVague
      ? `Il brief è ancora generico: conviene lavorare su un angolo "${plan.angle}", utile per trasformare una categoria ampia in una promessa più concreta.`
      : `Il pubblico non cerca solo ${lowerFirst(c.productType)}: vuole un modo più semplice per superare questo blocco: ${c.normalizedProblem}.`,
    hiddenDesire: `Il desiderio reale è ${c.normalizedDesire}, ma senza sentirsi forzato da promesse esagerate o claim difficili da dimostrare.`,
    adPromise: adPromiseFor(c, plan),
    emotionalLever: `La leva più sicura è la chiarezza: mostrare un prossimo passo credibile, non una trasformazione garantita.`,
    possibleObjection: `“E se non fosse adatto al mio caso o richiedesse troppo tempo?”`,
    objectionAnswer: `Rispondi con esempi pratici, output copiabili e una CTA soft: l'obiettivo è creare una prima bozza da adattare e testare.`
  };
}

function primaryTexts(input: AdsFormInput, plan: GenerationPlan): string[] {
  const c = normalizeInput(input);
  const curated = isDigital(c)
    ? [
        `Vuoi creare un prodotto digitale ma non sai da dove partire? Parti da idea, pubblico e promessa prima di pensare alla grafica.`,
        `Un prodotto digitale non nasce salvando altri tutorial. Nasce quando scegli una direzione e la trasformi in una prima offerta.`,
        `Hai appunti, video salvati e idee sparse? Crea una bozza più ordinata prima di perdere altro tempo tra alternative.`,
        `Prima di scrivere pagine, caption e ads, chiarisci cosa vendere, per chi e con quale promessa credibile.`,
        `Trasforma il brief in hook, headline e script video da adattare: una base utile per testare il primo messaggio.`
      ]
    : [
        `Il cliente capisce davvero perché scegliere questa offerta? Parti da una promessa più chiara prima del prossimo test.`,
        `Se l'offerta è confusa, anche una buona creatività fatica a funzionare. Prima chiarisci messaggio, beneficio e CTA.`,
        `Immagina una campagna con hook, headline e script coerenti invece di frasi cambiate a caso.`,
        `Prima di investire budget, chiarisci cosa cambia per il cliente e quale passo deve fare dopo.`,
        `Parti da un messaggio chiaro, poi testa visual, hook e CTA senza promettere risultati automatici.`
      ];

  const candidates = [...rotate(curated, plan.seed).slice(0, 5), ...fillFromPatterns(openingPatterns, c, plan)];
  return finalizeItems(candidates, c, "structures", 5, 150);
}

function chooseBestPrimaryText(items: string[], productName: string): string {
  const product = simplify(productName);
  const scored = items.map((item) => {
    const lower = simplify(item);
    let score = 0;
    if (hasAny(lower, ["prima", "chiarisci", "bozza", "testare", "direzione", "promessa", "offerta", "script", "headline"])) score += 5;
    if (hasAny(lower, ["vuoi", "hai"])) score += 1;
    if (lower.includes(product)) score -= 2;
    if (item.length >= 80 && item.length <= 150) score += 3;
    if (item.includes("?")) score += 1;
    return { item, score };
  });

  return scored.sort((a, b) => b.score - a.score)[0]?.item || items[0];
}

function headlines(input: AdsFormInput, plan: GenerationPlan): string[] {
  const c = normalizeInput(input);
  const categorySpecific = isDigital(c)
    ? digitalHeadlines
    : c.productCategory === "wellness"
      ? ["Routine più ordinata", "Un percorso più sostenibile", "Meno caos, più metodo", "Riparti da piccoli passi"]
      : c.productCategory === "finance"
        ? ["Scelte più consapevoli", "Prima capisci, poi decidi", "Più ordine nelle decisioni", "Guida pratica e prudente"]
        : c.productCategory === "food"
          ? ["Prenota con più gusto", "Il motivo per scegliere", "Una pausa fatta bene", "Menu più chiaro"]
          : headlinePatterns;

  return finalizeItems(rotate([...categorySpecific, ...headlinePatterns, ...expandHeadlines(c, plan)], plan.seed), c, "headlines", 10, 40);
}

function descriptions(input: AdsFormInput, plan: GenerationPlan): string[] {
  const c = normalizeInput(input);
  return finalizeItems(rotate([
    ...descriptionBank,
    "Da adattare e testare",
    "Niente promesse forzate",
    "Più ordine nel copy",
    "Brief più leggibile",
    isDigital(c) ? "Primo piano digitale" : "Messaggio più chiaro"
  ], plan.seed), c, "structures", 5, 30);
}

function videoHooks(input: AdsFormInput, plan: GenerationPlan): GeneratedAdsOutput["videoHooks"] {
  const c = normalizeInput(input);
  const problem = [
    `Prima di ${pick(["mettere budget", "registrare un video", "aprire Canva"], plan.seed)}, chiarisci il messaggio.`,
    `Il problema non è sempre l'offerta. Spesso è il modo in cui viene spiegata.`,
    isDigital(c) ? "Hai mille idee e nessuna direzione chiara?" : "Il cliente capisce davvero il prossimo passo?",
    `Se ${c.normalizedProblem}, l'annuncio deve semplificare, non spingere.`
  ];

  const desire = [
    `Una bozza chiara vale più di dieci idee lasciate a metà.`,
    `Da appunti sparsi a materiali promozionali pronti da adattare.`,
    `Immagina di avere già hook, headline e script da confrontare.`
  ];

  const provocative = [
    `Non ti manca un'altra frase creativa. Ti manca un angolo da testare.`,
    `Più budget non salva un messaggio poco chiaro.`,
    `Se sembra una promessa per tutti, spesso non parla a nessuno.`
  ];

  const curiosity = [
    `C'è una domanda che ogni ads dovrebbe risolvere subito.`,
    `Prima del visual, controlla questa parte del copy.`,
    `Ecco come trasformare un brief confuso in una bozza testabile.`
  ];

  const expanded = expandHooks(c, plan);
  const all = {
    problem: finalizeItems(rotate([...problem, ...expanded], plan.seed), c, "hooks", 3),
    desire: finalizeItems(rotate([...desire, ...expanded], plan.seed + 3), c, "hooks", 3),
    provocative: finalizeItems(rotate([...provocative, ...expanded], plan.seed + 7), c, "hooks", 2),
    curiosity: finalizeItems(rotate([...curiosity, ...expanded], plan.seed + 11), c, "hooks", 2)
  };
  return all;
}

function scriptStep(scene: string, text: string, voice: string, cta?: string) {
  return cta
    ? `Scena: ${scene}. Testo a schermo: "${text}". Voice over: "${voice}". CTA finale: "${cta}".`
    : `Scena: ${scene}. Testo a schermo: "${text}". Voice over: "${voice}".`;
}

function scripts8(input: AdsFormInput, plan: GenerationPlan): VideoScript[] {
  const c = normalizeInput(input);
  const scripts: VideoScript[] = [
    {
      title: "Blocco iniziale",
      duration: "8s",
      steps: [
        scriptStep("persona davanti al PC con appunti aperti", isDigital(c) ? "Troppe idee?" : "Messaggio poco chiaro?", "Il blocco spesso nasce prima della creatività."),
        scriptStep("zoom su una bozza disordinata", "Prima chiarisci l'angolo", "Scegli problema, promessa e prossimo passo."),
        scriptStep(`mockup di ${c.productReference}`, "Bozza pronta da adattare", "Genera una base più ordinata."),
        scriptStep("schermata finale con pulsante", "Prepara il primo test", "Copia, adatta e confronta le varianti.", pick([...ctaBank, ...digitalCtas], plan.seed))
      ]
    },
    {
      title: "Prima del budget",
      duration: "8s",
      steps: [
        scriptStep("cursore su budget campagna", "Prima di spendere", "Controlla se il messaggio è abbastanza chiaro."),
        scriptStep("copy generico barrato", "Troppo vago", "Una frase generica rende il test meno utile."),
        scriptStep("tre headline in colonna", "3 angoli da provare", "Prepara varianti diverse."),
        scriptStep("output ordinato", "Testa con criterio", "Parti da una bozza strategica.", pick(ctaBank, plan.seed + 4))
      ]
    },
    {
      title: "Output mobile",
      duration: "8s",
      steps: [
        scriptStep("telefono in mano con form compilato", "Inserisci il brief", "Bastano prodotto, pubblico e problema."),
        scriptStep("loading del tool", "Hook + script + CTA", "Il tool organizza i materiali."),
        scriptStep("card campagna pronta", "Campagna da adattare", "Non è magia, è una base da testare."),
        scriptStep("copia sezione", "Copia e modifica", "Rendi il copy coerente con la tua offerta.", pick(ctaBank, plan.seed + 8))
      ]
    }
  ];

  remember("scripts", scripts.map((script) => script.title));
  return rotate(scripts, plan.seed);
}

function scripts15(input: AdsFormInput, plan: GenerationPlan): VideoScript[] {
  const c = normalizeInput(input);
  const scripts: VideoScript[] = [
    {
      title: "Scenario concreto",
      duration: "15s",
      steps: [
        scriptStep("scrivania con note e tab aperte", "Hai il prodotto, manca il messaggio", `Quando il pubblico deve valutare un'offerta, spesso il blocco è capire cosa dire prima.`),
        scriptStep("evidenzia problema, promessa, CTA", "3 pezzi da chiarire", "Parti da problema reale, promessa credibile e prossimo passo."),
        scriptStep("dashboard con output", "Hook, headline, script", "Genera varianti da adattare, non un testo unico da copiare alla cieca."),
        scriptStep("schermata campagna", "Testa 2/3 varianti", "Confronta angoli diversi e migliora con i dati.", pick(ctaBank, plan.seed + 2))
      ]
    },
    {
      title: "Demo semplice",
      duration: "15s",
      steps: [
        scriptStep("screen recording del form", "Brief in 60 secondi", "Inserisci prodotto, pubblico, problema e beneficio."),
        scriptStep("output che appare a sezioni", "Copy e prompt ordinati", "Ottieni testi Meta Ads, script video e idee visual."),
        scriptStep("sezione Canva/InVideo", "Creatività più veloce", "Usa i prompt per trasformare il copy in visual o video."),
        scriptStep("pulsante copia", "Copia, adatta, testa", "Controlla sempre coerenza e policy prima di pubblicare.", pick(ctaBank, plan.seed + 5))
      ]
    },
    {
      title: "Obiezione",
      duration: "15s",
      steps: [
        scriptStep("persona indecisa davanti alla campagna", "Non sai se il copy basta?", "Non serve indovinare al primo colpo."),
        scriptStep("due varianti affiancate", "Angoli diversi", "Prepara una variante problema e una variante desiderio."),
        scriptStep("note A/B test", "Confronta i segnali", "Guarda quale messaggio genera più interesse."),
        scriptStep("campagna pronta", "Parti da una base", "Poi adatta tono, prova sociale e visual.", pick(ctaBank, plan.seed + 9))
      ]
    }
  ];

  remember("scripts", scripts.map((script) => script.title));
  return rotate(scripts, plan.seed);
}

function scripts30(input: AdsFormInput, plan: GenerationPlan): VideoScript[] {
  const c = normalizeInput(input);
  const scripts: VideoScript[] = [
    {
      title: "Video parlato naturale",
      duration: "30s",
      steps: [
        scriptStep("creator al laptop", "Prima del budget, il messaggio", "Molte campagne partono dalla grafica o dal budget, ma il primo filtro è più semplice: il pubblico capisce perché dovrebbe interessarsi?"),
        scriptStep("bozza confusa sullo schermo", "Il brief va ordinato", `Se il problema è ${c.normalizedProblem}, il copy deve renderlo chiaro senza accusare l'utente.`),
        scriptStep("output in sezioni", "Hook, copy, script, prompt", "Ads Creator PRO organizza una prima base: primary text, headline, script video e idee visual."),
        scriptStep("due varianti A/B", "Non pubblicare una sola idea", "Prepara almeno due angoli: uno sul problema e uno sul desiderio."),
        scriptStep("CTA finale", "Adatta prima di pubblicare", "Usa l'output come bozza strategica e controlla sempre le policy.", pick(ctaBank, plan.seed + 1))
      ]
    },
    {
      title: "Screen recording guidato",
      duration: "30s",
      steps: [
        scriptStep("registrazione del form", "Dal brief alla bozza", "Inserisci prodotto, pubblico, problema e beneficio: il tool non deve copiare il brief, deve trasformarlo in angoli utilizzabili."),
        scriptStep("sezione angoli", "Scegli la direzione", "Puoi lavorare su foglio bianco, obiezione, semplicità o prima versione da testare."),
        scriptStep("sezione script", "Video facili da produrre", "Le scene sono pensate per Canva, CapCut, HeyGen, InVideo o screen recording."),
        scriptStep("sezione compliance", "Copy più prudente", "Niente promesse garantite o claim aggressivi: meglio un messaggio credibile da validare."),
        scriptStep("download TXT", "Esporta e lavora", "Copia la campagna, adattala e confronta i risultati.", pick(ctaBank, plan.seed + 6))
      ]
    }
  ];

  remember("scripts", scripts.map((script) => script.title));
  return rotate(scripts, plan.seed);
}

function salesAngles(input: AdsFormInput, plan: GenerationPlan): SalesAngle[] {
  const c = normalizeInput(input);
  const candidates: SalesAngle[] = [
    {
      type: "Angolo problema",
      title: "Il blocco da rendere visibile",
      explanation: `Parte dal momento in cui ${c.audienceShort} si ferma perché ${c.normalizedProblem}.`,
      example: `Apri con uno scenario concreto, poi presenta ${c.productReference} come modo per creare una prima direzione più chiara.`
    },
    {
      type: "Angolo desiderio",
      title: "Dal desiderio al primo passo",
      explanation: `Mostra ${c.normalizedDesire} come percorso graduale, non come risultato immediato.`,
      example: `Il messaggio deve far percepire ordine: cosa fare prima, cosa evitare, quale output usare per iniziare.`
    },
    {
      type: "Angolo semplicità",
      title: "Meno teoria, più struttura",
      explanation: `Riduce la complessità e rende l'offerta accessibile senza banalizzarla.`,
      example: `Costruisci il copy in tre blocchi: frustrazione concreta, nuova prospettiva, invito soft all'azione.`
    },
    {
      type: "Angolo obiezione",
      title: "Non devo essere esperto",
      explanation: `Risponde alla paura di non saper usare bene il materiale generato.`,
      example: `Spiega che l'output è una bozza strategica da adattare, utile per creare varianti e non per saltare il test.`
    },
    {
      type: "Angolo visual",
      title: "Mostra il risultato, non solo il prodotto",
      explanation: `Usa ${plan.visualFrame} per rendere tangibile cosa l'utente ottiene.`,
      example: `Suggerisci un visual con schermata dell'output, mockup del risultato e micro-testo leggibile in overlay.`
    },
    {
      type: "Angolo comparativo",
      title: "Prima bozza disordinata vs output ordinato",
      explanation: `Confronto moderato, senza promesse aggressive o trasformazioni certe.`,
      example: `Mostra il passaggio da appunti sparsi a sezioni chiare: hook, headline, script, prompt visual.`
    }
  ];

  const selected = uniqueBySimilarity(rotate(candidates, plan.seed).map((angle) => angle.title), sessionMemory.angles, 0.55).slice(0, 5);
  remember("angles", selected);
  return candidates.filter((angle) => selected.includes(angle.title)).slice(0, 5);
}

function ctas(input: AdsFormInput, plan: GenerationPlan): GeneratedAdsOutput["ctas"] {
  const c = normalizeInput(input);
  const direct = isDigital(c) ? [...digitalCtas, ...expandCtas(c, plan)] : [...ctaBank, ...expandCtas(c, plan)];
  return {
    directSale: finalizeItems(rotate(direct, plan.seed), c, "ctas", 3, 55),
    whatsappDm: finalizeItems(rotate([
      "Scrivici con il tuo brief",
      "Mandaci l'offerta da chiarire",
      "Apri la chat e partiamo dal messaggio",
      "Invia prodotto e pubblico"
    ], plan.seed), c, "ctas", 2, 55),
    digitalDownload: finalizeItems(rotate([
      "Scarica la base e adattala",
      "Copia i materiali del lancio",
      "Prepara script e prompt",
      "Esporta la campagna"
    ], plan.seed), c, "ctas", 2, 55),
    urgency: finalizeItems(rotate([
      "Prepara il copy prima del budget",
      "Scegli l'angolo da testare oggi",
      "Crea una variante prima del lancio",
      "Metti ordine prima di pubblicare"
    ], plan.seed), c, "ctas", 3, 55),
    retargeting: finalizeItems(rotate([
      "Riparti da un messaggio più chiaro",
      "Rivedi l'offerta con un nuovo angolo",
      "Torna con una variante più specifica",
      "Confronta un nuovo hook"
    ], plan.seed), c, "ctas", 2, 55)
  };
}

function canvaPrompts(input: AdsFormInput, plan: GenerationPlan): PromptCanva[] {
  const c = normalizeInput(input);
  const prompts: PromptCanva[] = [
    {
      title: "Visual problema-soluzione moderato",
      format: "1080x1350 per feed Meta e Instagram",
      style: "layout premium chiaro, due colonne, accento blu/viola, testo grande leggibile",
      visualText: isDigital(c) ? "Da idee sparse a prima direzione" : "Prima chiarisci il messaggio",
      elements: `${c.visualSubject}, freccia soft, box checklist, mockup output`,
      mood: "professionale, concreto, non aggressivo",
      visualCta: pick(ctaBank, plan.seed)
    },
    {
      title: "Checklist salvabile",
      format: "1080x1920 per Stories, Reels e TikTok",
      style: "sfondo chiaro, card sovrapposte, icone check, headline in alto",
      visualText: "Hook, promessa, CTA, visual",
      elements: "quattro righe checklist, screenshot del risultato, badge 'bozza da testare'",
      mood: "pratico e utile",
      visualCta: "Copia e adatta"
    },
    {
      title: "Mockup output",
      format: "1200x628 per Facebook Feed e landing",
      style: "dashboard minimal con card bianche e bordo sottile",
      visualText: "Campagna pronta da adattare",
      elements: "sezioni hook, primary text, headline, script e prompt visual",
      mood: "SaaS premium, ordinato, credibile",
      visualCta: "Prepara il test"
    }
  ];
  return rotate(prompts, plan.seed);
}

function heygenPrompts(input: AdsFormInput, plan: GenerationPlan): string[] {
  const c = normalizeInput(input);
  return finalizeItems(rotate([
    `Avatar naturale, tono ${c.toneLabel}. Spiega che il problema non è creare una frase bella, ma chiarire angolo, promessa e CTA. Presenta ${c.productReference} come base da adattare e testare, senza claim assoluti.`,
    `Video parlato credibile. Apri con uno scenario: ${c.normalizedProblem}. Poi mostra il passaggio a hook, headline e script ordinati. Chiudi invitando a creare una prima bozza e controllare le policy prima di pubblicare.`,
    `Avatar frontale, stile consulente pratico. Racconta in modo semplice come trasformare un brief vago in materiali promozionali: primary text, hook video, prompt Canva e campagna pronta da adattare.`
  ], plan.seed), c, "structures", 2, 420);
}

function invideoPrompts(input: AdsFormInput, plan: GenerationPlan): string[] {
  const c = normalizeInput(input);
  return finalizeItems(rotate([
    `Crea un video verticale da 15 secondi. Ritmo pulito, scene semplici: appunti disordinati, output ordinato, due varianti A/B, CTA finale. Overlay: "Prima chiarisci il messaggio", "Hook + script + prompt", "Copia e adatta". Musica moderna sobria.`,
    `Crea un video ads da 20 secondi con screen recording. Mostra compilazione del form, generazione output, zoom su campagna pronta. Testi overlay brevi, sottotitoli leggibili, CTA finale: "${pick(ctaBank, plan.seed)}".`,
    `Crea un video faceless con b-roll laptop e checklist. Scene: problema quotidiano, nuova prospettiva, output del tool, nota compliance. Tono premium, niente promesse aggressive, CTA soft finale.`
  ], plan.seed), c, "structures", 2);
}

function creativeIdeas(input: AdsFormInput, plan: GenerationPlan): CreativeIdea[] {
  const c = normalizeInput(input);
  const ideas: CreativeIdea[] = [
    { category: "Faceless", idea: `Scrivania con appunti sparsi che diventano una checklist: problema, promessa, CTA, visual.` },
    { category: "Faceless", idea: `B-roll laptop con overlay: "Prima del budget, chiarisci il messaggio".` },
    { category: "Faceless", idea: `Mani che evidenziano un brief e poi mostrano output ordinato in card.` },
    { category: "Screen recording", idea: `Compilazione del form e zoom sulle sezioni: hook, primary text, script e prompt.` },
    { category: "Screen recording", idea: `Confronto tra due headline e nota su quale testare come variante A/B.` },
    { category: "Screen recording", idea: `Esportazione TXT e uso del copy dentro una bozza Meta Ads.` },
    { category: "Testimonianza/risultato", idea: `Utente racconta l'esperienza d'uso: "mi ha aiutato a non partire dal foglio bianco".` },
    { category: "Testimonianza/risultato", idea: `Mini caso interno: da brief generico a tre angoli più chiari da valutare.` },
    { category: "Comparativa prima/dopo", idea: `Prima: copy vago. Dopo: bozza con hook, promessa e CTA più leggibili.` },
    { category: "Comparativa prima/dopo", idea: `Prima: mille idee. Dopo: una campagna pronta da adattare e testare.` }
  ];

  return rotate(ideas, plan.seed).slice(0, 10);
}

function complianceNotes(input: AdsFormInput): ComplianceNote[] {
  const c = normalizeInput(input);
  const notes = [...complianceDefaults];

  if (["finance", "wellness", "beauty"].includes(c.productCategory)) {
    notes.unshift({
      topic: "Categoria sensibile",
      note: "Usa claim prudenti: evita promesse su guadagni, salute, corpo o trasformazioni certe. Parla di percorso, routine, chiarezza e valutazione consapevole."
    });
  }

  if (hasAny(`${input.mainProblem} ${input.mainBenefit}`, ["guadagn", "dimagr", "garant", "ricco", "soldi"])) {
    notes.unshift({
      topic: "Claim da moderare",
      note: "Il brief contiene parole potenzialmente rischiose. Il copy è stato reso più prudente e orientato a test, metodo e aspettative realistiche."
    });
  }

  return notes.slice(0, 4);
}

function abTests(input: AdsFormInput, plan: GenerationPlan): ABTestSuggestion[] {
  const c = normalizeInput(input);
  return [
    ...abTestDefaults,
    {
      test: `${plan.angle} vs ${pick(strategicAngles, plan.seed, 4)}`,
      why: `Permette di capire se il pubblico reagisce meglio a un blocco concreto o a una promessa più pratica.`
    }
  ].slice(0, 4);
}

function chooseBestHeadline(headlines: string[], productName: string): string {
  const product = simplify(productName);
  const scored = headlines.map((headline) => {
    const lower = simplify(headline);
    let score = 0;
    if (hasAny(lower, ["idea", "test", "direzione", "messaggio", "offerta", "primo", "chiarezza", "script", "hook"])) score += 5;
    if (lower === product || lower.includes(product)) score -= 8;
    if (headline.length <= 38) score += 2;
    return { headline, score };
  });
  return scored.sort((a, b) => b.score - a.score)[0]?.headline || headlines[0];
}

function cleanScript(script: VideoScript): VideoScript {
  return { ...script, title: cleanCopy(script.title), steps: script.steps.map(cleanCopy) };
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
    },
    complianceNotes: output.complianceNotes.map((note) => ({ ...note, note: cleanCopy(note.note) })),
    abTestSuggestions: output.abTestSuggestions.map((test) => ({ ...test, why: cleanCopy(test.why) }))
  };
}

export function generateAds(input: AdsFormInput): GeneratedAdsOutput {
  const seed = hashInput(input);
  const plan = buildPlan(input, seed);
  const normalized = normalizeInput(input);
  const generatedPrimaryTexts = primaryTexts(input, plan);
  const generatedHeadlines = headlines(input, plan);
  const generatedDescriptions = descriptions(input, plan);
  const generatedScripts8 = scripts8(input, plan);
  const generatedScripts15 = scripts15(input, plan);
  const generatedScripts30 = scripts30(input, plan);
  const generatedCanva = canvaPrompts(input, plan);
  const generatedCtas = ctas(input, plan);
  const bestHeadline = chooseBestHeadline(generatedHeadlines, normalized.productName);
  const bestCta = generatedCtas.directSale[0] || generatedCtas.urgency[0] || "Prepara il primo test";

  return cleanOutput({
    quickAnalysis: quickAnalysis(input, plan),
    salesAngles: salesAngles(input, plan),
    primaryTexts: generatedPrimaryTexts,
    headlines: generatedHeadlines,
    descriptions: generatedDescriptions,
    videoHooks: videoHooks(input, plan),
    scripts8: generatedScripts8,
    scripts15: generatedScripts15,
    scripts30: generatedScripts30,
    ctas: generatedCtas,
    canvaPrompts: generatedCanva,
    heygenPrompts: heygenPrompts(input, plan),
    invideoPrompts: invideoPrompts(input, plan),
    creativeIdeas: creativeIdeas(input, plan),
    readyCampaign: {
      primaryText: chooseBestPrimaryText(generatedPrimaryTexts, normalized.productName),
      headline: bestHeadline,
      description: generatedDescriptions[0],
      videoScript: generatedScripts15[0].steps.join(" "),
      canvaPrompt: `${generatedCanva[0].format}. ${generatedCanva[0].style}. Testo: ${generatedCanva[0].visualText}. Elementi: ${generatedCanva[0].elements}. CTA: ${generatedCanva[0].visualCta}.`,
      finalCta: bestCta
    },
    complianceNotes: complianceNotes(input),
    abTestSuggestions: abTests(input, plan),
    inputQualityScore: qualityScore(input),
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

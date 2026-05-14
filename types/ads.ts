export type Tone =
  | "Diretto e persuasivo"
  | "Amichevole e semplice"
  | "Urgente e promozionale"
  | "Premium e professionale"
  | "Empatico e motivazionale"
  | "Provocatorio ma elegante";

export type Platform =
  | "Meta Ads"
  | "TikTok Ads"
  | "Instagram Reels"
  | "Facebook Feed"
  | "Tutte";

export type Aggressiveness = "Soft" | "Medio" | "Forte";

export type CampaignGoal =
  | "Vendita diretta"
  | "Lead"
  | "Traffico alla landing"
  | "Messaggi WhatsApp/DM"
  | "Lancio prodotto"
  | "Retargeting";

export type OutputType =
  | "Testi Meta Ads"
  | "Headline"
  | "Descrizioni"
  | "Hook video"
  | "Script video 8 secondi"
  | "Script video 15 secondi"
  | "Script video 30 secondi"
  | "Angoli di vendita"
  | "CTA"
  | "Prompt Canva"
  | "Prompt Heygen"
  | "Prompt InVideo"
  | "Idee creative per visual";

export type AdsFormInput = {
  productType: string;
  productName: string;
  targetAudience: string;
  mainProblem: string;
  audienceDesire: string;
  mainBenefit: string;
  offer: string;
  tone: Tone;
  platform: Platform;
  aggressiveness: Aggressiveness;
  campaignGoal: CampaignGoal;
  outputTypes: OutputType[];
};

export type QuickAnalysis = {
  perceivedProblem: string;
  hiddenDesire: string;
  adPromise: string;
  emotionalLever: string;
  possibleObjection: string;
  objectionAnswer: string;
};

export type SalesAngle = {
  type: string;
  title: string;
  explanation: string;
  example: string;
};

export type VideoScript = {
  title: string;
  duration: "8s" | "15s" | "30s";
  steps: string[];
};

export type CreativeIdea = {
  category: string;
  idea: string;
};

export type PromptCanva = {
  title: string;
  format: string;
  style: string;
  visualText: string;
  elements: string;
  mood: string;
  visualCta: string;
};

export type ReadyCampaign = {
  primaryText: string;
  headline: string;
  description: string;
  videoScript: string;
  canvaPrompt: string;
  finalCta: string;
};

export type GeneratedAdsOutput = {
  quickAnalysis: QuickAnalysis;
  salesAngles: SalesAngle[];
  primaryTexts: string[];
  headlines: string[];
  descriptions: string[];
  videoHooks: {
    problem: string[];
    desire: string[];
    provocative: string[];
    curiosity: string[];
  };
  scripts8: VideoScript[];
  scripts15: VideoScript[];
  scripts30: VideoScript[];
  ctas: {
    directSale: string[];
    whatsappDm: string[];
    digitalDownload: string[];
    urgency: string[];
    retargeting: string[];
  };
  canvaPrompts: PromptCanva[];
  heygenPrompts: string[];
  invideoPrompts: string[];
  creativeIdeas: CreativeIdea[];
  readyCampaign: ReadyCampaign;
  generatedAt: string;
};

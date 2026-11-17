// Regression tests for campaign goal relevance. Run with: npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const filename = path.join(__dirname, "..", "lib", "adGenerator.ts");
const source = fs.readFileSync(filename, "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;
const generatedModule = new Module(filename, module);
generatedModule.filename = filename;
generatedModule.paths = module.paths;
generatedModule._compile(compiled, filename);
const { createEmptyInput, generateAds } = generatedModule.exports;

const goals = [
  ["Vendita diretta", /Scopri/i, /scopri/i],
  ["Lead", /Richiedi informazioni/i, /richiedi informazioni/i],
  ["Traffico alla landing", /Scopri i dettagli/i, /pagina dedicata/i],
  ["Messaggi WhatsApp\/DM", /Chiedi informazioni/i, /scrivici/i],
  ["Lancio prodotto", /Scopri/i, /ti presentiamo/i],
  ["Retargeting", /Riscopri/i, /stai ancora valutando/i]
];

for (const [goal, expectedCta, expectedText] of goals) {
  test(`campaign goal: ${goal}`, () => {
    const output = generateAds({
      ...createEmptyInput(),
      campaignGoal: goal,
      productName: "Agenda artigianale",
      productType: "Prodotto fisico",
      targetAudience: "professionisti",
      mainProblem: "perdono appuntamenti",
      audienceDesire: "organizzare le giornate",
      mainBenefit: "tenere traccia degli impegni"
    });
    assert.match(output.readyCampaign.finalCta, expectedCta);
    assert.match(output.readyCampaign.primaryText, expectedText);
    assert.match(output.readyCampaign.primaryText, /Agenda artigianale/);
    assert.doesNotMatch(output.readyCampaign.primaryText, /sconto del|spedizione gratuita|garantito al 100%/i);
  });
}

test("different business briefs do not leak product or audience details", () => {
  const first = generateAds({ ...createEmptyInput(), campaignGoal: "Lead", productName: "Agenda artigianale", targetAudience: "professionisti", mainBenefit: "organizzare appuntamenti" });
  const second = generateAds({ ...createEmptyInput(), campaignGoal: "Lead", productName: "Corso fotografia", targetAudience: "principianti", mainBenefit: "imparare le basi" });
  assert.match(first.readyCampaign.primaryText, /Agenda artigianale/);
  assert.match(second.readyCampaign.primaryText, /Corso fotografia/);
  assert.doesNotMatch(second.readyCampaign.primaryText, /Agenda artigianale|professionisti/);
  assert.notEqual(first.readyCampaign.primaryText, second.readyCampaign.primaryText);
});

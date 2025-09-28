const { fetchRSSFeed } = require("../01-documentRetrieval");
const { getEmbedModel } = require("../03-documentStorageEmbeddingsOllama");
const { setupChromaDB } = require("../04-documentStorageChroma");
const { evaluate } = require("../08-evaluationOllama.js");

// to avoid error 'input length exceeds maximum context length'
const CONTENT_LENGTH = 5000;
// 1 to 8, to speed up the process
const NUMBER_OF_DOCUMENTS_TO_IMPORT = 5;

(async function () {
  const texts = await fetchRSSFeed();
  const embedModel = getEmbedModel();
  const vectorStore = await setupChromaDB(
    texts
      .slice(0, NUMBER_OF_DOCUMENTS_TO_IMPORT)
      .map(({ text }) => text.slice(0, CONTENT_LENGTH)),
    embedModel,
  );
  await evaluate(texts, vectorStore);
})();

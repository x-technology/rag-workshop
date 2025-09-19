const { fetchRSSFeed } = require("../01-documentRetrieval.js");

const { getEmbedModel } = require("../03-documentStorageEmbeddingsOllama.js");
const { setupChromaDB } = require("../04-documentStorageChroma.js");
const { advancedRAG } = require("../07-documentRetrieveByQueryOllama.js");

// to avoid error 'input length exceeds maximum context length'
const CONTENT_LENGTH = 5000;
// 1 to 8, to speed up the process
const NUMBER_OF_DOCUMENTS_TO_IMPORT = 5;
// information we are looking for
const question = "What's terraform used for?";

(async function () {
  const texts = await fetchRSSFeed();
  const embedModel = getEmbedModel();
  const vectorStore = await setupChromaDB(
    texts
      .slice(0, NUMBER_OF_DOCUMENTS_TO_IMPORT)
      .map(({ text }) => text.slice(0, CONTENT_LENGTH)),
    embedModel,
  );
  console.log(await advancedRAG(vectorStore, question));
})();

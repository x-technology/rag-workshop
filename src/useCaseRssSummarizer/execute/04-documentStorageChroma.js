const { getEmbedModel } = require("../03-documentStorageEmbeddingsOllama.js");
const {
  setupChromaDB,
  searchChromaDB,
} = require("../04-documentStorageChroma.js");

(async function () {
  const texts = ["Hello, world!", "Sum of 2 and 3 is 5"];
  const embedModel = getEmbedModel();
  const vectorStore = await setupChromaDB(texts, embedModel);
  console.log(
    await searchChromaDB(vectorStore, "What is the sum of 2 and 3?", 1),
  );
})();

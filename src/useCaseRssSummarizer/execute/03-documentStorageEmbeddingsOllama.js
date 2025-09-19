const {
  generateEmbeddings,
} = require("../03-documentStorageEmbeddingsOllama.js");
const { ChromaClient } = require("chromadb");

(async function () {
  const texts = ["Hello, world!", "Sum of 2 and 3 is 5"];
  const embeddings = await generateEmbeddings(texts);
  console.log(embeddings);
  //const client = new ChromaClient({ path: "http://localhost:8000" });
  // const collection = await client.getCollection({
  //   name: "rag_node_workshop_articles",
  // });
  //
  // console.log(
  //   await collection.query({
  //     queryTexts: "What is the sum of 2 and 3?",
  //   }),
  // );
})();

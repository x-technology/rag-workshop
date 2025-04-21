// =============================================================
// COMPLETE WORKFLOW EXAMPLE
// =============================================================
require("dotenv").config();

const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { fetchRSSFeed } = require("./01-documentRetrieval.js");
const { splitByTokens } = require("./02-documentSplitter.js");
const { getEmbedModel } = require("./03-documentStorageEmbeddingsOllama.js");
const { advancedRAG } = require("./07-documentRetrieveByQueryOllama.js");
const { ChromaClient } = require("chromadb");
const { evaluate } = require("./08-evaluationOllama");
const { setupChromaDB } = require("./04-documentStorageChroma");

const fs = require("fs");
const util = require("util");
const { MODEL } = require("./07-documentRetrieveByQueryOllama");
// Or 'w' to truncate the file every time the process starts.
const logFile = fs.createWriteStream(
  `splitByTokens_500_50_nomic-embed-text_${MODEL}.txt`,
  { flags: "a" },
);
const logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + "\n");
  logStdout.write(util.format.apply(null, arguments) + "\n");
};

async function completeWorkshopDemo() {
  console.log("STARTING WORKSHOP DEMO");

  // 1. First, retrieve documents (simulate RSS feed)
  console.log("\n--- DOCUMENT RETRIEVAL ---");
  const rssFeed = await fetchRSSFeed("https://example.com/rss");
  const documents = rssFeed.map((item) => item.text);
  console.log(`Retrieved ${documents.length} documents`);

  // 2. Split documents
  console.log("\n--- DOCUMENT SPLITTING ---");
  const allChunks = [];
  for (const doc of documents) {
    const chunks = await splitByTokens(doc, 500, 50);
    allChunks.push(...chunks);
  }
  console.log(`Split into ${allChunks.length} chunks`);

  // 3. Generate embeddings
  console.log("\n--- EMBEDDINGS GENERATION ---");

  // const embeddings = await generateEmbeddings(allChunks);
  // console.log(`Generated ${embeddings.length} embeddings`);

  // 4. Store in vector database
  // Delete the existing collection first because when the model is switched, it's dimensionality differs
  const chromaClient = new ChromaClient({
    path: "http://localhost:8000", // Default ChromaDB server address
  });

  try {
    // clear existing models to be able to put records with a different model
    await chromaClient.deleteCollection({
      name: "rag_node_workshop_articles",
    });
  } catch {}
  await chromaClient.createCollection({
    name: "rag_node_workshop_articles",
    metadata: {
      description: "RSS feed articles for RAG workshop",
    },
  });

  console.log("\n--- VECTOR STORAGE ---");
  const embedModel = getEmbedModel();
  const vectorStore = await setupChromaDB(allChunks, embedModel);
  console.log("Documents stored in vector database");

  // 5. Retrieve and answer
  console.log("\n--- RETRIEVE & ANSWER ---");
  const question = async (query) => {
    const answer = await advancedRAG(vectorStore, query);
    console.log(`Query: ${query}`);
    console.log(`Answer: ${answer}`);
  };
  await question("What are the best ChatGPT use cases?");
  await question("What is the best JavaScript framework?");

  // 6. Evaluate based on summary
  console.log("\n--- EVALUATE THE STORE ---");
  await evaluate(allChunks, vectorStore);

  console.log("\nWORKSHOP DEMO COMPLETED");
}

completeWorkshopDemo();

// =============================================================
// COMPLETE WORKFLOW EXAMPLE
// =============================================================
require("dotenv").config();

const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { fetchRSSFeed } = require("./01-documentRetrieval.js");
const { splitByCharacter } = require("./02-documentSplitter.js");
const {
  generateEmbeddings,
  getEmbedModel,
} = require("./03-documentStorageEmbeddingsOllama.js");
const { advancedRAG } = require("./07-documentRetrieveAndSummarizeOllama.js");
const { ChromaClient } = require("chromadb");

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
    const chunks = await splitByCharacter(doc, 500, 50);
    allChunks.push(...chunks);
  }
  console.log(`Split into ${allChunks.length} chunks`);

  // 3. Generate embeddings
  console.log("\n--- EMBEDDINGS GENERATION ---");
  const embedModel = getEmbedModel();
  const embeddings = await generateEmbeddings(allChunks);
  console.log(`Generated ${embeddings.length} embeddings`);

  // 4. Store in vector database
  // Delete the existing collection first because when the model is switched, it's dimensionality differs
  const chromaClient = new ChromaClient({
    path: "http://localhost:8000", // Default ChromaDB server address
  });
  await chromaClient.deleteCollection({
    name: "rag_node_workshop_articles",
  });

  console.log("\n--- VECTOR STORAGE ---");
  const vectorStore = await Chroma.fromTexts(
    allChunks,
    { id: Array.from({ length: allChunks.length }, (_, i) => `chunk-${i}`) },
    embedModel,
    {
      collectionName: "rag_node_workshop_articles",
    },
  );
  console.log("Documents stored in vector database");

  // 5. Retrieve and summarize
  console.log("\n--- RETRIEVE & SUMMARIZE ---");
  const query = "What are the main topics in these articles?";
  const answer = await advancedRAG(vectorStore, query);
  console.log(`Query: ${query}`);
  console.log(`Answer: ${answer}`);

  console.log("\nWORKSHOP DEMO COMPLETED");
}

completeWorkshopDemo();

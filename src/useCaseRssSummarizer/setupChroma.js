// chroma-example.js
require("dotenv").config();
const { ChromaClient } = require("chromadb");
const { OpenAI } = require("openai");
const { loadJSONDocuments } = require("./01-documentRetrieval.js");

// Initialize OpenAI for embeddings and completions
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
//
// async function generateEmbedding(text) {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-ada-002",
//     input: text,
//   });
//   return response.data[0].embedding;
// }

async function runChromaExample() {
  console.log("Starting ChromaDB example...");

  // Sample data - RSS feed items
  const articles = await loadJSONDocuments(
    // "./src/useCaseRssSummarizer/assets/articles.json",
    "./src/useCaseRssSummarizer/assets/articlesSmall.json",
  );
  console.log("Retrieved articles...", articles.length);

  // 1. Connect to ChromaDB
  const client = new ChromaClient({
    path: "http://localhost:8000", // Default ChromaDB server address
  });

  console.log("Connected to ChromaDB");

  // 2. Create or get a collection
  let collection;
  const collectionName = "rag_node_workshop_articles";

  try {
    // List all collections first
    const collections = await client.listCollections();
    console.log("Existing collections:", collections);

    // Try to get the collection if it exists
    if (collections.some((c) => c === collectionName)) {
      collection = await client.getCollection({
        name: collectionName,
      });
      console.log(`Retrieved existing collection: ${collectionName}`);
    } else {
      // Create a new collection if it doesn't exist
      collection = await client.createCollection({
        name: collectionName,
        metadata: {
          description: "RSS feed articles for RAG workshop",
        },
      });
      console.log(`Created new collection: ${collectionName}`);
    }
  } catch (error) {
    console.error("Error accessing collection:", error);
    return;
  }

  // // 3. Generate embeddings and add documents
  // try {
  //   const ids = articles.map((_, i) => `article-${i}`);
  //   const documents = articles.map((a) => `${a.url}\n${a.text}`);
  //   const metadatas = articles.map((a) => ({ url: a.url }));
  //
  //   // Generate embeddings for each document
  //   console.log("Generating embeddings...");
  //   const embeddings = [];
  //   for (const doc of documents) {
  //     const embedding = await generateEmbedding(doc);
  //     embeddings.push(embedding);
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //   }
  //
  //   // Add documents to collection
  //   await collection.add({
  //     ids: ids,
  //     embeddings: embeddings,
  //     documents: documents,
  //     metadatas: metadatas,
  //   });
  //
  //   console.log(`Added ${documents.length} documents to collection`);
  // } catch (error) {
  //   console.error("Error adding documents:", error);
  //   return;
  // }
  //
  // // 4. Query the collection
  // try {
  //   console.log("Querying collection...");
  //   const queryText = "How do vector databases work?";
  //
  //   // Generate embedding for the query
  //   const queryEmbedding = await generateEmbedding(queryText);
  //
  //   // Search for similar documents
  //   const results = await collection.query({
  //     queryEmbeddings: [queryEmbedding],
  //     nResults: 2,
  //   });
  //
  //   console.log("Query:", queryText);
  //   console.log("Results:", JSON.stringify(results, null, 2));
  //
  //   // 5. Use the retrieved documents to generate an answer
  //   const contextDocs = results.documents[0];
  //   const context = contextDocs.join("\n\n");
  //
  //   const completion = await openai.chat.completions.create({
  //     model: "gpt-4",
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "You are a helpful assistant that answers questions based on the provided context.",
  //       },
  //       {
  //         role: "user",
  //         content: `Context information: ${context}\n\nQuestion: ${queryText}\n\nPlease answer the question based only on the context provided.`,
  //       },
  //     ],
  //   });
  //
  //   console.log("\nGenerated Answer:");
  //   console.log(completion.choices[0].message.content);
  // } catch (error) {
  //   console.error("Error querying collection:", error);
  // }
}

// Add function to view all collections
async function viewAllCollections() {
  const client = new ChromaClient({
    path: "http://localhost:8000",
  });

  const collections = await client.listCollections();
  console.log("\nAll Collections:");
  console.table(collections);
}

// Run the example
runChromaExample()
  .then(() => viewAllCollections())
  .catch(console.error);

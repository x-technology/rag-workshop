// =============================================================
// PART 5: RETRIEVE & SUMMARIZE (10 min) - @pavlik
// =============================================================

const { RetrievalQAChain } = require("langchain/chains");
const { ChatOllama } = require("@langchain/ollama");
const { default: Ollama } = require("ollama");

// Basic RAG Implementation
async function retrieveAndGenerate(vectorStore, query) {
  // Initialize the tinyllama model via Ollama
  const model = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default Ollama server address
    model: "tinyllama:1.1b", // Ultra-small model (around 600MB)
    temperature: 0.2, // Keeping low for factual responses
  });

  // Create a retriever from the vector store
  const retriever = vectorStore.asRetriever({
    k: 3, // Limit to top 3 results given the model's limited context window
  });

  // Create the RAG chain
  const chain = RetrievalQAChain.fromLLM(model, retriever, {
    returnSourceDocuments: false,
    verbose: false,
  });

  try {
    // Execute the chain
    const response = await chain.call({
      query: query,
    });

    return response.text;
  } catch (error) {
    console.error("Error in RAG process:", error);
    return "Error generating response based on retrieved documents.";
  }
}

/**
 * Summarizes documents based on a specific question using the smallest possible Ollama model
 * @param {Array<{pageContent: string}|string>} documents - Documents to summarize
 * @param {string} question - Question to answer from the documents
 * @returns {Promise<string>} - Summary text
 */
async function summarizeDocuments(documents, question) {
  // Initialize Ollama client
  const ollama = new Ollama({
    host: "http://localhost:11434", // Default Ollama server address
  });

  // Combine document content
  const combinedText = documents
    .map((doc) => doc.pageContent || doc)
    .join("\n\n");

  try {
    const response = await ollama.chat({
      model: "tinyllama:1.1b", // Ultra-small model, only around 600MB
      messages: [
        {
          role: "system",
          content:
            "Summarize information from documents to answer questions briefly.",
        },
        {
          role: "user",
          content: `Based on these documents, answer this question: ${question}\n\nDocuments:\n${combinedText}`,
        },
      ],
      temperature: 0.5, // Slightly higher for more coherent completions on small models
      stream: false,
    });

    return response.message.content;
  } catch (error) {
    console.error("Error summarizing documents:", error);
    return "Error generating summary";
  }
}

// Advanced RAG with LangChain
async function advancedRAG(vectorStore, query) {
  const model = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default Ollama server address
    model: "tinyllama:1.1b", // Ultra-small model (around 600MB)
    temperature: 0.2, // Keeping low for factual responses
  });

  // Create a retriever with search options
  const retriever = vectorStore.asRetriever({
    searchType: "similarity",
    k: 5,
  });

  // Get relevant documents
  const docs = await retriever.invoke(query);
  console.log("advancedRAG similar docs", docs);

  // Format documents for the prompt
  const formattedDocs = docs
    .map((doc, i) => `Document ${i + 1}:\n${doc.pageContent || doc}`)
    .join("\n\n");

  // Generate answer from the model
  const systemTemplate = `You are a helpful assistant that answers questions based on the provided documents.
  First analyze what documents are relevant to the question.
  Then answer the question using only information from those documents.
  If the documents don't contain the answer, say "I don't have enough information to answer this question."`;
  console.log("model call params", [
    { role: "system", content: systemTemplate },
    {
      role: "user",
      content: `Question: ${query}\n\nDocuments:\n${formattedDocs}`,
    },
  ]);
  const response = await model.call([
    { role: "system", content: systemTemplate },
    {
      role: "user",
      content: `Question: ${query}\n\nDocuments:\n${formattedDocs}`,
    },
  ]);

  return response.content;
}

// Export functions for workshop modules
module.exports = {
  retrieveAndGenerate,
  summarizeDocuments,
  advancedRAG,
};

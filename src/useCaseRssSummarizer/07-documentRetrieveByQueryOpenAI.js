// =============================================================
// PART 5: RETRIEVE & SUMMARIZE @pavlik
// =============================================================

const { RetrievalQAChain } = require("langchain/chains");
const { ChatOpenAI } = require("@langchain/openai");

// Basic RAG Implementation
async function retrieveAndGenerate(vectorStore, query) {
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4",
  });

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  const response = await chain.call({
    query: query,
  });

  return response.text;
}

// Document Summarization
async function summarizeDocuments(documents, question) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const combinedText = documents
    .map((doc) => doc.pageContent || doc)
    .join("\n\n");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes information from documents to answer questions accurately.",
        },
        {
          role: "user",
          content: `Based on the following documents, please answer this question: ${question}\n\nDocuments:\n${combinedText}`,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error summarizing documents:", error);
    return "Error generating summary";
  }
}

// Advanced RAG with LangChain
async function advancedRAG(vectorStore, query) {
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4",
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

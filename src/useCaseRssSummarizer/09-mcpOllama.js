const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
  StdioServerTransport,
} = require("@modelcontextprotocol/sdk/server/stdio.js");
const z = require("zod");
const { fetchRSSFeed } = require("./01-documentRetrieval");
const { getEmbedModel } = require("./03-documentStorageEmbeddingsOllama");
const { setupChromaDB } = require("./04-documentStorageChroma");
const { getRelevantDocuments } = require("./07-documentRetrieveByQueryOllama");

// to avoid error 'input length exceeds maximum context length'
const CONTENT_LENGTH = 5000;
// 1 to 8, to speed up the process
const NUMBER_OF_DOCUMENTS_TO_IMPORT = 5;

(async function () {
  // Create an MCP server
  const server = new McpServer({
    name: "rag-workshop-mcp-server",
    version: "1.0.0",
  });

  // Add an addition tool
  server.registerTool(
    "get_documents",
    {
      title: "Get related documents",
      description:
        "Get related documents from my personal RSS feeds to reply to a question with a up-to-date information",
      inputSchema: { q: z.string() },
    },
    async ({ q }) => {
      const texts = await fetchRSSFeed();
      const embedModel = getEmbedModel();
      const vectorStore = await setupChromaDB(
        texts
          .slice(0, NUMBER_OF_DOCUMENTS_TO_IMPORT)
          .map(({ text }) => text.slice(0, CONTENT_LENGTH)),
        embedModel,
      );

      // Get relevant documents
      const docs = await getRelevantDocuments(vectorStore, q);
      console.log("query", q);
      console.log("advancedRAG relevant docs", docs);

      // Format documents for the prompt
      const formattedDocs = docs
        .map((doc, i) => `Document ${i + 1}:\n${doc.pageContent || doc}`)
        .join("\n\n");

      return {
        content: [{ type: "text", text: formattedDocs }],
      };
    },
  );

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();

const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StdioClientTransport,
} = require("@modelcontextprotocol/sdk/client/stdio.js");

(async function () {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./src/useCaseRssSummarizer/09-mcpOllama.js"],
  });

  const client = new Client({
    name: "rag-workshop-mcp-client",
    version: "1.0.0",
  });

  await client.connect(transport);

  // Call a tool
  const result = await client.callTool({
    name: "get_documents",
    arguments: {
      q: "What's terraform used for?",
    },
  });

  console.log(result);
})();

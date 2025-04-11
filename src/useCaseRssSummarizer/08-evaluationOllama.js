const {
  summarizeDocument,
  getRelevantDocuments,
} = require("./07-documentRetrieveByQueryOllama");

function hitRate(relevanceTotal) {
  let cnt = 0;

  for (const line of relevanceTotal) {
    if (line.includes(true)) {
      cnt = cnt + 1;
    }
  }

  return cnt / relevanceTotal.length;
}

function mrr(relevanceTotal) {
  let totalScore = 0.0;

  for (const line of relevanceTotal) {
    for (let rank = 0; rank < line.length; rank++) {
      if (line[rank] === true) {
        totalScore = totalScore + 1 / (rank + 1);
        break; // Stop after finding the first true value
      }
    }
  }

  return totalScore / relevanceTotal.length;
}

async function evaluate(allChunks, vectorStore, limit = 3) {
  const relevanceTotal = [];
  let index = 0;
  for (const chunk of allChunks) {
    const summary = await summarizeDocument(chunk, 64);
    console.log(`#: ${index}`);
    console.log(`Chunk: ${chunk}`);
    console.log(`Summary: ${summary}`);
    console.log("");
    console.log("");
    index += 1;
    if (index > limit) {
      break;
    }
    const relevantDocs = await getRelevantDocuments(vectorStore, summary);
    console.log(relevantDocs);
    const relevance = relevantDocs.map((d) => d.pageContent === chunk);
    relevanceTotal.push(relevance);
    // console.log(relevanceTotal);
    // await question(
    //   `Here is a summary of some documents (none, one or more): "${summary}". Summary of what document is it?`,
    // );
  }

  console.log("Relevance", relevanceTotal);
  console.log("Hit Rate", hitRate(relevanceTotal));
  console.log("Mean Reciprocal Rank", mrr(relevanceTotal));
}

module.exports = {
  hitRate,
  mrr,
  evaluate,
};

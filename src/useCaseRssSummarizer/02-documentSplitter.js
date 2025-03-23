// =============================================================
// PART 3: DOCUMENT SPLITTING (15 min) - @alex
// =============================================================

const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

// Basic Text Splitter
async function splitByCharacter(text, chunkSize = 1000, overlap = 200) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: overlap,
  });

  return await splitter.splitText(text);
}

// Split by Token Count
async function splitByTokens(text, chunkSize = 500, overlap = 50) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap: overlap,
    lengthFunction: (text) => text.split(" ").length, // Simple token approximation
  });

  return await splitter.splitText(text);
}

// Split by Semantic Units (paragraphs, sentences)
function splitByParagraphs(text) {
  return text.split("\n\n").filter((para) => para.trim() !== "");
}

function splitBySentences(text) {
  return text.split(/[.!?]+/).filter((sentence) => sentence.trim() !== "");
}

// Practical example for the workshop
async function documentSplittingDemo(longDocument) {
  console.log("Original document length:", longDocument.length);

  // 1. Character-based splitting
  const charChunks = await splitByCharacter(longDocument);
  console.log(`Split into ${charChunks.length} chunks by character`);
  console.log("Sample chunk:", charChunks[0].substring(0, 100) + "...");

  // 2. Token-based splitting
  const tokenChunks = await splitByTokens(longDocument);
  console.log(`Split into ${tokenChunks.length} chunks by tokens`);

  // 3. Paragraph-based splitting
  const paragraphChunks = splitByParagraphs(longDocument);
  console.log(`Split into ${paragraphChunks.length} paragraphs`);

  // 4. Sentence-based splitting
  const sentenceChunks = splitBySentences(longDocument);
  console.log(`Split into ${sentenceChunks.length} sentences`);

  return {
    charChunks,
    tokenChunks,
    paragraphChunks,
    sentenceChunks,
  };
}

// Export functions for workshop modules
module.exports = {
  splitByCharacter,
  splitByTokens,
  splitByParagraphs,
  splitBySentences,
  documentSplittingDemo,
};

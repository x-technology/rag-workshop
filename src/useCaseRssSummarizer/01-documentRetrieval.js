// =============================================================
// PART 2: DOCUMENT RETRIEVAL @alex
// =============================================================

const fs = require("fs").promises;
const csv = require("csv-parser");
const axios = require("axios");
const { createReadStream } = require("fs");

// Load JSON documents
async function loadJSONDocuments(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading JSON:", error);
    return [];
  }
}

// Load CSV documents
async function loadCSVDocuments(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

// Fetch RSS Feed
async function fetchRSSFeed(url) {
  try {
    // const response = await axios.get(url);
    // In a real implementation, you would parse the XML here
    // For the workshop, we can simulate parsed RSS data
    return loadJSONDocuments(
      "./src/useCaseRssSummarizer/assets/articlesSmall.json",
    );
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return { title: "", items: [] };
  }
}

// Export functions for workshop modules
module.exports = {
  loadJSONDocuments,
  loadCSVDocuments,
  fetchRSSFeed,
};

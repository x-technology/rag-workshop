const { fetchRSSFeed } = require("./01-documentRetrieval.js");

async function dev() {
  const docs = await fetchRSSFeed();

  console.log(docs.length);
}

dev();

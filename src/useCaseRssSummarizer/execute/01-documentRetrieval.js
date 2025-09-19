const { fetchRSSFeed } = require("../01-documentRetrieval.js");

(async function () {
  console.log(await fetchRSSFeed());
})();

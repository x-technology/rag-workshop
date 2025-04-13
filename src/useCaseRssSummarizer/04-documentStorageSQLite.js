// =============================================================
// PART 4: DOCUMENT STORAGE @alex
// =============================================================

// Database Integration: Simple SQLite Example
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function setupSQLiteDB() {
  const db = await open({
    filename: "documents.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      embedding TEXT
    );
  `);

  return db;
}

async function storeDocumentsInDB(db, documents, embeddings) {
  const stmt = await db.prepare(
    "INSERT INTO documents (content, embedding) VALUES (?, ?)",
  );

  for (let i = 0; i < documents.length; i++) {
    await stmt.run(documents[i], JSON.stringify(embeddings[i]));
  }

  await stmt.finalize();
  console.log(`Stored ${documents.length} documents in the database`);
}

async function searchDocumentsInDB(db, queryEmbedding, limit = 3) {
  // This is a simplified approach - in production, you'd use a proper vector DB
  const rows = await db.all("SELECT id, content, embedding FROM documents");

  const results = rows.map((row) => ({
    id: row.id,
    content: row.content,
    similarity: cosineSimilarity(queryEmbedding, JSON.parse(row.embedding)),
  }));

  return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  return dotProduct / (normA * normB);
}

// Export functions for workshop modules
module.exports = {
  setupSQLiteDB,
  storeDocumentsInDB,
  searchDocumentsInDB,
};

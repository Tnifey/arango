import { aql, Database } from "./mod.ts";
import { CollectionType } from "./src/types.ts";

const db = new Database({
  url: "http://localhost:8529/",
  auth: { username: "root" },
  name: "_system", // database name
});

const collectionName = "test-collection";
const collection = db.collection(collectionName);

const exists = await collection.exists();
if (!exists) { // create collection if not exists
  await db.createCollection({
    name: collectionName,
    type: CollectionType.DOCUMENT_COLLECTION, // 2 - document collection, 3 - edge collection
  });
}

try {
  const queryToExplain = aql`
    for u in ${collection}
      limit 2
    return u
  `;

  const explain = await db.explain(queryToExplain);
  console.log(explain);
} catch (error) {
  console.log(error);
}

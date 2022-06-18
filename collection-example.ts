import { aql, CollectionType, Connection } from "./mod.ts";

const connection = new Connection({
  url: ["http://localhost:8529/"],
  auth: { username: "root" },
});

const db = connection.database("_system");

const collectionName = "test-collection";
const collection = db.collection(collectionName);

const exists = await collection.exists();
if (!exists) { // create collection if not exists
  await collection.create({
    name: collectionName,
    type: CollectionType.DOCUMENT, // 2 - document collection, 3 - edge collection
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

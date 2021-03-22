Simple ArangoDB driver for Deno

```
arangodb: 3.7.10
---
deno 1.8.2 (release, x86_64-unknown-linux-gnu)
v8 9.0.257.3
typescript 4.2.2
```

## Usage

```ts
import {
  aql,
  Database,
} from "https://github.com/Tnifey/arango/raw/main/mod.ts";

const db = new Database({
  url: "http://localhost:8529/",
  auth: { username: "root" },
  name: "_system", // database name
});

// Alternative:
// const pool = arango({
//   url: "http://localhost:8529/",
//   auth: { username: "root" },
// });
// const db = pool.database('_system');

const payload = 4;

const query = aql` 
  let nums = ${payload}
  for i in 1..nums // [1,2,3,4]
    return i + 1
`;

try {
  const cursor = await db.query(query, { batchSize: 2 });

  console.log({
    cursor: await cursor.all(), // { cursor: [ 2, 3 ] }
  });

  const more = await cursor.nextBatch(); // it is new Cursor or undefined

  console.log({
    more: await more?.all(), // { more: [ 4, 5 ] }
  });
} catch (error) {
  console.log(error);
}
```

### Using collections

```ts
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
if (!exists) {
  // create collection if not exists
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
```

## License

MIT

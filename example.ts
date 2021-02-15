import { aql, Database } from "./mod.ts";

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
    cursor: await cursor.all(), // all results
  });

  const more = await cursor.more(); // it is new Cursor or undefined

  console.log({
    more: await more?.all(),
  });
} catch (error) {
  console.log(error);
}

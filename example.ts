import { aql, Connection } from "./mod.ts";

const connection = new Connection({
  url: ["http://localhost:8529/"],
  auth: { username: "root" },
});

const db = connection.database("_system");

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

  const more = await cursor.nextBatch(); // it is new Cursor or undefined

  console.log({
    more: await more?.all(),
  });
} catch (error) {
  console.log(error);
}

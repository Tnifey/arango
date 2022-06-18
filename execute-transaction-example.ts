import { Connection } from "./mod.ts";

const connection = new Connection({
  url: ["http://localhost:8529/"],
  auth: { username: "root" },
});

const db = connection.database("_system");

try {
  const result = await db.executeTransaction({
    collections: {},
    // javascript function as string
    action: `function () { return 12345; }`,
  });
  console.log(result); // 12345
} catch (error) {
  console.log(error);
}

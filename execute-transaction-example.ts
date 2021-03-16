import { Database } from "./mod.ts";

const db = new Database({
  name: "_system",
  url: "http://localhost:8529/",
  auth: { username: "root" },
});

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

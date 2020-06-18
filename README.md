# arango

Simple ArangoDB driver for Deno

## Usage

```ts
import arango, {
  aql,
} from "https://raw.githubusercontent.com/Tnifey/arango/master/mod.ts";

const pool = arango({
  // array of urls
  url: ["http://localhost:8529"],

  // use basic auth
  auth: { username: "root", password: "password" },
  // or use bearer token
  auth: "token",
});

const systemDatabase = pool.database("_system");
const otherDatabase = pool.database("other");

// get jwt token for bearer auth
const jwt = await systemDatabase.login("root", "password");

const query = aql`
  for user in Users
  return user
`;

const cursor = await systemDatabase.query(query, { batchSize: 2 }); // Cursor

const usersList = await cursor.all(); // any[]

if (cursor.hasMore()) {
  const next = await cursor.nextBatch(); // Cursor
}
```

## License

MIT

// deno-lint-ignore-file
import { assert, assertEquals, assertExists } from "./deps_test.ts";
import { Database } from "../mod.ts";
import { ArangoError } from "../src/request/Error.ts";

const name = "test-collection";
const db = new Database();

Deno.test({
  name: `collection -> create instance`,
  async fn() {
    const collection = db.collection(name);
    assert(collection.name === name);
  },
});

Deno.test({
  name: `collection -> create collection`,
  async fn() {
    try {
      const result = await db.createCollection({ name, type: 3 });

      assertEquals(result.error, false);
      assertEquals(result.name, name);
    } catch (error) {
      assert(error instanceof ArangoError);
    }
  },
});

Deno.test({
  name: `collection -> get collection`,
  async fn() {
    try {
      const collection = db.collection(name);
      const result = await collection.get();
      assertEquals(result.name, name);
    } catch (error) {
      assert(error instanceof ArangoError);
    }
  },
});

Deno.test({
  name: `collection -> get / set properties`,
  async fn() {
    try {
      const collection = db.collection(name);
      const propertiesBefore = await collection.properties();

      assertExists(propertiesBefore.waitForSync);

      const propertiesAfter = await collection.setProperties({
        waitForSync: !propertiesBefore.waitForSync,
      });

      assertEquals(propertiesAfter.waitForSync, !propertiesBefore.waitForSync);
    } catch (error) {
      assert(error instanceof ArangoError);
    }
  },
});

Deno.test({
  name: `collection -> drop collection`,
  async fn() {
    try {
      const collection = db.collection(name);
      const result = await collection.dropCollection(name);
      assertEquals(result.error, false);
    } catch (error) {
      assert(error instanceof ArangoError);
    }
  },
});

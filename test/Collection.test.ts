// deno-lint-ignore-file
import { assert, assertExists } from "https://deno.land/std/testing/asserts.ts";
import { Database } from "../mod.ts";
import { ArangoError } from "../src/request/Error.ts";

Deno.test({
  name: `create instance of collection`,
  async fn() {
    const name = "test-collection";
    const db = new Database();

    const collection = db.collection(name);
    assert(collection.name === name);
  },
});

Deno.test({
  name: `drop collection non existent`,
  async fn() {
    const name = "test-collection";
    const db = new Database();

    try {
      const collection = db.collection(name);
      const nonExist = collection.dropCollection(name);
      assertExists(nonExist);
    } catch (error) {
      assert(error instanceof ArangoError);
    }
  },
});

Deno.test({
  name: `drop collection`,
  async fn() {
    const name = "test-collection";
    const db = new Database();

    try {
      const collection = db.collection(name);

      collection.dropCollection(name);
    } catch (error) {
      assert(error instanceof ArangoError);
    }
  },
});

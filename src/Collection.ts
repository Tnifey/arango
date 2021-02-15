import { Database } from "./Database.ts";
import { ArangoErrorCode } from "./deps.ts";
import { ArangoError } from "./request/Error.ts";
import { Dict, ICollection } from "./types.ts";

export class Collection {
  // for aql-tag
  readonly isArangoCollection = true;

  #database: Database;

  #id?: string;
  #name: string;
  #status?: number;
  #type?: 2 | 3;
  #isSystem?: boolean;
  #globallyUniqueId?: string;

  constructor(init: Partial<ICollection>, database: Database) {
    this.#database = database;

    if (init?.name) {
      this.#name = init.name;
    } else {
      throw new Error(`ArangoError: collection has no name`);
    }

    this.#id = init?.id;
    this.#status = init?.status;
    this.#type = init?.type;
    this.#isSystem = init?.isSystem;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get status() {
    return this.#status;
  }

  get type() {
    return this.#type;
  }

  get isSystem() {
    return this.#isSystem;
  }

  get globallyUniqueId() {
    return this.#globallyUniqueId;
  }

  #hydrate = (data: Dict) => {
    this.#id = data.id as string;
    this.#isSystem = data.isSystem as boolean;
    this.#type = data.type as 2 | 3;
    this.#status = data.status as number;
    this.#globallyUniqueId = data.globallyUniqueId as string;
  };

  async get() {
    const data = await this.#database.request({
      method: "get",
      path: `_api/collection/${this.name}`,
    });

    this.#hydrate(data);

    return data;
  }

  async exists(): Promise<boolean> {
    try {
      await this.get();
      return true;
    } catch (error) {
      if (
        error instanceof ArangoError &&
        error.errorNum === ArangoErrorCode.ERROR_ARANGO_COLLECTION_NOT_FOUND
      ) {
        return false;
      }

      throw error;
    }
  }

  async checksum(opts?: { withRevisions?: boolean; withData?: boolean }) {
    try {
      const data = await this.#database.request({
        method: "get",
        path: `_api/collection/${this.name}/checksum`,
        query: {
          withRevisions: opts?.withRevisions,
          withData: opts?.withData,
        },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      const data = await this.#database.request({
        method: "get",
        path: `_api/collection/${this.name}/count`,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async dropCollection(name: string) {
    if (name !== this.name) {
      throw new Error(`ArangoError: collection names doesn't match`);
    }
    try {
      return await this.#database.request({
        method: "delete",
        path: `_api/collection/${this.name}`,
      });
    } catch (error) {
      throw error;
    }
  }

  async figures() {
    try {
      const data = await this.#database.request({
        method: "get",
        path: `_api/collection/${this.name}/figures`,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async load(opts?: { count?: boolean }) {
    try {
      const data = await this.#database.request({
        method: "put",
        path: `_api/collection/${this.name}/load`,
        body: {
          count: !!(opts?.count ?? true),
        },
      });

      this.#hydrate(data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async loadIndexesIntoMemory() {
    try {
      const data = await this.#database.request({
        method: "put",
        path: `_api/collection/${this.name}/loadIndexesIntoMemory`,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async properties() {
    try {
      const data = await this.#database.request({
        method: "get",
        path: `_api/collection/${this.name}/properties`,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async setProperties(opts: Dict) {
    try {
      const data = await this.#database.request({
        method: "put",
        path: `_api/collection/${this.name}/properties`,
        body: { ...opts },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async recalculateCount() {
    try {
      const data = await this.#database.request({
        method: "put",
        path: `_api/collection/${this.name}/recalculateCount`,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async rename(name: string, newName: string) {
    if (this.name !== name) {
      throw new Error(`ArangoError: collection names doesn't match`);
    }
    try {
      const data = await this.#database.request({
        method: "put",
        path: `_api/collection/${this.name}/rename`,
        body: { name: newName },
      });

      this.#hydrate(data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async revision() {
    try {
      const data = await this.#database.request({
        method: "get",
        path: `_api/collection/${this.name}/revision`,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async unload(name: string) {
    try {
      if (this.name !== name) {
        throw new Error(`ArangoError: collection names doesn't match`);
      }
      const data = await this.#database.request({
        method: "put",
        path: `_api/collection/${this.name}/unload`,
      });

      this.#hydrate(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async truncate(name: string, opts?: Dict) {
    if (this.name !== name) {
      throw new Error(`ArangoError: collection names doesn't match`);
    }
    try {
      const data = await this.#database.request({
        method: "put",
        path: `_api/collection/${this.name}/truncate`,
        query: {
          waitForSync: !!(opts?.waitForSync),
          compact: !!(opts?.compact),
        },
      });

      this.#hydrate(data);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

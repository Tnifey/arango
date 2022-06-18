import type { DatabaseLike } from "./fp/types.ts";
import {
  collectionChecksum,
  collectionCompact,
  collectionCount,
  collectionCreate,
  collectionDrop,
  collectionFigures,
  collectionGet,
  collectionLoad,
  collectionLoadIndexesIntoMemory,
  collectionProperties,
  collectionRecalculateCount,
  collectionRename,
  collectionResponsibleShard,
  collectionRevision,
  collectionSetProperties,
  collectionShards,
  collectionTruncate,
  collectionUnload,
} from "./fp/collections.ts";

export class Collection {
  #database: DatabaseLike;
  get database() {
    return this.#database;
  }

  #fetched: boolean;
  get fetched() {
    return this.#fetched;
  }

  #name: string;
  get name() {
    return this.#name;
  }

  #isSystem: boolean;
  get isSystem() {
    return this.#isSystem;
  }

  #type: CollectionType;
  get type() {
    return this.#type;
  }

  #id: string;
  get id() {
    return this.#id;
  }

  #globallyUniqueId: string;
  get globallyUniqueId() {
    return this.#globallyUniqueId;
  }

  #status: CollectionStatus;
  get status() {
    return this.#status;
  }

  get isArangoCollection() {
    return true;
  }

  constructor({
    database,
    name,
  }: CollectionConfig) {
    this.#database = database;
    this.#name = name;
  }

  async exists() {
    try {
      await this.get();
      return true;
    } catch (_) {
      return false;
    }
  }

  async get(options?: CollectionGetOptions) {
    const data: unknown & Collection = await collectionGet(
      this.database,
      this.name,
      options,
    );

    if (!data) return;

    this.#fetched = true;
    this.#isSystem = data.isSystem;
    this.#type = data.type;
    this.#id = data.id;
    this.#globallyUniqueId = data.globallyUniqueId;
    this.#status = data.status;

    return this;
  }

  async create(options?) {
    const data: unknown & Collection = await collectionCreate(this.database, {
      name: this.name,
      ...options,
    });

    if (!data) return;

    this.#fetched = true;
    this.#isSystem = data.isSystem;
    this.#type = data.type;
    this.#id = data.id;
    this.#globallyUniqueId = data.globallyUniqueId;
    this.#status = data.status;

    return this;
  }

  async drop(name: string, options?) {
    const data: unknown & Collection = await collectionDrop(
      this.database,
      name,
      options,
    );
    if (!data) return;
    this.#status = CollectionStatus.DELETED;
    return data.id;
  }

  checksum() {
    return collectionChecksum(this.database, this.name);
  }

  count() {
    return collectionCount(this.database, this.name);
  }

  figures() {
    return collectionFigures(this.database, this.name);
  }

  compact() {
    return collectionCompact(this.database, this.name);
  }

  load(options?: { count?: boolean }) {
    return collectionLoad(this.database, this.name, options);
  }

  loadIndexesIntoMemory() {
    return collectionLoadIndexesIntoMemory(this.database, this.name);
  }

  properties() {
    return collectionProperties(this.database, this.name);
  }

  setProperties(properties) {
    return collectionSetProperties(this.database, this.name, properties);
  }

  recalculateCount() {
    return collectionRecalculateCount(this.database, this.name);
  }

  async rename(newName: string) {
    const data = await collectionRename(this.database, this.name, newName);
    if (!data) return;
    this.#name = newName;
    return data;
  }

  responsibleShard(options) {
    return collectionResponsibleShard(this.database, this.name, options);
  }

  revision() {
    return collectionRevision(this.database, this.name);
  }

  shards() {
    return collectionShards(this.database, this.name);
  }

  truncate() {
    return collectionTruncate(this.database, this.name);
  }

  unload() {
    return collectionUnload(this.database, this.name);
  }

  toJSON() {
    return {
      name: this.name,
      isSystem: this.isSystem,
      type: this.type,
      id: this.id,
      globallyUniqueId: this.globallyUniqueId,
      status: this.status,
    };
  }
}

export type CollectionGetOptions = {
  silent?: boolean;
};

export interface CollectionConfig {
  name: string;
  database: DatabaseLike;
}

export enum CollectionType {
  DOCUMENT = 2,
  EDGE = 3,
}

export enum CollectionStatus {
  NEW_BORN = 1,
  UNLOADED = 2,
  LOADED = 3,
  UNLOADING = 4,
  DELETED = 5,
  LOADING = 6,
}

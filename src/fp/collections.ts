import type { Database } from "./types.ts";

export function collectionCreate(
  database: Database,
  options: CollectionCreateOptions,
) {
  if (!options.name || typeof options.name !== "string") {
    throw new Error("Collection name is required");
  }

  if (!options.type || typeof options.type !== "number") {
    throw new Error("Collection type is required: 1 for document, 2 for edges");
  }

  return database.request({
    method: "POST",
    path: `_api/collection/${options.name}`,
    body: options,
  });
}

export function collectionDrop(
  database: Database,
  collectionName: string,
  options?: { silent?: boolean },
) {
  return database.request({
    silent: options?.silent,
    method: "DELETE",
    path: `_api/collection/${collectionName}`,
  });
}

export function collectionGet(
  database: Database,
  collectionName: string,
  options,
) {
  return database.request({
    silent: options?.silent,
    path: `_api/collection/${collectionName}`,
  });
}

// function collectionChecksum
export function collectionChecksum(database: Database, collectionName: string) {
  return database.request({
    path: `_api/collection/${collectionName}/checksum`,
  });
}

// function collectionCompact
export function collectionCompact(database: Database, collectionName: string) {
  return database.request({
    method: "PUT",
    path: `_api/collection/${collectionName}/compact`,
  });
}

// function collectionCount
export function collectionCount(database: Database, collectionName: string) {
  return database.request({
    path: `_api/collection/${collectionName}/count`,
  });
}

// function collectionFigures
export function collectionFigures(database: Database, collectionName: string) {
  return database.request({
    path: `_api/collection/${collectionName}/figures`,
  });
}

// function collectionLoad
export function collectionLoad(
  database: Database,
  collectionName: string,
  options?,
) {
  return database.request({
    silent: options?.silent,
    method: "PUT",
    path: `_api/collection/${collectionName}/load`,
  });
}

// function collectionLoadIndexesIntoMemory
export function collectionLoadIndexesIntoMemory(
  database: Database,
  collectionName: string,
) {
  return database.request({
    method: "PUT",
    path: `_api/collection/${collectionName}/loadIndexesIntoMemory`,
  });
}

// function collectionProperties
export function collectionProperties(
  database: Database,
  collectionName: string,
) {
  return database.request({
    path: `_api/collection/${collectionName}/properties`,
  });
}

// function collectionSetProperties
export function collectionSetProperties(
  database: Database,
  collectionName: string,
  options,
) {
  return database.request({
    method: "PUT",
    path: `_api/collection/${collectionName}/properties`,
    body: options,
  });
}

// function collectionRecalculateCount
export function collectionRecalculateCount(
  database: Database,
  collectionName: string,
) {
  return database.request({
    method: "PUT",
    path: `_api/collection/${collectionName}/recalculateCount`,
  });
}

// function collectionRename
export function collectionRename(
  database: Database,
  collectionName: string,
  newName: string,
) {
  return database.request({
    method: "PUT",
    path: `_api/collection/${collectionName}/rename`,
    body: { name: newName },
  });
}

// function collectionResponsibleShard
export function collectionResponsibleShard(
  database: Database,
  collectionName: string,
  options,
) {
  return database.request({
    method: "PUT",
    path: `_api/collection/${collectionName}/responsibleShard`,
    body: options,
  });
}

// function collectionRevision
export function collectionRevision(database: Database, collectionName: string) {
  return database.request({
    path: `_api/collection/${collectionName}/revision`,
  });
}

// function collectionShards
export function collectionShards(database: Database, collectionName: string) {
  return database.request({
    path: `_api/collection/${collectionName}/shards`,
  });
}

// function collectionTruncate
export function collectionTruncate(database: Database, collectionName: string) {
  return database.request({
    method: "PUT",
    path: `_api/collection/${collectionName}/truncate`,
  });
}

// function collectionUnload
export function collectionUnload(database: Database, collectionName: string) {
  return database.request({
    method: "PUT",
    path: `_api/collection/${collectionName}/unload`,
  });
}

export type CollectionCreateOptions = {
  name: string;
  type: number;
};

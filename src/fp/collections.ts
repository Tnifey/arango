import type { DatabaseLike } from "./types.ts";
import { queueRequest } from "../request.ts";

export function collectionCreate(
  database: DatabaseLike,
  options: CollectionCreateOptions,
) {
  if (!options.name || typeof options.name !== "string") {
    throw new Error("Collection name is required");
  }

  if (!options.type || typeof options.type !== "number") {
    throw new Error("Collection type is required: 1 for document, 2 for edges");
  }

  return queueRequest(database, {
    method: "POST",
    path: `_api/collection/${options.name}`,
    body: options,
  });
}

export function collectionDrop(
  database: DatabaseLike,
  collectionName: string,
  options?: { silent?: boolean },
) {
  return queueRequest(database, {
    silent: options?.silent,
    method: "DELETE",
    path: `_api/collection/${collectionName}`,
  });
}

export function collectionGet(
  database: DatabaseLike,
  collectionName: string,
  options,
) {
  return queueRequest(database, {
    silent: options?.silent,
    path: `_api/collection/${collectionName}`,
  });
}

export function collectionChecksum(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    path: `_api/collection/${collectionName}/checksum`,
  });
}

export function collectionCompact(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/collection/${collectionName}/compact`,
  });
}

export function collectionCount(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    path: `_api/collection/${collectionName}/count`,
  });
}

export function collectionFigures(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    path: `_api/collection/${collectionName}/figures`,
  });
}

export function collectionLoad(
  database: DatabaseLike,
  collectionName: string,
  options?,
) {
  return queueRequest(database, {
    silent: options?.silent,
    method: "PUT",
    path: `_api/collection/${collectionName}/load`,
  });
}

export function collectionLoadIndexesIntoMemory(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/collection/${collectionName}/loadIndexesIntoMemory`,
  });
}

export function collectionProperties(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    path: `_api/collection/${collectionName}/properties`,
  });
}

export function collectionSetProperties(
  database: DatabaseLike,
  collectionName: string,
  options,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/collection/${collectionName}/properties`,
    body: options,
  });
}

export function collectionRecalculateCount(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/collection/${collectionName}/recalculateCount`,
  });
}

export function collectionRename(
  database: DatabaseLike,
  collectionName: string,
  newName: string,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/collection/${collectionName}/rename`,
    body: { name: newName },
  });
}

export function collectionResponsibleShard(
  database: DatabaseLike,
  collectionName: string,
  options,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/collection/${collectionName}/responsibleShard`,
    body: options,
  });
}

export function collectionRevision(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    path: `_api/collection/${collectionName}/revision`,
  });
}

export function collectionShards(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    path: `_api/collection/${collectionName}/shards`,
  });
}

export function collectionTruncate(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/collection/${collectionName}/truncate`,
  });
}

export function collectionUnload(
  database: DatabaseLike,
  collectionName: string,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/collection/${collectionName}/unload`,
  });
}

export type CollectionCreateOptions = {
  name: string;
  type: number;
};

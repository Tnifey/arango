import type { DatabaseLike } from "./types.ts";
import { queueRequest } from "../request.ts";

export function transactionList(database: DatabaseLike) {
  return queueRequest(database, {
    path: `_api/transaction`,
  });
}

export function transactionCreate(database: DatabaseLike, options) {
  return queueRequest(database, {
    method: "POST",
    path: `_api/transaction`,
    body: options,
  });
}

export function transactionBegin(database: DatabaseLike, options) {
  return queueRequest(database, {
    method: "POST",
    path: `_api/transaction/begin`,
    body: options,
  });
}

export function transactionAbort(database: DatabaseLike, transaction, options) {
  return queueRequest(database, {
    method: "DELETE",
    path: `_api/transaction/${transaction}`,
    body: options,
  });
}

export function transactionGet(database: DatabaseLike, transaction) {
  return queueRequest(database, {
    path: `_api/transaction/${transaction}`,
  });
}

export function transactionCommit(
  database: DatabaseLike,
  transaction,
  options,
) {
  return queueRequest(database, {
    method: "PUT",
    path: `_api/transaction/${transaction}`,
    body: options,
  });
}

import type { Database } from "./types.ts";

export function transactionList(database: Database) {
  return database.request({
    path: `_api/transaction`,
  });
}

export function transactionCreate(database: Database, options) {
  return database.request({
    method: "POST",
    path: `_api/transaction`,
    body: options,
  });
}

export function transactionBegin(database: Database, options) {
  return database.request({
    method: "POST",
    path: `_api/transaction/begin`,
    body: options,
  });
}

export function transactionAbort(database: Database, transaction, options) {
  return database.request({
    method: "DELETE",
    path: `_api/transaction/${transaction}`,
    body: options,
  });
}

export function transactionGet(database: Database, transaction) {
  return database.request({
    path: `_api/transaction/${transaction}`,
  });
}

export function transactionCommit(database: Database, transaction, options) {
  return database.request({
    method: "PUT",
    path: `_api/transaction/${transaction}`,
    body: options,
  });
}

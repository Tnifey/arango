export class ArangoError extends Error {
  name: string = "ArangoError";
  code: number = 500;

  constructor(...args: any) {
    super(...args);
  }
}

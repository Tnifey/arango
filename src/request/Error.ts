export class ArangoError extends Error {
  name = "ArangoError";
  code = 500;
  errorNum = 500;

  constructor(message: string) {
    super(message);
  }
}

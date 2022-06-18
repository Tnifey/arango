import { ArangoErrorCode, cleanStack } from "./deps.ts";
export { ArangoErrorCode };

export class ArangoError extends Error {
  get isArangoError() {
    return true;
  }

  readonly response: Response;
  readonly code: number;
  readonly type: keyof typeof ArangoErrorCode;

  constructor(
    message: string,
    extra: { code: number; response: Response },
  ) {
    super(message);
    this.name = "ArangoError";
    this.response = extra.response;
    this.code = extra.code;
    this.type = ArangoErrorCode[this.code];
    this.stack = cleanStack(this.stack);
  }
}

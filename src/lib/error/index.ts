import { QpErrorCode } from "./code";

export class QpError extends Error {
  private readonly code: QpErrorCode;

  constructor(c: QpErrorCode, message: string) {
    super(message);

    this.code = c;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, QpError.prototype);
  }
}

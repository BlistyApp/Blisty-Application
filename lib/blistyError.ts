class BlistyError extends Error {
  code: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "MyBError";
    this.code = code || "default";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default BlistyError;
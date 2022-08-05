// Models
import Exception from "./Exception.js";

const EXCEPTION_NAME = "AsyncProcessInvalidArguments";
const MESSAGE_DEFAULT = "Async Process has an invalid command line interface and/or arguments.";

class AsyncProcessInvalidArgumentsException extends Exception {
  constructor(message, debug) {
    super(message || MESSAGE_DEFAULT, EXCEPTION_NAME, debug);
    return this;
  }
}
export default AsyncProcessInvalidArgumentsException;

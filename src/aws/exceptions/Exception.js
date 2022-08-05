// Global Libraries
import LoggerUtils from "../../utils/LoggerUtils.js";

// Constants - Local
const ERROR_CODE = "ERR_AWSKAFKA_EXCEPTION";

class Exception extends Error {
  constructor(message, name, debug) {
    super(message || "No message available.");
    this.code = ERROR_CODE;
    this.name = name || "Unnamed Exception";
    const readout = this.getExceptionReadout();
    LoggerUtils.error(readout);
    if(debug) {
      LoggerUtils.debug(debug);
    }
    return this;
  }

  getMessage() { return this.message; }
  getName() { return this.name; }
  getExceptionReadout() {
    return (`${String(this.getName())}:\n${String(this.getMessage())}`);
  }
}
export default Exception;

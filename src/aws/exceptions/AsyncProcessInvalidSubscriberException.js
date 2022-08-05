// Models
import Exception from "./Exception.js";

const EXCEPTION_NAME = "AsyncProcessInvalidSubscriber";
const MESSAGE_DEFAULT = "Only instances of functions can subscribe to AsyncProcess data or error feeds.";

class AsyncProcessInvalidSubscriberException extends Exception {
  constructor(message, debug) {
    super(message || MESSAGE_DEFAULT, EXCEPTION_NAME, debug);
    return this;
  }
}
export default AsyncProcessInvalidSubscriberException;

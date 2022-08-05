// Constants - Local
const ENVIRONMENTS = {
  development: String("DEVELOPMENT"),
  production: String("PRODUCTION"),
  testing: String("TESTING"),
};
const ERROR_BAD_SUBSCRIBER = "Unable to bind LoggerUtils subscriber, passed instance is not a function.";

class LoggerUtils {
  static debugActive = true;
  static errorActive = true;
  static infoActive = true;
  static warnActive = true;
  static subscribers = {};

  /*====================
  Initialization
  ====================*/
  static initialize(environment, suppress) {
    switch (String(environment)) {

      // Development
      case String(ENVIRONMENTS.development):
        this.debugActive = true;
        this.errorActive = true;
        this.infoActive = true;
        this.warnActive = true;
        break;

      // Testing
      case String(ENVIRONMENTS.testing):
        this.debugActive = false;
        this.errorActive = false;
        this.infoActive = false;
        this.warnActive = false;
        break;

      // Production - (!dev && !test)
      default:
        environment = String(ENVIRONMENTS.production);
        this.debugActive = false;
        this.errorActive = true;
        this.infoActive = true;
        this.warnActive = true;
    }

    if(!suppress) {
      LoggerUtils.debug("Debug Enabled");
      LoggerUtils.error("Error Enabled");
      LoggerUtils.info("Info Enabled");
      LoggerUtils.warn("Warning Enabled");
    }
  }

  /*====================
  Logging
  ====================*/
  static bypass(message) {
    console.log(message);
  }

  static debug(message) {
    if (this.debugActive) {
      const formattedMessage = String(`[DEBUG]: ${message}`);
      LoggerUtils.publish(formattedMessage);
      if (formattedMessage === "[DEBUG]: [object Object]") {
        console.debug(message);
      } else {
        console.debug(formattedMessage);
      }
    }
  }

  static error(message) {
    if (this.errorActive) {
      const formattedMessage = String(`[ERROR]: ${message}`);
      LoggerUtils.publish(formattedMessage);
      console.error(formattedMessage);
    }
  }

  static info(message) {
    if (this.infoActive) {
      const formattedMessage = String(`[INFO]: ${message}`);
      LoggerUtils.publish(formattedMessage);
      console.info(formattedMessage);
    }
  }

  static warn(message) {
    if (this.warnActive) {
      const formattedMessage = String(`[WARN]: ${message}`);
      LoggerUtils.publish(formattedMessage);
      console.warn(formattedMessage);
    }
  }

  /*====================
  Publish & Subscribe
  ====================*/
  static publish(message) {
    const subscriberKeys = Object.keys(LoggerUtils.subscribers);
    for (const key in subscriberKeys) {
      if (LoggerUtils.subscribers[subscriberKeys[key]] instanceof Function) {
        LoggerUtils.subscribers[subscriberKeys[key]](message);
      } else {
        LoggerUtils.unsubscribe(subscriberKeys[key]);
      }
    }
  }

  static subscribe(onLog) {
    if (onLog instanceof Function) {
      const key = `LoggerUtils-Subscriber-${Object.keys(LoggerUtils.subscribers).length}`;
      LoggerUtils.subscribers[key] = onLog;
    } else {
      LoggerUtils.error(ERROR_BAD_SUBSCRIBER);
    }
  }

  static unsubscribe(key) {
    if (LoggerUtils.subscribers.hasOwnProperty(key)) {
      delete LoggerUtils.subscribers[key];
    }
  }
}
export default LoggerUtils;

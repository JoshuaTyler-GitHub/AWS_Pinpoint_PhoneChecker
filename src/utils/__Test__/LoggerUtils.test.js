// Testing Library
import LoggerUtils from "../LoggerUtils.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// initialize
test("initialize()", () => {
  // development
  LoggerUtils.initialize("DEVELOPMENT", true);
  expect(LoggerUtils.debugActive).toEqual(true);
  expect(LoggerUtils.errorActive).toEqual(true);
  expect(LoggerUtils.infoActive).toEqual(true);
  expect(LoggerUtils.warnActive).toEqual(true);

  // testing
  LoggerUtils.initialize("TESTING", true);
  expect(LoggerUtils.debugActive).toEqual(false);
  expect(LoggerUtils.errorActive).toEqual(false);
  expect(LoggerUtils.infoActive).toEqual(false);
  expect(LoggerUtils.warnActive).toEqual(false);

  // production (not dev && not test)
  LoggerUtils.initialize("", true);
  expect(LoggerUtils.debugActive).toEqual(false);
  expect(LoggerUtils.errorActive).toEqual(true);
  expect(LoggerUtils.infoActive).toEqual(true);
  expect(LoggerUtils.warnActive).toEqual(true);
});

// bypass
test("bypass()", () => {
  LoggerUtils.initialize("DEVELOPMENT", true);
  let bypassMessage = "";

  // mock console.bypass
  const mockSwitch = console.log;
  console.log = (message) => bypassMessage = message;

  // logs message
  LoggerUtils.bypass("testMessage");
  expect(bypassMessage).toEqual("testMessage");

  // revert mocks
  console.bypass = mockSwitch;
});

// debug
test("debug()", () => {
  LoggerUtils.initialize("DEVELOPMENT", true);
  let debugMessage = "";
  let publishMessage = "";

  // mock LoggerUtils.publish
  const mockSwitch1 = LoggerUtils.publish;
  LoggerUtils.publish = (message) => publishMessage = message;

  // mock console.debug
  const mockSwitch2 = console.debug;
  console.debug = (message) => debugMessage = message;

  // does nothing when disabled
  LoggerUtils.debugActive = false;
  LoggerUtils.debug("testMessage");
  expect(debugMessage).toEqual("");
  expect(publishMessage).toEqual("");

  // publishes when enabled (formatted)
  LoggerUtils.debugActive = true;
  LoggerUtils.debug("testMessage");
  expect(debugMessage).toEqual("[DEBUG]: testMessage");
  expect(publishMessage).toEqual("[DEBUG]: testMessage");

  // publishes when enabled (non-formatted when object)
  // this lets you see the object in local browser debugger instead of "object Object"
  LoggerUtils.debugActive = true;
  LoggerUtils.debug("[object Object]");
  expect(debugMessage).toEqual("[object Object]");
  expect(publishMessage).toEqual("[DEBUG]: [object Object]");

  // revert mocks
  LoggerUtils.publish = mockSwitch1;
  console.debug = mockSwitch2;
});

// error
test("error()", () => {
  LoggerUtils.initialize("DEVELOPMENT", true);
  let errorMessage = "";
  let publishMessage = "";

  // mock LoggerUtils.publish
  const mockSwitch1 = LoggerUtils.publish;
  LoggerUtils.publish = (message) => publishMessage = message;

  // mock console.error
  const mockSwitch2 = console.error;
  console.error = (message) => errorMessage = message;

  // does nothing when disabled
  LoggerUtils.errorActive = false;
  LoggerUtils.error("testMessage");
  expect(errorMessage).toEqual("");
  expect(publishMessage).toEqual("");

  // publishes when enabled
  LoggerUtils.errorActive = true;
  LoggerUtils.error("testMessage");
  expect(errorMessage).toEqual("[ERROR]: testMessage");
  expect(publishMessage).toEqual("[ERROR]: testMessage");

  // revert mocks
  LoggerUtils.publish = mockSwitch1;
  console.error = mockSwitch2;
});

// info
test("info()", () => {
  LoggerUtils.initialize("DEVELOPMENT", true);
  let infoMessage = "";
  let publishMessage = "";

  // mock LoggerUtils.publish
  const mockSwitch1 = LoggerUtils.publish;
  LoggerUtils.publish = (message) => publishMessage = message;

  // mock console.info
  const mockSwitch2 = console.info;
  console.info = (message) => infoMessage = message;

  // does nothing when disabled
  LoggerUtils.infoActive = false;
  LoggerUtils.info("testMessage");
  expect(infoMessage).toEqual("");
  expect(publishMessage).toEqual("");

  // publishes when enabled
  LoggerUtils.infoActive = true;
  LoggerUtils.info("testMessage");
  expect(infoMessage).toEqual("[INFO]: testMessage");
  expect(publishMessage).toEqual("[INFO]: testMessage");

  // revert mocks
  LoggerUtils.publish = mockSwitch1;
  console.info = mockSwitch2;
});

// warn
test("warn()", () => {
  LoggerUtils.initialize("DEVELOPMENT", true);
  let warnMessage = "";
  let publishMessage = "";

  // mock LoggerUtils.publish
  const mockSwitch1 = LoggerUtils.publish;
  LoggerUtils.publish = (message) => publishMessage = message;

  // mock console.warn
  const mockSwitch2 = console.warn;
  console.warn = (message) => warnMessage = message;

  // does nothing when disabled
  LoggerUtils.warnActive = false;
  LoggerUtils.warn("testMessage");
  expect(warnMessage).toEqual("");
  expect(publishMessage).toEqual("");

  // publishes when enabled
  LoggerUtils.warnActive = true;
  LoggerUtils.warn("testMessage");
  expect(warnMessage).toEqual("[WARN]: testMessage");
  expect(publishMessage).toEqual("[WARN]: testMessage");

  // revert mocks
  LoggerUtils.publish = mockSwitch1;
  console.warn = mockSwitch2;
});

// publish
test("publish()", () => {
  LoggerUtils.initialize("DEVELOPMENT", true);
  const badDataSubscriber = 1;
  let goodDataSubcriberCalled = false;
  let goodDataSubcriberData = "";
  const goodDataSubcriber = (data) => {
    goodDataSubcriberCalled = true;
    goodDataSubcriberData = data;
  };

  // - goodDataSubscriber is called
  // - badDataSubscriber unsubscribed
  LoggerUtils.subscribers = {
    "key1": badDataSubscriber,
    "key2": goodDataSubcriber,
  };
  LoggerUtils.publish("publish()");
  expect(Object.values(LoggerUtils.subscribers).includes(badDataSubscriber)).toEqual(false);
  expect(Object.values(LoggerUtils.subscribers).includes(goodDataSubcriber)).toEqual(true);
  expect(goodDataSubcriberCalled).toEqual(true);
  expect(goodDataSubcriberData).toEqual("publish()");
  expect(Object.keys(LoggerUtils.subscribers).length).toEqual(1);
});

// subscribe
test("subscribe()", () => {
  LoggerUtils.initialize("DEVELOPMENT", true);
  const ERROR_BAD_SUBSCRIBER = "Unable to bind LoggerUtils subscriber, passed instance is not a function.";

  // mock LoggerUtils.error()
  let errorMessage = "";
  const mockSwitch = LoggerUtils.error;
  LoggerUtils.error = (message) => errorMessage = message;

  // - goodDataSubscriber is subscribed (no error)
  const goodDataSubcriber = () => { };
  LoggerUtils.subscribe(goodDataSubcriber);
  expect(Object.values(LoggerUtils.subscribers).includes(goodDataSubcriber)).toEqual(true);
  expect(errorMessage).toEqual("");

  // - badDataSubscriber is ignored (logs error)
  const badDataSubscriber = 1;
  LoggerUtils.subscribe(badDataSubscriber);
  expect(Object.values(LoggerUtils.subscribers).includes(badDataSubscriber)).toEqual(false);
  expect(errorMessage).toEqual(ERROR_BAD_SUBSCRIBER);

  // revert mocks
  LoggerUtils.error = mockSwitch;
});

// unsubscribe
test("unsubscribe()", () => {
  LoggerUtils.initialize("DEVELOPMENT", true);
  const badDataSubscriber = 1;
  const goodDataSubcriber = () => { };
  LoggerUtils.subscribers = {
    "key1": badDataSubscriber,
    "key2": goodDataSubcriber,
  };

  // - nonExistantSubscriber does nothing
  LoggerUtils.unsubscribe("key3");
  expect(Object.values(LoggerUtils.subscribers).includes(badDataSubscriber)).toEqual(true);
  expect(Object.values(LoggerUtils.subscribers).includes(goodDataSubcriber)).toEqual(true);
  expect(Object.keys(LoggerUtils.subscribers).length).toEqual(2);

  // - badDataSubscriber is deleted
  LoggerUtils.unsubscribe("key1");
  expect(Object.values(LoggerUtils.subscribers).includes(badDataSubscriber)).toEqual(false);
  expect(Object.values(LoggerUtils.subscribers).includes(goodDataSubcriber)).toEqual(true);
  expect(Object.keys(LoggerUtils.subscribers).length).toEqual(1);

  // - goodDataSubscriber is deleted
  LoggerUtils.unsubscribe("key2");
  expect(Object.values(LoggerUtils.subscribers).includes(badDataSubscriber)).toEqual(false);
  expect(Object.values(LoggerUtils.subscribers).includes(goodDataSubcriber)).toEqual(false);
  expect(Object.keys(LoggerUtils.subscribers).length).toEqual(0);
});

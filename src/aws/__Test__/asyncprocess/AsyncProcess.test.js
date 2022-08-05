// Global Libraries
import { expect } from "@jest/globals";
import { spyOn } from "jest-mock";
import LoggerUtils from "../../../utils/LoggerUtils.js";

// Testing Library
import AsyncProcess from "../../asyncprocesses/AsyncProcess.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// constructor (with delayed execution)
test("constructor(args, cli, awaitExecution) - Valid Case (awaiting execution)", () => {
  const spyExecute = spyOn(AsyncProcess.prototype, "execute");
  let exited = false;

  // - AsyncProcess initializes successfully
  //  -- args
  //  -- cli
  //  -- awaitExecution
  //  -- isAlive = true
  //  -- execute not called
  //  -- onExit callback set but not invoked
  const testAsyncProcess = new AsyncProcess(
    { cwd: "../" },
    "echo constructor - Valid Case - awaiting execution",
    true,
    () => exited = true
  );
  expect(testAsyncProcess.hasOwnProperty("args")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("awaitingExecution")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("cli")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("process")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("processDataSubscribers")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("processErrorSubscribers")).toEqual(true);
  expect(testAsyncProcess.args.hasOwnProperty("cwd")).toEqual(true);
  expect(testAsyncProcess.args.cwd).toEqual("../");
  expect(testAsyncProcess.awaitingExecution).toEqual(true);
  expect(testAsyncProcess.cli).toEqual("echo constructor - Valid Case - awaiting execution");
  expect(testAsyncProcess.isAlive).toEqual(true);
  expect(testAsyncProcess.onExit instanceof Function).toEqual(true);
  expect(exited).toEqual(false);
  expect(AsyncProcess.prototype.execute).toHaveBeenCalledTimes(0);
  spyExecute.mockClear();
});

// constructor (with immediate execution)
test("constructor(args, cli, awaitExecution) - Valid Case (not awaiting execution)", (done) => {
  const spyExecute = spyOn(AsyncProcess.prototype, "execute");
  let exited = false;

  // - AsyncProcess initializes successfully
  //  -- args
  //  -- cli
  //  -- awaitExecution
  //  -- isAlive = true
  //  -- execute called
  //  -- onExit callback set and invoked
  const testAsyncProcess = new AsyncProcess(
    { cwd: "../" },
    "echo constructor - Valid Case - not awaiting execution",
    false,
    () => exited = true
  );
  expect(testAsyncProcess.hasOwnProperty("args")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("awaitingExecution")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("cli")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("process")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("processDataSubscribers")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("processErrorSubscribers")).toEqual(true);
  expect(testAsyncProcess.hasOwnProperty("isAlive")).toEqual(true);
  expect(testAsyncProcess.args.hasOwnProperty("cwd")).toEqual(true);
  expect(testAsyncProcess.args.cwd).toEqual("../");
  expect(testAsyncProcess.awaitingExecution).toEqual(false);
  expect(testAsyncProcess.cli).toEqual("echo constructor - Valid Case - not awaiting execution");
  expect(testAsyncProcess.onExit instanceof Function).toEqual(true);
  expect(exited).toEqual(false);
  expect(AsyncProcess.prototype.execute).toHaveBeenCalledTimes(1);
  spyExecute.mockClear();

  // Brief delay for proccess.stdout
  setTimeout(() => {
    expect(exited).toEqual(true);
    done();
  }, 200);
});

// getArgs
test("getArgs()", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo getArgs", true);
  expect(JSON.stringify(testAsyncProcess.getArgs())).toEqual(JSON.stringify({ cwd: "../" }));
});

// getAwaitingExecution
test("getAwaitingExecution()", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo getAwaitingExecution", true);
  expect(testAsyncProcess.getAwaitingExecution()).toEqual(testAsyncProcess.awaitingExecution);
});

// getCli
test("getCli()", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo getCli", true);
  expect(testAsyncProcess.getCli()).toEqual("echo getCli");
});

// getProcess
test("getProcess() - before execution", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo getProcess", true);
  expect(testAsyncProcess.getProcess()).toEqual(null);
});

test("getProcess() - after execution", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo getProcess", false);
  expect(testAsyncProcess.getProcess()).toBeTruthy();
  expect(testAsyncProcess.getProcess().stderr).toBeTruthy();
  expect(testAsyncProcess.getProcess().stdin).toBeTruthy();
  expect(testAsyncProcess.getProcess().stdout).toBeTruthy();
});

// getProcessDataSubscribers
test("getProcessDataSubscribers() - no subscribers", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo getProcessDataSubscribers", true);
  expect(JSON.stringify(testAsyncProcess.getProcessDataSubscribers()))
    .toEqual(JSON.stringify({}));
});

// getProcessErrorSubscribers
test("getProcessErrorSubscribers() - no subscribers", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo getProcessErrorSubscribers", true);
  expect(JSON.stringify(testAsyncProcess.getProcessErrorSubscribers()))
    .toEqual(JSON.stringify({}));
});

// getIsAlive
test("getIsAlive()", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo getIsAlive", true);
  expect(testAsyncProcess.getIsAlive()).toEqual(testAsyncProcess.isAlive);
});

// execute (valid cli with publishToDataSubscribers)
test("execute() - Valid CLI args - publishToDataSubscribers", (done) => {
  // - awaitingExecution = true
  // - execute success
  // - awaitingExecution = false
  const testValidAsyncProcess = new AsyncProcess(
    { cwd: "../" },
    "echo execute - Valid CLI args - publishToDataSubscribers",
    true
  );
  const spyPublishToDataSubscribers = spyOn(testValidAsyncProcess, "publishToDataSubscribers");
  expect(testValidAsyncProcess.awaitingExecution).toEqual(true);
  testValidAsyncProcess.execute();
  expect(testValidAsyncProcess.awaitingExecution).toEqual(false);

  // Brief delay for proccess.stdout
  setTimeout(() => {
    expect(spyPublishToDataSubscribers).toHaveBeenNthCalledWith(
      1, "execute - Valid CLI args - publishToDataSubscribers"
    );
    spyPublishToDataSubscribers.mockClear();
    done();
  }, 200);
});

// execute (valid cli with publishToErrorSubscribers)
test("execute() - Valid CLI args - publishToErrorSubscribers", (done) => {
  // - isAlive = true
  // - awaitingExecution = true
  // - execute success
  // - awaitingExecution = false
  // - isAlive = false
  const testValidAsyncProcess = new AsyncProcess(
    { cwd: "../" },
    ">&2 echo execute - Valid CLI args - publishToErrorSubscribers",
    true
  );
  const spyPublishToErrorSubscribers = spyOn(testValidAsyncProcess, "publishToErrorSubscribers");
  expect(testValidAsyncProcess.isAlive).toEqual(true);
  expect(testValidAsyncProcess.awaitingExecution).toEqual(true);
  testValidAsyncProcess.execute();
  expect(testValidAsyncProcess.awaitingExecution).toEqual(false);

  // Brief delay for proccess.stderr
  setTimeout(() => {
    expect(spyPublishToErrorSubscribers).toHaveBeenNthCalledWith(
      1, "execute - Valid CLI args - publishToErrorSubscribers"
    );
    expect(testValidAsyncProcess.isAlive).toEqual(false);
    spyPublishToErrorSubscribers.mockClear();
    done();
  }, 200);
});

// execute (invalid cli)
test("execute() - Invalid CLI args", () => {

  // - isAlive = true
  // - awaitingExecution = true
  // - execute fail
  // - awaitingExecution = false
  const testErrorAsyncProcess = new AsyncProcess({ cwd: "../" }, "", true);
  expect(testErrorAsyncProcess.isAlive).toEqual(true);
  expect(testErrorAsyncProcess.awaitingExecution).toEqual(true);
  expect(() => testErrorAsyncProcess.execute())
    .toThrow("Command-line-interface (CLI) arguments cannot be empty, null, or undefined");
  expect(testErrorAsyncProcess.awaitingExecution).toEqual(false);
});

// kill
test("kill()", () => {
  let onExitCalled = false;
  // - isAlive = false
  // - onExit Callback
  // - childprocess kill
  // - process = null
  const testErrorAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo kill", false);
  testErrorAsyncProcess.onExit = () => { onExitCalled = true };
  testErrorAsyncProcess.kill();
  expect(testErrorAsyncProcess.isAlive).toEqual(false);
  expect(onExitCalled).toEqual(true);
  expect(testErrorAsyncProcess.process).toEqual(null);
});

// publishToDataSubscribers
test("publishToDataSubscribers()", (done) => {
  const badDataSubscriber = 1;
  let goodDataSubcriberCalled = false;
  let goodDataSubcriberData = "";

  // - goodDataSubscriber called
  // - badDataSubscriber unsubscribed
  const testErrorAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo publishToDataSubscribers", true);
  testErrorAsyncProcess.processDataSubscribers = {
    "key1": badDataSubscriber,
    "key2": (data) => {
      goodDataSubcriberCalled = true;
      goodDataSubcriberData = data;
    },
  };
  testErrorAsyncProcess.publishToDataSubscribers("publishToDataSubscribers()");

  // Brief delay for proccess.stdout
  setTimeout(() => {
    expect(Object.values(testErrorAsyncProcess.getProcessDataSubscribers()).includes(badDataSubscriber))
      .toEqual(false);
    expect(goodDataSubcriberCalled).toEqual(true);
    expect(goodDataSubcriberData).toEqual("publishToDataSubscribers()");
    expect(Object.values(testErrorAsyncProcess.getProcessDataSubscribers()).length).toEqual(1);
    done();
  }, 200);
});

// publishToErrorSubscribers
test("publishToErrorSubscribers()", (done) => {
  const badErrorSubscriber = 1;
  let goodErrorSubcriberCalled = false;
  let goodErrorSubcriberError = "";

  // - goodErrorSubscriber called
  // - badErrorSubscriber unsubscribed
  const testErrorAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo publishToErrorSubscribers", true);
  testErrorAsyncProcess.processErrorSubscribers = {
    "key1": badErrorSubscriber,
    "key2": (error) => {
      goodErrorSubcriberCalled = true;
      goodErrorSubcriberError = error;
    },
  };
  testErrorAsyncProcess.publishToErrorSubscribers("publishToErrorSubscribers()");

  // Brief delay for proccess.stderr
  setTimeout(() => {
    expect(Object.values(testErrorAsyncProcess.getProcessErrorSubscribers()).includes(badErrorSubscriber))
      .toEqual(false);
    expect(goodErrorSubcriberCalled).toEqual(true);
    expect(goodErrorSubcriberError).toEqual("publishToErrorSubscribers()");
    expect(Object.values(testErrorAsyncProcess.getProcessErrorSubscribers()).length).toEqual(1);
    done();
  }, 200);
});

// subscribeToData - Valid callback
test("subscribeToData(onLog) - Valid callback", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo subscribeToData - Valid callback", true);
  let subscriberData = "";

  // subscribe and generate uuid
  const validSubscriber = (data) => subscriberData = data;
  testAsyncProcess.subscribeToData(validSubscriber);
  expect(Object.values(testAsyncProcess.getProcessDataSubscribers()).includes(validSubscriber))
    .toEqual(true);
  testAsyncProcess.publishToDataSubscribers("subscribeToData(onLog) - Valid callback");
  expect(subscriberData).toEqual("subscribeToData(onLog) - Valid callback");
});

// subscribeToData - Invalid callback
test("subscribeToData(onLog) - Invalid callback", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo subscribeToData - Invalid callback", true);

  // throw error for invalid subscriber
  const invalidSubscriber = 1;
  expect(() => testAsyncProcess.subscribeToData(invalidSubscriber))
    .toThrow("Only instances of functions can subscribe to AsyncProcess data or error feeds.");
});

// subscribeToError - Valid callback
test("subscribeToError(onLog) - Valid callback", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo subscribeToError - Valid callback", true);
  let subscriberError = "";

  // subscribe and generate uuid
  const validSubscriber = (error) => subscriberError = error;
  testAsyncProcess.subscribeToError(validSubscriber);
  expect(Object.values(testAsyncProcess.getProcessErrorSubscribers()).includes(validSubscriber))
    .toEqual(true);
  testAsyncProcess.publishToErrorSubscribers("subscribeToError(onLog) - Valid callback");
  expect(subscriberError).toEqual("subscribeToError(onLog) - Valid callback");
});

// subscribeToError - Invalid callback
test("subscribeToError(onLog) - Invalid callback", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo subscribeToError - Invalid callback", true);

  // throw error for invalid subscriber
  const invalidSubscriber = 1;
  expect(() => testAsyncProcess.subscribeToError(invalidSubscriber))
    .toThrow("Only instances of functions can subscribe to AsyncProcess data or error feeds.");
});

// unsubscribeFromData
test("unsubscribeFromData(key)", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo unsubscribeFromData", true);
  testAsyncProcess.processDataSubscribers = { testKey: (data) => data.toString() };
  testAsyncProcess.unsubscribeFromData("testKey");
  expect(Object.keys(testAsyncProcess.processDataSubscribers).includes("testKey")).toEqual(false);
  expect(Object.keys(testAsyncProcess.processDataSubscribers).length).toEqual(0);
});

// unsubscribeFromError
test("unsubscribeFromError(key)", () => {
  const testAsyncProcess = new AsyncProcess({ cwd: "../" }, "echo unsubscribeFromError", true);
  testAsyncProcess.processErrorSubscribers = { testKey: (error) => error.toString() };
  testAsyncProcess.unsubscribeFromError("testKey");
  expect(Object.keys(testAsyncProcess.processErrorSubscribers).includes("testKey")).toEqual(false);
  expect(Object.keys(testAsyncProcess.processErrorSubscribers).length).toEqual(0);
});
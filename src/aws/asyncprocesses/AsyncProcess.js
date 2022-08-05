// Libraries
import { exec } from "child_process";

// Exceptions
import AsyncProcessInvalidArgumentsException from "../exceptions/AsyncProcessInvalidArgumentsException.js";
import AsyncProcessInvalidSubscriberException from "../exceptions/AsyncProcessInvalidSubscriberException.js";

class AsyncProcess {
  constructor(args, cli, awaitExecution, onExit) {
    this.args = args;
    this.awaitingExecution = awaitExecution || false;
    this.cli = cli;
    this.onExit = onExit;
    this.process = null;
    this.processDataSubscribers = {};
    this.processErrorSubscribers = {};
    this.isAlive = true;

    if (!this.awaitingExecution) {
      this.execute();
    }
    return this;
  }

  getArgs() { return this.args; }
  getAwaitingExecution() { return this.awaitingExecution; }
  getCli() { return this.cli; }
  getProcess() { return this.process; }
  getProcessDataSubscribers() { return this.processDataSubscribers; }
  getProcessErrorSubscribers() { return this.processErrorSubscribers; }
  getIsAlive() { return this.isAlive; }

  execute() {
    if(this.isAlive) {
      this.awaitingExecution = false;
      const args = this.getArgs();
      const cli = this.getCli();
      if (cli) {
        const process = exec((cli), { ...args });
        
        // data
        process.stdout.on("data", (data) => this.publishToDataSubscribers(data));

        // error
        process.stderr.on("data", (error) => this.publishToErrorSubscribers(error));

        // exit
        process.on("exit", () => this.kill());
        this.process = process;
        return process;
      }
      else {
        throw new AsyncProcessInvalidArgumentsException(`
          Command-line-interface (CLI) arguments cannot be empty, null, or undefined.
          Received value: "${cli}".
        `);
      }
    }
  }

  kill() {
    // set status
    this.isAlive = false;
    
    // onExit callback
    if(this.onExit instanceof Function) {
      this.onExit();
    }

    // kill childprocess
    if(this.process) {
      this.process.kill(0);
    }
    this.process = null;
  }

  /*====================
  Publish & Subscribe
  ====================*/
  publishToDataSubscribers(data) {
    const processDataSubscribers = this.getProcessDataSubscribers();
    const subscriberKeys = Object.keys(processDataSubscribers);
    for (const key in subscriberKeys) {
      if (processDataSubscribers[subscriberKeys[key]] instanceof Function) {
        processDataSubscribers[subscriberKeys[key]](data);
      } else {
        this.unsubscribeFromData(subscriberKeys[key]);
      }
    }
  }

  publishToErrorSubscribers(error) {
    const processErrorSubscribers = this.getProcessErrorSubscribers();
    const subscriberKeys = Object.keys(processErrorSubscribers);
    for (const key in subscriberKeys) {
      if (processErrorSubscribers[subscriberKeys[key]] instanceof Function) {
        processErrorSubscribers[subscriberKeys[key]](error);
      } else {
        this.unsubscribeFromError(subscriberKeys[key]);
      }
    }
  }

  subscribeToData(onLog) {
    const processDataSubscribers = this.getProcessDataSubscribers();
    if (onLog instanceof Function) {
      const key = `Async-Process-Data-Subscriber-${Object.keys(processDataSubscribers).length}`;
      processDataSubscribers[key] = onLog;
    } else {
      throw new AsyncProcessInvalidSubscriberException();
    }
  }

  subscribeToError(onLog) {
    const processErrorSubscribers = this.getProcessErrorSubscribers();
    if (onLog instanceof Function) {
      const key = `Async-Process-Error-Subscriber-${Object.keys(processErrorSubscribers).length}`;
      processErrorSubscribers[key] = onLog;
    } else {
      throw new AsyncProcessInvalidSubscriberException();
    }
  }

  unsubscribeFromData(key) {
    const processDataSubscribers = this.getProcessDataSubscribers();
    if (processDataSubscribers.hasOwnProperty(key)) {
      delete processDataSubscribers[key];
    }
  }

  unsubscribeFromError(key) {
    const processErrorSubscribers = this.getProcessErrorSubscribers();
    if (processErrorSubscribers.hasOwnProperty(key)) {
      delete processErrorSubscribers[key];
    }
  }
}
export default AsyncProcess;

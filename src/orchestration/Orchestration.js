// Libraries
import Controller from "./Controller.js";
import LoggerUtils from "../utils/LoggerUtils.js";
import Store, { ENVIRONMENTS, STATUSES } from "../statemanagement/Store.js";

// Constants - Local
const ENVIRONMENT_ARGS_LENGTH = 2;

class Orchestration {
  static initialize = async() => {

    // 1) CLI Arguments
    Orchestration.initializeEnvironmentArguments();

    // 2) LoggerUtils
    const { environment } = Store.getState();
    LoggerUtils.initialize(environment.deployment);
    LoggerUtils.bypass(`
      ==========================================
      -- ${environment.applicationName} --
      version: ${environment.applicationVersion}
      deployment: ${environment.deployment}
      server port: ${environment.serverPort}
      ==========================================
    `);

    // 3) Endpoint Listeners
    Controller.initializeEndpoints();

    // 4) Initialization complete
    Store.setState(() => ({ status: STATUSES.active }));
  }

  static initializeEnvironmentArguments() {
    const args = process.argv;
    for (const i in args) {
      if (args[i]) {

        // clone to string, check for "=", ignore "/"
        const argClone = String(args[i]);
        if (argClone.trim() !== "" &&
          !argClone.startsWith("/")
        ) {
          if (argClone.includes("=") &&
            argClone.split("=").length === ENVIRONMENT_ARGS_LENGTH
          ) {
            Orchestration.handleEnvironmentArgument(args[i]);
          }
          else {
            console.error(`[INVALID ARGUMENT]: "${args[i]}" is not a valid environment variable format.`);
          }
        }
      }
    }
  }

  static handleEnvironmentArguments(argument) {
    const { environment } = Store.getState();
    const [argName, argValue] = argument.split("=");
    switch (argName) {

      // AWS - Region
      case "--awsRegion":
        Store.setState((state) => ({ "aws": { ...state.aws, "region": argValue } }));
        break;

      // AWS - Kafka ARN
      case "--awsKafkaArn":
        Store.setState((state) => ({ "aws": { ...state.aws, "kafkaArn": argValue } }));
        break;

      // Environment - Deployment
      case "--environment":
        if (ENVIRONMENTS.includes(argValue)) {
          Store.setState((state) => ({ "environment": { ...state.environment, "deployment": argValue } }));
        } else {
          console.error(
            `[INVALID ARGUMENT]: "${argValue}" is not a valid Environment value - defaulting to "${environment}".`,
            `Valid Environment values are: ${Object.values(ENVIRONMENTS).join(", ")}`
          );
        }
        break;

      // Environment - Server Port
      case "--serverPort":
        if (!isNaN(parseInt(argValue))) {
          Store.setState((state) => ({ "environment": { ...state.environment, "serverPort": argValue } }));
        }
        else {
          console.error(`[INVALID ARGUMENT]: "${argValue}" is not a valid server port (must be an integer).`);
        }
        break;

      // Unrecognized Argument
      default:
        console.error(`[INVALID ARGUMENT]: "${argName}" is not recognized as a valid environment variable.`);
    }
  }

  static onExit() {
    // no subprocesses to exit
    return new Promise((resolve) => {
      resolve();
    });
  }
}
export default Orchestration;

// Constants - Global
import ApplicationConfig from "../resources/ApplicationConfig.json" assert { type: 'json' };

// Constants - Local
export const ENVIRONMENTS = {
  development: String("DEVELOPMENT"),
  production: String("PRODUCTION"),
  testing: String("TESTING"),
};

export const STATUSES = {
  active: String("ACTIVE"),
  disabled: String("DISABLED"),
  error: String("ERROR"),
  inactive: String("INACTIVE"),
  initial: String("INITIAL"),
  pending: String("PENDING"),
  success: String("SUCCESS"),
};

const APP_NAME = String(ApplicationConfig.name);
const APP_VERSION = String(ApplicationConfig.version);
const AWS_REGION = String(ApplicationConfig.region);
const SERVER_PORT = String(ApplicationConfig.serverPort);

export const STORE_STATE_DEFAULT = {
  aws: {
    region: AWS_REGION,
  },
  endpoints: [],
  environment: {
    applicationName: APP_NAME,
    applicationVersion: APP_VERSION,
    deployment: ENVIRONMENTS.development,
    serverPort: SERVER_PORT,
  },
  status: STATUSES.initial,
};

class Store {
  static state = { ...STORE_STATE_DEFAULT };

  static getState() { return Store.state; }

  static setState(callback) {
    const stateChange = callback(Store.state);
    Store.state = {
      ...Store.state,
      ...stateChange,
    };
  }
}
export default Store;

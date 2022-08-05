import AwsPinpoint from "../aws/AwsPinpoint.js";
import cors from "cors";
import express from "express";
import LoggerUtils from "../utils/LoggerUtils.js";
import Store from "../statemanagement/Store.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));

// Constants - Local
const ENDPOINTS = {
  environment: String("/environment"),
  status: String("/status"),
  validate: String("/validate")
};

const HTTP_CODES = {
  okay: 200,
  badRequest: 400,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
};

const HTTP_METHODS = {
  delete: "DELETE",
  get: "GET",
  post: "POST",
  put: "PUT"
};

class Controller {
  static endpoints = [
    // path                     // method            // callback
    [ENDPOINTS.environment,     HTTP_METHODS.get,    (request, response) => this.handleEnvironmentCheck(request, response)],
    [ENDPOINTS.status,          HTTP_METHODS.get,    (request, response) => this.handleStatusCheck(request, response)],
    [ENDPOINTS.validate,        HTTP_METHODS.post,   (request, response) => this.handlePhoneNumberValidation(request, response)],
  ];

  static initializeEndpoints() {
    const { endpoints, environment } = Store.getState();
    app.listen(environment.serverPort, () => {
      for(const i in Controller.endpoints) {
        if(Controller.endpoints[i]) {
          Controller.handleEndpointInitialization(Controller.endpoints[i]);
        }
        else {
          LoggerUtils.error(`[INVALID ENDPOINT]: "${Controller.endpoints[i]}" is not a valid endpoint format.`);
        }
      }
      LoggerUtils.info(`Established endpoints:\n${endpoints.join("\n")}`);
    });
  }

  static handleEndpointInitialization(endpointConfig) {
    const { endpoints } = Store.getState();
    const [path, method, callback] = endpointConfig;
    switch(method) {
      case HTTP_METHODS.get:
        app.get(path, (request, response) => callback(request, response));
        if(!endpoints.includes(path)) endpoints.push(path);
      break;

      case HTTP_METHODS.post:
        app.post(path, (request, response) => callback(request, response));
        if(!endpoints.includes(path)) endpoints.push(path);
      break;

      case HTTP_METHODS.put:
        app.put(path, (request, response) => callback(request, response));
        if(!endpoints.includes(path)) endpoints.push(path);
      break;

      case HTTP_METHODS.delete:
        app.delete(path, (request, response) => callback(request, response));
        if(!endpoints.includes(path)) endpoints.push(path);
      break;

      default:
        LoggerUtils.warn(`"${method}" is not recognized as a valid HTTP Method for the endpoint: ${path}`);
    }
  }

  /*====================
  Application Endpoints
  ====================*/
  static handleEnvironmentCheck(request, response) {
    LoggerUtils.debug("Called environment check");
    const { environment } = Store.getState();
    Controller.setCors(response);
    response.status(HTTP_CODES.okay)
    .send(JSON.stringify(environment));
  }

  static handleStatusCheck(request, response) {
    LoggerUtils.debug("Called status check");
    const { status } = Store.getState();
    Controller.setCors(response);
    response.status(HTTP_CODES.okay)
    .send(JSON.stringify(status));
  }

  /*====================
  Cors
  ====================*/
  static setCors(response) {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "DELETE, GET, PUT, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "*");
  }

  /*====================
  Pinpoint Endpoints
  ====================*/
  static handlePhoneNumberValidation(request, response) {
    Controller.setCors(response);

    console.log(request.body);
    const phoneNumber = request.body.phoneNumber;
    LoggerUtils.debug(`Called validate phone number: ${phoneNumber}`);

    if(!phoneNumber) {
      response.status(HTTP_CODES.badRequest)
      .send("Phone number cannot be empty.");
      return;
    }

    AwsPinpoint.validate(phoneNumber)
    .then((data) => {
      response.status(HTTP_CODES.okay)
      .send(data);
    })
    .catch((error) => {
      response.status(HTTP_CODES.badRequest)
      .send(error);
    });
  }
}
export default Controller;

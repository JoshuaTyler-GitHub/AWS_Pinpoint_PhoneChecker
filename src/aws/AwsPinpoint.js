// jobs
import AwsPinpointValidateJob from "./jobs/AwsPinpointValidateJob.js";

class AwsPinpoint {
  static validate(phoneNumber) {
    const validateJob = new AwsPinpointValidateJob(phoneNumber);
    return validateJob.start();
  }
}
export default AwsPinpoint;

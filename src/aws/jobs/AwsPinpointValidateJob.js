// Libraries
import AwsPinpointValidate from "../asyncprocesses/AwsPinpointValidate.js";

class AwsPinpointValidateJob {
  constructor(phoneNumber) {
    this.asyncProcess = new AwsPinpointValidate(phoneNumber, true);
    this.error = false;
  }

  start() {
    return new Promise((resolve, reject) => {      
      // data
      this.asyncProcess.subscribeToData((data) => resolve(data));
      
      // error
      this.asyncProcess.subscribeToError((error) => {
        reject(`Unable to perform Pinpoint validation:\n${error}`);
      });

      // execute
      this.asyncProcess.execute();
    });
  }
}
export default AwsPinpointValidateJob;

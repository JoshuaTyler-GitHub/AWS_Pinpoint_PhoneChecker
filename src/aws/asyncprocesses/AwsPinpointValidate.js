// Libraries
import AsyncProcess from "./AsyncProcess.js";

class AwsPinpointValidate extends AsyncProcess {
  constructor(phoneNumber, awaitExecution) {
    super(
      { /* No Arguments */ },
      (
        `aws pinpoint phone-number-validate ` +
        `--number-validate-request ` +
        `PhoneNumber=${phoneNumber}`
      ),
      awaitExecution
    );
  }
}
export default AwsPinpointValidate;
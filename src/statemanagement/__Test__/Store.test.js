// Global Libraries
import { expect } from "@jest/globals";
import LoggerUtils from "../../utils/LoggerUtils.js";

// Testing Library
import Store from "../Store";


beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// getState
test("getState()", () => {
  const testState = {
    key: "value",
    multiple: {
      nested: {
        deps: {
          down: {
            to: {
              anArray: [1, 2, 3, 4 ]
            }
          }
        }
      }
    }
  };

  Store.state = testState;
  expect(Store.getState()).toEqual(testState);
});

// setState
test("setState()", () => {
  const testState = {
    key: "value",
    multiple: {
      nested: {
        deps: {
          down: {
            to: {
              anArray: [1, 2, 3, 4 ]
            }
          }
        }
      }
    }
  };

  Store.state = testState;
  expect(Store.getState()).toEqual(testState);
  Store.setState(() => ({ newKey: "newValue" }));
  expect(Store.getState().hasOwnProperty("newKey")).toEqual(true);
  expect(Store.getState().newKey).toEqual("newValue");
});

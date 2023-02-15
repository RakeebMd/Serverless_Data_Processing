import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_P4ERbyxCu",
  ClientId: "70f6652uitkaepqklouaupe68q",
};

export default new CognitoUserPool(poolData);

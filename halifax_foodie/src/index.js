import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import { Amplify } from "aws-amplify";
import config from "./aws-exports";
import LexChat from "react-lex";

//https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#option-1-use-pre-built-ui-components
Amplify.configure(config);
// Reference: https://www.npmjs.com/package/react-lex-plus
//Reference: https://www.robinwieruch.de/local-storage-react/
ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse */}
    {/* Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator */}
    {/* //Reference: https://www.npmjs.com/package/react-lex/v/1.0.0 */}
    <LexChat
      botName="myBot"
      IdentityPoolId="us-east-1:eceae3ad-6ac0-4b26-8bd4-37146d11c9d0"
      placeholder="Placeholder text"
      backgroundColor="white"
      height={450}
      region="us-east-1"
      headerText="HalifaxFoodie Help"
      headerStyle={{ backgroundColor: "#873e23", fontSize: "40px" }}
      greeting={"Hello, how can I help you?"}
    />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

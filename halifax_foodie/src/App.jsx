import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { BrowserRouter as Router, NavLink, Route, Switch } from "react-router-dom";
import DashboardComp from "./components/dashboard/Dashboard";
import Order from "./components/order/OrderFood";
import RealTimeChatComp from './components/real-time-chat/RealTimeChatComp';
import RecipeUploadComp from "./components/recipeUpload/RecipeUpload";
import RateOrderComp from "./components/review/RateOrder";

import { withAuthenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import "../src/main.css";
import './App.scss';
import MultiFactor from "./components/mfa/MultiFactorAuth";
import Visualization from "./components/visualization/Visualization";
import PolarityComponent from "./components/polarity/PolarityComponent";


function App() {
 
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };
  //Reference: https://www.robinwieruch.de/local-storage-react/
  localStorage.setItem("isChat","false");
  //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
  let isVerified = !!JSON.parse(localStorage.getItem("isVerifiedQues"))
//https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#option-1-use-pre-built-ui-components

  return (
    <Box sx={{ flexGrow: 1 }} className="app">

      {/* //https://mui.com/material-ui/react-app-bar/} */}
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <NavLink style={{textDecoration: 'none', color: 'white', cursor: 'pointer'}} to={'/'}> Halifax Foodie</NavLink>
              </Typography>
              <Button color="inherit" onClick={() => logout()}>Logout</Button>
            </Toolbar>
          </AppBar>
          {
           //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator

            isVerified ?
            // references
            // https://v5.reactrouter.com/web/guides/quick-start
            <Switch>
                <Route exact path="/" component={DashboardComp} />
                <Route exact path="/question" component={MultiFactor} />
                <Route exact path="/postReview" component={RateOrderComp} />
                <Route exact path="/chat" component={RealTimeChatComp} />
                <Route exact path="/fetchFood" component={Order} />
                <Route exact path="/ownerRecipeUpload" component={RecipeUploadComp} />
                <Route exact path="/visualize" component={Visualization} />
                <Route exact path="/polarity" component={PolarityComponent} />
            </Switch>
            :
            <Switch>
              <Route exact path="/" component={MultiFactor} />
            </Switch>
          }
        </Router>
    </Box>

  );
}
// export default App;
//Reference: https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/
export default withAuthenticator(App);

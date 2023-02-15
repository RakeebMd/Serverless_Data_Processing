import { Card, Grid } from "@mui/material";
import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import './Dashboard.scss';
import { useHistory } from "react-router-dom";
import axios from "axios";

//Dashboard contains all the buttons visualization, Uplaod Recipe, Order Food etc
export default function DashboardComp() {
  // Reference: https://reactjs.org/docs/hooks-state.html
  const currentUsrRole = localStorage.getItem("userRole");
  const histNavigate = useHistory();
  //Reference: https://reactjs.org/docs/hooks-state.html
  const [currUsr, setCurrUsr] = useState(null);

  //Reference: https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    currentUsrInfo();
  }, []);


  useEffect(() => {
    if(currentUsrRole!="owner"){
    const interval = setInterval(() => {
      getCheck();
    }, 10000);
    return () => clearInterval(interval);
  }
  },[]);

  async function getCheck() {
    //Reference: https://axios-http.com/docs/post_example
    await axios
    .post(
      "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/getcheck",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      var flag=JSON.parse(response.data.body)
      console.log(flag)
      if(flag=="true")
      {
        histNavigate.push("/chat");
        //Reference: https://www.w3schools.com/jsref/met_loc_reload.asp#:~:text=Window%20location.reload()&text=The%20reload()%20method%20reloads,reload%20button%20in%20your%20browser.
        window.location.reload();
      }
    });    
  }
  async function currentUsrInfo() {
    try {
      //Reference: https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/
      const user = await Auth.currentAuthenticatedUser({
        bypassCache: false,
      });
      setCurrUsr({
        ...user.attributes,
        role: user.storage?.getItem("userRole"),
      });
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...user.attributes,
          role: user.storage?.getItem("userRole"),
        })
      );
    } catch (error) {
      histNavigate.push("/");
    }
  }
  //Buttons for all navigations
  //Reference: https://stackoverflow.com/questions/42701129/how-to-push-to-history-in-react-router-v4
  const fetchFoodList = () => {
    histNavigate.push("/fetchFood");
  };
  const ownerRecipeUpload = () => {
    histNavigate.push("/ownerRecipeUpload");
  };
  const visualizaData = () => {
    histNavigate.push("/visualize");
  };

  const chatWithUsr = () => {
    histNavigate.push("/chat");
  };

  const viewPolarity = () => {
    histNavigate.push('/polarity')
  }

  return (
    //Reference: https://react-bootstrap.github.io/layout/grid/
    //Reference: https://react-bootstrap.github.io/components/cards/
    <Grid
      alignItems='center'
      container
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      marginTop={"50px"}
    >
      {currentUsrRole?.toLowerCase() === "customer" && (
        <Grid item xs={6} className="grid-item">
          <div className="card-item" onClick={() => fetchFoodList()}>
            <Card className="card" variant="outlined">
              Subway
            </Card>
          </div>
        </Grid>
      )}
{currentUsrRole?.toLowerCase() === "customer" && (
        <Grid item xs={6} className="grid-item">
          <div className="card-item" onClick={() => fetchFoodList()}>
            <Card className="card" variant="outlined">
              Tawa Grill
            </Card>
          </div>
        </Grid>
      )}{currentUsrRole?.toLowerCase() === "customer" && (
        <Grid item xs={6} className="grid-item">
          <div className="card-item" onClick={() => fetchFoodList()}>
            <Card className="card" variant="outlined">
              Pizza Pizza
            </Card>
          </div>
        </Grid>
      )}
      {currentUsrRole?.toLowerCase() === "customer" && (
        <Grid item xs={6} className="grid-item">
          <div className="card-item" onClick={() => fetchFoodList()}>
            <Card className="card" variant="outlined">
              Burger Queen
            </Card>
          </div>
        </Grid>
      )}
      
      {/* show visualization only to owner */}
      {
        currentUsrRole?.toLowerCase() !== "customer" &&
        <Grid item xs={6} className="grid-item">
          <div className="card-item" onClick={() => visualizaData()}>
            <Card className="card" variant="outlined">
              Visualize Data
            </Card>
          </div>
        </Grid>
      }

      {currentUsrRole?.toLowerCase() !== "customer" && (
        <Grid item xs={6} className="grid-item">
          <div className="card-item" onClick={() => ownerRecipeUpload()}>
            <Card className="card" variant="outlined">
              Upload Recipe
            </Card>
          </div>
        </Grid>
      )}

      {currentUsrRole?.toLowerCase() !== "customer" && (
        <Grid item xs={6} className="grid-item">
          <div className="card-item" onClick={() => viewPolarity()}>
            <Card className="card" variant="outlined">
              Review Polarity
            </Card>
          </div>
        </Grid>
      )}

      {currentUsrRole?.toLowerCase() !== "customer" &&(<Grid item xs={6} className="grid-item">
        <div className="card-item" onClick={() => chatWithUsr()}>
          <Card className="card" variant="outlined">
            Chat
          </Card>
        </div>
      </Grid>)}
    </Grid>
  );
}

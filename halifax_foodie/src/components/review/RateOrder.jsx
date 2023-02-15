import axios from "axios";
import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import { withRouter } from "react-router";
//This code is used to rate order and store it in dyanamo db using an api call
export class RateOrderComp extends Component {
  constructor(props) {
    super(props);
  //Reference: https://www.robinwieruch.de/local-storage-react/
    //Reference: https://www.digitalocean.com/community/tutorials/react-constructors-with-react-components
    this.state = {
      //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
      user: JSON.parse(localStorage.getItem("currentLocalUser")),
      rating: "",
      foodId: props.location.state.foodId,
    };
  }
  onValueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  //used to save item in dynamo by making api call to lambda
  saveItem = async (event) => {
    event.preventDefault();
    const body = {
      ratings: this.state.rating,
      username: this.state.user.username,
      foodId: this.state.foodId,
    };

    try {
      //Reference: https://axios-http.com/docs/post_example
      let result = await axios.post(
        "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/addreview",

        JSON.stringify(body),
        { headers: { "Content-Type": "application/json" } }
      );
      this.cancel();
    } catch (err) {
    }
  };
    //Reference: https://www.digitalocean.com/community/tutorials/react-constructors-with-react-components
  cancel = (e) => {
    this.props.history.push("/fetchFood");
  };

  render() {
    return (
      <div className="row rating-content justify-content-center align-items-center h-50">
        <div className="col-md-4">
         {/* Reference: https://react-bootstrap.github.io/components/cards/ */}
         {/* Reference: https://reactjs.org/docs/uncontrolled-components.html */}
          <Card>
            <Card.Header>
                Please give your review
            </Card.Header>
            <Card.Body>
              <input
                className="form-control"
                type="text"
                placeholder="Type your review ..."
                name="rating"
                value={this.state.rating}
                onChange={this.onValueChange}
              />
              <Button className="btn primary-button" onClick={this.saveItem}>
                Submit
              </Button>
              <Button className="btn primary-button" onClick={this.cancel}>
                Cancel
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}
//Reference: https://www.oreilly.com/library/view/javascript-by-example/9781788293969/58acd049-c14d-443f-9aa5-9c625de32331.xhtml
export default withRouter(RateOrderComp);

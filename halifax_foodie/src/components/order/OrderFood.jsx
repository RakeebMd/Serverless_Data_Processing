import axios from "axios";
import React, { Component } from "react";
import { Button, Card, Col, ListGroup, Row, Spinner } from "react-bootstrap";
import { withRouter } from "react-router";
import "./OrderFood.scss";

// It contains all food items for restaurant and an option to order food
export class OrderFoodComp extends Component {
    //Reference: https://www.robinwieruch.de/local-storage-react/
    //Reference: https://www.digitalocean.com/community/tutorials/react-constructors-with-react-components
  constructor(props) {
    super(props);
    this.state = {
        //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
      currUsr: JSON.parse(localStorage.getItem("currentLocalUser")),
      heading: "",
      title: "",
      ingredient: "",
      listFood: [],
      isLoading: true
    };
  }
  //Fetches food from dynamodb
  //https://reactjs.org/docs/react-component.html
  async componentDidMount() {
      //Reference: https://axios-http.com/docs/post_example
    await axios
      .post("https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/fetchfood",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
          //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
        var result = JSON.parse(response.data.body);
        this.setState({
          listFood: result[0].food,
        });
      })
      .catch(error => {})
      .finally(() => {
        this.setState({isLoading: false})
      })
  }
  //Code to order an item from the given list
  async placeOrder(row) {
    const body = {
      foodName: row["foodName"],
      foodId: row["foodId"],
      price: row["price"],
      ingredient: row["ingredient"],
      userName: this.state.currUsr.email,
    };
    try {
      //Reference: https://axios-http.com/docs/post_example
      await axios.post(
        "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/addorder",
        JSON.stringify(body),
        { headers: { "Content-Type": "application/json" } }
      );
      //Reference: https://stackoverflow.com/questions/53090699/how-to-run-an-alert-on-button-click-react-js
      alert(body.userName+" ordered " + row["foodName"]);
      //Reference: https://www.digitalocean.com/community/tutorials/react-constructors-with-react-components
      this.props.history.push("/postReview", { foodId: body.foodId });
    } catch (err) {
    }
  }

  //Exports recipe of the selected item
  async exportRecipe(row) {
    this.setState({
      heading: "Extracted Title and Key Ingredients",
      title: row.foodName,
      ingredient: row.ingredient,
    });
  }

  render() {
    return (
        // {/* references */}
        // {/* https://mui.com/material-ui/react-grid/ */}
            //Reference: https://react-bootstrap.github.io/components/cards/
        <Row className="to-do-list-items">
          <Col md={10} lg={5} className="items-container">
            <Card className="item-card">
              <Card.Header style={{ fontWeidht: "bold" }}>
                Order Your Food
              </Card.Header>
              <Card.Body>
                {
                  this.state.isLoading &&
                  <div className="d-flex h-100 justify-content-center align-items-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                } {
                  !this.state.isLoading &&
                  this.state.listFood.map((row) => (
                    <Card className="card-content-incomplete">
                      <Card.Body>
                        <ListGroup className="list-group-flush" style={{marginBottom: '1rem'}}>
                          <ListGroup.Item>
                            <strong>Food: </strong>
                            <span>{row.foodName}</span>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <strong>Price:  </strong>
                            <span>${row.price}</span>
                          </ListGroup.Item>
                        </ListGroup>
                        <Button style={{marginRight: '1rem'}} className="add-button" onClick={() => this.placeOrder(row)}>
                          Place Order
                        </Button>
                        <Button onClick={() => this.exportRecipe(row)}>
                          Extract ingredients
                        </Button>
                      </Card.Body>
                    </Card>
                  ))
                }
              </Card.Body>
            </Card>
          </Col>
        {
          this.state.heading &&
          <Col md={10} lg={5}>
            {/* references */}
            {/* https://mui.com/material-ui/react-card/ */}
            <Card>
              <Card.Header>{this.state.heading}</Card.Header>
              <Card.Body>
                {/* Reference: https://getbootstrap.com/docs/4.0/components/list-group/*/}
                <ListGroup className="list-group-flush" style={{marginBottom: '1rem'}}>
                  <ListGroup.Item>
                    <strong>Title:  </strong>
                    <span>{this.state.title}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Ingredients:  </strong>
                    <span>{this.state.ingredient}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        }
        </Row>
    );
  }
}
//Reference: https://www.oreilly.com/library/view/javascript-by-example/9781788293969/58acd049-c14d-443f-9aa5-9c625de32331.xhtml
export default withRouter(OrderFoodComp);

//references
//https://www.youtube.com/watch?v=zQyrwxMPm88&t=60s

import React, { useEffect, useState } from "react";

import { useHistory } from 'react-router-dom';
import db from '../../firebase';
import ChatRoom from "./ChatRoom";
import './RealTimeChat.scss';

import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";

export default function RealTimeChatComp({sentBy}) {
      //Reference: https://reactjs.org/docs/hooks-state.html
    const [currentUser, setCurrentUser] = useState(null)
    const [customerList, setCustomerList] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const history = useHistory();
   //Reference: https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        getCurrentUser()
    }, [])

    async function getCurrentUser() {
          //Reference: https://www.robinwieruch.de/local-storage-react/
        let localStorageCurrentUser = localStorage.getItem('currentUser')
        if(!localStorageCurrentUser || localStorageCurrentUser === 'null') {
            history.push('/')
            return
        }
          //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
        setCurrentUser(JSON.parse(localStorageCurrentUser));
    //Reference: https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
    //Reference: https://firebase.google.com/docs/firestore/manage-data/add-data
    //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
        if(currentUser?.role?.toLowerCase() !== 'customer') {
            const users = await db.collection("users");
            const userData = await users.where("role", "==", 'customer').get();

            const customerData = []
            userData.forEach((doc) => {
                customerData.push(doc.data())
            });
            setCustomerList(customerData)
        }
    }

    function SingleCustomer(props) {
        return (
            //Reference: https://react-bootstrap.github.io/components/cards/
            //Reference: https://www.digitalocean.com/community/tutorials/react-constructors-with-react-components
            <Card style={{marginBottom: '1rem', cursor: 'pointer'}}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {props.customer.email}
                    </Typography>
                    {
                        props.customer.hasComplaint &&
                        <p className="text-danger">Complaint raised</p>
                    }
                </CardContent>
            </Card>
        )
    }

    function getCardHeading() {
        return 'Chat'
    }

    function selectCustomerToChatWith(customer) {
        setSelectedCustomer(customer)
    }

    function CustomersList(props) {
        return (
            //Reference: https://www.digitalocean.com/community/tutorials/react-constructors-with-react-components
            <div className="customers-list">
                {
                    props.customerList
                    && props.customerList.length
                    && props.customerList.map((customer, index) =>
                        <div key={index} onClick={(e) => selectCustomerToChatWith(customer)}>
                            <SingleCustomer customer={customer}/>
                        </div>
                    )
                }

                {
                    props.customerList
                    && !props.customerList.length
                    &&
                    <h1 style={{ padding: '1rem'}}>
                        No Customers !!!
                    </h1>
                }
            </div>
        )
    }

    return (
        //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
        //Reference: https://react-bootstrap.github.io/layout/grid/
        <Grid container spacing={2} justifyContent="center" alignItems="center" height={'100%'} marginTop={2}>
            <Grid item={true} xs={2} sm={4} md={4}  className="chat-container">
                <Card variant="outlined" style={{marginBottom: '25px'}}>
                    <CardHeader style={{borderBottom: '1px solid lightgray'}} title={getCardHeading()}/>
                    <CardContent>
                        {
                            currentUser && currentUser?.role?.toLowerCase() === 'customer' && <ChatRoom currentUser={currentUser}/>
                        }

                        {
                            currentUser && currentUser?.role?.toLowerCase() !== 'customer' && selectedCustomer && <ChatRoom currentUser={currentUser} chatWith={selectedCustomer} />
                        }
                        {/* https://reactjs.org/docs/components-and-props.html */}
                        {
                            currentUser && currentUser?.role?.toLowerCase() !== 'customer' && !selectedCustomer && <CustomersList customerList={customerList}/>
                        }

                        {
                            !currentUser &&
                            <h1 style={{color: 'white', padding: '1rem'}}>
                                Loading !!!!!!
                            </h1>
                        }
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )

    }

//references
//https://www.youtube.com/watch?v=zQyrwxMPm88&t=60s

import React, {useState, useRef} from 'react'
import db from "../../firebase";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';
import ChatMessage from './ChatMessage'
import { Button, OutlinedInput } from '@mui/material';
import axios from "axios";
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

export default function ChatRoom({currentUser, chatWith}) {
  //Reference: https://reactjs.org/docs/hooks-state.html
    const [formValue, setFormValue] = useState("");
    const sentBy = currentUser.role?.toLowerCase() === 'customer' ? currentUser.email : 'restaurant'
    //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
    const sentTo = chatWith ? chatWith.email : 'restaurant'
    //Reference: https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
    //Reference: https://firebase.google.com/docs/firestore/manage-data/add-data
    const messagesRef = db.collection("messages");
    const query = messagesRef.where('sentBy', 'in', [sentBy, sentTo]).orderBy("createdAt").limit(25);
    const [messages] = useCollectionData(query, { idField: "id" });

    const refDummy = useRef();
    //Reference: https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
    //Reference: https://www.robinwieruch.de/local-storage-react/
     localStorage.setItem("isChat","true");
    }, [])
    
    function getFilteredMessages() {
        if(!messages)return
        const usersSet = new Set([sentBy, sentTo]);
        return messages.filter(message => usersSet.has(message.sentTo))
    }

    const sendMessage = async (e) => {
        e.preventDefault();

        try {
            await messagesRef.add({
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                sentBy,
                sentTo
            });

            setFormValue("");
            refDummy.current.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
            console.log(error)
        }

    };

    const updateCheck= async ()=>{
        await axios
    .post(
      "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/updatecheck",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
        console.log(response)
          //Reference: https://www.robinwieruch.de/local-storage-react/
        localStorage.setItem("isChat","false");
        //Reference: https://www.w3schools.com/jsref/met_loc_reload.asp#:~:text=Window%20location.reload()&text=The%20reload()%20method%20reloads,reload%20button%20in%20your%20browser.
        window.location.reload();
    }); 
    //Reference: https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
    //Reference: https://firebase.google.com/docs/firestore/manage-data/add-data
    db.collection("users")
            .doc(currentUser.email)
            .update({
              hasComplaint: false,
            })
            .then((doc) => {})
            .catch((err) => {});

    };

    return (
        <>
        <main>
            {getFilteredMessages() &&
            getFilteredMessages().map((msg) => <ChatMessage key={msg.id} message={msg} currentUser={currentUser} />)}

            <span ref={refDummy}></span>
        </main>
          {/* Reference: https://reactjs.org/docs/forms.html */}

        <form onSubmit={sendMessage} className="message-form">
            <OutlinedInput
                placeholder="Type message ..."
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}/>

                <Button style={{marginLeft:'10px'}} type="submit" variant="contained" color="success" disabled={!formValue}>
                    Send
                </Button>
                <Button style={{marginLeft:'10px'}} variant="contained" color="success" onClick={updateCheck}>
                    <NavLink style={{textDecoration: 'none', color: 'white', cursor: 'pointer'}} to={'/'}> Close</NavLink>
    
                </Button>
        </form>
        </>
    );
}

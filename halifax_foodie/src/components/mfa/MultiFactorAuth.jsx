import { Auth } from "aws-amplify";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import db from "../../firebase";
import firebase from "firebase/app";
import { Button } from "react-bootstrap";

export default function MultiFactor() {
  const histNavigate = useHistory();
  //Reference: https://reactjs.org/docs/hooks-state.html
  const [secondFacAns, setSecondFacAns] = useState("");
  const [thirdFacKey, setThirdFacKey] = useState("");
  const [thirdFacText, setThirdFacText] = useState("");
  const secondFactorQuestion = "What is Your favorite color?";
  const [currentUsrRole, setCurrentUsrRole] = useState("customer");
  const [ques, setQues] = useState();
  const [generatedCipher, setGeneratedCipher] = useState("");
  var firebaseUsr;
  useEffect(async () => {
    let firebaseUsr;
    //Checking if the user is a registered user
    //Reference: https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/
      //Reference: https://www.robinwieruch.de/local-storage-react/
  //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    console.log("called useEff")
    !JSON.parse(localStorage.getItem("isVerifiedQues")) &&
      (await Auth.currentUserPoolUser().then((obj) => {
        const regUser = {
          username: obj.username,
          email: obj.attributes.email,
        };
        //Reference: https://www.robinwieruch.de/local-storage-react/
        localStorage.setItem("currentLocalUser", JSON.stringify(regUser));
        localStorage.setItem("isVerifiedQues", false);
      }));
      //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    const currUSr = JSON.parse(localStorage.getItem("currentLocalUser"));
    //Reference: https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
    //Reference: https://firebase.google.com/docs/firestore/manage-data/add-data
    const firebaseUsers = await db.collection("users");
    const userInfo = await firebaseUsers
      .where("username", "==", currUSr.username)
      .get();
    
    userInfo.forEach((doc) => {
      firebaseUsr = doc.data();
    });

    if (firebaseUsr) {
      setQues(true);
    } else {
      setQues(false);
    }
  }, []);

  const generateCipherText = async () => {
    var currentUsr = JSON.parse(localStorage.getItem("currentLocalUser"));

    //sign-up third factor
    var body = {
      email: currentUsr.email,
      userName: currentUsr.username,
      role: currentUsrRole,
      key: thirdFacKey,
      plainText: thirdFacText,
    };
    //Reference: https://axios-http.com/docs/post_example
    try {
      let response = await axios.post(
        "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/addcipher",

        JSON.stringify(body),
        { headers: { "Content-Type": "application/json" } }
      );
      setGeneratedCipher(response.data.body);
    } catch (err) {}
  };

  // On submit, perform 2nd and 3rd factor authentication, first check 2nd factor auth and if the answer is invalid, show invalid answer otherwise perform third factor auth
  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (ques) {
        //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
      const currentUsr = JSON.parse(localStorage.getItem("currentLocalUser"));
      firebaseUsr = {};

      const firebaseUsers = await db.collection("users");
      const usrInfo = await firebaseUsers
        .where("username", "==", currentUsr.username)
        .get();

      usrInfo.forEach((doc) => {
        firebaseUsr = doc.data();
      });
      if (firebaseUsr.securityAnswer) {
        if (secondFacAns === firebaseUsr?.securityAnswer) {
          //Reference: https://www.robinwieruch.de/local-storage-react/
          localStorage.setItem("isVerifiedQues", true);
          localStorage.setItem("userRole", firebaseUsr.role);
          console.log(firebaseUsr.loginCount);
          //Reference: https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
          //Reference: https://firebase.google.com/docs/firestore/manage-data/add-data
          db.collection("users")
            .doc(firebaseUsr.email)
            .update({
              loginCount: firebaseUsr.loginCount || 0 + 1,
              lastAuthTime: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((doc) => {})
            .catch((err) => {});
        } else {
          //Reference: https://stackoverflow.com/questions/53090699/how-to-run-an-alert-on-button-click-react-js
          alert("Please Enter a valid answer");
        }
      }

      //login 3rd factor api call
      var body = {
        cipher: generatedCipher,
        username: currentUsr.username,
      };
      //Reference: https://axios-http.com/docs/post_example

      await axios
        .post(
          "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/thirdfactor",
          JSON.stringify(body),

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
          response = JSON.parse(response.data.body);
          var message = response[0].message;
          if (message === "User Not Verified") {
            //Reference: https://stackoverflow.com/questions/53090699/how-to-run-an-alert-on-button-click-react-js
            alert(message);
            localStorage.setItem("isVerifiedQues", false);
          } else {
            console.log("3Factor login")

            histNavigate.push("/");
            //Reference: https://www.w3schools.com/jsref/met_loc_reload.asp#:~:text=Window%20location.reload()&text=The%20reload()%20method%20reloads,reload%20button%20in%20your%20browser.
            window.location.reload();
          }
        })
        .catch((err) => {});
    } else {
      var currentUsr = JSON.parse(localStorage.getItem("currentLocalUser"));

      //SignUp 2nd factor code
      const firebase_body = {
        email: currentUsr.email,
        securityQuestion: secondFactorQuestion,
        securityAnswer: secondFacAns,
        role: currentUsrRole,
        username: currentUsr.username,
        loginCount: 0,
        lastAuthTime: firebase.firestore.FieldValue.serverTimestamp(),
      };
      //Reference: https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/
      await axios
        .post(
          "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/addtofirebase",
          JSON.stringify(firebase_body),
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          //Reference: https://www.robinwieruch.de/local-storage-react/
          localStorage.setItem("isVerifiedQues", true);
          localStorage.setItem("userRole", currentUsrRole);
          histNavigate.push("/");
          //Reference: https://www.w3schools.com/jsref/met_loc_reload.asp#:~:text=Window%20location.reload()&text=The%20reload()%20method%20reloads,reload%20button%20in%20your%20browser.
          window.location.reload();
        })
        .catch((err) => {});
    }
  };

  return (
    <div className="row justify-content-center align-items-center mt-4">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
          {/* Reference: https://reactjs.org/docs/forms.html */}
          {/* //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator */}

            <form onSubmit={(e) => onSubmitForm(e)}>
              <div className="mb-5">
                {ques ? (
                  <div></div>
                ) : (
                  <div>
                    <div>
                      <h4>Enter User Role</h4>
                    </div>
                    <div>
                      <span>Please Enter user role</span>
                      {/* Reference: https://reactjs.org/docs/uncontrolled-components.html */}
                      <input
                        className="input-design top-space form-control"
                        type="text"
                        value={currentUsrRole}
                        onChange={(e) =>
                          setCurrentUsrRole(e.target.value.toLowerCase())
                        }
                        placeholder="Customer"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div></div>
              <div className="mb-5">
                {ques ? (
                  <h4>2nd-Factor Auth</h4>
                ) : (
                  <h4>Set up 2nd-Factor Auth</h4>
                )}

                <div className="cus-form form-top-space">
                  <span>{secondFactorQuestion}</span>
                  {/* Reference: https://reactjs.org/docs/uncontrolled-components.html */}
                  <input
                    className="input-design top-space form-control"
                    type="text"
                    value={secondFacAns}
                    onChange={(e) => setSecondFacAns(e.target.value)}
                    placeholder="Enter your answer"
                  />
                </div>
              </div>

              <div></div>

              <div className="mb-5">
                {ques ? (
                  <div>
                    <h4>3rd-Factor Auth</h4>
                    <div className="cus-form form-top-space">
                      <span>Enter a Cipher Text</span>
                      <input
                        className="input-design top-space form-control"
                        type="text"
                        value={generatedCipher}
                        onChange={(e) => setGeneratedCipher(e.target.value)}
                        placeholder="Enter cipher value"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4>Set Up 3rd-Factor Auth</h4>
                    <div className="cus-form form-top-space">
                      <span>Enter key</span>
                      <input
                        className="input-design top-space form-control"
                        type="text"
                        value={thirdFacKey}
                        onChange={(e) => setThirdFacKey(e.target.value)}
                        placeholder="Enter key"
                      />
                    </div>

                    <div className="cus-form form-top-space">
                      <span>Enter plain text</span>
                      <input
                        className="input-design top-space form-control"
                        type="text"
                        value={thirdFacText}
                        onChange={(e) => setThirdFacText(e.target.value)}
                        placeholder="Enter Value"
                      />
                    </div>
                    <div>
                    <div className="mb-3"></div>
                    <button className="btn btn-success" onClick={generateCipherText}>
                      Generate Cipher
                    </button>
                    <div className="mb-2"></div>
                    <span>{generatedCipher}</span>
                  </div></div>
                )}
              </div>

              <div className="cus-form form-top-space">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import axios from "axios";
import React, { useRef, useState } from "react";
import db from "../../firebase";
import firebase from "firebase/app";
import { Card } from "react-bootstrap";
//This code is used to uplaod a recipe file
function RecipeUploadComp() {
    //Reference: https://reactjs.org/docs/hooks-state.html
  const [uploadedFileName, setUploadedFileName] = useState();
  const [fileContent, setFileContent] = useState("");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [similarRecipe, setSimilarRecipe] = useState("");
  const [displaySimilarRecipe, setDisplaySimilarRecipe] = useState("");

  const ipRef = useRef();
  //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator

  const handleUpload = () => {
    ipRef.current?.click();
  };
  // {/* Reference: https://reactjs.org/docs/forms.html */}

  const handleSubmit = async () => {
    const body = {
      filecontent: fileContent,
      filename: uploadedFileName,
    };

    try {
      //Reference: https://axios-http.com/docs/post_example
      await axios.post(
        "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/addrecipe",

        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const getSimilarRecipe = () => {
    setDisplaySimilarRecipe(similarRecipe);
  };

  //Export recipe function
  const exportRecipe = async () => {
    const body = {
      filename: uploadedFileName,
      createdTime: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      //Reference: https://axios-http.com/docs/post_example
      let result = await axios.post(
        "https://vvzh0tcvl0.execute-api.us-east-1.amazonaws.com/default/exportrecipe",
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
        //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
      result = JSON.parse(result.data.body);
      setTitle(result[0].title);
      setIngredients(result[0].ingredients.toString());
      setSimilarRecipe(result[0].similarRecipies);
      const recipe = {
        title: title,
        ingredients: ingredients,
        createdTime: new Date().toLocaleString(),
      };
      
    //Reference: https://dev.to/gautemeekolsen/til-firestore-get-collection-with-async-await-a5l
    //Reference: https://firebase.google.com/docs/firestore/manage-data/add-data
      db.collection("recipes")
        .add(recipe)
        .then((doc) => {})
        .catch((err) => {});
    } catch (error) {
      console.error(error); // NOTE - use "error.response.data` (not "error")
    }
  };

  //Code to uplaod recipe file from the system
  const uploadFileFromSystem = () => {
    ipRef.current?.files && setUploadedFileName(ipRef.current.files[0].name);
    const fileReader = new FileReader();
    fileReader.readAsText(ipRef.current.files[0]);
    fileReader.onload = async (e) => {
      const txt = e.target.result;
      setFileContent(txt);
    };
  };
  return (
    <div className="row m-3 justify-content-center">
      <div className="col-md-4">
        {/* Reference: https://react-bootstrap.github.io/components/cards/ */}
        {/* Reference: https://reactjs.org/docs/uncontrolled-components.html */}
        <Card>
          <Card.Header>Upload a new recipe:</Card.Header>
          <Card.Body className="d-flex justify-content-center">
            <div className="w-75">
              <input
                ref={ipRef}
                onChange={uploadFileFromSystem}
                className="d-none"
                type="file"
              />
              {/* Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator */}

              <button
                onClick={handleUpload}
                className={`w-100 btn btn-outline-${
                  uploadedFileName ? "success" : "primary"
                }`}
              >
                {uploadedFileName ? uploadedFileName : "Upload"}
              </button>

              <div className="m-3" style={{ maxHeight: '300px', overflow: 'scroll'}}>
                <span>
                  <b>
                    File Content: {fileContent || 'N/A'}
                  </b>
                </span>
              </div>
          {/* Reference: https://reactjs.org/docs/forms.html */}
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-primary w-100 mb-3" onClick={handleSubmit}>
                  Submit
                </button>

                <button className="btn btn-primary w-100 mb-3" onClick={exportRecipe}>
                  Extract Title and Ingredients
                </button>

                <button
                  className="btn btn-primary w-100 mb-3"
                  onClick={getSimilarRecipe}
                >
                  Get Similar recipes
                </button>
              </div>
              <div className="m-3">
                <span>
                  <b>Title: {title || 'N/A'}</b>
                </span>
              </div>

              <div className="m-3">
                <span>
                  <b>Ingredients: {ingredients || 'N/A' } </b>
                </span>
              </div>

              <div className="m-3">
                <span>
                  <b>Similar Recipe: {displaySimilarRecipe || 'N/A'} </b>
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default RecipeUploadComp;

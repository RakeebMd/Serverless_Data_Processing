const axios = require('axios');

exports.handler = async (event) => {
    var request = event
    //post url of cloud function
    //Reference: https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/

    await axios.post('https://us-central1-group01-9791a.cloudfunctions.net/userSignUp',request);
    const response = {
        statusCode: 200,
        body: JSON.stringify('Invoked Cloud Function'),
    };
    return response;
};
# References:
# https://firebase.google.com/docs/firestore/manage-data/add-data#python

from google.cloud import firestore
import json
#Cloud function for sign up
def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    response = {"headers":{"Access-Control-Allow-Origin":"*"},
                "body":{"message":"Details uploaded to Firestore"}}
    initial_values = []
    for key,value in request_json.items():
        initial_values.append(value)
    uploadToFirebase(initial_values)
    if request.method == 'OPTIONS':
        headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    return response

def uploadToFirebase(values):
    db = firestore.Client()
    secondFactor = db.collection(u'users').document(values[0])
    secondFactor.set({    
        u'email': values[0],    
        u'securityQuestion' : values[1],
        u'securityAnswer' : values[2],
        u'role' : values[3],
        u'username' : values[4],
        u'count' : 0,
        u'lastAuthTime' : values[5]
    }, merge=True)

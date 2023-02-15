# References: 
# https://cloud.google.com/pubsub/docs/publisher#python

from google.cloud import pubsub_v1
import json
import os
#publish message
def publish_message(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json().get("message")
    complaint={}
    complaint['sentBy']= request.get_json().get("username")
    complaint['sentTo'] = 'restaurant'
    complaint['text']= request_json
    json_complaint = json.dumps(complaint)
    publisher = pubsub_v1.PublisherClient(
        publisher_options = pubsub_v1.types.PublisherOptions(
            enable_message_ordering=True,)
        )
    project_id= 'group01-9791a'
    topic_id = 'complaints'
    topic_path = publisher.topic_path(project_id,topic_id)
    publisher.publish(topic_path, json_complaint.encode("utf-8"))
    return f'Hello from Google Cloud'

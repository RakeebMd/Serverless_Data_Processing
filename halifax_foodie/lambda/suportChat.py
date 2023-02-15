# References:
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Table.scan
# https://googleapis.dev/python/google-auth/1.15.0/reference/google.auth.transport.urllib3.html

import json
import boto3
import urllib3

url = urllib3.PoolManager()

def lambda_handler(event, context):
    if (event):
        print(event)
        db = boto3.resource('dynamodb')
        order_id= event['currentIntent']['slots']['orderId']
        username =event['currentIntent']['slots']['userName']
        ordersTable = db.Table("userOrder")
        orders = ordersTable.scan()
        orders_details = orders['Items']
        data ={}
        for order in orders_details:
            if order_id == order['orderId'] and username == order['username']:
                data['orderId']= order_id
                data['username']=order['username']
                data['message']='Issue regarding my order : '+str(order_id)
            else:
                order_id = -1     
        #Add flag to dynamo    
        table=db.Table("check")
        table.update_item(
        Key={
            'id': '1'
        },
        UpdateExpression="SET flag = :r",
        ExpressionAttributeValues={
        ':r': 'true',
        }, ReturnValues="UPDATED_NEW"
        )
        #call cloud function to perform pub sub
        if order_id!=-1:
            response = url.request('POST','https://us-central1-group01-9791a.cloudfunctions.net/publishComplaints',
                        body=json.dumps(data),headers={'Content-Type':'application/json'},retries=False)
            
            return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled","message": { "contentType": "PlainText", "content": "Complaint recorded successfully!"}}}
        else:
            return {"dialogAction":{"type":"Close","fulfillmentState": "Failed","message": { "contentType": "PlainText", "content": "Order not found."}}}

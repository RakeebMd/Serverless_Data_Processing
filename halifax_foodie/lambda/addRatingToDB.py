# References:
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item

import json
import boto3
import random
import re
def lambda_handler(event, context):
    if (event):
        reviewAdd= event['currentIntent']['slots']['rating']
        uname=event['currentIntent']['slots']['user_id']
        randNum = random.randint(10, 100000)
        dynamoDb = boto3.resource('dynamodb')
        
        rateTable = dynamoDb.Table("ratings")
        if(len(reviewAdd)!=0):
            rateTable.put_item(
                Item={
                  'id':str(randNum),    
                  'userName' :uname,
                  'review':reviewAdd
                })
       
        return addToDynamo(dynamoDb,reviewAdd,randNum,uname)
#add rating to dynamo
def addToDynamo(dynamoDb,reviewAdd,randNum,uname):
  rateTable = dynamoDb.Table("ratings")
  if(len(reviewAdd)!=0):
        rateTable.put_item(
        Item={
          'id':str(randNum),    
          'userName' :uname,
          'review':reviewAdd
          })
       
        return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled",
        "message": { "contentType": "PlainText", 
        "content": "Rating has been added. Thank you!."}}}
  
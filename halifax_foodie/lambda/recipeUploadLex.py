# References:
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item

import json
import boto3
import random
import re
def lambda_handler(event, context):
    if (event):
        dynDb = boto3.resource('dynamodb')
        restId= event['currentIntent']['slots']['res_id']
        recTitle=event['currentIntent']['slots']['recipe_name']
        recIng= event['currentIntent']['slots']['recipe_desc']
        recCost=event['currentIntent']['slots']['price']
        
        if restId!='-1':
            foodTable = dynDb.Table("Food")
            if(len(recTitle)!=0):
                 foodTable.put_item(
                    Item={
                      'foodId':str(ranInt),    
                      'name' :recTitle,
                      'ingredient':recIng,
                      'price': recCost
                    })
            
            return addToDynamo(restId,recTitle,recIng,recCost,dynDb)
# add recipe to dynamo
def addToDynamo(restId, recTitle,recIng,recCost,dynDb):
    ranInt = random.randint(10, 100000)
    if restId!='-1':
        foodTable = dynDb.Table("Food")
        if(len(recTitle)!=0):
            resposne = foodTable.put_item(
            Item={
                'foodId':str(ranInt),    
                'name' :recTitle,
                'ingredient':recIng,
                'price': recCost
                })
        # return response to lex
        return {"dialogAction":{"type":"Close","fulfillmentState": "Fulfilled","message": { "contentType": "PlainText", "content": "Recipe uploaded. Thanks!"}}}
    
    
    
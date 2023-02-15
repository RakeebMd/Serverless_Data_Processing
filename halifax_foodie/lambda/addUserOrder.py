# References:
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item

import json
import boto3
import random
def lambda_handler(event, context):
   
    if (event):
        body=event
        ranInt = random.randint(10, 100000)
        dyndb = boto3.resource('dynamodb')
        foodNm =body['foodName']
        id = body['foodId']
        uname = body['userName']
        cost = body['price']
        ingred = body['ingredient']
        
        orderTable = dyndb.Table("userOrder")
        return addToDynamo(body,orderTable,foodNm,ranInt,uname,cost,ingred);
        
#add user order to dynamo
def addToDynamo(body,orderTable,foodNm,ranInt,uname,cost,ingred):
  if(len(body)!=0):
            orderTable.put_item(
                Item={
                  'name' :foodNm,
                  'foodId':id,
                  'orderId': str(ranInt),
                  'userName':uname,
                  'Price':cost,
                  'ingredient':ingred,
                  'orderStatus':"In Process"
                })
        
  return {
            'statusCode': 200,
            'headers': {
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
            'body': json.dumps('Order processing')
        }

# References:
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Table.scan

import json
import math
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
    
def lambda_handler(event, context):
    uname = event['username']
    cipherText =  event['cipher']
    userTable = dynamodb.Table('userDetails')
    msg = ""
    myTable =  userTable.scan(
        FilterExpression=Attr('userID').eq(uname)
        )
    uInfo = myTable['Items']
    return verifyUser
#verify user code
def verifyUser(uInfo, uname, cipherText):
    for item in uInfo:
        if item['userID']== uname:
            if item['cipher'] == cipherText:
                msg = 'User Verified'
            else:
                msg = 'User Not Verified'
   
    result = [{'message':msg}]
    return {
        'statusCode':200 ,
        'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
        'body':json.dumps(result)
    }
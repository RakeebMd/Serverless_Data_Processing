# References:
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item

import json
import random
import boto3
def lambda_handler(event, context):
    if (event):
        print(event)
        ranInt = random.randint(10, 10000)
        dyndb = boto3.resource('dynamodb')
        data= event
        revAdd = data['ratings']
        uname=data['username']
        fid=data['foodId']
        reviewRate = dyndb.Table("ratings")
        return addToDyn(revAdd,reviewRate,ranInt,uname,revAdd,fid)
# add reviews to dynamo
def addToDyn(revAdd,reviewRate,ranInt,uname,fid):
  if(len(revAdd)!=0):
            reviewRate.put_item(
                Item={
                  'id':str(ranInt),    
                  'userName' :uname,
                  'review':revAdd,
                  'foodId':fid
                })
  return {
            'statusCode': 200,
            'body': json.dumps('Rating addded')
        }
  
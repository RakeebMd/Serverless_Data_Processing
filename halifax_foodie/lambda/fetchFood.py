# References:
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item

import boto3
import json
def lambda_handler(event, context):
    if (event):
        dyndb = boto3.resource('dynamodb')
        fTable = dyndb.Table("Food")
        listFood = []
        foodtablelist = fTable.scan()        
        fooditems = foodtablelist['Items']
        return returnFromDynamo(fooditems,listFood)
        
# return food list from dynamo
def returnFromDynamo(fooditems,listFood):
    for fitem in fooditems:
            id = fitem['foodId']
            cost=fitem['price']
            food = {
                "foodName": fitem['name'],
                "foodId":str(id),
                "price":str(cost),
                "ingredient":fitem['ingredient']
            }
            
            listFood.append(food)
                
    result = [{'food':listFood}]
    return {
            'statusCode':200 ,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                },
            'body':json.dumps(result)
            }
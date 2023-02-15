# References
# https://origin.geeksforgeeks.org/columnar-transposition-cipher/
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item

import json
import math
import boto3

dynamodb = boto3.resource('dynamodb')
# cipher generated for signup
def generateCipher(inputKey,plaintxt):
    ciphText = ""
    ind = 0
    length = float(len(plaintxt))
    lstPlaintxt = list(plaintxt)
    lstKey = sorted(list(inputKey))
    column = len(inputKey)    
    rowCal = int(math.ceil(length / column))
    nullFill = int((rowCal * column) - length)
    lstPlaintxt.extend('_' * nullFill)
    matx = [lstPlaintxt[i: i + column]
            for i in range(0, len(lstPlaintxt), column)]
    for _ in range(column):
        currentInd = inputKey.index(lstKey[ind])
        ciphText += ''.join([row[currentInd]
                        for row in matx])
        ind += 1
    return ciphText


def lambda_handler(event, context):
    userTable = dynamodb.Table('userDetails')
    evnt = event
    generatedCipher = generateCipher(evnt['key'],evnt['plainText'])
    return addToDynaAndReturnCipher(userTable,evnt,generatedCipher)
#add cipher to dynamo
def addToDynaAndReturnCipher(userTable,evnt,generatedCipher):
    userTable.put_item(Item=
    {
        'userID': evnt['userName'],
        'userName': evnt['userName'],
        'email': evnt['email'],
        'role': evnt['role'],
        'userkey': evnt['key'],
        'plainText': evnt['plainText'],
        'cipher': generatedCipher
        
    })
    return {
        'statusCode': 200,
        'body':generatedCipher,
    }
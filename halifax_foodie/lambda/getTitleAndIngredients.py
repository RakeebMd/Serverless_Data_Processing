# References:
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Table.scan
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item
# https://docs.python.org/3/library/difflib.html#sequencematcher-examples
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/comprehend.html#Comprehend.Client.detect_entities
# https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/comprehend.html#Comprehend.Client.detect_key_phrases

import json
import boto3
import re
from boto3.dynamodb.conditions import Attr
from difflib import SequenceMatcher

dyndb = boto3.resource('dynamodb')
comprehend = boto3.client('comprehend')
#get recipe name 
def getRecipeName(entities):
    RecName = 'Recipe Title'
    for i in range(len(entities['Entities'])):
        if entities['Entities'][i]['Type'] == 'TITLE':
            RecName = entities['Entities'][i]['Text']
        else:
            continue
    return RecName
#extract ingredients   
def getRecipeIngredients(keyPhrases):
    ingredientDictionary=[]
    startIndex=0
    endIndex=0
    for i in range(len(keyPhrases['KeyPhrases'])):
        if 'Ingredients' in keyPhrases['KeyPhrases'][i]['Text']:
            startIndex = keyPhrases['KeyPhrases'][i]['BeginOffset']
        elif 'Process' in keyPhrases['KeyPhrases'][i]['Text']:
            endIndex = keyPhrases['KeyPhrases'][i]['BeginOffset']

    for i in range(len(keyPhrases['KeyPhrases'])):
        if keyPhrases['KeyPhrases'][i]['BeginOffset'] > startIndex and keyPhrases['KeyPhrases'][i]['BeginOffset']< endIndex:
            value1 = keyPhrases['KeyPhrases'][i]['Text']
            replaceVal = value1.replace('\\r\\n','')
            ingredientDictionary.append(replaceVal)
    return ingredientDictionary
#Insert data in dynamo
def insertIntoTable(recName,ingreds,timeCreated):
    recipeTble = dyndb.Table('recipes')
    recipeTble.put_item(Item=
    {
        'title': recName,
        'ingredients': ingreds,
        'createdTime':timeCreated
    })
#check similarity
def similarCheck(oldRecipes,recipeNew):
    return SequenceMatcher(None, oldRecipes,recipeNew).ratio()>0.50

def lambda_handler(event, context):
    bucket = boto3.client('s3')
    bucket = 'ownrecipes'
    bucketKey = '/tmp/' +event['filename']
    f = bucket.get_object(Bucket = bucket , Key =bucketKey )
    fileCont = str(f['Body'].read())
    recTable = dyndb.Table('recipes')
    recSimilar = []

    ent = comprehend.detect_entities(Text = fileCont , LanguageCode ='en')
    keyPhrses = comprehend.detect_key_phrases(Text = fileCont , LanguageCode = 'en')
    synt = comprehend.detect_syntax(Text = fileCont, LanguageCode = 'en')
    
    recName = getRecipeName(ent)
    recIngred = getRecipeIngredients(keyPhrses)

    insertIntoTable(recName,recIngred,event['createdTime'])
    
    # Check similarity scores 
    res = recTable.scan()

    for i in res['Items']:
        if((similarCheck(i['ingredients'], recIngred)) and (i['title'] != recName)):
            recSimilar.append(i['title'])
    result= [{'title':recName,'ingredients':recIngred,'similarRecipies':recSimilar}];
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
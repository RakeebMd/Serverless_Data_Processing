//Reference - https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/#creating-an-item-in-dynamodb-from-lambda
const awsAdd = require("aws-sdk");
const dbClinet = new awsAdd.DynamoDB.DocumentClient();

//Reference - https://www.fernandomc.com/posts/eight-examples-of-fetching-data-from-dynamodb-with-node/
async function verifyAndRaturnToLex(uid, oid) {
  try {
    const para = {
      TableName: "userOrder",
    };
    const userOrderTable = await dbClinet.scan(para).promise();
    const userOrderItems = userOrderTable.Items;
    for (let i = 0; i < userOrderItems.length; i++) {
      if (userOrderItems[i].userName == uid) {
        if (userOrderItems[i].orderId == oid) {
          return {
            sessionAttributes: {
              user_id: uid,
              order_id: oid,
            },
            dialogAction: {
              type: "ElicitSlot",
              intentName: "AddRating",
              slots: { user_id: uid, order_id: oid, rating: "" },
              slotToElicit: "rating",
              message: {
                contentType: "PlainText",
                content: "Registered user! Give rating.",
              },
            },
          };
        }
      }
    }
    return {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Failed",
        message: {
          contentType: "PlainText",
          content: "Invalid User ID, please try again",
        },
      },
    };
  } catch (err) {}
}
//Reference: https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html#using-lambda-response-format
exports.handler = async (event, context) => {
  const uid = event.currentIntent.slots.user_id;
  const oid = event.currentIntent.slots.order_id;
  const data = await verifyAndRaturnToLex(uid, oid);
  return data;
};

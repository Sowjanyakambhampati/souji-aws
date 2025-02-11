const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const response = (statusCode, data) => ({
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});

exports.handler = async (event) => {
    const { name, value } = JSON.parse(event.body);

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        UpdateExpression: "SET #name = :name, #value = :value",
        ExpressionAttributeNames: {
            "#name": "name",
            "#value": "value"
        },
        ExpressionAttributeValues: {
            ":name": name,
            ":value": value
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const result = await dynamoDb.update(params).promise();
        return response(200, { message: "Item updated successfully", item: result.Attributes });
    } catch (error) {
        console.log(error);
        return response(500, { error: "Could not update the item." });
    }
};

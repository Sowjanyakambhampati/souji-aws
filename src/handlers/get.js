const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const response = (statusCode, data) => ({
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});

exports.handler = async (event) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    try {
        const result = await dynamoDb.get(params).promise();
        if (result.Item) {
            return response(200, result.Item);
        } else {
            return response(404, { error: "Item not found." });
        }
    } catch (error) {
        console.log(error);
        return response(500, { error: "Could not fetch the item." });
    }
};

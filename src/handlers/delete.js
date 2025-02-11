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
        }
    };

    try {
        await dynamoDb.delete(params).promise();
        return response(200, { message: "Item deleted successfully" });
    } catch (error) {
        console.log(error);
        return response(500, { error: "Could not delete the item." });
    }
};

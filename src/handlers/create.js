const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const response = (statusCode, data) => ({
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});

exports.handler = async (event) => {
    const { id, name, value } = JSON.parse(event.body);

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: {
            id,  // Unique ID
            name,
            value,
            createdAt: new Date().toISOString()
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return response(201, { message: "Item created successfully", item: params.Item });
    } catch (error) {
        console.log(error);
        return response(500, { error: "Could not create the item." });
    }
};

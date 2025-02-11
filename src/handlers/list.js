const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const response = (statusCode, data) => ({
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
});

exports.handler = async () => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE
    };

    try {
        const result = await dynamoDb.scan(params).promise();
        return response(200, { items: result.Items });
    } catch (error) {
        console.error("Error fetching items:", error);
        return response(500, { error: "Could not fetch items." });
    }
};

const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
// Removed DynamoDB imports

const ssmClient = new SSMClient({ region: 'us-east-2' });

async function getOpenAIKey() {
  const command = new GetParametersCommand({
    Names: ['integraled/central/OpenAI_API_Key'],
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);
  return response.Parameters[0].Value;
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', // For testing purposes; change to your domain in production
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    if (event && event.requestContext && event.requestContext.http) {
      const method = event.httpMethod || event.requestContext.http.method;

      if (method === 'OPTIONS') {
        // Handle CORS preflight request
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'CORS preflight response' }),
        };
      }

      if (method !== 'POST') {
        // Method Not Allowed
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
      }

      // Retrieve the OpenAI API Key
      const openAIKey = await getOpenAIKey();

      // Configure OpenAI API client
      const configuration = new Configuration({
        apiKey: openAIKey,
      });
      const openai = new OpenAIApi(configuration);

      // Handle POST request
      // Your existing POST handling code

      const responseData = {
        message: "Lambda function executed successfully",
        data: "Your response data here"
      };

      console.log("Event:", JSON.stringify(event, null, 2));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(responseData),
      };
    } else {
      // Handle the case where properties are missing
      console.error("Missing requestContext or http properties in event");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Bad Request" }),
      };
    }
  } catch (error) {
    console.error('Error processing request:', error);

    // Internal server error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}; 
const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const { Configuration, OpenAIApi } = require('openai');

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
    'Access-Control-Allow-Origin': '*', // For testing purposes; change for production
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

      // Parse the request body
      const requestBody = JSON.parse(event.body);
      const { User_ID, Assistant_ID, Org_ID, message, Thread_ID } = requestBody;

      // Retrieve the OpenAI API Key
      const openAIKey = await getOpenAIKey();
      if (!openAIKey) {
        throw new Error("Failed to retrieve OpenAI API Key");
      }

      // Configure OpenAI API client
      const configuration = new Configuration({
        apiKey: openAIKey,
      });
      const openai = new OpenAIApi(configuration);

      // Call the OpenAI API
      const openaiResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 150,
        temperature: 0.7,
      });

      const assistantResponse = openaiResponse.data.choices[0].text.trim();

      // Prepare the response data
      const responseData = {
        response: assistantResponse,
      };

      // Return the response
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
        body: JSON.stringify({ error: "Bad Request: Missing event properties" }),
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
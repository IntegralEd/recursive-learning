const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
// Removed DynamoDB imports

// Initialize AWS SSM client
const ssmClient = new SSMClient({ region: 'us-east-2' });

// Function to get OpenAI API Key from SSM Parameter Store
async function getOpenAIKey() {
  const command = new GetParametersCommand({
    Names: ['integraled/central/OpenAI_API_Key'],
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);
  return response.Parameters[0].Value;
}

exports.handler = async (event, context) => {
  console.log('Lambda function started');
  console.log('Event:', JSON.stringify(event, null, 2));

  const headers = {
    'Access-Control-Allow-Origin': '*', // Adjust as needed for production
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const method = event.httpMethod || event.requestContext.http.method;
    console.log('HTTP Method:', method);

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
    console.log('Parsing request body');
    const requestBody = JSON.parse(event.body);
    console.log('Request Body:', requestBody);

    const { User_ID, Assistant_ID, Org_ID, message, Thread_ID } = requestBody;

    // Retrieve the OpenAI API Key
    console.log('Retrieving OpenAI API Key');
    const openAIKey = await getOpenAIKey();
    if (!openAIKey) {
      throw new Error('Failed to retrieve OpenAI API Key');
    }
    console.log('OpenAI API Key retrieved');

    // Configure OpenAI API client
    console.log('Configuring OpenAI API client');
    const configuration = new Configuration({
      apiKey: openAIKey,
    });
    const openai = new OpenAIApi(configuration);

    // Call the OpenAI API
    console.log('Calling OpenAI API');
    const openaiResponse = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: message,
      max_tokens: 150,
      temperature: 0.7,
    });
    console.log('OpenAI API response received');

    const assistantResponse = openaiResponse.data.choices[0].text.trim();
    console.log('Assistant Response:', assistantResponse);

    // Prepare the response data
    const responseData = {
      response: assistantResponse,
    };
    console.log('Response Data:', responseData);

    // Return the response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    console.error('Error processing request:', error);

    // Internal server error response
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 
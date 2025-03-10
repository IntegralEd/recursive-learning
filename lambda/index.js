const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');
// const Airtable = require('airtable'); // Uncomment if Airtable is used

// Initialize the SSM client
const ssmClient = new SSMClient({ region: 'us-east-2' });

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://integraled.github.io',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const method = event.requestContext.http.method;

    if (method !== 'POST') {
      // Method Not Allowed
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the request body
    const body = JSON.parse(event.body);
    const { messages } = body;

    if (!messages) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing messages in request body' }),
      };
    }

    // Fetch parameters from SSM
    const command = new GetParametersCommand({
      Names: ['OPENAI_API_KEY'],
      WithDecryption: true,
    });
    const response = await ssmClient.send(command);
    const OPENAI_API_KEY = response.Parameters.find(
      (p) => p.Name === 'OPENAI_API_KEY'
    )?.Value;

    if (!OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    // Make the API request to OpenAI
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Return the response from OpenAI
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(openaiResponse.data),
    };
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

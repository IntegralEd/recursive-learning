const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');
// Additional requires if needed

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://your-frontend-domain.com',
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

    // Handle POST request
    // Your existing POST handling code
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
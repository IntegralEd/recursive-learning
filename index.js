const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');
// Additional requires if needed

exports.handler = async (event) => {
  const method = event.requestContext.http.method;

  if (method === 'OPTIONS') {
    // Handle CORS preflight
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://your-frontend-domain.com', // Replace with your domain
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  } else if (method === 'POST') {
    // Handle POST request
    // Your existing POST handling code
  } else if (method === 'GET') {
    // Handle GET request (if applicable)
    // Your existing GET handling code
  } else {
    // Method Not Allowed
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': 'https://your-frontend-domain.com',
      },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }
}; 
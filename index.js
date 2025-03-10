const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');
// Additional requires if needed

exports.handler = async (event) => {
  // Your actual Lambda function logic
  // ...

  // For debugging purposes, you can log the event
  console.log('Event:', JSON.stringify(event, null, 2));

  // Your response
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' }),
  };

  return response;
}; 
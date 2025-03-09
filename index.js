exports.handler = async (event) => {
  // Your Lambda function code

  // For debugging purposes, you can log the event
  console.log('Event:', JSON.stringify(event, null, 2));

  // Your response
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello from Lambda!' }),
  };

  return response;
}; 
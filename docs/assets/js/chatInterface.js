// Existing code...

// Construct URL with updated parameters
const params = new URLSearchParams({
  User_ID: userId,
  Org_ID: orgId,
  Thread_ID: threadId,
  Source: 'chat',
  Action_ID: actionId,
});

const LAMBDA_URL = 'https://your-lambda-url.amazonaws.com/?' + params.toString();

// Existing code... 
function initializeChat(config, variables) {
  // Destructure necessary values
  const { Org_ID, clientID, actionID } = config;

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('User_ID') || 'anonymous';
  const threadId = localStorage.getItem(`chat_thread_${userId}`);
  const source = urlParams.get('Source') || 'chat';

  // Construct Lambda URL with query parameters
  const params = new URLSearchParams({
    User_ID: userId,
    Org_ID: Org_ID,
    Thread_ID: threadId || '',
    Source: source,
    Action_ID: actionID,
  });

  const LAMBDA_URL = `https://your-lambda-endpoint.amazonaws.com/?${params.toString()}`;

  // Initialize chat interface
  // ... Rest of the chat initialization code
}

export { initializeChat }; 
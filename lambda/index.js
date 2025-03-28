const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const OpenAI = require('openai');

let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

// Initialize AWS SSM client
const ssmClient = new SSMClient({ region: 'us-east-2' });

// Function to get OpenAI API Key from SSM Parameter Store
async function getOpenAIKey() {
  const command = new GetParametersCommand({
    Names: ['IE-OpenAI-API'],
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);
  if (!response.Parameters.length) throw new Error('OpenAI API Key missing from SSM');
  return response.Parameters[0].Value;
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body);
    const { message, threadId, assistantId } = body;

    if (!assistantId) {
      throw new Error('Assistant ID must be provided in the request body');
    }

    const openAIKey = await getOpenAIKey();
    const openai = new OpenAI({ apiKey: openAIKey });

    let currentThreadId = threadId || (await openai.beta.threads.create()).id;

    await openai.beta.threads.messages.create(currentThreadId, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: assistantId,
    });

    let runStatus;
    do {
      await new Promise(res => setTimeout(res, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
    } while (runStatus.status !== 'completed');

    const messages = await openai.beta.threads.messages.list(currentThreadId);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: assistantMessage.content[0].text.value,
        Thread_ID: currentThreadId,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

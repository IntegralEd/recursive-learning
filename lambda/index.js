const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const OpenAI = require('openai');
// const fetch = require('node-fetch');

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

// Function to get Assistant ID from SSM Parameter Store
// async function getAssistantID() {
//   const command = new GetParametersCommand({
//     Names: ['integraled/bmore/OpenAI_Assistant_ID'],
//     WithDecryption: true,
//   });

//   try {
//     const response = await ssmClient.send(command);
//     console.log('SSM Response for Assistant ID:', JSON.stringify(response, null, 2));

//     if (!response.Parameters || response.Parameters.length === 0) {
//       throw new Error('Assistant ID not found in SSM Parameter Store');
//     }

//     return response.Parameters[0].Value;
//   } catch (error) {
//     console.error('Error retrieving Assistant ID:', error);
//     throw new Error('Error retrieving Assistant ID');
//   }
// }

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
    const { message, Thread_ID } = body;

    const openAIKey = await getOpenAIKey();
    const openai = new OpenAI({ apiKey: openAIKey });

    let threadId = Thread_ID;

    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: 'asst_IA5PsJxdShVPTAv2xeXTr4Ma',
    });

    let runStatus;
    do {
      await new Promise(res => setTimeout(res, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    } while (runStatus.status !== 'completed');

    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: assistantMessage.content[0].text.value,
        Thread_ID: threadId,
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
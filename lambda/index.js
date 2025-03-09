const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');

// Initialize the SSM client
const ssmClient = new SSMClient({ region: 'us-east-2' });

exports.handler = async (event) => {
  console.log('🔄 Received event:', JSON.stringify(event, null, 2));

  // Default message to start a new chat session
  const userMessage = 'Start a new chat session with Bmore RAG chat assistant';

  try {
    // Retrieve parameters from SSM
    const params = {
      Names: [
        'arn:aws:ssm:us-east-2:559050208320:parameter/integraled/central/OpenAI_API_Key',
        'arn:aws:ssm:us-east-2:559050208320:parameter/integraled/bmore/OpenAI_Assistant_ID'
      ],
      WithDecryption: true,
    };

    const command = new GetParametersCommand(params);
    const response = await ssmClient.send(command);

    const { Parameters } = response;
    const OpenAI_API = Parameters.find(p => p.Name.includes('OpenAI_API_Key')).Value;
    const OpenAI_Assistant_ID = Parameters.find(p => p.Name.includes('OpenAI_Assistant_ID')).Value;

    // Make the API request to OpenAI
    const openAIResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        assistant_id: OpenAI_Assistant_ID,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OpenAI_API}`,
        },
      }
    );

    // Process the response
    const responseBody = {
      response: openAIResponse.data.choices[0].message.content.trim(),
    };

    // Return the response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://integraled.github.io",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify(responseBody),
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};

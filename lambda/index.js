const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');
const Airtable = require('airtable');

// Initialize the SSM client
const ssmClient = new SSMClient({ region: 'us-east-2' });

const allowedOrigins = [
  'https://bmore.softr.app',
  'https://integral-mothership.softr.app',
  'http://localhost:3000',
  'https://integraled.github.io',
];

exports.handler = async (event) => {
  console.log('🔄 Received event:', JSON.stringify(event, null, 2));

  const origin = event.headers.origin;
  const allowOrigin = allowedOrigins.includes(origin) ? origin : 'https://bmore.softr.app';

  // Handling OPTIONS requests
  if (event.requestContext.http.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: '',
    };
  }

  try {
    // Retrieve parameters from SSM
    const params = {
      Names: [
        '/integraled/central/OpenAI_API_Key',
        '/integraled/central/IE_Business_Assistant_ID', // IE Business Assistant ID
        '/integraled/airtable/Table_ID',                // Airtable Table ID
        // Airtable API Key and Base ID are still fetched for future use
        '/integraled/airtable/API_Key',
        '/integraled/airtable/Base_ID',
      ],
      WithDecryption: true,
    };

    const command = new GetParametersCommand(params);
    const response = await ssmClient.send(command);

    const { Parameters } = response;
    const OpenAI_API = Parameters.find(p => p.Name.includes('OpenAI_API_Key')).Value;
    const IE_Business_Assistant_ID = Parameters.find(p => p.Name.includes('IE_Business_Assistant_ID')).Value;
    const Airtable_API_Key = Parameters.find(p => p.Name.includes('airtable/API_Key')).Value;
    const Airtable_Base_ID = Parameters.find(p => p.Name.includes('airtable/Base_ID')).Value;
    const Airtable_Table_ID = Parameters.find(p => p.Name.includes('airtable/Table_ID')).Value;

    // Initialize Airtable client (not used in code but included)
    Airtable.configure({
      apiKey: Airtable_API_Key,
    });
    // const base = Airtable.base(Airtable_Base_ID);
    // const table = base(Airtable_Table_ID);

    // Extract user message from event
    const eventBody = event.body ? JSON.parse(event.body) : {};
    const userMessage = eventBody.message || 'Start a new chat session';

    // (Airtable code removed for MVP)

    // Make the API request to OpenAI
    const openAIResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        // Use the IE Business Assistant ID
        assistant_id: IE_Business_Assistant_ID,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OpenAI_API}`,
        },
      }
    );

    // Process the assistant's response
    const assistantMessage = openAIResponse.data.choices[0].message.content.trim();

    // (Airtable code removed for MVP)

    // Prepare the response body
    const responseBody = {
      response: assistantMessage,
    };

    // Return the response with CORS headers
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
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

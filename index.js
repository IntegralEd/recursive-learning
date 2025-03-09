// const AWS = require('aws-sdk'); // Remove this line if present

// Import the necessary AWS SDK v3 clients
const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const axios = require('axios');

// Initialize the SSM client
const ssmClient = new SSMClient({ region: 'us-east-2' });

// Parameter ARNs in SSM Parameter Store
const PARAMETER_ARNS = {
  OPENAI_API_KEY: 'arn:aws:ssm:us-east-2:559050208320:parameter/integraled/central/OpenAI_API_Key',
  BUSINESS_ANALYST_ASSISTANT_ID: 'arn:aws:ssm:us-east-2:559050208320:parameter/integraled/central/OpenAI_Assistant_ID',
  BHB_ASSISTANT_ID: 'arn:aws:ssm:us-east-2:559050208320:parameter/integraled/bmore/OpenAI_Assistant_ID',
  IE_CENTRAL_ASSISTANT_ID: 'arn:aws:ssm:us-east-2:559050208320:parameter/integraled/central/IE_Central_OpenAI_Assistant_ID',
};

exports.handler = async (event) => {
  console.log('🔄 Received event:', JSON.stringify(event, null, 2));

  // Parse the body
  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (parseError) {
    console.error('❌ Error parsing event body:', parseError);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const userMessage = body.message || 'Hello';

  // Determine the assistant type (e.g., 'ie_central', 'bhb', etc.)
  const assistantType = body.assistantType || 'ie_central'; // Default to 'ie_central' if not specified

  try {
    // Retrieve parameters from SSM
    const params = {
      Names: [
        '/path/to/OpenAI_API',
        `/path/to/${assistantType}_Assistant_ID`,
      ],
      WithDecryption: true,
    };

    const command = new GetParametersCommand(params);
    const response = await ssmClient.send(command);

    const { Parameters } = response;

    // Extract parameter values
    const OpenAI_API = Parameters.find(p => p.Name.endsWith('OpenAI_API')).Value;
    const OpenAI_Assistant_ID = Parameters.find(p => p.Name.endsWith(`${assistantType}_Assistant_ID`)).Value;

    // Make the API request to OpenAI
    const openAIResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OpenAI_API}`,
        },
      }
    );

    // Return response to client
    return {
      statusCode: 200,
      body: JSON.stringify(openAIResponse.data),
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

async function getOpenAIParameters(assistantType) {
  // Determine the assistant ID parameter ARN based on assistant type
  let assistantIdArn;
  if (assistantType === 'ie_central') {
    assistantIdArn = PARAMETER_ARNS.IE_CENTRAL_ASSISTANT_ID;
  } else if (assistantType === 'bhb') {
    assistantIdArn = PARAMETER_ARNS.BHB_ASSISTANT_ID;
  } else {
    // Fallback to Business Analyst assistant for unknown assistant types
    assistantIdArn = PARAMETER_ARNS.BUSINESS_ANALYST_ASSISTANT_ID;
    console.warn(`Unknown assistant type: '${assistantType}'. Falling back to Business Analyst assistant.`);
  }

  // Fetch the OpenAI API key and assistant ID from SSM
  const params = {
    Names: [PARAMETER_ARNS.OPENAI_API_KEY, assistantIdArn],
    WithDecryption: true,
  };

  const command = new GetParametersCommand(params);
  const response = await ssmClient.send(command);
  const parameters = {};

  for (const param of response.Parameters) {
    switch (param.ARN) {
      case PARAMETER_ARNS.OPENAI_API_KEY:
        parameters.openaiApiKey = param.Value;
        break;
      case assistantIdArn:
        parameters.assistantId = param.Value;
        break;
      default:
        break;
    }
  }

  // Validate that the essential parameters are retrieved
  if (!parameters.openaiApiKey) {
    throw new Error('Failed to retrieve OpenAI API key from SSM Parameter Store.');
  }
  if (!parameters.assistantId) {
    throw new Error('Failed to retrieve OpenAI Assistant ID from SSM Parameter Store.');
  }

  return parameters;
}

function getOpenAIResponse(message, apiKey, assistantId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo', // Replace with your desired model
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      // Include the assistant ID
      assistant_id: assistantId,
    });

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(data),
    };

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: headers,
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const responseJson = JSON.parse(responseData);
          const assistantMessage = responseJson.choices[0].message.content.trim();
          resolve(assistantMessage);
        } else {
          console.error(`❌ OpenAI API error: ${res.statusCode} ${res.statusMessage}`);
          console.error('Response body:', responseData);
          reject(new Error(`OpenAI API error: ${res.statusCode} ${res.statusMessage}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Request error:', e);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}
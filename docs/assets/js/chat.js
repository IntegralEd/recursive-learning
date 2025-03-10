function initializeChat(client, context) {
    // Display loading message
    displayMessage('Initializing chat, please wait...');

    // Determine webhook type based on client
    let webhookType = '';

    if (client === 'IECentral') {
        webhookType = 'businessAnalyst';
    } else if (client === 'BHB') {
        webhookType = 'generalRouting';
    } else {
        webhookType = 'generalRouting';
    }

    // Assemble data to send to webhook
    const requestData = {
        User_ID: context.User_ID || 'anonymous',
        Org_ID: context.Org_ID || client,
        Thread_ID: context.Thread_ID || null,
        Source: context.Source || 'unknown',
        Action_ID: context.Action_ID || null
    };

    // Send data to webhook and initialize chat after response
    sendDataToWebhook(webhookType, requestData)
        .then(responseData => {
            // Update context
            context = { ...context, ...responseData };

            // Initialize chat with updated context
            if (client === 'IECentral') {
                initializeBusinessAnalystChat(context);
            } else if (client === 'BHB') {
                initializeRAGChat(context);
            } else {
                initializeGenericChat(context);
            }
        })
        .catch(error => {
            console.error('Error initializing chat:', error);
            displayMessage('An error occurred while initializing the chat. Please try again later.');
        });
}

function initializeBusinessAnalystChat(context) {
    const chatContainer = document.getElementById('chat-container');

    // Use context data (including Thread_ID) to load chat interface
    displayMessage('Welcome to the Business Analyst Support Chat.');

    // Proceed with chat logic using the updated context
    startBusinessAnalystChatSession(context);
}

function promptUserForInput(promptMessage) {
    return new Promise((resolve) => {
        if (promptMessage) {
            displayMessage(promptMessage);
        }
        const inputField = createInputField();
        inputField.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const userInput = inputField.value.trim();
                if (userInput) {
                    displayUserMessage(userInput);
                    inputField.disabled = true;
                    resolve(userInput);
                }
            }
        });
    });
}

async function initializeRAGChat(context) {
    const chatContainer = document.getElementById('chat-container');

    // Use context data (including Thread_ID) to load chat interface
    displayMessage('Welcome to the RAG Assistant.');

    // Proceed with chat logic using the updated context
    startRAGChatSession(context);
}

function initializeGenericChat(context) {
    // Fallback chat initialization
}

function sendXAPIStatement(statementData) {
    const xapiStatement = {
        actor: {
            account: {
                name: statementData.user_ID,
                homePage: 'http://yourdomain.com'
            }
        },
        verb: {
            id: 'http://adlnet.gov/expapi/verbs/interacted',
            display: { 'en-US': 'interacted' }
        },
        object: {
            id: `http://yourdomain.com/actions/${statementData.action_ID}`,
            definition: {
                name: { 'en-US': `Action ${statementData.action_ID}` },
                description: { 'en-US': 'User interacted with the action.' }
            }
        },
        timestamp: statementData.timestamp
    };

    // Send the xAPI statement to LRS
    fetch('https://your.lrs.endpoint.com/xapi/statements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('yourUsername:yourPassword') // Replace with your auth
        },
        body: JSON.stringify(xapiStatement)
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send xAPI statement:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error sending xAPI statement:', error);
    });
}

function shouldIdentifyUser(userInput) {
    const keywords = ['save account', 'remember me', 'user id', 'login', 'sign in'];
    return keywords.some(keyword => userInput.toLowerCase().includes(keyword));
}

function isBusinessAnalystRequest(userInput) {
    return userInput.toLowerCase().includes('iecentral-team');
}

async function collectBusinessAnalystVariables() {
    const variables = {};
    variables.URL = await promptUserForInput('Please provide the URL related to your request:');
    variables.purpose = await promptUserForInput('What is the purpose of your inquiry?');
    variables.points_of_contact = await promptUserForInput('Who are your points of contact in the program?');
    variables.resources_needed = await promptUserForInput('What resources do you need?');
    return variables;
}

function sendDataToWebhook(type, data) {
    let webhookURL = '';

    if (type === 'businessAnalyst') {
        // Business Analyst User Support Tickets
        webhookURL = 'https://hook.us1.make.com/huu6kvcj6t6eenynbx4t79c3wa8evfsg';
    } else {
        // General Routing for LRS Records (RAG Chat)
        webhookURL = 'https://hook.us1.make.com/htxuau2ru7kunf336ufjqmddlfentqvf';
    }

    const payload = {
        User_ID: data.User_ID || '-----',
        Org_ID: data.Org_ID || '-----',
        Thread_ID: data.Thread_ID || '-----',
        Source: data.Source || '-----',
        Action_ID: data.Action_ID || '-----',
    };

    return fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send data to webhook:', response.statusText);
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error sending data to webhook:', error);
        throw error;
    });
}

async function handleUserMessage(userInput) {
    // Basic implementation to decide if escalation is needed
    const escalationKeywords = ['help', 'issue', 'problem', 'support', 'agent', 'escalate'];

    if (escalationKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
        // Decide whether to escalate based on your logic
        // For simplicity, we'll return true to escalate
        return true;
    }

    // Continue the conversation
    displayMessage('Can you please provide more details?');

    // Return false to continue the chat without escalation
    return false;
}

async function startRAGChatSession(context) {
    // Use context.Thread_ID and other context data as needed
    // Chat logic for RAG Assistant

    // Example:
    displayMessage('How can I assist you today?');

    // Proceed with chat loop as needed
}

function startBusinessAnalystChatSession(context) {
    // Use context.Thread_ID and other context data as needed
    // Chat logic for Business Analyst Support

    // Example:
    displayMessage('You are now connected with a Business Analyst. How can we assist you?');

    // Proceed with chat loop as needed
}

function createIframe(context) {
    // Ensure userId is defined
    const userId = context.User_ID || 'anonymous';

    // Proceed with iframe creation using userId
    const iframe = document.createElement('iframe');
    iframe.src = `some_url?userId=${encodeURIComponent(userId)}`;
    // ... rest of your code ...
}

// Implement displayMessage, displayUserMessage, createInputField functions accordingly 

// Update the GITHUB_PAGES_URL constant if present
const GITHUB_PAGES_URL = 'https://integraled.github.io/recursive-learning/';

// ... rest of your code ... 

// Adjusting when to invoke the LRS endpoints
// Introduce a save/send trigger function

function saveConversation() {
    const contextData = {
        User_ID: context.User_ID || '-----',
        Org_ID: context.Org_ID || '-----',
        Thread_ID: context.Thread_ID || '-----',
        Source: context.Source || '-----',
        Action_ID: context.Action_ID || '-----',
    };

    // Determine the type of webhook based on context or user interaction
    const webhookType = determineWebhookType(); // Implement this function based on your logic

    sendDataToWebhook(webhookType, contextData)
        .then(responseData => {
            console.log('Conversation saved successfully:', responseData);
        })
        .catch(error => {
            console.error('Error saving conversation:', error);
        });
}

// Example triggers to save conversation
function onConversationEnd() {
    // Call this function when the conversation ends
    saveConversation();
}

function onUserSaysSave() {
    // Call this function when the user explicitly says 'save'
    saveConversation();
}

// Implement logic to invoke saveConversation based on user input or conversation flow
function handleUserMessage(userInput) {
    // Existing code to handle user message...

    // Check if the user wants to save the conversation
    if (userInput.trim().toLowerCase() === 'save') {
        onUserSaysSave();
    }

    // Existing code...
}

// Existing code... 

// Function to open the chat modal
function openChat() {
    // (Previous suggestion was incorrect)
    window.open('https://integral-mothership.softr.app/chat', '_blank');
} 
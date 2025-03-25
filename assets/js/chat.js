document.addEventListener('DOMContentLoaded', function() {
    initChatInterface({
        User_ID: "test_user",
        Assistant_ID: "asst_IA5PsJxdShVPTAv2xeXTr4Ma",
        Org_ID: "recjUGiOT65lwgBtm",
        Thread_ID: null
    });
});

function initChatInterface(config) {
    // Add thread persistence
    config.threadId = localStorage.getItem('threadId') || null;
    
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (!messagesDiv || !userInput || !sendButton) {
        console.error('Error: Required DOM elements not found');
        return;
    }

    // Display welcome message
    displayAssistantMessage('Hello! How can I assist you today?');

    // Send message on button click
    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message !== '') {
            sendMessage(message, config);
            userInput.value = '';
        }
    });

    // Send message on Enter key
    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    function sendMessage(message, config) {
        displayUserMessage(message);

        const payload = {
            User_ID: config.User_ID,
            Assistant_ID: config.Assistant_ID,
            Org_ID: config.Org_ID,
            message: message,
            threadId: config.threadId,  // Use threadId consistently
        };

        fetch('https://tixnmh1pe8.execute-api.us-east-2.amazonaws.com/prod/IntegralEd-Main', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.response) {
                displayAssistantMessage(data.response);
                // Persist threadId
                if (data.Thread_ID) {
                    config.threadId = data.Thread_ID;
                    localStorage.setItem('threadId', data.Thread_ID);
                }
            } else {
                displayAssistantMessage('Sorry, I did not understand that.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayAssistantMessage('An error occurred. Please try again later.');
        });
    }

    function displayUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user');
        messageElement.innerText = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function displayAssistantMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'assistant');
        messageElement.innerText = message;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
} 
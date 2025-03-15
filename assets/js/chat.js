function initChatInterface(config) {
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    // Display welcome message
    if (messagesDiv) {
        displayAssistantMessage('Hello! How can I assist you today?');
    } else {
        console.error('Error: messagesDiv not found');
    }

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
        if (messagesDiv) {
            displayUserMessage(message);
        } else {
            console.error('Error: messagesDiv not found');
        }

        const payload = {
            User_ID: config.User_ID,
            Assistant_ID: config.Assistant_ID,
            Org_ID: config.Org_ID,
            message: message,
            Thread_ID: config.Thread_ID,
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
        if (messagesDiv) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'user');
            messageElement.innerText = message;
            messagesDiv.appendChild(messageElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } else {
            console.error('Error: messagesDiv not found');
        }
    }

    function displayAssistantMessage(message) {
        if (messagesDiv) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'assistant');
            messageElement.innerText = message;
            messagesDiv.appendChild(messageElement);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } else {
            console.error('Error: messagesDiv not found');
        }
    }
} 
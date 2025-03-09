// BHB-specific min.js script
(function() {
    // Create and display the chat bubble
    const chatBubble = document.createElement('div');
    chatBubble.id = 'chat-bubble';
    chatBubble.style.position = 'fixed';
    chatBubble.style.bottom = '20px';
    chatBubble.style.right = '20px';
    chatBubble.style.width = '50px';
    chatBubble.style.height = '50px';
    chatBubble.style.backgroundColor = '#007bff';
    chatBubble.style.borderRadius = '50%';
    chatBubble.style.cursor = 'pointer';
    chatBubble.style.zIndex = '1000';
    document.body.appendChild(chatBubble);

    // Function to open the chat modal
    function openChat() {
        // For now, open a new tab with the Business Analyst assistant
        window.open('https://your-chat-url.com', '_blank');
    }

    // Add click event to the chat bubble
    chatBubble.addEventListener('click', openChat);
})(); 
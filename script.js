// Get DOM elements
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Function to append a message to the chat log
function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    chatLog.appendChild(messageElement);
}

// OpenAPI call to fetch the response
function openaiCall(userMessage, user) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    // Replace the OpenAPI key here
    const apiKey = 'YOUR_API_KEY';
    const openaiModel = "gpt-3.5-turbo";
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const conversationContext = {
        user: user,
        message: userMessage
    };
    const postBody = {
        model: openaiModel,
        messages: conversationContext
    }

    // Make a POST request to start the chat conversation
    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(postBody)
    })
        .then(response => response.json())
        .then(data => {
            // Process the response data
            console.log(data);
            const response = data.choice[0].message.content;
            appendMessage(response, 'chatbot');
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
            const response = "Thanks for asking the question, something went wrong. Call human assitance for help @123423242";
            appendMessage(response, 'chatbot');
        });
}

// Function to handle user input
function handleUserInput() {
    const message = userInput.value;
    const user = 'user';
    appendMessage(message, user);

    openaiCall(message, user);

    // Clear the user input field
    userInput.value = '';
}

// Event listener for the send button click event
sendBtn.addEventListener('click', handleUserInput);

// Event listener for the enter key press event
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Get DOM elements
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');


// Array to store user messages
const userMessages = [];

// Function to add a user message to the chat log
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'user-message');
    messageElement.innerHTML = `<span class="message-content">${message}</span>`;
    chatLog.appendChild(messageElement);
}

// Function to add a chatbot message to the chat log
function addChatbotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'chatbot-message');
    messageElement.innerHTML = `<span class="message-content">${message}</span>`;
    chatLog.appendChild(messageElement);
}


// OpenAPI call to fetch the response
function openaiCall(userMessage, user) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    // Replace the OpenAPI key here
    const apiKey = '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';
    const openaiModel = "gpt-3.5-turbo";
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };

    const conversationContext = userMessages.map((message) => ({
        role: user,
        content: message,
      }));

    const postBody = {
        model: openaiModel,
        messages: conversationContext
    };

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
            const response = data.choices[0].message.content;
            addChatbotMessage(response);
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
            const response = "Thanks for asking the question, something went wrong. Call human assitance for help @123423242";
            addChatbotMessage(response);
        });
}

// Event listener for the send button
sendBtn.addEventListener('click', handleUserInput);

// Event listener for the "keydown" event on the userInput
userInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    handleUserInput();
  }
});

function handleUserInput() {
  const userMessage = userInput.value.trim();
  const user = 'user';

  if (userMessage !== '') {
    userMessages.push(userMessage); // Add user message to the array
    addUserMessage(userMessage); // Display user message in the chat log
    openaiCall(userMessage, user); // Make the OpenAI API call
  }

  userInput.value = ''; // Clear the user input field
}

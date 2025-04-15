<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Translator</title>
    <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-image: url('https://www.w3schools.com/w3images/forestbridge.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        .chat-container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        .chat-box {
            flex-grow: 1;
            max-height: 400px;
            overflow-y: auto;
            margin-bottom: 10px;
        }
        .message-container {
            display: flex;
            flex-direction: column;
        }
        .message {
            max-width: 70%;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
            display: inline-block;
            word-wrap: break-word;
        }
        .message.left {
            background-color: #f1f1f1;
            align-self: flex-start;
        }
        .message.right {
            background-color: #38b2ac;
            color: white;
            align-self: flex-end;
        }
        .username-left {
            color: #2b6cb0;
        }
        .username-right {
            color: #fff;
        }
        .input-container {
            display: flex;
            align-items: center;
            padding: 10px;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 8px;
        }
        .input-container input {
            flex-grow: 1;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #ddd;
            margin-right: 10px;
        }
    </style>
</head>
<body>
    <div class="chat-container" id="start-screen">
        <h2 class="text-center text-2xl font-bold p-4">Chat with Translator</h2>
        <div class="text-center p-4">
            <input id="username" type="text" placeholder="Enter your name" class="border p-2 rounded-lg mb-4 w-1/2" />
            <button id="startChat" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Start Chat</button>
        </div>
    </div>

    <div class="chat-container" id="chat-screen" style="display: none;">
        <div id="chat-box" class="chat-box p-4 bg-gray-100 rounded-lg mb-4">
            <!-- Messages will appear here -->
        </div>

        <div class="input-container">
            <input id="message" type="text" placeholder="Type a message" class="border p-2 rounded-lg w-full" />
            <button id="sendMessage" class="bg-green-500 text-white px-4 py-2 ml-2 rounded-lg">Send</button>
        </div>
    </div>

    <script>
        const socket = io.connect('http://' + document.domain + ':' + location.port);
        let username = '';

        // Handle the start of the chat
        document.getElementById('startChat').onclick = function() {
            username = document.getElementById('username').value;
            if (username.trim() !== '') {
                document.getElementById('start-screen').style.display = 'none'; // Hide start screen
                document.getElementById('chat-screen').style.display = 'flex'; // Show chat screen
                socket.emit('join', username); // Inform the server about the new user
            }
        };

        // Handle sending messages
        document.getElementById('sendMessage').onclick = function() {
            const message = document.getElementById('message').value;
            if (message.trim() !== '') {
                socket.send({ message: message, sender: username });
                document.getElementById('message').value = ''; // clear input
            }
        };

        // Allow sending messages with Enter key
        document.getElementById('message').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                document.getElementById('sendMessage').click(); // Simulate button click when Enter is pressed
            }
        });

        // Listen for incoming messages and handle translations
        socket.on('message', function(data) {
            const messageContainer = document.getElementById('chat-box');
            const messageElement = document.createElement('div');
            const messageClass = (data.sender === username) ? 'right' : 'left';
            const usernameClass = (data.sender === username) ? 'username-right' : 'username-left';

            let translatedMessage = data.message; // Default to the original message

            // Perform translation automatically based on the language of the message
            if (data.language === 'vi') {
                translatedMessage = data.translatedMessage;
            } else if (data.language === 'my') {
                translatedMessage = data.translatedMessage;
            }

            messageElement.classList.add('message', messageClass);
            messageElement.innerHTML = `
                <span class="${usernameClass} font-bold">${data.sender}</span>
                <p>${data.message}</p>
                <p><i>${translatedMessage}</i></p> <!-- Show the translated message -->
            `;
            messageContainer.appendChild(messageElement);
            messageContainer.scrollTop = messageContainer.scrollHeight;  // Scroll to the bottom
        });
    </script>
</body>
</html>

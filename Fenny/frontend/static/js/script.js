// Updated event listener for the paperclip icon (file upload)
document.querySelector('.file-upload-icon').addEventListener('click', () => {
  document.getElementById('file-upload').click();
});

// script.js
import { getCurrentTime } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbot = document.getElementById('chatbot');
  const socialIcons = document.getElementById('social-icons');
  const messageInput = document.getElementById('message');
  const messageBox = document.getElementById('message-box');
  const maximizeBtn = document.getElementById('maximize-btn');
  const minimizeBtn = document.querySelector('.minimize-btn');
  const fileInput = document.getElementById('file-upload');
  const fileUploadDisplay = document.getElementById('file-upload-display');
  const fileNameDisplay = document.getElementById('file-name');
  const fileSizeDisplay = document.getElementById('file-size');
  const fileUploadProgress = document.getElementById('file-upload-progress');
  const progressPercentage = document.getElementById('progress-percentage');

  // Toggle chatbot visibility
  chatbotToggle.addEventListener('click', () => {
    chatbot.classList.toggle('collapsed');
    socialIcons.classList.toggle('visible', !chatbot.classList.contains('collapsed'));
  });

  // Minimize chatbot
  minimizeBtn.addEventListener('click', () => {
    chatbot.classList.toggle('collapsed');
    socialIcons.classList.remove('visible');
  });

  // Maximize chatbot
  maximizeBtn.addEventListener('click', () => {
    chatbot.classList.toggle('maximized');
    maximizeBtn.querySelector('i').classList.toggle('bx-plus', !chatbot.classList.contains('maximized'));
    maximizeBtn.querySelector('i').classList.toggle('bx-minus', chatbot.classList.contains('maximized'));
  });

  // Add a message to the chat
  function addMessage(text, className, isFile = false) {
    const div = document.createElement('div');
    div.classList.add('chat-message-div', className);

    // Add timestamp
    const timestamp = getCurrentTime();
    const timestampElement = document.createElement('div');
    timestampElement.classList.add('timestamp');
    timestampElement.textContent = timestamp;

    // Add message text or file icon
    const messageElement = document.createElement('div');
    if (isFile) {
      const fileIcon = document.createElement('i');
      fileIcon.classList.add('bx', 'bxs-file-pdf', 'pdf-icon');
      messageElement.appendChild(fileIcon);
      messageElement.appendChild(document.createTextNode(text));
    } else {
      messageElement.textContent = text;
    }

    div.appendChild(messageElement);
    div.appendChild(timestampElement);

    messageBox.appendChild(div);
    messageBox.scrollTop = messageBox.scrollHeight; // Scroll to the bottom
  }

  // Handle sending messages
  function send() {
    const message = messageInput.value.trim();

    // Handle file upload
    if (fileInput.files[0]) {
      const fileName = fileInput.files[0].name;
      addMessage(`${fileName}`, 'chat-message-sent', true); // Display file name with icon
      fileInput.value = ''; // Clear the file input
      fileUploadDisplay.classList.add('hidden'); // Hide file upload display
    }

    // Handle text messages
    if (message) {
      addMessage(message, 'chat-message-sent');

      // Send the message to the Flask server
      fetch('/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `message=${encodeURIComponent(message)}`,
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            addMessage(`Error: ${data.error}`, 'chat-message-received');
          } else {
            addMessage(data.bot_response, 'chat-message-received');
          }
        })
        .catch(error => {
          addMessage(`Error: ${error.message}`, 'chat-message-received');
        });

      messageInput.value = ''; // Clear the input field
    }
  }

  // Handle Enter key for sending messages
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      send(); // Send the message
    }
  });

  // Attach event listener to the Send button
  const sendButton = document.querySelector('.send-btn');
  sendButton.addEventListener('click', send);

  // Handle file uploads
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type and size
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      fileInput.value = ''; // Clear invalid file input
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      fileInput.value = ''; // Clear large file input
      return;
    }

    // Show the upload display and progress bar
    fileUploadDisplay.classList.remove('hidden');
    fileUploadProgress.classList.remove('hidden');
    fileUploadProgress.style.width = '0'; // Reset progress bar width
    progressPercentage.textContent = '0%';

    // Display file name and size
    fileNameDisplay.textContent = file.name;
    fileSizeDisplay.textContent = `${(file.size / 1024).toFixed(2)} KB`;

    // Simulate real-time upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10; // Increment progress
      fileUploadProgress.style.width = `${progress}%`;
      progressPercentage.textContent = `${progress}%`;

      if (progress >= 100) {
        clearInterval(progressInterval); // Stop the simulation
        progressPercentage.textContent = 'Completed!';
        setTimeout(() => {
          fileUploadProgress.classList.add('hidden'); // Hide progress bar
        }, 1000);
      }
    }, 300); // Adjust speed of progress
  });

  // Remove the selected file
  window.removeFile = function () {
    // Clear the file input
    fileInput.value = ''; // Reset the input value to clear the file

    // Hide the file upload display and progress bar
    fileUploadDisplay.classList.add('hidden');
    fileUploadProgress.classList.add('hidden');

    // Reset progress bar and percentage text
    fileUploadProgress.style.width = '0';
    progressPercentage.textContent = '0%';

    console.log('File removed successfully');
  };

  // Random color hover animation for currency icons
  function getRandomColor() {
    const colors = ['red', 'green', 'yellowgreen','darkred'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const icons = document.querySelectorAll('.currency-slide i');
  icons.forEach((icon) => {
    icon.addEventListener('mouseover', () => {
      const randomColor = getRandomColor();
      icon.style.setProperty('--random-hover-color', randomColor);
    });

    icon.addEventListener('mouseout', () => {
      icon.style.setProperty('--random-hover-color', '');
    });
  });
});

// Resize textarea based on content
document.getElementById('message').addEventListener('input', function () {
  this.style.height = 'auto'; // Reset height to auto
  this.style.height = Math.min(this.scrollHeight, 10) + 'px'; // Limit height to max-height
});
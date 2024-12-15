import { getCurrentTime } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element References
  const elements = {
    chatbotToggle: document.getElementById('chatbot-toggle'),
    chatbot: document.getElementById('chatbot'),
    socialIcons: document.getElementById('social-icons'),
    messageInput: document.getElementById('message'),
    messageBox: document.getElementById('message-box'),
    maximizeBtn: document.getElementById('maximize-btn'),
    minimizeBtn: document.querySelector('.minimize-btn'),
    fileInput: document.getElementById('file-upload'),
    fileUploadDisplay: document.getElementById('file-upload-display'),
    fileNameDisplay: document.getElementById('file-name'),
    fileSizeDisplay: document.getElementById('file-size'),
    fileUploadProgress: document.getElementById('file-upload-progress'),
    progressPercentage: document.getElementById('progress-percentage'),
    sendButton: document.querySelector('.send-btn'),
  };

  // Utility Functions
  const toggleClass = (element, className) => element.classList.toggle(className);
  const addClass = (element, className) => element.classList.add(className);
  const removeClass = (element, className) => element.classList.remove(className);

  const displayMessage = (text, className, isFile = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message-div', className);

    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    timestampDiv.textContent = getCurrentTime();

    const messageContent = document.createElement('div');
    if (isFile) {
      const fileIcon = document.createElement('i');
      fileIcon.classList.add('bx', 'bxs-file-pdf', 'pdf-icon');
      messageContent.appendChild(fileIcon);
    }
    messageContent.appendChild(document.createTextNode(text));

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(timestampDiv);

    elements.messageBox.appendChild(messageDiv);
    elements.messageBox.scrollTop = elements.messageBox.scrollHeight;
  };

  const handleFileValidation = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      return false;
    }
    return true;
  };

  const updateProgressBar = (progress) => {
    elements.fileUploadProgress.style.width = `${progress}%`;
    elements.progressPercentage.textContent = `${progress}%`;
  };

  const simulateFileUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      updateProgressBar(progress);
      if (progress >= 100) {
        clearInterval(interval);
        elements.progressPercentage.textContent = 'Completed!';
        setTimeout(() => addClass(elements.fileUploadProgress, 'hidden'), 1000);
      }
    }, 300);
  };

  // Function to remove the file from display
  const removeFile = () => {
    elements.fileInput.value = ''; // Clear the file input
    elements.fileNameDisplay.textContent = 'File Name'; // Reset file name display
    elements.fileSizeDisplay.textContent = 'File Size'; // Reset file size display
    addClass(elements.fileUploadDisplay, 'hidden'); // Hide the file upload display
  };

  // Event Handlers
  const toggleChatbotVisibility = () => {
    toggleClass(elements.chatbot, 'collapsed');
    toggleClass(elements.socialIcons, 'visible');
  };
  // Event Handlers
  elements.fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && handleFileValidation(file)) {
      elements.fileNameDisplay.textContent = file.name;
      elements.fileSizeDisplay.textContent = `${(file.size / 1024).toFixed(2)} KB`;
      addClass(elements.fileUploadDisplay, 'expanded'); // Show the file upload display
    }
  });


  const handleSendMessage = () => {
    const message = elements.messageInput.value.trim();

    // Handle file upload
    if (elements.fileInput.files[0]) {
      const file = elements.fileInput.files[0];
      if (handleFileValidation(file)) {
        displayMessage(file.name, 'chat-message-sent', true);
        elements.fileNameDisplay.textContent = file.name;
        elements.fileSizeDisplay.textContent = `${(file.size / 1024).toFixed(2)} KB`;
        simulateFileUpload();
      }
      elements.fileInput.value = '';
      addClass(elements.fileUploadDisplay, 'hidden');
    }

    // Handle text messages
    if (message) {
      displayMessage(message, 'chat-message-sent');
      elements.messageInput.value = '';
      resetTextareaHeight(); // Reset the textarea height


      // Simulate server communication
      fetch('/send_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `message=${encodeURIComponent(message)}`,
      })
        .then((response) => response.json())
        .then((data) => displayMessage(data.bot_response || 'No response', 'chat-message-received'))
        .catch((error) => displayMessage(`Error: ${error.message}`, 'chat-message-received'));
    }
  };

  // Attach Event Listeners
  elements.chatbotToggle.addEventListener('click', toggleChatbotVisibility);
  elements.minimizeBtn.addEventListener('click', () => toggleClass(elements.chatbot, 'collapsed'));
  elements.maximizeBtn.addEventListener('click', () => toggleClass(elements.chatbot, 'maximized'));
  elements.sendButton.addEventListener('click', handleSendMessage);
  elements.messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  elements.fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && handleFileValidation(file)) {
      elements.fileNameDisplay.textContent = file.name;
      elements.fileSizeDisplay.textContent = `${(file.size / 1024).toFixed(2)} KB`;
      removeClass(elements.fileUploadDisplay, 'hidden');
      simulateFileUpload();
    }
  });
  // Function to reset the textarea height to its default size
  const resetTextareaHeight = () => {
  elements.messageInput.style.height = '60px'; // Set the default height
  };

  // Add event listener for the remove file button
  const removeFileBtn = document.querySelector('.remove-file-btn');
  removeFileBtn.addEventListener('click', removeFile);

  // Utility Animations
  const currencyIcons = document.querySelectorAll('.currency-slide i');
  currencyIcons.forEach((icon) => {
    icon.addEventListener('mouseover', () => {
      icon.style.setProperty('--random-hover-color', ['red', 'green', 'yellowgreen', 'darkred'][Math.floor(Math.random() * 4)]);
    });
    icon.addEventListener('mouseout', () => {
      icon.style.setProperty('--random-hover-color', '');
    });
  });

  // Auto-resize message input
  elements.messageInput.addEventListener('input', () => {
    elements.messageInput.style.height = 'auto';  // Set the height to the scrollHeight, with a minimum of 40px and a maximum of 120px
    elements.messageInput.style.height = `${Math.min(Math.max(elements.messageInput.scrollHeight, 60), 80)}px`;
  });
});

// Function to reset the textarea height to its default size
const resetTextareaHeight = () => {
  elements.messageInput.style.height = '40px'; // Set the default height
};
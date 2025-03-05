// chatbot.js
import { getCurrentTime } from './utils.js';

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
  sendButton: document.querySelector('.send-btn'),
  wordCount: document.getElementById('word-count'),
  fileUploadSpinner: document.getElementById('file-upload-spinner'),
  removeFileBtn: document.querySelector('.remove-file-btn'),
};

// Utility Functions
const toggleClass = (element, className) => element.classList.toggle(className);
const addClass = (element, className) => element.classList.add(className);
const removeClass = (element, className) => element.classList.remove(className);

// Add this utility function at the top with other utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Function to count words in a string
const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

// Update the displayMessage function to include file size for file messages
const displayMessage = (text, className, isFile = false, fileSize = null) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message-div', className);

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');

  if (isFile) {
    const fileContainer = document.createElement('div');
    fileContainer.classList.add('file-info-chat');
    
    const fileIcon = document.createElement('i');
    fileIcon.classList.add('bx', 'bxs-file-pdf', 'pdf-icon');
    
    const fileInfoContent = document.createElement('div');
    fileInfoContent.classList.add('file-info-content');
    
    const fileName = document.createElement('div');
    fileName.classList.add('file-name-chat');
    fileName.textContent = text;
    
    const fileSizeElement = document.createElement('div');
    fileSizeElement.classList.add('file-size-chat');
    fileSizeElement.textContent = formatFileSize(fileSize);
    
    fileInfoContent.appendChild(fileName);
    fileInfoContent.appendChild(fileSizeElement);
    
    fileContainer.appendChild(fileIcon);
    fileContainer.appendChild(fileInfoContent);
    messageContent.appendChild(fileContainer);
  } else {
    messageContent.textContent = text;
  }

  const timestampDiv = document.createElement('div');
  timestampDiv.classList.add('timestamp');
  timestampDiv.textContent = getCurrentTime();

  messageDiv.appendChild(messageContent);
  messageDiv.appendChild(timestampDiv);

  elements.messageBox.appendChild(messageDiv);
  elements.messageBox.scrollTop = elements.messageBox.scrollHeight;
};

// Validate file upload
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

// Simulate file upload progress
const simulateFileUpload = () => {
  removeClass(elements.fileUploadSpinner, 'hidden'); // Show spinner

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (progress >= 100) {
      clearInterval(interval);
      addClass(elements.fileUploadSpinner, 'hidden'); // Hide spinner when done
    }
  }, 300);
};

// Update the handleFileUpload function
const handleFileUpload = (file) => {
  elements.fileNameDisplay.textContent = file.name;
  elements.fileSizeDisplay.textContent = formatFileSize(file.size);
  removeClass(elements.fileUploadDisplay, 'hidden');
  addClass(elements.fileUploadDisplay, 'expanded');
  simulateFileUpload();
};

// Remove uploaded file
const removeFile = () => {
  elements.fileInput.value = '';
  elements.fileNameDisplay.textContent = 'File Name';
  elements.fileSizeDisplay.textContent = 'File Size';
  addClass(elements.fileUploadDisplay, 'hidden');
  removeClass(elements.fileUploadDisplay, 'expanded');
};

// Update the handleSendMessage function to include file size
const handleSendMessage = () => {
  const message = elements.messageInput.value.trim();

  // Check word count
  const wordCount = countWords(message);
  if (wordCount > 100) {
    alert('Message exceeds 100 words. Please shorten your message.'); // Show alert
    return; // Stop execution if word count exceeds 100
  }

  // Handle file upload
  if (elements.fileInput.files[0]) {
    const file = elements.fileInput.files[0];
    if (handleFileValidation(file)) {
      displayMessage(file.name, 'chat-message-sent', true, file.size);
      handleFileUpload(file);
    }
    elements.fileInput.value = '';
    addClass(elements.fileUploadDisplay, 'hidden');
    removeClass(elements.fileUploadDisplay, 'expanded');
  }

  // Handle text messages
  if (message) {
    displayMessage(message, 'chat-message-sent');
    elements.messageInput.value = '';
    elements.wordCount.textContent = '0/100'; // Reset word count
    resetTextareaHeight();
  }
};

// Reset textarea height to default
const resetTextareaHeight = () => {
  elements.messageInput.style.height = '60px';
};

// Auto-resize message input
const autoResizeTextarea = () => {
  const wordCount = countWords(elements.messageInput.value.trim());
  elements.wordCount.textContent = `${wordCount}/100`;

  // Reset height to default before adjusting
  elements.messageInput.style.height = 'auto';
  // Set height to the scrollHeight, with a minimum of 60px and a maximum of 120px
  elements.messageInput.style.height = `${Math.min(Math.max(elements.messageInput.scrollHeight, 60), 120)}px`;
};

const setupEventListeners = () => {
  elements.chatbotToggle.addEventListener('click', () => {
    toggleClass(elements.chatbot, 'collapsed');

    // Check if the chatbot is open
    if (!elements.chatbot.classList.contains('collapsed')) {
      addClass(elements.socialIcons, 'visible'); // Show social icons
    } else {
      removeClass(elements.socialIcons, 'visible'); // Hide social icons
    }
  });

  elements.minimizeBtn.addEventListener('click', () => {
    toggleClass(elements.chatbot, 'collapsed');
    removeClass(elements.socialIcons, 'visible'); // Hide social icons when minimized
  });

  elements.maximizeBtn.addEventListener('click', () => {
    toggleClass(elements.chatbot, 'maximized');
    addClass(elements.socialIcons, 'visible'); // Show social icons when maximized
  });

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
      handleFileUpload(file);
    }
  });

  elements.messageInput.addEventListener('input', autoResizeTextarea);

  if (elements.removeFileBtn) {
    elements.removeFileBtn.addEventListener('click', removeFile);
  }
};

// Initialize the chatbot
const initChatbot = () => {
  setupEventListeners();
};

// Run the chatbot initialization
initChatbot();
document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements
  const elements = {
    userInput: document.getElementById("user-input"),
    sendBtn: document.getElementById("send-btn"),
    attachBtn: document.getElementById("attach-btn"),
    chatMessages: document.getElementById("chat-messages"),
    modelSelect: document.querySelector(".model-select")
  };

  // Bot response templates
  const responses = [
    "I've analyzed your financial query and here's my assessment...",
    "Based on current market data, I recommend considering...",
    "From an investment perspective, this looks interesting...",
    "Here's my analysis of your question with key insights...",
    "Let me break down the financial implications for you...",
    "According to recent market trends, you should know..."
  ];

  // Initialize all event listeners
  function initializeEventListeners() {
    // Auto-resize textarea and handle input
    elements.userInput.addEventListener("input", handleTextareaResize);
    
    // Handle keyboard shortcuts
    elements.userInput.addEventListener("keydown", handleKeyPress);
    
    // Send button click
    elements.sendBtn.addEventListener("click", sendMessage);
    
    // File attachment (simplified)
    elements.attachBtn.addEventListener("click", handleFileAttachment);
    
    // Model selection
    elements.modelSelect.addEventListener("change", handleModelChange);
  }

  // Handle textarea auto-resize
  function handleTextareaResize() {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 150) + "px";
  }

  // Handle keyboard input
  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Handle file attachment
  function handleFileAttachment() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg";
    
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        addMessage(`📎 Attached: ${file.name}`, true);
        simulateBotResponse();
      }
    };
    
    fileInput.click();
  }

  // Handle model selection
  function handleModelChange() {
    const selectedModel = this.value;
    console.log(`Switched to model: ${selectedModel}`);
    // Add model-specific logic here if needed
  }

  // Send message function
  function sendMessage() {
    const message = elements.userInput.value.trim();
    if (!message) return;
    
    addMessage(message, true);
    elements.userInput.value = "";
    elements.userInput.style.height = "auto";
    simulateBotResponse();
  }

  // Optimized message creation
  function addMessage(content, isUser) {
    const timestamp = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const messageHTML = `
      <div class="message ${isUser ? 'user-message' : 'bot-message'}">
        <div class="message-content">${content}</div>
        <div class="message-timestamp">${timestamp}</div>
      </div>
    `;
    
    elements.chatMessages.insertAdjacentHTML('beforeend', messageHTML);
    scrollToBottom();
  }

  // Optimized scroll function
  function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }

  // Optimized typing indicator
  function showTypingIndicator() {
    const typingHTML = `
      <div class="typing-indicator">
        <i class="fa-solid fa-coin-front"></i>
        <span class="text">Thinking...</span>
      </div>
    `;
    
    elements.chatMessages.insertAdjacentHTML('beforeend', typingHTML);
    scrollToBottom();
    return elements.chatMessages.lastElementChild;
  }

  // Simulate bot response with random delay
  function simulateBotResponse() {
    const typingIndicator = showTypingIndicator();
    const responseDelay = 1500 + Math.random() * 2000;
    
    setTimeout(() => {
      typingIndicator.remove();
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage(response, false);
    }, responseDelay);
  }

  // Initialize the application
  initializeEventListeners();
});
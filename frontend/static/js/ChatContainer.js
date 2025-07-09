document.addEventListener("DOMContentLoaded", function () {
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const attachBtn = document.getElementById("attach-btn");
  const chatMessages = document.getElementById("chat-messages");

  // Auto-resize textarea
  userInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 150) + "px";
  });

  // Send message on Enter (but allow Shift+Enter for new lines)
  userInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Send button click handler
  sendBtn.addEventListener("click", sendMessage);

  // File attachment handler
  attachBtn.addEventListener("click", function () {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg";

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        addMessage(`Attachment: ${file.name}`, true);
        simulateBotResponse();
      }
    };

    fileInput.click();
  });

  function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
      addMessage(message, true);
      userInput.value = "";
      userInput.style.height = "auto";
      simulateBotResponse();
    }
  }

  function addMessage(content, isUser) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(isUser ? "user-message" : "bot-message");

    // Get current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;

    // Create message content
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = content;

    // Create timestamp
    const timestampDiv = document.createElement("div");
    timestampDiv.className = "message-timestamp";
    timestampDiv.textContent = timeString;

    // Append elements
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestampDiv);

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("typing-indicator");
    
    typingDiv.innerHTML = `
      <i class="fa-solid fa-coin-front"></i>
      <span class="text">Thinking...</span>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    return typingDiv;
  }

  function simulateBotResponse() {
    const typingIndicator = showTypingIndicator();

    setTimeout(() => {
      chatMessages.removeChild(typingIndicator);

      const responses = [
        "I've analyzed your financial query...",
        "Based on market data, I recommend...",
        "From an investment perspective...",
        "Here's my analysis of your question...",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];

      addMessage(response, false);
    }, 1500 + Math.random() * 2000);
  }
});
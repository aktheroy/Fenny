document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements
  const elements = {
    userInput: document.getElementById("user-input"),
    sendBtn: document.getElementById("send-btn"),
    attachBtn: document.getElementById("attach-btn"),
    chatMessages: document.getElementById("chat-messages"),
    modelSelect: document.querySelector(".model-select"),
  };

  // Store attached files
  let attachedFiles = [];

  // Bot response templates
  const responses = [
    "I've analyzed your financial query and here's my assessment...",
    "Based on current market data, I recommend considering...",
    "From an investment perspective, this looks interesting...",
    "Here's my analysis of your question with key insights...",
    "Let me break down the financial implications for you...",
    "According to recent market trends, you should know...",
  ];

  // Initialize all event listeners
  function initializeEventListeners() {
    // Auto-resize textarea and handle input
    elements.userInput.addEventListener("input", handleTextareaResize);

    // Handle keyboard shortcuts
    elements.userInput.addEventListener("keydown", handleKeyPress);

    // Send button click
    elements.sendBtn.addEventListener("click", sendMessage);

    // File attachment
    elements.attachBtn.addEventListener("click", handleFileAttachment);

    // Model selection
    elements.modelSelect.addEventListener("change", handleModelChange);
  }

  // Handle textarea auto-resize
  function handleTextareaResize() {
    this.style.height = "auto";
    const maxHeight = 150;
    const newHeight = Math.min(this.scrollHeight, maxHeight);
    this.style.height = newHeight + "px";
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
    fileInput.accept = ".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv";

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Limit to one file
      if (attachedFiles.length >= 1) {
        alert("Only one file can be attached at a time.");
        return;
      }

      // Restrict to 5MB max
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        alert("File size exceeds 5MB limit.");
        return;
      }

      // Only allow files that may contain text content
      const allowedMimeTypes = [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (!allowedMimeTypes.includes(file.type)) {
        alert(
          "Only text-based files are allowed (.txt, .pdf, .doc, .docx, .xls, .xlsx, .csv)."
        );
        return;
      }

      addAttachedFile(file);
    };

    fileInput.click();
  }

  // Add attached file to the input area
  function addAttachedFile(file) {
    // Store the file
    attachedFiles.push(file);

    // Create file indicator element
    const fileIndicator = document.createElement("div");
    fileIndicator.className = "attached-file";
    fileIndicator.innerHTML = `
    <i class="fa-solid fa-file"></i>
    <span class="file-name">${file.name}</span>
    <button class="remove-file" title="Remove file">
    <i class="fa-solid fa-xmark"></i>
  </button>
  `;

    // Remove any existing remove listener to avoid duplication
    const removeBtn = fileIndicator.querySelector(".remove-file");
    removeBtn.onclick = () => removeAttachedFile(fileIndicator, file.name);

    // Insert before all other elements inside right-actions
    const rightActions = document.querySelector(".right-actions");
    rightActions.insertBefore(fileIndicator, rightActions.firstChild);
  }

  // Remove attached file
  function removeAttachedFile(fileElement, fileName) {
    // Remove from array
    attachedFiles = attachedFiles.filter((file) => file.name !== fileName);
    // Remove from UI
    fileElement.remove();
  }

  // Handle model selection
  function handleModelChange() {
    const selectedModel = this.value;
    console.log(`Switched to model: ${selectedModel}`);
  }

  // Send message function
  function sendMessage() {
    const message = elements.userInput.value.trim();

    // Check if we have message or files
    if (!message && attachedFiles.length === 0) return;

    // Create message content
    let messageContent = message;

    // Add attached files to message
    // Add attached files to message
    if (attachedFiles.length > 0) {
      const filesList = attachedFiles
        .map((file) => `<i class="fa-solid fa-file"></i> ${file.name}`)
        .join("<br>");
      messageContent = messageContent
        ? `${messageContent}<br><br>${filesList}`
        : filesList;
    }

    // Add message to chat
    addMessage(messageContent, true);

    // Clear input and files
    elements.userInput.value = "";
    elements.userInput.style.height = "auto";
    clearAttachedFiles();

    // Simulate bot response
    simulateBotResponse();
  }

  // Clear all attached files
  function clearAttachedFiles() {
    attachedFiles = [];
    // Remove all file indicators
    const fileIndicators = document.querySelectorAll(".attached-file");
    fileIndicators.forEach((indicator) => indicator.remove());
  }

  // Optimized message creation
  function addMessage(content, isUser) {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const messageHTML = `
  <div class="message ${isUser ? "user-message" : "bot-message"}">
    <div class="message-content">${content}</div>
    <div class="message-timestamp">${timestamp}</div>
  </div>
`;

    elements.chatMessages.insertAdjacentHTML("beforeend", messageHTML);
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
        <span class="text">Thinking </span>
      </div>
    `;
    elements.chatMessages.insertAdjacentHTML("beforeend", typingHTML);
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

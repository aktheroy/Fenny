document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements
  const elements = {
    userInput: document.getElementById("user-input"),
    sendBtn: document.getElementById("send-btn"),
    attachBtn: document.getElementById("attach-btn"),
    chatMessages: document.getElementById("chat-messages"),
    modelSelect: document.querySelector(".model-select"),
    messageInputContainer: document.querySelector(".message-input-container")
  };

  // Store attached files
  let attachedFiles = [];
  let isBotTyping = false;

  // Bot response templates
  const responses = [
    "I've analyzed your financial query and here's my assessment...",
    "Based on current market data, I recommend considering...",
    "From an investment perspective, this looks interesting...",
    "Here's my analysis of your question with key insights...",
    "Let me break down the financial implications for you...",
    "According to recent market trends, you should know...",
  ];

  // Initialize event listeners
  function initializeEventListeners() {
    elements.userInput.addEventListener("input", handleTextareaResize);
    elements.userInput.addEventListener("keydown", handleKeyPress);
    elements.sendBtn.addEventListener("click", sendMessage);
    elements.attachBtn.addEventListener("click", handleFileAttachment);
    elements.modelSelect.addEventListener("change", handleModelChange);
  }

  // Auto-resize textarea
  function handleTextareaResize() {
    this.style.height = "auto";
    const maxHeight = 150;
    const newHeight = Math.min(this.scrollHeight, maxHeight);
    this.style.height = newHeight + "px";
  }

  // Handle Enter key
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
    fileInput.style.position = 'fixed';
    fileInput.style.left = '-9999px';
    fileInput.style.top = '-9999px';
    fileInput.style.opacity = '0';
    fileInput.style.pointerEvents = 'none';

    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        fileInput.remove();
        return;
      }

      // Limit to one file
      if (attachedFiles.length >= 1) {
        alert("Only one file can be attached at a time.");
      } else if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
      } else {
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
          alert("Only text-based files are allowed (.txt, .pdf, .doc, .docx, .xls, .xlsx, .csv).");
        } else {
          addAttachedFile(file);
        }
      }
      fileInput.remove();
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  }

  // Add attached file UI
  function addAttachedFile(file) {
    attachedFiles.push(file);

    const fileIndicator = document.createElement("div");
    fileIndicator.className = "attached-file";
    fileIndicator.innerHTML = `
      <i class="fa-solid fa-file"></i>
      <span class="file-name">${file.name}</span>
      <button class="remove-file" title="Remove file">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    const removeBtn = fileIndicator.querySelector(".remove-file");
    removeBtn.onclick = () => removeAttachedFile(fileIndicator, file.name);

    const rightActions = document.querySelector(".right-actions");
    rightActions.insertBefore(fileIndicator, rightActions.firstChild);
  }

  // Remove attached file
  function removeAttachedFile(fileElement, fileName) {
    attachedFiles = attachedFiles.filter((file) => file.name !== fileName);
    if (fileElement && fileElement.parentNode) {
      fileElement.remove();
    }
  }

  // Handle model selection
  function handleModelChange() {
    const selectedModel = this.value;
    console.log(`Switched to model: ${selectedModel}`);
  }

  // Disable user input
  function disableUserInput(disabled = true) {
    elements.userInput.disabled = disabled;
    elements.sendBtn.disabled = disabled;
    elements.attachBtn.disabled = disabled;

    if (disabled) {
      elements.messageInputContainer.classList.add("disabled");
    } else {
      elements.messageInputContainer.classList.remove("disabled");
    }
  }

  // Send message
  function sendMessage() {
    if (isBotTyping) return;

    const message = elements.userInput.value.trim();

    if (!message && attachedFiles.length === 0) return;

    disableUserInput(true);

    let messageContent = message;

    if (attachedFiles.length > 0) {
      const filesList = attachedFiles
        .map((file) => `<i class="fa-solid fa-file"></i> ${file.name}`)
        .join("<br>");
      messageContent = messageContent
        ? `${messageContent}<br><br>${filesList}`
        : filesList;
    }

    addMessage(messageContent, true);

    elements.userInput.value = "";
    elements.userInput.style.height = "auto";
    clearAttachedFiles();

    simulateBotResponse();
  }

  // Clear attached files
  function clearAttachedFiles() {
    attachedFiles = [];
    document.querySelectorAll(".attached-file").forEach(el => el.remove());
  }

  // Add message to chat
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

  // Scroll to bottom
  function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  }

  // Show typing indicator
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

  // Simulate bot response
  function simulateBotResponse() {
    isBotTyping = true;
    const typingIndicator = showTypingIndicator();
    const responseDelay = 1500 + Math.random() * 2000;

    setTimeout(() => {
      typingIndicator.remove();
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage(response, false);

      disableUserInput(false);
      isBotTyping = false;
    }, responseDelay);
  }

  // Start app
  initializeEventListeners();
});
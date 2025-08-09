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
    elements.userInput.addEventListener("input", debounce(handleTextareaResize, 50));
    elements.userInput.addEventListener("keydown", handleKeyPress);
    elements.sendBtn.addEventListener("click", sendMessage);
    elements.attachBtn.addEventListener("click", handleFileAttachment);
    elements.modelSelect.addEventListener("change", handleModelChange);
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
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

  function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    if (["pdf"].includes(ext)) return "fa-file-pdf";
    if (["doc", "docx"].includes(ext)) return "fa-file-word";
    if (["xls", "xlsx", "csv"].includes(ext)) return "fa-file-excel";
    if (["txt"].includes(ext)) return "fa-file-lines";
    return "fa-file";
  }

  // Add attached file UI
  function addAttachedFile(file) {
    attachedFiles.push(file);

    const fileIndicator = document.createElement("div");
    fileIndicator.className = "attached-file";
    const iconClass = getFileIcon(file.name);
    fileIndicator.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
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

    let messageContent = "";
    
    // Combine file and message in one content
    if (attachedFiles.length > 0) {
      const file = attachedFiles[0];
      const iconClass = getFileIcon(file.name);
      messageContent = `
        <div class="attached-file">
          <i class="fa-solid ${iconClass}"></i>
          <span class="file-name">${file.name}</span>
        </div>
      `;
    }

    if (message) {
      messageContent += `<div class="message-text">${message}</div>`;
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

  // Load chat history from localStorage
  function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem("fenny_chat_history") || "[]");
    history.forEach(msg => {
      addMessage(msg.content, msg.isUser, msg.timestamp, true);
    });
  }

  // Save chat history to localStorage
  function saveMessageToHistory(content, isUser, timestamp) {
    const history = JSON.parse(localStorage.getItem("fenny_chat_history") || "[]");
    history.push({ content, isUser, timestamp });
    localStorage.setItem("fenny_chat_history", JSON.stringify(history));
  }

  // Clear chat history (optional utility)
  function clearChatHistory() {
    localStorage.removeItem("fenny_chat_history");
  }

  // Modify addMessage to accept timestamp and skip saving if loading history
  function addMessage(content, isUser, timestamp = null, skipSave = false) {
    timestamp = timestamp || new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlContent = renderMarkdown(content);

    const messageHTML = `
      <div class="message ${isUser ? "user-message" : "bot-message"}">
        <div class="message-content">${htmlContent}</div>
        <div class="message-timestamp">${timestamp}</div>
      </div>
    `;
    
    elements.chatMessages.insertAdjacentHTML("beforeend", messageHTML);

    // Keep only last 100 messages in DOM
    const msgs = elements.chatMessages.querySelectorAll(".message");
    if (msgs.length > 100) {
      msgs[0].remove();
    }

    scrollToBottom();

    if (!skipSave) saveMessageToHistory(content, isUser, timestamp);
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

  // Render markdown-like syntax to HTML
  function renderMarkdown(text) {
    if (!text) return "";
    // Basic replacements: **bold**, *italic*, `code`, [text](url)
    return text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\*([^*]+)\*/g, '<i>$1</i>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, "<br>");
  }

  // Start app
  initializeEventListeners();
  loadChatHistory();

  document.getElementById("clear-chat-btn").onclick = function() {
    if (confirm("Clear all chat history?")) {
      clearChatHistory();
      elements.chatMessages.innerHTML = "";
    }
  };

  document.getElementById("download-chat-btn").onclick = function() {
    const history = JSON.parse(localStorage.getItem("fenny_chat_history") || "[]");
    let text = history.map(msg =>
      (msg.isUser ? "You: " : "Fenny: ") + msg.content.replace(/<[^>]+>/g, '')
    ).join("\n\n");
    const blob = new Blob([text], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fenny_chat.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };
});
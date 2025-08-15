document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    userInput: document.getElementById("user-input"),
    sendBtn: document.getElementById("send-btn"),
    attachBtn: document.getElementById("attach-btn"),
    chatMessages: document.getElementById("chat-messages"),
    modelSelect: document.querySelector(".model-select"),
    messageInputContainer: document.querySelector(".message-input-container"),
    rightActions: document.querySelector(".right-actions"),
    clearChatBtn: document.getElementById("clear-chat-btn"),
    downloadChatBtn: document.getElementById("download-chat-btn")
  };

  const MAX_MESSAGES = 100;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_TEXTAREA_HEIGHT = 150;

  let attachedFiles = [];
  let isBotTyping = false;

  const responses = [
    "I've analyzed your financial query and here's my assessment...",
    "Based on current market data, I recommend considering...",
    "From an investment perspective, this looks interesting...",
    "Here's my analysis of your question with key insights...",
    "Let me break down the financial implications for you...",
    "According to recent market trends, you should know...",
  ];

  /** Utility: debounce */
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  /** Auto-resize textarea */
  function handleTextareaResize() {
    this.style.height = "auto";
    const newHeight = Math.min(this.scrollHeight, MAX_TEXTAREA_HEIGHT);
    if (this.style.height !== `${newHeight}px`) {
      this.style.height = `${newHeight}px`;
    }
  }

  /** Handle Enter to send */
  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  /** File Attachment */
  function handleFileAttachment() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".txt,.pdf,.doc,.docx,.xls,.xlsx,.csv";
    fileInput.style.display = "none";

    fileInput.onchange = () => {
      const file = fileInput.files[0];
      if (!file) return;

      if (attachedFiles.length >= 1) {
        alert("Only one file can be attached at a time.");
      } else if (file.size > MAX_FILE_SIZE) {
        alert("File size exceeds 5MB limit.");
      } else if (!isAllowedFileType(file.type)) {
        alert("Only text-based files are allowed (.txt, .pdf, .doc, .docx, .xls, .xlsx, .csv).");
      } else {
        addAttachedFile(file);
      }
      fileInput.remove();
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  }

  function isAllowedFileType(type) {
    const allowed = [
      "text/plain", "application/pdf",
      "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv"
    ];
    return allowed.includes(type);
  }

  function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === "pdf") return "fa-file-pdf";
    if (["doc", "docx"].includes(ext)) return "fa-file-word";
    if (["xls", "xlsx", "csv"].includes(ext)) return "fa-file-excel";
    if (ext === "txt") return "fa-file-lines";
    return "fa-file";
  }

  function addAttachedFile(file) {
    attachedFiles = [file];
    const fileIndicator = document.createElement("div");
    fileIndicator.className = "attached-file";
    fileIndicator.innerHTML = `
      <i class="fa-solid ${getFileIcon(file.name)}"></i>
      <span class="file-name">${file.name}</span>
      <button class="remove-file" title="Remove file">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    fileIndicator.querySelector(".remove-file").onclick = () => removeAttachedFile(fileIndicator, file.name);
    elements.rightActions.insertBefore(fileIndicator, elements.rightActions.firstChild);
  }

  function removeAttachedFile(fileElement, fileName) {
    attachedFiles = attachedFiles.filter(f => f.name !== fileName);
    fileElement.remove();
  }

  /** Send Message */
  function sendMessage() {
    if (isBotTyping) return;

    const message = elements.userInput.value.trim();
    if (!message && attachedFiles.length === 0) return;

    disableUserInput(true);

    let messageContent = "";
    if (attachedFiles.length > 0) {
      const file = attachedFiles[0];
      messageContent += `
        <div class="attached-file message-file">
          <i class="fa-solid ${getFileIcon(file.name)}"></i>
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

  function clearAttachedFiles() {
    attachedFiles = [];
    document.querySelectorAll(".attached-file:not(.message-file)").forEach(el => el.remove());
  }

  /** Add message */
  function addMessage(content, isUser, timestamp = null, skipSave = false) {
    timestamp = timestamp || new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
    const htmlContent = renderMarkdown(content);

    const messageHTML = document.createElement("div");
    messageHTML.className = `message ${isUser ? "user-message" : "bot-message"}`;
    messageHTML.innerHTML = `
      <div class="message-content">${htmlContent}</div>
      <div class="message-timestamp">${timestamp}</div>
    `;

    elements.chatMessages.appendChild(messageHTML);

    if (elements.chatMessages.children.length > MAX_MESSAGES) {
      elements.chatMessages.firstChild.remove();
    }

    scrollToBottom();

    if (!skipSave) saveMessageToHistory(content, isUser, timestamp);
  }

  /** Scroll helper */
  function scrollToBottom() {
    requestAnimationFrame(() => {
      elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    });
  }

  /** Typing indicator */
  function showTypingIndicator() {
    const typingHTML = document.createElement("div");
    typingHTML.className = "typing-indicator";
    typingHTML.innerHTML = `<i class="fa-solid fa-coin-front"></i><span class="text">Thinking  </span>`;
    elements.chatMessages.appendChild(typingHTML);
    scrollToBottom();
    return typingHTML;
  }

  function simulateBotResponse() {
    isBotTyping = true;
    const typingIndicator = showTypingIndicator();
    const delay = 1500 + Math.random() * 2000;

    setTimeout(() => {
      typingIndicator.remove();
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage(response, false);
      disableUserInput(false);
      isBotTyping = false;
    }, delay);
  }

  /** Markdown parser */
  function renderMarkdown(text) {
    if (!text) return "";
    return text
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\*([^*]+)\*/g, '<i>$1</i>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, "<br>");
  }

  /** History handling */
  function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem("fenny_chat_history") || "[]");
    history.forEach(msg => addMessage(msg.content, msg.isUser, msg.timestamp, true));
  }
  function saveMessageToHistory(content, isUser, timestamp) {
    const history = JSON.parse(localStorage.getItem("fenny_chat_history") || "[]");
    history.push({ content, isUser, timestamp });
    localStorage.setItem("fenny_chat_history", JSON.stringify(history));
  }
  function clearChatHistory() {
    localStorage.removeItem("fenny_chat_history");
  }

  /** Enable/Disable input */
  function disableUserInput(disabled) {
    elements.userInput.disabled = disabled;
    elements.sendBtn.disabled = disabled;
    elements.attachBtn.disabled = disabled;
    elements.messageInputContainer.classList.toggle("disabled", disabled);
  }

  /** Event Listeners */
  elements.userInput.addEventListener("input", debounce(handleTextareaResize, 50));
  elements.userInput.addEventListener("keydown", handleKeyPress);
  elements.sendBtn.addEventListener("click", sendMessage);
  elements.attachBtn.addEventListener("click", handleFileAttachment);
  elements.modelSelect.addEventListener("change", e => console.log(`Switched to model: ${e.target.value}`));

  elements.clearChatBtn.addEventListener("click", () => {
    if (confirm("Clear all chat history?")) {
      clearChatHistory();
      elements.chatMessages.innerHTML = "";
    }
  });

  elements.downloadChatBtn.addEventListener("click", () => {
    const history = JSON.parse(localStorage.getItem("fenny_chat_history") || "[]");
    const text = history.map(msg => (msg.isUser ? "You: " : "Fenny: ") + msg.content.replace(/<[^>]+>/g, '')).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fenny_chat.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  /** Init */
  loadChatHistory();
});

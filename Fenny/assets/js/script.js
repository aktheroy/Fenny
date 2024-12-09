document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbot = document.getElementById("chatbot");
  const socialIcons = document.getElementById("social-icons");
  const messageInput = document.getElementById("message");
  const messageBox = document.getElementById("message-box");
  const maximizeBtn = document.getElementById("maximize-btn");
  const minimizeBtn = document.querySelector(".minimize-btn");
  const fileInput = document.getElementById("file-upload");
  const fileUploadDisplay = document.getElementById("file-upload-display");
  const fileUploadProgress = document.getElementById("file-upload-progress");
  const progressPercentage = document.getElementById("progress-percentage");
  const icons = document.querySelectorAll(".currency-slide i");

  // Start the bounce animation on the chatbot toggle button
  chatbotToggle.classList.add("bounce");

  // Toggle chatbot visibility
  chatbotToggle.addEventListener("click", () => {
    chatbot.classList.toggle("collapsed");
    socialIcons.classList.toggle(
      "visible",
      !chatbot.classList.contains("collapsed")
    );
  });

  // Minimize chatbot
  minimizeBtn.addEventListener("click", () => {
    chatbot.classList.toggle("collapsed");
    socialIcons.classList.remove("visible");
  });

  // Maximize chatbot
  maximizeBtn.addEventListener("click", () => {
    if (chatbot.classList.contains("maximized")) {
      chatbot.classList.remove("maximized");
      maximizeBtn.querySelector("i").classList.replace("bx-minus", "bx-plus");
    } else {
      chatbot.classList.add("maximized");
      maximizeBtn.querySelector("i").classList.replace("bx-plus", "bx-minus");
    }
  });

  // Add a message to the chat
  function addMessage(text, className) {
    const div = document.createElement("div");
    div.classList.add("chat-message-div", className);

    // Add timestamp
    const timestamp = getCurrentTime();
    const timestampElement = document.createElement("div");
    timestampElement.classList.add("timestamp");
    timestampElement.textContent = timestamp;

    // Add message text
    const messageElement = document.createElement("div");
    messageElement.textContent = text;

    div.appendChild(messageElement);
    div.appendChild(timestampElement);

    messageBox.appendChild(div);
    messageBox.scrollTop = messageBox.scrollHeight; // Scroll to the bottom
  }

  // Get the current time for timestamps
  function getCurrentTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Handle sending messages
  function send() {
    const message = messageInput.value.trim();

    // Handle file upload
    if (fileInput.files[0]) {
      const fileName = fileInput.files[0].name;

      // Display the file as a message
      addMessage(`File uploaded: ${fileName}`, "chat-message-sent");
      fileInput.value = ""; // Clear the file input
      fileUploadDisplay.classList.add("hidden"); // Hide file upload display
    }

    // Handle text messages
    if (message) {
      addMessage(message, "chat-message-sent");

      // Fake bot response (this can be replaced with real logic later)
      setTimeout(
        () => addMessage(`Bot: ${message}`, "chat-message-received"),
        1000
      );

      messageInput.value = ""; // Clear the input field
    }
  }

  // Handle Enter key for sending messages
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      send(); // Send the message
    }
  });

  // Attach event listener to the Send button
  const sendButton = document.querySelector(".send-btn");
  sendButton.addEventListener("click", () => {
    send(); // Trigger the send function when the send button is clicked
  });

  // Handle file uploads
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type and size
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      fileInput.value = ""; // Clear invalid file input
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB.");
      fileInput.value = ""; // Clear large file input
      return;
    }

    // Show the upload display and progress bar
    fileUploadDisplay.classList.remove("hidden");
    fileUploadProgress.classList.remove("hidden");
    fileUploadProgress.style.width = "0"; // Reset progress bar width
    progressPercentage.textContent = "0%";

    // Simulate real-time upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10; // Increment progress
      fileUploadProgress.style.width = `${progress}%`;
      progressPercentage.textContent = `${progress}%`;

      if (progress >= 100) {
        clearInterval(progressInterval); // Stop the simulation
        progressPercentage.textContent = "Completed!";
        setTimeout(() => {
          fileUploadProgress.classList.add("hidden"); // Hide progress bar
        }, 1000);
      }
    }, 300); // Adjust speed of progress
  });

  // Remove the selected file
  window.removeFile = function () {
    // Clear the file input
    fileInput.value = ""; // Reset the input value to clear the file

    // Hide the file upload display and progress bar
    fileUploadDisplay.classList.add("hidden");
    fileUploadProgress.classList.add("hidden");

    // Reset progress bar and percentage text
    fileUploadProgress.style.width = "0";
    progressPercentage.textContent = "0%";

    console.log("File removed successfully");
  };

  // Handle hover effects for currency icons
  function getRandomColor() {
    return Math.random() > 0.5 ? "darkgreen" : "red";
  }

  icons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
      const randomColor = getRandomColor();
      icon.style.setProperty("--random-hover-color", randomColor);
    });

    icon.addEventListener("mouseout", () => {
      icon.style.setProperty("--random-hover-color", "");
    });
  });
});

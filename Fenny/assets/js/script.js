document.addEventListener("DOMContentLoaded", () => {
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbot = document.getElementById("chatbot");
  const messageInput = document.getElementById("message");
  const messageBox = document.getElementById("message-box");
  const maximizeBtn = document.getElementById("maximize-btn");
  const minimizeBtn = document.querySelector(".minimize-btn");
  const fileInput = document.getElementById("file-upload");
  const fileDisplay = document.getElementById("file-display");

  // Start the bounce animation on the chatbot toggle button
  chatbotToggle.classList.add("bounce");

  // Toggle chatbot visibility
  chatbotToggle.addEventListener("click", () => {
    chatbot.classList.toggle("collapsed");
    chatbotToggle.classList.toggle(
      "bounce",
      chatbot.classList.contains("collapsed")
    );
  });

  minimizeBtn.addEventListener("click", () => {
    chatbot.classList.toggle("collapsed");
    chatbotToggle.classList.add("bounce");
  });

  maximizeBtn.addEventListener("click", () => {
    if (chatbot.classList.contains("maximized")) {
      chatbot.classList.remove("maximized");
      maximizeBtn.querySelector("i").classList.replace("bx-minus", "bx-plus");
    } else {
      chatbot.classList.add("maximized");
      maximizeBtn.querySelector("i").classList.replace("bx-plus", "bx-minus");
    }
  });

  // Send message when the send button is clicked or Enter key is pressed
  window.send = function () {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add the user's message
    addMessage(message, "chat-message-sent");

    // Simulate a bot response (you can replace this with actual bot logic)
    setTimeout(
      () => addMessage(`Echo: ${message}`, "chat-message-received"),
      1000
    );

    messageInput.value = ""; // Clear the input field
  };

  // Send message when Enter key is pressed
  messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      // Avoid sending message if Shift+Enter is pressed (for multiline input)
      e.preventDefault(); // Prevent the default Enter behavior (e.g., adding a new line)
      send(); // Call the send function
    }
  });

  function addMessage(text, className) {
    const messageBox = document.getElementById("message-box");
    const div = document.createElement("div");
    div.classList.add("chat-message-div", className);

    // Get the current timestamp
    const timestamp = getCurrentTime();

    // Create the timestamp element
    const timestampElement = document.createElement("div");
    timestampElement.classList.add("timestamp");
    timestampElement.textContent = timestamp;

    // Create the message element
    const messageElement = document.createElement("div");
    messageElement.textContent = text;

    // Append the message and timestamp
    div.appendChild(messageElement);
    div.appendChild(timestampElement);

    messageBox.appendChild(div);
    messageBox.scrollTop = messageBox.scrollHeight; // Scroll to the bottom
  }

  function getCurrentTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
});

// Handle file uploads
document.getElementById("file-upload").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    addMessage(`Attached file: ${file.name}`, "chat-message-sent");
  } else {
    alert("Only PDF files are allowed.");
    event.target.value = ""; // Clear invalid file input
  }
});

// Send function remains unchanged
document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll(".currency-slide i");

  // Function to generate a random color (green or red)
  function getRandomColor() {
    return Math.random() > 0.5 ? "darkgreen" : "red"; // 50% chance to pick green or red
  }

  // Apply the random color on hover
  icons.forEach((icon) => {
    icon.addEventListener("mouseover", () => {
      const randomColor = getRandomColor();
      icon.style.setProperty("--random-hover-color", randomColor); // Apply random color to the icon
    });

    // Reset the color when mouse leaves
    icon.addEventListener("mouseout", () => {
      icon.style.setProperty("--random-hover-color", ""); // Reset color
    });
  });
});

const fileInput = document.getElementById("file-upload");
const fileUploadDisplay = document.getElementById("file-upload-display");
const fileUploadProgress = document.getElementById("file-upload-progress");

// Handle file selection
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

  // Show the file upload display and progress bar
  fileUploadDisplay.classList.remove("hidden");
  fileUploadProgress.classList.remove("hidden");
  fileUploadProgress.style.width = "0"; // Reset progress bar width

  // Simulate upload progress
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 10; // Increment progress
    fileUploadProgress.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(progressInterval); // Stop the animation
      fileUploadProgress.classList.add("hidden"); // Hide progress bar
    }
  }, 300); // Adjust speed of progress
});

// Remove the selected file
function removeFile() {
  fileInput.value = ""; // Clear the file input
  fileUploadDisplay.classList.add("hidden"); // Hide file upload display
  fileUploadProgress.classList.add("hidden"); // Hide progress bar
}

// Send message or process file
function send() {
  const message = messageInput.value.trim();

  // If a file is attached, process it
  if (fileInput.files[0]) {
    const fileName = fileInput.files[0].name;

    // Display the file as a message in the chat (you can adjust this logic)
    addMessage(`File uploaded: ${fileName}`, "chat-message-sent");
    fileInput.value = ""; // Clear the file input
    fileUploadDisplay.classList.add("hidden"); // Hide file upload display
  }

  // If a message is entered, send it
  if (message) {
    addMessage(message, "chat-message-sent");
    messageInput.value = ""; // Clear the input field
  }
}

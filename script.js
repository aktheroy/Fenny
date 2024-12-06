document.addEventListener("DOMContentLoaded", () => {
  const chatbotToggle = document.getElementById("chatbot-toggle");
  const chatbot = document.getElementById("chatbot");
  const messageInput = document.getElementById("message");
  const messageBox = document.getElementById("message-box");
  const minimizeBtn = document.querySelector(".minimize-btn");

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

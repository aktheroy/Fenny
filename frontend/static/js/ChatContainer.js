class ChatContainer {
    constructor() {
        this.messagesContainer = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.addFileButton = document.getElementById('add-file-button');
        this.githubButton = document.getElementById('github-button');
        this.isTyping = false;
        
        this.init();
    }

    init() {
        // Add event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Add file button functionality
        this.addFileButton.addEventListener('click', () => this.handleFileAdd());
        this.githubButton.addEventListener('click', () => this.handleGitHub());

        // Add welcome message
        this.addBotMessage("👋 Hello! I'm your AI assistant. How can I help you today?");
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addUserMessage(message);
        this.chatInput.value = '';

        // Show typing indicator and simulate bot response
        this.showTypingIndicator();
        
        // Simulate API call delay
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(message);
        }, 1000 + Math.random() * 2000);
    }

    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user';
        messageElement.textContent = message;
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message bot';
        messageElement.textContent = message;
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = '<span></span><span></span><span></span>';
        this.messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    generateBotResponse(userMessage) {
        // Simple response logic - you can replace this with actual AI API calls
        const responses = [
            "That's an interesting question! Let me think about that...",
            "I understand what you're asking. Here's my perspective:",
            "Great question! Based on what you've shared:",
            "I can help you with that. Here's what I think:",
            "Thanks for asking! My response would be:",
            "Let me provide some insights on that topic:",
            "I appreciate your question. Here's my take:",
            "That's a thoughtful inquiry. Allow me to respond:"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add some context-aware responses
        let botResponse = randomResponse;
        
        const lowerMessage = userMessage.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            botResponse = "Hello there! 👋 It's great to meet you. What would you like to chat about?";
        } else if (lowerMessage.includes('how are you')) {
            botResponse = "I'm doing well, thank you for asking! 😊 I'm here and ready to help with whatever you need.";
        } else if (lowerMessage.includes('currency') || lowerMessage.includes('money')) {
            botResponse = "I see you're interested in currency! 💱 The animated background shows various world currencies. Is there something specific about finance or currencies you'd like to discuss?";
        } else if (lowerMessage.includes('help')) {
            botResponse = "I'm here to help! 🤝 You can ask me questions, have conversations, or discuss various topics. What would you like assistance with?";
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
            botResponse = "Goodbye! 👋 It was nice chatting with you. Feel free to come back anytime!";
        }

        this.addBotMessage(botResponse);
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    handleFileAdd() {
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '*/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.addBotMessage(`📁 File selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
                // Here you can add file processing logic
            }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    handleGitHub() {
        this.addBotMessage("🐱 GitHub integration coming soon! This will allow you to interact with repositories.");
        // Here you can add GitHub integration logic
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatContainer();
});
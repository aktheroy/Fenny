from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# LM Studio server details
LM_STUDIO_API_URL = "http://192.168.0.86:1234/v1/chat/completions"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.form.get('message')
    
    # Prepare the data to send to the LM Studio server
    lm_studio_data = {
        "model": "llama-3.2-3b-instruct",
        "messages": [
            {"role": "user", "content": user_message}
        ]
    }
    
    # Send the request to the LM Studio server
    response = requests.post(LM_STUDIO_API_URL, json=lm_studio_data)
    
    # Check if the request was successful
    if response.status_code == 200:
        lm_studio_response = response.json().get('choices')[0].get('message').get('content')
        return jsonify({"bot_response": lm_studio_response})
    else:
        return jsonify({"error": "Failed to get a response from the LM Studio server"}), 500

if __name__ == '__main__':
    app.run(debug=True)
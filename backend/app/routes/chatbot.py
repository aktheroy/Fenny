from flask import Flask, render_template, request, jsonify
from time import sleep

app = Flask(__name__, 
    template_folder='../../../frontend/templates',
    static_folder='../../../frontend/static')

@app.route('/')
def home():
    return render_template('Home.html')

@app.route('/chat', methods=['POST'])
def chat():
    # Get message from request
    message = request.json.get('message', '')
    
    # Simulate processing time
    sleep(5)
    
    # Reverse the message
    response = message[::-1]
    
    return jsonify({
        'response': response,
        'timestamp': True
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
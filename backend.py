from flask import Flask, request, render_template

app = Flask(__name__)

# Main page for visitors
@app.route('/')
def index():
    return render_template('index.html')

# Hidden admin page (only accessible via secret URL)
@app.route('/super-secret-admin-123456')  # change this to your secret URL
def admin():
    # Read messages from file
    with open('messages.txt', 'r') as f:
        messages = f.readlines()
    return render_template('admin.html', messages=messages)

# Handle message submissions
@app.route('/send-message', methods=['POST'])
def send_message():
    message = request.form.get('message')
    if message:
        with open('messages.txt', 'a') as f:
            f.write(message + '\n')
    return "Message received!"  # simple response

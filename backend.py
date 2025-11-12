from flask import Flask, request, render_template

app = Flask(__name__)

# Main site for visitors
@app.route('/')
def index():
    return render_template('index.html')

# Hidden admin page (only accessible if you know the URL)
@app.route('/super-secret-admin-123456')  # make this hard to guess
def admin():
    # Read all messages from file
    with open('messages.txt', 'r') as f:
        messages = f.readlines()
    return render_template('admin.html', messages=messages)

# Handle messages sent from the main site
@app.route('/send-message', methods=['POST'])
def send_message():
    message = request.form.get('message')
    if message:
        with open('messages.txt', 'a') as f:
            f.write(message + '\n')
    return "Message received!"

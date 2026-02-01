document.addEventListener("DOMContentLoaded", function() {
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Tabs found:', tabs.length); // Debug log
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-tab')); // Debug log
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            const targetContent = document.getElementById(tabId);
            
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Showing tab:', tabId); // Debug log
            } else {
                console.error('Tab content not found:', tabId);
            }
        });
    });
    
    // Message sending functionality
    const sendBtn = document.getElementById("sendBtn");
    const msgInput = document.getElementById("msgInput");
    const nameInput = document.getElementById("nameInput");
    const status = document.getElementById("status");
    
    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }
    
    // Also send message when pressing Enter (with Ctrl or Cmd)
    if (msgInput) {
        msgInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const name = nameInput.value.trim();
        const message = msgInput.value.trim();
        
        if (!name) {
            showStatus("Please enter your name", "error");
            nameInput.focus();
            return;
        }
        
        if (!message) {
            showStatus("Please enter a message", "error");
            msgInput.focus();
            return;
        }
        
        // Disable button and show loading state
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span>Sending...</span>';
        
        // Your webhook URL
        const webhookUrl = "https://discord.com/api/webhooks/1467634963204542464/SqIqBJXPiSXBeoo8F6hXwUaFGLgLG510KZmbFKg6CeSx1CSnxHVeLXadXrB6oF03Y2rM";
        
        fetch(webhookUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                content: `**From:** ${name}\n\n**Message:** ${message}`,
                username: "Website Contact",
                avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png"
            })
        })
        .then(response => {
            if (response.ok) {
                console.log("Message sent successfully!");
                showStatus("Message sent successfully!", "success");
                msgInput.value = "";
                nameInput.value = "";
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error("Error sending message:", error);
            showStatus(`Failed to send message: ${error.message}`, "error");
        })
        .finally(() => {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<span>Send Message</span>';
        });
    }
    
    function showStatus(message, type) {
        if (status) {
            status.textContent = message;
            status.className = "status " + type;
            
            setTimeout(() => {
                status.className = "status";
            }, 5000);
        }
    }
});
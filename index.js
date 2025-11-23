document.addEventListener("DOMContentLoaded", function() {
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Message sending functionality
    const sendBtn = document.getElementById("sendBtn");
    const msgInput = document.getElementById("msgInput");
    const nameInput = document.getElementById("nameInput");
    const status = document.getElementById("status");
    
    sendBtn.addEventListener("click", sendMessage);
    
    // Also send message when pressing Enter (with Ctrl or Cmd)
    msgInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            sendMessage();
        }
    });
    
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
        const webhookUrl = "https://discord.com/api/webhooks/1439619216624844812/lo-HnJWV36Rmhf0OCOZASToXf7uclpnbREDl_m28ojU72Pskl3VZKIDdynFTJfjrmagD";
        
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
                // Success! Discord returns empty response for webhooks
                console.log("Message sent successfully!");
                showStatus("Message sent successfully!", "success");
                msgInput.value = ""; // Clear the input
                nameInput.value = ""; // Clear the name
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .catch(error => {
            console.error("Error sending message:", error);
            showStatus(`Failed to send message: ${error.message}`, "error");
        })
        .finally(() => {
            // Re-enable button
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<span>Send Message</span>';
        });
    }
    
    function showStatus(message, type) {
        status.textContent = message;
        status.className = "status " + type;
        
        // Hide status after 5 seconds
        setTimeout(() => {
            status.className = "status";
        }, 5000);
    }
});
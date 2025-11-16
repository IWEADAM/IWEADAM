document.addEventListener("DOMContentLoaded", function() {
    const sendBtn = document.getElementById("sendBtn");
    const msgInput = document.getElementById("msgInput");
    const status = document.getElementById("status");
    
    sendBtn.addEventListener("click", sendMessage);
    
    // Also send message when pressing Enter (with Ctrl or Cmd)
    msgInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = msgInput.value.trim();
        
        if (!message) {
            showStatus("Please enter a message", "error");
            return;
        }
        
        // Disable button and show loading state
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span>Sending...</span>';
        
        // Your webhook URL
        const webhookUrl = "https://api.codetabs.com/v1/proxy?quest=https://discord.com/api/webhooks/1439619216624844812/lo-HnJWV36Rmhf0OCOZASToXf7uclpnbREDl_m28ojU72Pskl3VZKIDdynFTJfjrmagD";
        
        fetch(webhookUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                content: message,
                username: "Webhook Sender",
                avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png"
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Message sent successfully:", data);
            showStatus("Message sent successfully!", "success");
            msgInput.value = ""; // Clear the input
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
            status.style.display = "none";
        }, 5000);
    }
});
document.addEventListener("DOMContentLoaded", function() {
    // ========== ADD THIS - Capture IP AND LOCATION ==========
    let visitorIP = "Unable to detect IP";
    let visitorLocation = "Location unavailable";
    let visitorCoordinates = "";
    
    // First get the IP
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            visitorIP = data.ip;
            console.log("Visitor IP:", visitorIP);
            
            // Then get location info using the IP
            return fetch(`https://ipapi.co/${visitorIP}/json/`);
        })
        .then(response => response.json())
        .then(locationData => {
            if (locationData && !locationData.error) {
                const city = locationData.city || "Unknown";
                const region = locationData.region || "Unknown";
                const country = locationData.country_name || "Unknown";
                const lat = locationData.latitude || "";
                const lon = locationData.longitude || "";
                
                visitorLocation = `${city}, ${region}, ${country}`;
                visitorCoordinates = lat && lon ? `\n**Coordinates:** ${lat}, ${lon}` : "";
                console.log("Visitor Location:", visitorLocation);
            }
        })
        .catch(err => {
            console.error("Location capture failed:", err);
            visitorLocation = "Location detection failed";
        });
    // ========== END IP & LOCATION CAPTURE ==========
    
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Tabs found:', tabs.length);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-tab'));
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            const targetContent = document.getElementById(tabId);
            
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Showing tab:', tabId);
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
        
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<span>Sending...</span>';
        
        const webhookUrl = "https://discord.com/api/webhooks/1467634963204542464/SqIqBJXPiSXBeoo8F6hXwUaFGLgLG510KZmbFKg6CeSx1CSnxHVeLXadXrB6oF03Y2rM";
        
        fetch(webhookUrl, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                content: `**From:** ${name}\n**IP:** ${visitorIP}\n**Location:** ${visitorLocation}${visitorCoordinates}\n\n**Message:** ${message}`,
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

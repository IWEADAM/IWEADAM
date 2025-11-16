document.getElementById("sendBtn").addEventListener("click", sendMessage);

function sendMessage() {
    const message = document.getElementById("msgInput").value;

    if (!message.trim()) return; // لو فاضي متبعتش

    fetch("https://discord.com/api/webhooks/1439619216624844812/lo-HnJWV36Rmhf0OCOZASToXf7uclpnbREDl_m28ojU72Pskl3VZKIDdynFTJfjrmagD", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: `New message: ${message}`
        })
    })
    .then(res => {
        console.log("sent");
        document.getElementById("msgInput").value = ""; // يمسح التكست
    })
    .catch(err => console.log("error:", err));
fetch("https://discord.com/api/webhooks/1439619216624844812/lo-HnJWV36Rmhf0OCOZASToXf7uclpnbREDl_m28ojU72Pskl3VZKIDdynFTJfjrmagDL", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `New message: ${message}`
  })
});
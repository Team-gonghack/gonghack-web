const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

console.log("🚀 WebSocket Test Server started on ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("✅ Client connected");

  // 2초마다 랜덤 데이터 전송
  const interval = setInterval(() => {
    const patterns = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
    const risks = ["safe", "warning", "danger"];

    const data = {
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      riskLevel: risks[Math.floor(Math.random() * risks.length)],
      timestamp: Date.now(),
    };

    console.log("📤 Sending:", data);
    ws.send(JSON.stringify(data));
  }, 2000);

  ws.on("close", () => {
    clearInterval(interval);
    console.log("❌ Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("⚠️  WebSocket error:", error);
  });
});

wss.on("error", (error) => {
  console.error("⚠️  Server error:", error);
});

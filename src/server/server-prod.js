import path from "path";
import express from "express";

const WebSocket = require("ws"); // new

const app = express(),
  DIST_DIR = __dirname,
  HTML_FILE = path.join(DIST_DIR, "index.html");

app.use(express.static(DIST_DIR));

app.get("*", (req, res) => {
  res.sendFile(HTML_FILE);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log("Press Ctrl+C to quit.");
});

const socketServer = new WebSocket.Server({ port: 3030 });

const messages = ["\n"];
socketServer.on("connection", (socketClient) => {
  console.log("connected");
  console.log("Number of clients: ", socketServer.clients.size);
  //console.log('username: ', socketServer.clients.size);
  socketClient.send(JSON.stringify(messages));

  socketClient.on("message", (message) => {
    console.log("message: ", message);
    messages.push(message);
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify([message]));
      }
    });
  });

  socketClient.on("close", (socketClient) => {
    console.log("closed");
    console.log("Number of clients: ", socketServer.clients.size);
  });
});

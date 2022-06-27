import path from "path";
import express from "express";

const { spawn } = require("child_process");

const WebSocket = require("ws");

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

  // socketServer.clients.forEach((client) => {
  const child = spawn("dotnet", [
    "/Users/jiayin/Downloads/formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll",
  ]);

  socketClient.send(JSON.stringify(messages));

  socketClient.on("message", (message) => {
    // console.log("message: ", message);

    //save the variables to 'tmp_file.txt'
    var fs = require("fs");
    var stream = fs.createWriteStream("tmp_file.4ml");
    stream.once("open", function (fd) {
      stream.write(message);
      stream.end();
    });

    //send 'load file' to dotnet
    child.stdin.write(
      "load /Users/jiayin/Downloads/react-monaco-tree-sitter/tmp_file.4ml"
    );
    child.stdin.end();

    //receive the data from dotnet and save it to a tmp file
    child.stdout.on("data", (data) => {
      messages.push(data.toString());
    });
  });
  // });

  socketClient.on("close", (socketClient) => {
    console.log("closed");
    console.log("Number of clients: ", socketServer.clients.size);
  });
});

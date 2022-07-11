import path from "path";
import os from "os";
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

const wss = new WebSocket.Server({ port: 3030 });
const clients = new Map();

wss.on("connection", (ws, req) => {
  console.log("Client connected.");
  
  const child = spawn("dotnet", [
    "/Users/daniel/work/formula/formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll"
    //"/Users/jiayin/Downloads/formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll",
  ]);

  clients.set(ws, child); // store child process in map

  child.on('exit', function() {
    console.log("dotnet child process exited.");
  })

  child.stdout.on("data", (data) => {
    resultOrError(data, ws);
  });

  ws.on("close", (ws) => {
    console.log("Web socket closed. Current number of clients: ", wss.clients.size);
  });

  ws.on("message", (message) => {
    var msg = JSON.parse(message);
    var child = clients.get(ws); // retrieve child process from map

    if (msg.type == "editor") {
      var fs = require("fs");    
      var stream = fs.createWriteStream("tmp_file.4ml");
      stream.once("open", function (fd) {
        stream.write(msg.text);
        stream.end();
      });

      //send 'load file' to dotnet
      child.stdin.write(
        //"load /Users/jiayin/Downloads/react-monaco-tree-sitter/tmp_file.4ml"
        "load /Users/daniel/git/formula-web/tmp_file.4ml\n"
      );    
    } else if (msg.type == "user") {
      console.log("Sending message to dotnet: ", msg.text);
      child.stdin.write(msg.text + "\n");
    }
  });
});

function resultOrError(data, ws) {
  if (data.toString().startsWith("Error")) {
    var sendingError = {
      type: "error",
      text: data.toString(),
    };

    ws.send(JSON.stringify(sendingError));
  } else {
    var sendingResult = {
      type: "result",
      text: data.toString(),
    };

    console.log("Sending message from dotnet to ws: ", sendingResult);
    ws.send(JSON.stringify(sendingResult));
  }
}
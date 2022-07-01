import path from "path";
import express from "express";
import { v4 as uuid } from "uuid";

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

const messages = ["\n"];
wss.on("connection", (ws, req) => {
  console.log("connected");
  console.log("Number of clients: ", wss.clients.size);

  const child = spawn("dotnet", [
    "/Users/jiayin/Downloads/formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll",
  ]);

  ws.send(JSON.stringify(messages));

  ws.on("message", (message) => {
    var msg = JSON.parse(message);
    if (msg.type == "editor") {
      //save the variables to 'tmp_file.txt'
      var fs = require("fs");
      var stream = fs.createWriteStream("tmp_file.4ml");
      stream.once("open", function (fd) {
        stream.write(msg.text);
        stream.end();
      });

      //send 'load file' to dotnet
      child.stdin.write(
        "load /Users/jiayin/Downloads/react-monaco-tree-sitter/tmp_file.4ml"
      );
      child.stdin.end();

      //receive the data from dotnet and save it to a tmp file
      child.stdout.on("data", (data) => {
        resultOrError(data);
      });
    } else if (msg.type == "user") {
      //send 'load file' to dotnet
      child.stdin.write(msg.text);
      child.stdin.end();

      //receive the data from dotnet and save it to a tmp file
      child.stdout.on("data", (data) => {
        resultOrError(data);
      });
    }
  });

  function resultOrError(data) {
    if (data.toString().startsWith("Error")) {
      var sendingError = {
        type: "error",
        text: data.toString(),
      };

      messages.push(JSON.stringify(sendingError));
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(sendingError));
        }
      });
    } else {
      var sendingResult = {
        type: "result",
        text: data.toString(),
      };

      messages.push(JSON.stringify(sendingResult));
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(sendingResult));
        }
      });
    }
  }

  ws.on("close", (ws) => {
    console.log("closed");
    console.log("Number of clients: ", wss.clients.size);
  });
});

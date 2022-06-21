import path from "path";
import express from "express";

// const { spawn } = require("child_process");
// const child_process = spawn("pwd");

// var child = cp.fork("/src/index.js");

//pseudo code for conserving number of child process created
// numberOfChilds = 0;
// if (numberOfChilds < socketServer.clients.size) {
//   var numChildDiff = socketServer.clients.size - numberOfChilds;
//   while (numChildDiff > 0) {
//     fork();
//   }
// }

//pseudo code for spawning a new child process for every client connection
// socketServer.clients.forEach((client) => {
//     fork();
// });

// child.on("exit", function (code, signal) {
//   console.log(
//     "child process exited with " + `code ${code} and signal ${signal}`
//   );
// });

// var cp = require("child_process");
const { spawn } = require("child_process");
// const child_process = spawn("pwd");

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

  socketClient.send(JSON.stringify(messages));

  socketClient.on("message", (message) => {
    console.log("message: ", message);

    const child = spawn("dotnet", [
      "formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll",
    ]);

    //'filepath to CommandLine.dll'

    //fix so child process is continuous for each client connection
    //so can continously update the terminal environment

    //save the variables to 'tmp_file.txt'
    var fs = require("fs");
    var stream = fs.createWriteStream("tmp_file.4ml");
    stream.once("open", function (fd) {
      stream.write(message);
      stream.end();
    });

    //send 'load file' to dotnet
    child.stdin.write("load react-monaco-tree-sitter/tmp_file.4ml");
    child.stdin.end();

    //receive the data from dotnet and save it to a tmp file
    child.stdout.on("data", (data) => {
      var s = fs.createWriteStream("tmp_file_2.txt");
      s.once("open", function (fd) {
        s.write(data);
        s.end();
      });
    });

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

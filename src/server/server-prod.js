/**
 *  @fileoverview Creates the functionality for the server side
 */

import path from "path";
import os from "os";
import express from "express";

//create and load the Express.js server
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

//initialize the constants
const { spawn } = require("child_process");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3030 });
const clients = new Map();

//function for when the server receives a new connection
wss.on("connection", (ws, req) => {
  //notify the console that a new client has connected
  console.log("Client connected.\nNumber of clients now: ", wss.clients.size);

  //spawn a child of formula-dotnet
  const child = spawn("dotnet", [
    // "/Users/daniel/work/formula/formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll"
    "/Users/jiayin/Downloads/formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll",
  ]);

  clients.set(ws, child); // store child process in map

  //function for when child process has exited
  child.on("exit", function () {
    console.log("dotnet child process exited.");
  });

  //function for when child process gets data from formula-dotnet
  child.stdout.on("data", (data) => {
    //send the results from formula-dotnet to the client side
    resultOrError(data, ws);
  });

  //function for when a ws connection exits
  ws.on("close", (ws) => {
    console.log(
      "Client disconnected.\nNumber of clients now: ",
      wss.clients.size
    );
  });

  //function for when ws receives a message from the client side
  ws.on("message", (message) => {
    var msg = JSON.parse(message);
    var child = clients.get(ws); // retrieve child process from map

    //if the message is from the text editor
    if (msg.type == "editor") {
      //write the values to a temp file
      var fs = require("fs");
      var stream = fs.createWriteStream("tmp_file.4ml");
      stream.once("open", function (fd) {
        stream.write(msg.text);
        stream.end();
      });

      //send 'load tmp file' command to formula-dotnet child process
      child.stdin.write(
        "load /Users/jiayin/Downloads/react-monaco-tree-sitter/tmp_file.4ml\n"
        // "load /Users/daniel/git/formula-web/tmp_file.4ml\n"
      );
    }
    //else if the message is from the terminal area
    else if (msg.type == "user") {
      //send user command to formula-dotnet child process
      console.log("received terminal input: ", message.text);
      child.stdin.write(msg.text + "\n");
    }
  });
});

//helper function for sending results from formula-dotnet to the client side
function resultOrError(data, ws) {
  //if the data string starts with "error"
  if (data.toString().startsWith("Error")) {
    //categorize the message type as "error"
    var sendingError = {
      type: "error",
      text: data.toString(),
    };
    //send the categorized message to the ws on the client side
    ws.send(JSON.stringify(sendingError));
  }
  //else if the data string does not start with "error"
  else {
    //categorize the message type as "result"
    var sendingResult = {
      type: "result",
      text: data.toString(),
    };
    //send the categorized message to the ws on the client side
    ws.send(JSON.stringify(sendingResult));
  }
}

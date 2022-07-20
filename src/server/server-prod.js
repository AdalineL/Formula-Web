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
const fs = require("fs");
const { spawn } = require("child_process");
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3030 });
const clients = new Map();

//function for when the server receives a new connection
wss.on("connection", (ws, req) => {
  //vars for temp directory and file content
  var dir = "";
  var domain = "";

  //notify the console that a new client has connected
  console.log("Client connected.\nNumber of clients now: ", wss.clients.size);

  //spawn a child of formula-dotnet
  const child = spawn("dotnet", [
    // "/Users/daniel/work/formula/formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll"
    "/Users/jiayin/Downloads/formula-dotnet/Src/CommandLine/bin/Debug/net6.0/CommandLine.dll",
  ]);

  // store ws and info object (containing child and dir) in a map
  var info = {
    child: child,
    dir: dir,
  };
  clients.set(ws, info);

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
    // fs.rmSync(clients.get(ws).dir + "/tmp_file.4ml"); //delete the temp file
    // console.log(clients.get(ws).dir);
    // fs.rmdir(clients.get(ws).dir, { recursive: true });
    console.log(
      "Client disconnected.\nNumber of clients now: ",
      wss.clients.size
    );
  });

  //function for when ws receives a message from the client side
  ws.on("message", (message) => {
    var msg = JSON.parse(message);
    var child = clients.get(ws).child; // retrieve child process from map

    //make the temp directory
    clients.get(ws).dir = fs.mkdtempSync(path.join(os.tmpdir(), "formula-"));

    //if the message is from the text editor
    if (msg.type == "editor") {
      //update file content
      domain = msg.text + "\n";

      //write values to a temp file in the temp directory
      fs.writeFileSync(clients.get(ws).dir + "/tmp_file.4ml", domain);

      //send 'load tmp file' command to formula-dotnet child process
      child.stdin.write("load " + clients.get(ws).dir + "/tmp_file.4ml\n");
    }
    //else if the message is from the terminal area
    else if (msg.type == "user") {
      //send user command to formula-dotnet child process
      child.stdin.write(msg.text + "\n");
    }
  });
  // fs.rmSync(clients.get(ws).dir + "/tmp_file.4ml");
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

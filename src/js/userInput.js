import React, { useRef } from "react";
const { ws } = require("./configSocket.js");
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";

// Xterm.js
// let term = new Terminal();

// document.addEventListener("DOMContentLoaded", function () {
//   term.open(document.getElementById("terminal"));
//   term.write("It works!");
// });

//to attach WebSocket stream to Xterm.js
// const socket = new WebSocket('wss://docker.example.com/containers/mycontainerid/attach/ws');
// const attachAddon = new AttachAddon(socket);
// change to separate file for export

// import { ws } from "./configSocket.js";

function userInput() {
  //helper function for getting an element
  const getElement = (id) => document.getElementById(id);

  //helper function to add result message to response section
  const addMessage = (message) => {
    getElement("response").appendChild(document.createTextNode(message));
  };

  //helper function to add error message to error section
  const addError = (message) => {
    getElement("error").appendChild(document.createTextNode(message));
  };

  // const ws = new WebSocket("ws://localhost:3030");
  //open websocket connection
  // ws.onopen = () => {
  //   console.log("userInput: connected");
  // };

  //client side receives a message from the server
  ws.onmessage = (event) => {
    const messages = JSON.parse(event.data);
    //send to responses section if it is a 'result' type of messages
    if (messages.type == "result") {
      // messages.forEach(addMessage(messages.text));
      addMessage(messages.text);
    }
    //send to error section if it is a 'error' type of message
    else if (messages.type == "error") {
      // messages.forEach(addError(messages.text));
      addError(messages.text);
    }
  };

  //send user input from textfield
  function sendInput() {
    // var ws = new WebSocket("ws://localhost:3030");
    // console.log("sendInput");

    //when the websocket connection opens
    // ws.onopen = () => {
    // console.log("sendinput onopen");
    var msg = {
      type: "user",
      text: document.getElementById("input").value,
    };
    ws.send(JSON.stringify(msg));
    console.log(JSON.stringify(msg));
    // ws.send(document.getElementById("input").value);
    // };
  }

  return (
    <>
      <textarea id="response"></textarea>
      <button onClick={sendInput}>Send input</button>
      <p>client input area</p>
      <textarea id="input"></textarea>
      <p>error logs</p>
      <textarea id="error"></textarea>
      <div id="terminal"></div>
    </>
  );
}

export default userInput;

/**
 *  @fileoverview Creates the functionality for the terminal area.
 */

import React, { useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const { ws } = require("./configSocket.js"); //get the ws connection initialized in configSocket.js

//initialize Xterm.js
let term = new Terminal();

document.addEventListener("DOMContentLoaded", function () {
  term.open(document.getElementById("terminal"));
});

//the main functionality of the terminal area
function TerminalArea() {
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

  //function for when ws receives a message from the server
  ws.onmessage = (event) => {
    const messages = JSON.parse(event.data);
    //send to responses section if it is a 'result' type of messages
    if (messages.type == "result") {
      term.write(messages.text); //write the message to the terminal
      addMessage(messages.text);
    }
    //send to error section if it is a 'error' type of message
    else if (messages.type == "error") {
      addError(messages.text);
    }
  };

  //function to send user input values to the server via WebSockets
  function sendInput() {
    var msg = {
      type: "user",
      text: document.getElementById("input").value,
    };
    ws.send(JSON.stringify(msg));
  }

  //return the html for the terminal area
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

export default TerminalArea;

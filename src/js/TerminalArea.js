/**
 *  @fileoverview Creates the functionality for the terminal area.
 */

import React, { useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const { ws } = require("./configSocket.js"); //get the ws connection initialized in configSocket.js

//initialize Xterm.js
var curr_input = ""; //var to keep track of user input in the terminal

var term = new Terminal({
  cursorBlink: "block",
});

document.addEventListener("DOMContentLoaded", function () {
  term.open(document.getElementById("terminal"));
});

//User input in terminal
term.onKey((key) => {
  const char = key.domEvent.key;
  //if 'enter' send curr_input to server
  if (char === "Enter") {
    sendTerminalValues();
    curr_input = "";
  }
  //if 'backspace' delete a char on both curr_input and terminal
  else if (char === "Backspace") {
    term.write("\b \b");
    curr_input = curr_input.substring(0, curr_input - 2);
  }
  //else add char to both curr_input and terminal
  else {
    term.write(char);
    curr_input += char;
  }
});

//helper function to send terminal values to server
function sendTerminalValues() {
  var msg = {
    type: "user",
    text: curr_input,
  };
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(msg));
  }
}

//the main functionality of the terminal area
function TerminalArea() {
  //helper function for getting an element
  const getElement = (id) => document.getElementById(id);

  //helper function to add error message to error section
  const addError = (message) => {
    getElement("error").appendChild(document.createTextNode(message));
  };

  //function for when ws receives a message from the server
  ws.onmessage = (event) => {
    const messages = JSON.parse(event.data);
    //send to terminal if it is a 'result' type of messages
    if (messages.type == "result") {
      term.write("\r\n" + messages.text); //write the message to the terminal
    }
    //send to error section if it is a 'error' type of message
    else if (messages.type == "error") {
      addError(messages.text);
    }
  };

  //return the html for the terminal area
  return (
    <>
      <p>error logs</p>
      <textarea id="error"></textarea>
      <div id="terminal"></div>
    </>
  );
}

export default TerminalArea;

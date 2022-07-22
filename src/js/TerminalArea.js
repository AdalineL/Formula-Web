/**
 *  @fileoverview Creates the functionality for the terminal area.
 */

import React, { useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import useCollapse from "react-collapsed";

const { ws } = require("./configSocket.js"); //get the ws connection initialized in configSocket.js

//initialize Xterm.js
const fitAddon = new FitAddon();
var curr_input = ""; //var to keep track of user input in the terminal

var term = new Terminal({
  //cursor and '\r' for every new line
  cursorBlink: true,
  cursorBlink: "block",
  convertEol: true,
});

document.addEventListener("DOMContentLoaded", function () {
  //open terminal and resize it to fit its container properly
  term.open(document.getElementById("terminal"));
  term.loadAddon(fitAddon);
  fitAddon.fit();
});

//resize the terminal whenever the window is resized
addEventListener("resize", (event) => {
  term.loadAddon(fitAddon);
  fitAddon.fit();
});

//resize the terminal whenever the window is loaded
window.addEventListener("load", (event) => {
  term.loadAddon(fitAddon);
  fitAddon.fit();
});

//User input in terminal
term.onKey((key) => {
  const char = key.domEvent.key;
  //if 'enter' send curr_input to server
  if (char === "Enter") {
    term.write("\r\n");
    sendTerminalValues();
    curr_input = "";
  }
  //if 'backspace' delete a char on both curr_input and terminal
  else if (char === "Backspace") {
    term.write("\b \b");
    curr_input = curr_input.substring(0, curr_input - 2);
  }
  //if 'left arrow' go back a character
  else if (char == "ArrowLeft") {
    term.write("\x1b[D");
  }
  //if 'right arrow' go forward a character
  else if (char == "ArrowRight") {
    term.write("\x1b[C");
  }
  //if 'up arrow' go up a line
  else if (char == "ArrowUp") {
    term.write("\x1b[A");
  }
  //if 'down arrow' go down a line
  else if (char == "ArrowDown") {
    term.write("\x1b[B");
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
  //function for when ws receives a message from the server
  ws.onmessage = (event) => {
    const messages = JSON.parse(event.data);
    //write the result to Xterm.js
    term.write(messages.text);
  };

  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  //return the html for the terminal area
  return (
    <>
      <div id="terminal"></div>
      <div class="header">Common Commands</div>
      <div class="content">
        <p>
          <b>Solving:</b>
        </p>
        <blockquote>
          <code>
            solve x = pm // Try to complete the partial model named pm
          </code>
        </blockquote>

        <p>
          <b>Queries:</b>
        </p>
        <blockquote>
          <code>query m badMapping // Does model m have a badMapping?</code>
        </blockquote>

        <p>
          <b>Display task status:</b>
        </p>
        <blockquote>
          <code>list</code>
        </blockquote>

        <p>
          <b>Proofs:</b>
        </p>
        <blockquote>
          <code>pr 0 //Show a proof for task 0</code>
        </blockquote>
      </div>
    </>
  );
}

export default TerminalArea;

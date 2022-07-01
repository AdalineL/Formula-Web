import React, { useRef } from "react";

function userInput() {
  const getElement = (id) => document.getElementById(id);
  const addMessage = (message) => {
    getElement("response").appendChild(document.createTextNode(message));
  };
  const ws = new WebSocket("ws://localhost:3030");
  ws.onopen = () => {
    console.log("Now connected");
  };

  ws.onmessage = (event) => {
    const messages = JSON.parse(event.data);
    messages.forEach(addMessage);
  };

  //send user input from textfield
  function sendInput() {
    var ws = new WebSocket("ws://localhost:3030");

    ws.onopen = () => {
      var msg = {
        type: "user",
        text: document.getElementById("input").value,
      };
      ws.send(JSON.stringify(msg));
      // ws.send(document.getElementById("input").value);
    };
  }

  return (
    <>
      <textarea id="response"></textarea>
      <button onClick={sendInput}>Send input</button>
      <p>client input area</p>
      <textarea id="input"></textarea>
    </>
  );
}

export default userInput;

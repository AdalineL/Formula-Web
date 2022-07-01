import React, { useRef } from "react";

function userInput() {
  const getElement = (id) => document.getElementById(id);
  const addMessage = (message) => {
    getElement("response").appendChild(document.createTextNode(message));
  };
  const addError = (message) => {
    getElement("error").appendChild(document.createTextNode(message));
  };
  const ws = new WebSocket("ws://localhost:3030");
  ws.onopen = () => {
    console.log("Now connected");
  };

  ws.onmessage = (event) => {
    // console.log("error");
    // console.log(data.toString());
    // console.log(sendingError);
    const messages = JSON.parse(event.data);
    if (messages.type == "result") {
      messages.forEach(addMessage(messages.text));
    } else if (messages.type == "error") {
      messages.forEach(addError(messages.text));
    }
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
      <p>error logs</p>
      <textarea id="error"></textarea>
    </>
  );
}

export default userInput;

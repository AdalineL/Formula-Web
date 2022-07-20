/**
 *  @fileoverview Creates the functionality for the text-editor.
 */

import React, { useRef } from "react";
import loader from "@monaco-editor/loader";

const { ws } = require("./configSocket.js"); //get the ws connection initialized in configSocket.js

//example codes for Monaco Editor
const defaultExample = require("../examples/DefaultExample.js");
const battery = require("../examples/Battery.js");
const mappingExample = require("../examples/MappingExample.js");
const recursionExample = require("../examples/RecursionExample.js");
const sendMoreMoney = require("../examples/SendMoreMoney.js");

//the main functionality of the text-editor
function EditorArea() {
  //refer to https://github.com/suren-atoyan/monaco-react for docs on @monaco-editor/react

  //load monaco editor into the browser
  loader.init().then((monaco) => {
    const wrapper = document.getElementById("textEditor");
    wrapper.style.height = "100%";
    const properties = {
      value: defaultExample.defaultExample(),
      language: "json",
    };

    //turn off validation for Monaco Editor
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false,
    });

    window.editor = monaco.editor.create(wrapper, properties);
  });

  //function to send text editor values to the server via WebSockets
  document.getElementById("loadFile").onclick = function () {
    var msg = {
      type: "editor",
      text: window.editor.getValue(),
    };
    ws.send(JSON.stringify(msg));
  };

  function downloadFile(file) {
    //from this source https://pqina.nl/blog/how-to-prompt-the-user-to-download-a-file-instead-of-navigating-to-it/
    // Create a link and set the URL using `createObjectURL`
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = URL.createObjectURL(file);
    link.download = file.name;

    // It needs to be added to the DOM so it can be clicked
    document.body.appendChild(link);
    link.click();

    // To make this work on Firefox we need to wait
    // a little while before removing it.
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.parentNode.removeChild(link);
    }, 0);
  }

  //function to send text editor values to the server via WebSockets (to initiate a
  // save of the current editor values to a .4ml file on the user's system)
  document.getElementById("save").onclick = function () {
    // Dynamically create a File
    const myFile = new File([window.editor.getValue()], "formulaCode.4ml");

    // Download it
    downloadFile(myFile);
  };

  //change the default values in Monaco Editor based on the example code
  // the user chooses
  document.getElementById("battery").onclick = function () {
    window.editor.setValue(battery.battery());
  };

  document.getElementById("mappingExample").onclick = function () {
    window.editor.setValue(mappingExample.mappingExample());
  };

  document.getElementById("recursionExample").onclick = function () {
    window.editor.setValue(recursionExample.recursionExample());
  };

  document.getElementById("sendMoreMoney").onclick = function () {
    window.editor.setValue(sendMoreMoney.sendMoreMoney());
  };

  document.getElementById("defaultExample").onclick = function () {
    window.editor.setValue(defaultExample.defaultExample());
  };

  //resize the text editor whenever the window is resized
  addEventListener("resize", (event) => {
    window.editor.layout();
  });

  //return the html for the text editor
  return (
    <>
      <div id="textEditor"></div>
    </>
  );
}

export default EditorArea;

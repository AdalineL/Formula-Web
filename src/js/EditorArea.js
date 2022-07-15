/**
 *  @fileoverview Creates the functionality for the text-editor.
 */

import React, { useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import loader from "@monaco-editor/loader";
import * as Parser from "web-tree-sitter";
import {
  Language,
  Theme,
  MonacoTreeSitter,
  highlight,
} from "monaco-tree-sitter";

const { ws } = require("./configSocket.js"); //get the ws connection initialized in configSocket.js

//the main functionality of the text-editor
function EditorArea() {
  //refer to https://github.com/suren-atoyan/monaco-react for docs on @monaco-editor/react

  //default code for the text editor
  const formulaCode = `
  domain Mapping
  {
    Component ::= new (id: Integer, utilization: Real).
    Processor ::= new (id: Integer).
    Mapping   ::= new (c: Component, p: Processor).
  
    badMapping :- p is Processor,
          s = sum(0.0, { c.utilization |
                     c is Component, Mapping(c, p) }), s > 100.
  }`;

  //load monaco editor into the browser
  loader.init().then((monaco) => {
    loadTreeSitter();
    const wrapper = document.getElementById("textEditor");
    wrapper.style.height = "100%";
    const properties = {
      value: formulaCode,
      language: "javascript",
    };

    window.editor = monaco.editor.create(wrapper, properties);
  });

  async function loadTreeSitter() {
    Theme.load(require("./theme.json")); //"monaco-tree-sitter/themes/tomorrow")); //to use the 'tomorrow' theme

    await Parser.init();
    const parser = new Parser();
    const Lang = await Parser.Language.load("./tree-sitter-formula.wasm");
    parser.setLanguage(Lang);

    const language = new Language(require("./grammar.json"));
    await language.init(
      "http://localhost:8080/tree-sitter-formula.wasm",
      Parser
    );
  }

  //function to send text editor values to the server via WebSockets
  document.getElementById("loadFile").onclick = function () {
    var msg = {
      type: "editor",
      text: window.editor.getValue(),
    };
    ws.send(JSON.stringify(msg));
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

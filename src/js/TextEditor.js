import React, { useRef } from "react";
import ReactDOM from "react-dom";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

// const path = require("path");
import "./patch-fetch.js";

// import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
//uncomment = parsing error from css minimizer
//Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
//and ModuleParseError: Module parse failed: Unexpected character ''

import * as Parser from "web-tree-sitter";
import {
  Language,
  Theme,
  MonacoTreeSitter,
  highlight,
} from "monaco-tree-sitter";

function TextEditor() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function callWebSocket() {
    // alert(editorRef.current.getValue());

    var ws = new WebSocket("ws://localhost:3030");

    ws.onopen = () => {
      console.log("texteditor: Now connected");
      ws.send(editorRef.current.getValue());
    };
  }

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

  // (async () => {
  //   Theme.load(require("./theme.json")); //"monaco-tree-sitter/themes/tomorrow")); //to use the 'tomorrow' theme

  //   await Parser.init();
  //   const parser = new Parser();
  //   const Lang = await Parser.Language.load("tree-sitter-formula.wasm");
  //   parser.setLanguage(Lang);

  //   const language = new Language(require("./grammar.json"));
  //   await language.init(
  //     "http://localhost:8080/tree-sitter-formula.wasm",
  //     Parser
  //   );
  // })();

  // (async () => {
  //   const GSQL = await Parser.Language.load(
  //     path.join(__dirname, "./tree-sitter-formula.wasm")
  //   );
  // })();

  // const Parser = require("tree-sitter");
  // const JavaScript = require("tree-sitter-javascript");

  // const parser = new Parser();
  // parser.setLanguage(JavaScript);

  // const monaco = useMonaco();

  // useEffect(() => {
  //   if (monaco) {
  //     console.log("here is the monaco instance:", monaco);
  //   }
  // }, [monaco]);

  return (
    <>
      <button onClick={callWebSocket}>Send value</button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={formulaCode}
        onMount={handleEditorDidMount}
      />
    </>
  );
}

export default TextEditor;

import React, { useRef } from "react";

import Editor from "@monaco-editor/react";

//import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
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
    alert(editorRef.current.getValue());

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

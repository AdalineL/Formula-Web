/**
 *  @fileoverview Creates the functionality for the text-editor.
 */

import React, { useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

const { ws } = require("./configSocket.js"); //get the ws connection initialized in configSocket.js

//the main functionality of the text-editor
function EditorArea() {
  //refer to https://github.com/suren-atoyan/monaco-react for docs on @monaco-editor/react

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  //function to send text editor values to the server via WebSockets
  function sendEditorValues() {
    var msg = {
      type: "editor",
      text: editorRef.current.getValue(),
    };
    ws.send(JSON.stringify(msg));
  }

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

  //return the html for the text editor
  return (
    <>
      <button onClick={sendEditorValues}>Send value</button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={formulaCode}
        onMount={handleEditorDidMount}
      />
    </>
  );
}

export default EditorArea;

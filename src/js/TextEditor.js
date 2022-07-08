import React, { useRef } from "react";

import Editor, { useMonaco } from "@monaco-editor/react";

const { ws } = require("./configSocket.js");

// import { ws } from "./configSocket.js";

function TextEditor() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function callWebSocket() {
    var msg = {
      type: "editor",
      text: editorRef.current.getValue(),
    };
    ws.send(JSON.stringify(msg));
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

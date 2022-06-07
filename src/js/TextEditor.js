import React, { useRef } from "react";
import ReactDOM from "react-dom";

import Editor from "@monaco-editor/react";
import { getSyntheticLeadingComments } from "typescript";

function TextEditor() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function callWebSocket() {
    alert(editorRef.current.getValue());

    const addMessage = (message) => {
      getElement("response").appendChild(document.createTextNode(message));
    };

    var ws = new WebSocket("ws://localhost:3030");

    ws.onopen = () => {
      console.log("texteditor: Now connected");
      ws.send(editorRef.current.getValue());
      getElement("message").value = "";
    };
  }

  return (
    <>
      <button onClick={callWebSocket}>Send value</button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
      />
    </>
  );
}

// const rootElement = document.getElementById("app");
// ReactDOM.render(<TextEditor />, rootElement);

export default TextEditor;

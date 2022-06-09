import React, { useRef } from "react";

import Editor from "@monaco-editor/react";

// import * as Monaco from "monaco-editor/esm/vs/editor/editor.api";
// import * as Parser from "web-tree-sitter";
// import {
//   Language,
//   Theme,
//   MonacoTreeSitter,
//   highlight,
// } from "monaco-tree-sitter";

// const formulaCode = `
//   domain Mapping
//   {
//     Component ::= new (id: Integer, utilization: Real).
//     Processor ::= new (id: Integer).
//     Mapping   ::= new (c: Component, p: Processor).

//     badMapping :- p is Processor,
//                   s = sum(0.0, { c.utilization |
//                                 c is Component, Mapping(c, p) }), s > 100.
//   }`;

// (async () => {
//   Theme.load(require("/src/misc/theme.json")); //"monaco-tree-sitter/themes/tomorrow")); //to use the 'tomorrow' theme

//   await Parser.init();
//   const parser = new Parser();
//   const Lang = await Parser.Language.load("/src/misc/tree-sitter-formula.wasm");
//   parser.setLanguage(Lang);

//   const language = new Language(require("/src/misc/grammar.json"));
//   await language.init(
//     "http://localhost:9000/src/misc/tree-sitter-formula.wasm",
//     Parser
//   );

//   // window.editor = Monaco.editor.create(document.querySelector("#app"), {
//   //   value: formulaCode,
//   //   language: "formula",
//   // });

//   // window.editor = editor;
//   // window.monacoTreeSitter = new MonacoTreeSitter(Monaco, editor, language);
// })();

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

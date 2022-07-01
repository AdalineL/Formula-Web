import React, { useRef } from "react";

import Editor, { useMonaco } from "@monaco-editor/react";

//for custom Monaco Editor language
// // Register a new language
// monaco.languages.register({ id: "formula" });

// // Register a tokens provider for the language
// monaco.languages.setMonarchTokensProvider("formula", {
//   tokenizer: {
//     root: [
//       [/domain/, "type"],
//       [/model/, "type"],
//       [/transform/, "type"],
//       [/system/, "type"],
//       [/machine/, "type"],
//       [/partial/, "type"],
//       [/ensures/, "type"],
//       [/requires/, "type"],
//       [/conforms/, "type"],
//       [/includes/, "type"],
//       [/extends/, "type"],
//       [/of/, "type"],
//       [/returns/, "type"],
//       [/at/, "type"],
//       [/some/, "type"],
//       [/atleast/, "type"],
//       [/atmost/, "type"],
//       [/initially/, "type"],
//       [/next/, "type"],
//       [/property/, "type"],
//       [/boot/, "type"],
//       [/no/, "type"],
//       [/is/, "type"],
//       [/new/, "type"],
//       [/inj/, "type"],
//       [/bij/, "type"],
//       [/sur/, "type"],
//       [/fun/, "type"],
//       [/any/, "type"],
//     ],
//   },
// });

// // Define a new theme that contains only rules that match this language
// monaco.editor.defineTheme("formulaTheme", {
//   base: "vs",
//   inherit: false,
//   rules: [{ token: "type", foreground: "FFA500" }],
//   colors: {
//     "editor.foreground": "#000000",
//   },
// });

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
      //send monaco editor values to server
      var msg = {
        type: "editor",
        text: editorRef.current.getValue(),
      };
      ws.send(JSON.stringify(msg));
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
        // height="90vh"
        // theme="formulaTheme"
        // language="formula"
        // defaultValue={formulaCode}
        // onMount={handleEditorDidMount}
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={formulaCode}
        onMount={handleEditorDidMount}
      />
    </>
  );
}

export default TextEditor;

// import React from "react";
// import { render } from "react-dom";
// import MonacoEditor, { MonacoDiffEditor } from "react-monaco-editor";
// import * as Parser from "web-tree-sitter";
// import "./patch-fetch.js";

// const formulaCode = `
// domain Mapping
// {
// 	Component ::= new (id: Integer, utilization: Real).
// 	Processor ::= new (id: Integer).
// 	Mapping   ::= new (c: Component, p: Processor).

// 	badMapping :- p is Processor,
// 				        s = sum(0.0, { c.utilization | 
//                                c is Component, Mapping(c, p) }), s > 100.
// }`;


// (async () => {
//   Theme.load(require("./theme.json"));//"monaco-tree-sitter/themes/tomorrow")); //to use the 'tomorrow' theme

//   await Parser.init();
//   const parser = new Parser();
//   const Lang = await Parser.Language.load('tree-sitter-formula.wasm');
//   parser.setLanguage(Lang);

//   const language = new Language(require("./grammar.json"));
//   // await language.init("http://localhost:9000/tree-sitter-formula.wasm", Parser);

//   // window.editor = Monaco.editor.create(document.querySelector("#app"), {
//   //   value: formulaCode,
//   //   language: "formula"
//   // });

//   // window.editor = editor;
//   // window.monacoTreeSitter = new MonacoTreeSitter(Monaco, editor, language);
// })();

// class CodeEditor extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       code: formulaCode,
//       theme: "./theme.json",
//     };
//   }

//   render() {
//     const { code, theme } = this.state;
//     const options = {
//       selectOnLineNumbers: true,
//       roundedSelection: false,
//       readOnly: false,
//       cursorStyle: "line",
//       automaticLayout: false,
//     };
//     return (
//       <div>
//         <hr />
//         <MonacoEditor
//           height="400"
//           language="language"
//           value={code}
//           options={options}
//           theme={theme}
//         />
//       </div>
//     );
//   }
// }

// const App = () => (
//   <div>
//     <CodeEditor />
//     <hr />
//   </div>
// );

// render(<App />, document.getElementById("app"));

import React from 'react';
import { render } from "react-dom";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import MonacoEditor, { MonacoDiffEditor } from "react-monaco-editor";
import * as Parser from "web-tree-sitter";
import "./patch-fetch.js";

import ReactDOM from "react-dom/client";



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
//   Theme.load(require("./theme.json"));//"monaco-tree-sitter/themes/tomorrow")); //to use the 'tomorrow' theme

//   await Parser.init();
//   const parser = new Parser();
//   const Lang = await Parser.Language.load('tree-sitter-formula.wasm');
//   parser.setLanguage(Lang);

//   const language = new Language(require("./grammar.json"));
//   // await language.init("http://localhost:9000/tree-sitter-formula.wasm", Parser);

//   // window.editor = Monaco.editor.create(document.querySelector("#app"), {
//   //   value: formulaCode,
//   //   language: "formula"
//   // });

//   // window.editor = editor;
//   // window.monacoTreeSitter = new MonacoTreeSitter(Monaco, editor, language);
// })();

// class CodeEditor extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       code: formulaCode,
//       theme: "./theme.json",
//     };
//   }

//   render() {
//     const { code, theme } = this.state;
//     const options = {
//       selectOnLineNumbers: true,
//       roundedSelection: false,
//       readOnly: false,
//       cursorStyle: "line",
//       automaticLayout: false,
//     };
//     return (
//       <div>
//         <hr />
//         <MonacoEditor
//           height="400"
//           language="language"
//           value={code}
//           options={options}
//           theme={theme}
//         />
//       </div>
//     );
//   }
// }

// const App = () => (
//   <div>
//     <CodeEditor />
//     <hr />
//   </div>
// );

// render(<App />, document.getElementById("app"));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
    }
    this.alertText = this.alertText.bind(this);
  }
  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
    this.setState({code: this.state.code })
  }
  alertText() {
    alert(this.state.code)
  }
  callWebSocket() {
    var ws = new WebSocket('ws://localhost:3000/echo');

    ws.onmessage=function(event){
      console.log('web socket event', event)
    }

    ws.onopen = function () {
      ws.send('Ping'); // 
    };
  }
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <>
        <div>
          <button
            onClick={this.alertText}
          >Save</button>
          <button
            onClick={this.callWebSocket}
          >Call Websocket</button>
        </div>
        <MonacoEditor
          width="800"
          height="600"
          language="javascript"
          theme="vs-dark"
          value={code}
          options={options}
          onChange={code => this.setState({ code })}
          editorDidMount={this.editorDidMount}
        />
      </>
    );
  }
}

// render(<App />, document.getElementById("root"));
const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// export default App;

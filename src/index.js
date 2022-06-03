import React from 'react'
import ReactDOM from 'react-dom'
import Message from './js/Message'
import './css/style.css'
import Editor from "@monaco-editor/react";


console.log('monaco-editor'); 

ReactDOM.render(
  <Message />,
  document.getElementById('app') // eslint-disable-line no-undef
)

if(module.hot) // eslint-disable-line no-undef  
  module.hot.accept() // eslint-disable-line no-undef  


// function App() {
//   return (
//    <Editor
//      height="90vh"
//      defaultLanguage="javascript"
//      defaultValue="// some comment"
//    />
//   );
// }

// const rootElement = document.getElementById("app");
// ReactDOM.render(<App />, rootElement);
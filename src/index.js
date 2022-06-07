import React from 'react'
import ReactDOM from 'react-dom'
import TextEditor from './js/TextEditor'
import './css/style.css'



console.log('monaco-editor'); 

// ReactDOM.render(
//   <TextEditor />,
//   document.getElementById('app') // eslint-disable-line no-undef
// )

const rootElement = document.getElementById("app");
ReactDOM.render(
  <React.StrictMode>
    <TextEditor />
  </React.StrictMode>,
  rootElement
);

if(module.hot) // eslint-disable-line no-undef  
  module.hot.accept() // eslint-disable-line no-undef  

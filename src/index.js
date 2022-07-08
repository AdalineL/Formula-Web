import React from "react";
import ReactDOM from "react-dom";
import TextEditor from "./js/TextEditor";
import UserInput from "./js/userInput";
import "./css/style.css";
import "./css/xterm.css";

console.log("index");

ReactDOM.render(
  <React.StrictMode>
    <TextEditor />
  </React.StrictMode>,
  document.getElementById("app")
);
ReactDOM.render(
  <React.StrictMode>
    <UserInput />
  </React.StrictMode>,
  document.getElementById("secondHalf")
);

if (module.hot)
  // eslint-disable-line no-undef
  module.hot.accept(); // eslint-disable-line no-undef

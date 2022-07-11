/**
 *  @fileoverview Render the react components into their
 *  respective elements located in index.html
 */

import React from "react";
import ReactDOM from "react-dom";
import EditorArea from "./js/EditorArea";
import TerminalArea from "./js/TerminalArea";
import "./css/style.css";
import "./css/xterm.css";

//render the EditorArea react component into the "editor-area" div
ReactDOM.render(
  <React.StrictMode>
    <EditorArea />
  </React.StrictMode>,
  document.getElementById("editor-area")
);

//render the TerminalArea react component into the "terminal-area" div
ReactDOM.render(
  <React.StrictMode>
    <TerminalArea />
  </React.StrictMode>,
  document.getElementById("terminal-area")
);

if (module.hot) module.hot.accept();

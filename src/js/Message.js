// import React from 'react'

// const Message = () => {
//   return (
//     <div className="content">
//       <h1>Rexpack</h1>
//     </div>
//   )
// }

// export default Message

import React from "react";

import Editor from "@monaco-editor/react";

function Message() {
  return (
   <Editor
     height="90vh"
     defaultLanguage="javascript"
     defaultValue="// some comment"
   />
  );
}

export default Message
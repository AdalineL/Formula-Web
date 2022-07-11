/**
 *  @fileoverview Initiliazes a single WebSocket connection for each user so that users
 *  can make multiple calls to WebSocket (when they send their editor values
 *  or their user input values to the server) without the need for a new WebSocket connection
 *  in each call
 */

const ws = new WebSocket("ws://localhost:3030");

ws.onopen = () => {
  console.log("configSocket: connected");
};

console.log("configSocket: connected");

module.exports.ws = ws;

const ws = new WebSocket("ws://localhost:3030");

ws.onopen = () => {
  console.log("configSocket: connected");
};

console.log("configSocket: connected");

module.exports.ws = ws;
// export default ws;

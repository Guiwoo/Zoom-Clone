const fSocket = new WebSocket(`ws://${window.location.host}`);

fSocket.addEventListener("open", (e) => console.log("Connected to Server✅"));

fSocket.addEventListener("message", (e) =>
  console.log(`A message from backend ${e.data}`)
);

fSocket.addEventListener("close", (e) => console.log("Disconnected Server "));

setTimeout(() => {
  fSocket.send("From the browser");
}, 5000);

const ul = document.querySelector("ul");
const form = document.querySelector("form");
const fSocket = new WebSocket(`ws://${window.location.host}`);

fSocket.addEventListener("open", (e) => console.log("Connected to Server✅"));

fSocket.addEventListener("message", (e) =>
  console.log(`A message from backend ${e.data}`)
);

fSocket.addEventListener("close", (e) => console.log("Disconnected Server "));

const handleSubmit = (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  fSocket.send(input.value);
  input.value = "";
};

form.addEventListener("submit", handleSubmit);

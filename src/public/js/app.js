const ul = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nicknameForm = document.querySelector("#nickname");
const fSocket = new WebSocket(`ws://${window.location.host}`);

const makeMessage = (type, payload) => {
  const msg = { type, payload };
  return JSON.stringify(msg);
};

fSocket.addEventListener("open", (e) => console.log("Connected to Server✅"));
fSocket.addEventListener("message", (e) => {
  const li = document.createElement("li");
  li.innerText = e.data;
  ul.appendChild(li);
});
fSocket.addEventListener("close", (e) => console.log("Disconnected Server "));

const handleMessage = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  fSocket.send(makeMessage("new_message", input.value));
  const li = document.createElement("li");
  li.innerText = `You send:${input.value}`;
  ul.appendChild(li);
  input.value = "";
};

const handleNickname = (e) => {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  fSocket.send(makeMessage("nickname", input.value));
  input.value("");
};

messageForm.addEventListener("submit", handleMessage);
nicknameForm.addEventListener("submit", handleNickname);

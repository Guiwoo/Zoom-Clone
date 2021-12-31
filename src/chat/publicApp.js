const socket = io();

// const welcome = document.getElementById("welcome");
// const form = welcome.querySelector("form");
// const room = document.getElementById("room");

room.hidden = true;

let roomName = "";

const addMessage = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
};

const handleMessage = (e) => {
  e.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
};

const handleNickname = (e) => {
  e.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
  input.value = "";
};

const handleRoom = (e) => {
  e.preventDefault();
  const rNum = document.getElementById("rnum");
  const name = document.getElementById("name");
  roomName = rNum.value;
  socket.emit("enter_room", rNum.value, name.value, () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessage);
  });
};

form.addEventListener("submit", handleRoom);

socket.on("welcome", (user, number) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName} (${number})`;
  addMessage(`${user} Joined!`);
});
socket.on("bye", (user, number) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName} (${number})`;
  addMessage(`${user} Left`);
});

socket.on("new_message", addMessage);
socket.on("room_status", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

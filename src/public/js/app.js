const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const handleRoom = (e) => {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("servershit");
  });
  input.value = "";
};

form.addEventListener("submit", handleRoom);

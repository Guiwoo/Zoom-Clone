const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let myStream;
let muted = false;
let cameraOff = false;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((d) => d.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.deviceId;
      option.innerText = c.label;
      if (currentCamera.label == c.label) {
        option.selected = true;
      }
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(error);
  }
};

const getMedia = async (deviceid) => {
  const init = { audio: false, video: { facingMode: "user" } };
  const cameraConstrain = {
    auido: false,
    video: { deviceId: { exact: deviceid } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceid ? cameraConstrain : init
    );
    myFace.srcObject = myStream;
    if (!deviceid) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
};

getMedia();

const handleMuteBtn = (e) => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
};

const handleCameraBtn = (e) => {
  console.log(myStream.getVideoTracks());
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Camera On";
    cameraOff = true;
  }
};

const handleCameraChange = async () => {
  await getMedia(cameraSelect.value);
};

muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraBtn);
cameraSelect.addEventListener("input", handleCameraChange);

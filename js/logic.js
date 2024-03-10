const informationDialog = document.querySelector(
  ".action-buttons__info-dialog"
);
const informationButton = document.querySelector(".action-buttons__info");
const closeButton = document.querySelector(".info-dialog-close");

const muteButton = document.querySelector(".action-buttons__mute");
const muteIcon = document.querySelector(".action-buttons__mute-icon");

const backgroundSound = new Audio("../Sound/background.mp3");
const startingSound = new Audio("../Sound/yooooooooooo.mp3");
startingSound.play();
setTimeout(() => {
  backgroundSound.play();
}, 9000);

muteButton.addEventListener("click", () => {
  if (backgroundSound.muted) {
    backgroundSound.muted = false;
    startingSound.muted = false;
    muteIcon.classList.add("fa-volume-high");
    muteIcon.classList.remove("fa-volume-xmark");
  } else {
    backgroundSound.muted = true;
    startingSound.muted = true;
    muteIcon.classList.remove("fa-volume-high");
    muteIcon.classList.add("fa-volume-xmark");
  }
});

informationButton.addEventListener("click", () => {
  informationDialog.classList.add("action-buttons__info-dialog--slide-in");
  informationDialog.showModal();
});

informationDialog.addEventListener("animationend", () => {
  informationDialog.classList.remove("action-buttons__info-dialog--slide-in");
});

closeButton.addEventListener("click", () => {
  informationDialog.classList.add("action-buttons__info-dialog--slide-out");
  setTimeout(() => {
    informationDialog.close();
    informationDialog.classList.remove(
      "action-buttons__info-dialog--slide-out"
    );
  }, 1000);
});

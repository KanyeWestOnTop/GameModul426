const informationDialog = document.querySelector(
  ".action-buttons__info-dialog"
);
const informationButton = document.querySelector(".action-buttons__info");
const closeButton = document.querySelector(".info-dialog-close");

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

export function markCoordinate(x, y) {
  const markerX = document.createElement("div");
  markerX.classList.add("marker", "x");
  markerX.style.left = `${x}px`;
  markerX.style.top = `${y}px`;
  document.querySelector(".content").append(markerX);
  const markerY = document.createElement("div");
  markerY.classList.add("marker", "y");
  markerY.style.left = `${x}px`;
  markerY.style.top = `${y}px`;
  document.querySelector(".content").append(markerY);
}

let labelList;
let labelContainer;
let scrollOffset = 0;
const LABEL_HEIGHT = 25;
const CONTAINER_HEIGHT = 150;

document.addEventListener("DOMContentLoaded", () => {
  labelList = document.querySelector(".label-list");
  labelContainer = document.querySelector(".label-container");
  const paddingTop = CONTAINER_HEIGHT;
  labelList.style.paddingTop = `${paddingTop}px`;
});

export function addLabel(locationName, magnitude) {
  const label = document.createElement("div");
  label.classList.add("earthquake-label");
  label.textContent = `M${magnitude.toFixed(1)} - ${locationName}`;

  labelList.appendChild(label);

  scrollOffset += LABEL_HEIGHT;
  labelList.style.transform = `translateY(-${scrollOffset}px)`;
}

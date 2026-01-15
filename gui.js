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

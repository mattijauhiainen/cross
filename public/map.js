export function getMapDimensions() {
  const mapImage = document.querySelector(".content img");
  const imageWidth = mapImage.naturalWidth;
  const imageHeight = mapImage.naturalHeight;
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  const containerAspectRatio = containerWidth / containerHeight;
  const imageAspectRatio = imageWidth / imageHeight;
  if (imageAspectRatio >= containerAspectRatio) {
    const mapHeight = containerHeight;
    const scale = mapHeight / imageHeight;
    const mapWidth = scale * imageWidth;
    const mapXOverflow = mapWidth - containerWidth;
    return { mapWidth, mapHeight, mapXOverflow, mapYOverflow: 0 };
  } else {
    const mapWidth = containerWidth;
    const scale = mapWidth / imageWidth;
    const mapHeight = scale * imageHeight;
    const mapYOverflow = mapHeight - containerHeight;
    return { mapWidth, mapHeight, mapXOverflow: 0, mapYOverflow };
  }
}

export function latLngToPixel({
  mapWidth,
  mapHeight,
  lat,
  lng,
  mapXOverflow,
  mapYOverflow,
}) {
  const x = (lng + 180) * (mapWidth / 360);
  const latRadians = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRadians / 2));
  const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);
  const RX = 1;
  const RY = 1;
  return {
    x: x * RX - mapXOverflow / 2,
    y: y * RY - mapYOverflow / 2,
  };
}

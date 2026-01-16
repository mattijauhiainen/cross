import { promiseWithTimeout } from './promiseWithTimeout.js';

export async function animateInCrosshair() {
  const horizontalLine = document.querySelector('.crosshairs.horizontal')
  horizontalLine.classList.add('visible')
  document.querySelector('.crosshairs.vertical').classList.add('visible')
  await new Promise(resolve => {
    const handler = () => {
      setTimeout(resolve, 100);
      horizontalLine.removeEventListener('transitionend', handler);
    };
    horizontalLine.addEventListener('transitionend', handler);
  })
}

export async function moveToCoordinates(x, y) {
  const verticalLine = document.querySelector(".crosshairs.vertical");
  const horizontalLine = document.querySelector(".crosshairs.horizontal");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Extract translate values (relative to viewport center) and convert to absolute coordinates
  const currentXTransform = parseFloat(verticalLine.style.translate?.split(' ')[0]) || 0;
  const currentX = currentXTransform + viewportWidth / 2;

  const currentYTransform = parseFloat(horizontalLine.style.translate?.split(' ')[1]) || 0;
  const currentY = currentYTransform + viewportHeight / 2;

  const directDistanceX = Math.abs(x - currentX);
  const wrapDistanceX = viewportWidth - directDistanceX;
  const shouldWrapX = wrapDistanceX < directDistanceX;
  const effectiveDistanceX = shouldWrapX ? wrapDistanceX : directDistanceX;

  const directDistanceY = Math.abs(y - currentY);
  const wrapDistanceY = viewportHeight - directDistanceY;
  const shouldWrapY = wrapDistanceY < directDistanceY;
  const effectiveDistanceY = shouldWrapY ? wrapDistanceY : directDistanceY;

  const totalDistance = Math.sqrt(effectiveDistanceX ** 2 + effectiveDistanceY ** 2);
  const totalDuration = totalDistance / 0.35;

  await Promise.all([
    moveVerticalLine(verticalLine, x, currentX, totalDuration),
    moveHorizontalLine(horizontalLine, y, currentY, totalDuration)
  ]);
}

export async function moveVerticalLine(verticalLine, x, currentX, totalDuration) {
  const viewportWidth = window.innerWidth;
  const directDistanceX = Math.abs(x - currentX);
  const wrapDistanceX = viewportWidth - directDistanceX;
  const shouldWrapX = wrapDistanceX < directDistanceX;
  const effectiveDistanceX = shouldWrapX ? wrapDistanceX : directDistanceX;

  if (shouldWrapX) {
    let edgeX, oppositeEdgeX;
    if (x > currentX) {
      edgeX = 0;
      oppositeEdgeX = viewportWidth;
    } else {
      edgeX = viewportWidth;
      oppositeEdgeX = 0;
    }

    const distanceToEdge = Math.abs(edgeX - currentX);
    const distanceFromEdge = Math.abs(x - oppositeEdgeX);
    const durationToEdge = (distanceToEdge / effectiveDistanceX) * totalDuration;
    const durationFromEdge = (distanceFromEdge / effectiveDistanceX) * totalDuration;

    const { promise: toEdge, resolve: resolveToEdge } = promiseWithTimeout(durationToEdge + 30);
    const handlerToEdge = () => {
      verticalLine.removeEventListener('transitionend', handlerToEdge);
      resolveToEdge();
    };
    verticalLine.addEventListener('transitionend', handlerToEdge);
    verticalLine.style.transitionDuration = `${durationToEdge}ms`;
    verticalLine.style.translate = `${edgeX - viewportWidth / 2}px 0`;

    await toEdge;

    verticalLine.style.transitionDuration = '0ms';
    verticalLine.style.translate = `${oppositeEdgeX - viewportWidth / 2}px 0`;

    // Wait for the style to take effect
    await new Promise(resolve => setTimeout(resolve, 0))

    const { promise: fromEdge, resolve: resolveFromEdge } = promiseWithTimeout(durationFromEdge + 30);
    const handlerFromEdge = () => {
      verticalLine.removeEventListener('transitionend', handlerFromEdge);
      resolveFromEdge();
    };
    verticalLine.addEventListener('transitionend', handlerFromEdge);
    verticalLine.style.transitionDuration = `${durationFromEdge}ms`;
    verticalLine.style.translate = `${x - viewportWidth / 2}px 0`;

    await fromEdge;
  } else {
    const { promise, resolve } = promiseWithTimeout(totalDuration + 30);
    const handler = () => {
      verticalLine.removeEventListener('transitionend', handler);
      resolve();
    };
    verticalLine.addEventListener('transitionend', handler);
    verticalLine.style.transitionDuration = `${totalDuration}ms`;
    verticalLine.style.translate = `${x - viewportWidth / 2}px 0`;

    await promise;
  }
}

export async function moveHorizontalLine(horizontalLine, y, currentY, totalDuration) {
  const viewportHeight = window.innerHeight;
  const directDistanceY = Math.abs(y - currentY);
  const wrapDistanceY = viewportHeight - directDistanceY;
  const shouldWrapY = wrapDistanceY < directDistanceY;
  const effectiveDistanceY = shouldWrapY ? wrapDistanceY : directDistanceY;

  if (shouldWrapY) {
    let edgeY, oppositeEdgeY;
    if (y > currentY) {
      edgeY = 0;
      oppositeEdgeY = viewportHeight;
    } else {
      edgeY = viewportHeight;
      oppositeEdgeY = 0;
    }

    const distanceToEdge = Math.abs(edgeY - currentY);
    const distanceFromEdge = Math.abs(y - oppositeEdgeY);
    const durationToEdge = (distanceToEdge / effectiveDistanceY) * totalDuration;
    const durationFromEdge = (distanceFromEdge / effectiveDistanceY) * totalDuration;

    const { promise: toEdge, resolve: resolveToEdge } = promiseWithTimeout(durationToEdge + 30);
    const handlerToEdge = () => {
      horizontalLine.removeEventListener('transitionend', handlerToEdge);
      resolveToEdge();
    };
    horizontalLine.addEventListener('transitionend', handlerToEdge);
    horizontalLine.style.transitionDuration = `${durationToEdge}ms`;
    horizontalLine.style.translate = `0 ${edgeY - viewportHeight / 2}px`;

    await toEdge;

    horizontalLine.style.transitionDuration = '0ms';
    horizontalLine.style.translate = `0 ${oppositeEdgeY - viewportHeight / 2}px`;

    // Wait for the style to take effect
    await new Promise(resolve => setTimeout(resolve, 0))

    const { promise: fromEdge, resolve: resolveFromEdge } = promiseWithTimeout(durationFromEdge + 30);
    const handlerFromEdge = () => {
      horizontalLine.removeEventListener('transitionend', handlerFromEdge);
      resolveFromEdge();
    };
    horizontalLine.addEventListener('transitionend', handlerFromEdge);
    horizontalLine.style.transitionDuration = `${durationFromEdge}ms`;
    horizontalLine.style.translate = `0 ${y - viewportHeight / 2}px`;

    await fromEdge;
  } else {
    const { promise, resolve } = promiseWithTimeout(totalDuration + 30);
    const handler = () => {
      horizontalLine.removeEventListener('transitionend', handler);
      resolve();
    };
    horizontalLine.addEventListener('transitionend', handler);
    horizontalLine.style.transitionDuration = `${totalDuration}ms`;
    horizontalLine.style.translate = `0 ${y - viewportHeight / 2}px`;

    await promise;
  }
}


var currentKey = {};

function setKeyboardHandlers() {
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

function handleKeyDown(event) {
  currentKey[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentKey[event.keyCode] = false;
}

function handleKeys() {
  if(!playerLoaded || !terrainLoaded) {
    return;
  }

  if (currentKey[37]) {
    // Left cursor key
    fish.clockRotation = true;
  }
  else if(!currentKey[37]) {
    fish.clockRotation = false;
  }

  if (currentKey[39]) {
    // Right cursor key
    fish.antiClockRotation = true;
  }
  else if(!currentKey[39]) {
    fish.antiClockRotation = false;
  }

  if (currentKey[38]) {
    // Up cursor key
    fish.movingForward = true;
  }
  else if(!currentKey[38]) {
    fish.movingForward = false;
  }

  if (currentKey[40]) {
    // Down cursor key
  }
}

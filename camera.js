
function setupCamera() {
  camera.projectionMatrix = mat4.create();
  camera.viewMatrix = mat4.create();

  mat4.perspective(camera.projectionMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
  mat4.identity(camera.viewMatrix);
}

function renderCamera(meshObj) {
  if(playerLoaded == true && terrainLoaded == true) {
    var playerPosition = meshObj.positionVector;
    var cameraPosition = [0.0, 0.0, 0.0];
    var upVector = [0.0, 1.0, 0.0];

    var addVec = vec3.create();
    vec3.multiply(addVec, fish.directionVector, [-20.0, -20.0, -20.0]);
    vec3.add(addVec, addVec, [0.0, 5.0, 0.0]);
    vec3.add(cameraPosition, addVec, playerPosition);

    camera.positionVector = cameraPosition;
    mat4.lookAt(camera.viewMatrix, cameraPosition, playerPosition, upVector);
  }
}

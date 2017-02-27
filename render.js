
function sceneSetup(playerContainer, terrainContainer) {
  setupCamera();

  setupMainPlayer(playerContainer);
  setupTerrain(terrainContainer);
}

function handleLoadedTexture(texture, isRepeat) {
  var repeatVal;
  if(isRepeat) {
    repeatVal = gl.REPEAT;
  }
  else {
    repeatVal = gl.CLAMP_TO_EDGE;
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeatVal);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeatVal);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function genMesh(container) {
  var objStr = document.getElementById(container).innerHTML;
  var mesh = new OBJ.Mesh(objStr);

  OBJ.initMeshBuffers(gl, mesh);
  mesh.modelMatrix = mat4.create();

  return mesh;
}

function genTexture(imageSrc, obj, loaded) {
  var texture = gl.createTexture();
  texture.image = new Image();
  texture.image.onload = function () {
    obj.appliedTexture = texture;

    if(loaded == "player") {
      handleLoadedTexture(texture, false);
      playerLoaded = true;
    }
    else if(loaded == "terrain") {
      handleLoadedTexture(texture, true);
      terrainLoaded = true;
    }
  }
  texture.image.src = imageSrc;
}

function setupRenderBuffers(meshObj) {
  gl.bindBuffer(gl.ARRAY_BUFFER, meshObj.vertexBuffer);
  gl.vertexAttribPointer(shaderId.vertexPosition, meshObj.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, meshObj.textureBuffer);
  gl.vertexAttribPointer(shaderId.vertexTexture, meshObj.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

  // gl.bindBuffer(gl.ARRAY_BUFFER, meshObj.normalBuffer);
  // gl.vertexAttribPointer(shaderId.vertexNormal, meshObj.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshObj.indexBuffer);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, meshObj.appliedTexture);
  gl.uniform1i(shaderId.texture, 0);
}

function setTransform(meshObj) {
  gl.uniformMatrix4fv(shaderId.projectionMatrix, false, camera.projectionMatrix);
  gl.uniformMatrix4fv(shaderId.viewMatrix, false, camera.viewMatrix);
  gl.uniformMatrix4fv(shaderId.modelMatrix, false, meshObj.modelMatrix);
}


function setupTerrain(container) {
  $("#"+container).load("containerModels/terrain_mesh.html", function() {
    terrain = genMesh("terrain_mesh");
    genTexture("Textures/terrain_sand.jpg", terrain, "terrain");
  });
}

function setupMainPlayer(container) {
  $("#"+container).load("containerModels/fish_mesh.html", function() {
    fish = genMesh("fish_mesh");
    genTexture("Textures/fish_body2.jpg", fish, "player");

    fish.directionVector = [-0.5, 0.0, 0.0];
    fish.rightVector = [0.0, 0.0, -0.5];
    fish.translationVector = [0.0, 0.0, 0.0];
    fish.positionVector = [0.0, 0.0, 0.0];
    fish.theta = 0.0;

    fish.movingForward = false;
    fish.clockRotation = false;
    fish.antiClockRotation = false;
  });
}

function renderTerrain() {
  if(terrainLoaded == true) {

    setupRenderBuffers(terrain);
    mat4.translate(terrain.modelMatrix, terrain.modelMatrix, [0.0, 0.0, 0.0]);
    setTransform(terrain);

    gl.drawElements(gl.TRIANGLES, terrain.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  }
}

function renderPlayer() {
  if(playerLoaded == true) {

    setupRenderBuffers(fish);

    var theta = fish.clockRotation ? 1.0 : 0.0;
    theta = fish.antiClockRotation ? -1.0 : theta;

    fish.theta = (fish.theta + theta) % 360;

    var transVec = fish.movingForward ? fish.directionVector : [0.0, 0.0, 0.0];
    var finVec = vec3.create();
    vec3.add(finVec, transVec, fish.positionVector);

    var axis = vec3.create();
    vec3.cross(axis, fish.rightVector, fish.directionVector);

    var quatVec = quat.create();
    quat.rotateY(quatVec, quatVec, glMatrix.toRadian(fish.theta));
    mat4.fromRotationTranslation(fish.modelMatrix, quatVec, finVec);

    vec3.transformMat4(fish.positionVector, [0.0, 0.0, 0.0], fish.modelMatrix);

    vec3.rotateY(fish.directionVector, fish.directionVector, [0.0, 0.0, 0.0], glMatrix.toRadian(theta));
    vec3.rotateY(fish.rightVector, fish.rightVector, [0.0, 0.0, 0.0], glMatrix.toRadian(theta));

    setTransform(fish);

    gl.drawElements(gl.TRIANGLES, fish.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  }
}

function tick() {
  requestAnimFrame(tick);
  drawScene();
}

function drawScene() {
  gl.clearColor(0.0, 159.0/255.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  handleKeys();

  renderCamera(fish);

  renderPlayer();
  renderTerrain();
}

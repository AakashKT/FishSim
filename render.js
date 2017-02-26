
function sceneSetup() {
  setupMainPlayer();
}

function handleLoadedTexture(texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

function setupMainPlayer() {

  $("#fish_mesh_div").load("fish_mesh.html", function() {
    var objStr = document.getElementById("fish_mesh").innerHTML;
    var mesh = new OBJ.Mesh(objStr);

    OBJ.initMeshBuffers(gl, mesh);
    fish = mesh;

    var texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
      fish.appliedTexture = texture;
      handleLoadedTexture(texture);
      playerLoaded = true;
    }

    texture.image.src = "Textures/fish_body2.jpg";
  });

  /*
  fish.vertBuffer = gl.createBuffer();
  fish.colorBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, fish.vertBuffer);
  var verts = [
    0.0,  1.0,  0.0,
   -1.0, -1.0,  0.0,
    1.0, -1.0,  0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, fish.colorBuffer);
  var color = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
  */
}

function setTransform() {
  gl.uniformMatrix4fv(shaderId.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(shaderId.viewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(shaderId.modelMatrix, false, modelMatrix);
}

function tick() {
  requestAnimFrame(tick);

  //animate();
  initMatrices();
  drawScene();
}

function renderPlayer() {
  if(playerLoaded == true) {
    gl.bindBuffer(gl.ARRAY_BUFFER, fish.vertexBuffer);
    gl.vertexAttribPointer(shaderId.vertexPosition, fish.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, fish.textureBuffer);
    gl.vertexAttribPointer(shaderId.vertexTexture, fish.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // gl.bindBuffer(gl.ARRAY_BUFFER, fish.normalBuffer);
    // gl.vertexAttribPointer(shaderId.vertexNormal, fish.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fish.indexBuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fish.appliedTexture);
    gl.uniform1i(shaderId.texture, 0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, projectionMatrix);
    mat4.translate(modelMatrix, [0.0, 0.0, -10.0]);
    setTransform();

    gl.drawElements(gl.TRIANGLES, fish.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
  }
}

function drawScene() {

  renderPlayer();
  /*
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, projectionMatrix);

  mat4.translate(modelMatrix, [0.0, 0.0, -0.5]);

  gl.bindBuffer(gl.ARRAY_BUFFER, fish.vertBuffer);
  gl.vertexAttribPointer(shaderId.vertexPosition, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, fish.colorBuffer);
  gl.vertexAttribPointer(shaderId.vertexColor, 4, gl.FLOAT, false, 0, 0);

  setTransform();
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  */
}

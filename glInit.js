
var gl;
var shaderId;

function glSetup(canvasId) {
  var canvas = document.getElementById(canvasId);

  initGl(canvas);
  initShaders();
  setKeyboardHandlers();
}

function initGl(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = 1024;
    gl.viewportHeight = 768;
  }
  catch(e) {
    console.log("Somthing went wrong in initGl");
  }

  if(!gl) {
    console.log("GL object was not initialised");
  }
}

function initShaders() {
  var fragmentShader = getShader(gl, "fragmentShader");
  var vertexShader= getShader(gl, "vertexShader");

  shaderId = gl.createProgram();
  gl.attachShader(shaderId, vertexShader);
  gl.attachShader(shaderId, fragmentShader);
  gl.linkProgram(shaderId);

  if (!gl.getProgramParameter(shaderId, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
  }

  gl.useProgram(shaderId);

  shaderId.vertexPosition = gl.getAttribLocation(shaderId, "position");
  gl.enableVertexAttribArray(shaderId.vertexPosition);

  shaderId.vertexTexture = gl.getAttribLocation(shaderId, "textureCoords");
  gl.enableVertexAttribArray(shaderId.vertexTexture);

  //shaderId.vertexNormal = gl.getAttribLocation(shaderId, "normalVec");
  //gl.enableVertexAttribArray(shaderId.vertexNormal);

  shaderId.projectionMatrix = gl.getUniformLocation(shaderId, "projection");
  shaderId.viewMatrix = gl.getUniformLocation(shaderId, "view");
  shaderId.modelMatrix = gl.getUniformLocation(shaderId, "model");
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

let objectDetector;
let video;
let objects = [];
let modelLoaded = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, () => {
    video.size(540, 380);
    document.getElementById('camera-container').appendChild(video.elt);
    objectDetector = ml5.objectDetector('cocossd', modelReady);
  });
  document.getElementById('snapshot-btn').addEventListener('click', takeSnapshot);
}

function modelReady() {
  modelLoaded = true;
  document.querySelector("#model-feedback").style.visibility = "hidden";
}

function takeSnapshot() {
  image(video, 0, 0, width, height);
  objectDetector.detect(canvas, gotResult);
}

function gotResult(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  objects = results;
  displayObjects();
}

function displayObjects() {
  let resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; 
  for (let i = 0; i < objects.length; i++) {
    if (objects[i].confidence > 0.5) {
      noStroke();
      fill(69, 113, 207);
      text(objects[i].label + " " + nfc(objects[i].confidence * 100.0, 2) + "%", objects[i].x + 8, objects[i].y + 12);
      noFill();
      strokeWeight(4);
      stroke(69, 113, 207);
      rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
    }
  }
}

let handpose;
let video;
let predictions = [];
let modelLoaded = false;
let bubbles = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  handpose.on("predict", results => {
    predictions = results;
  });

  video.hide();

  // Afbeelding laden en bubbels initialiseren
  loadImage('images/bubble.png', img => {
    for (let i = 0; i < 10; i++) { // 10 bubbels toegevoegd
      let x = random(width);
      let y = random(height);
      let size = random(20, 70); // Willekeurige grootte tussen 20 en 70
      let speedX = random(-1, 1); // Willekeurige horizontale snelheid
      let speedY = random(-1, 1); // Willekeurige verticale snelheid
      bubbles.push(new Bubble(x, y, size, img, speedX, speedY)); // Bewegingssnelheden toegevoegd
    }
  });
}

function modelReady() {
  console.log("Model ready!");
  modelLoaded = true;
}

function draw() {
  frameRate(30);
  if (modelLoaded) {
    image(video, 0, 0, width, height);
    drawFingers();
    updateBubbles();
    drawBubbles();
    checkBubblePop();
  }
}

function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

function drawFingers() {
  console.log(predictions);
  push();
  rectMode(CORNERS);
  noStroke();
  fill('#3478dd');
  if (predictions[0] && predictions[0].hasOwnProperty('annotations')) {
    let index1 = predictions[0].annotations.indexFinger[0];
    let index2 = predictions[0].annotations.indexFinger[1];
    let index3 = predictions[0].annotations.indexFinger[2];
    let index4 = predictions[0].annotations.indexFinger[3];
    circle(index4[0], index4[1], 10); // index4[2]);
  }
  pop();
}

function updateBubbles() {
  for (let i = 0; i < bubbles.length; i++) { // Loop door alle bubbels
    bubbles[i].move(); // Beweeg elke bubbel
  }
}

function drawBubbles() {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].display();
  }
}

function checkBubblePop() {
  if (predictions.length > 0) {
    let indexFinger = predictions[0].annotations.indexFinger[3];
    for (let i = bubbles.length - 1; i >= 0; i--) {
      let d = dist(indexFinger[0], indexFinger[1], bubbles[i].x, bubbles[i].y);
      if (d < bubbles[i].size / 2) { // Vinger binnen de bubbel
        bubbles.splice(i, 1);
      }
    }
    if (bubbles.length === 0) { // Als er geen bubbels meer zijn
      gameOver(); // Roep de gameOver functie aan
    }
  }
}

function gameOver() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill('#3478dd');
  textStyle(BOLD);
  text("Je hebt de laatste bubbel kunnen poppen!\nGefeliciteerd, je hebt het spel voltooid.",  width / 2, height / 2);
  noLoop(); // Stop het tekenen van het canvas
}

class Bubble {
  constructor(x, y, size, img, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;
    this.speedX = speedX; // Horizontale snelheid
    this.speedY = speedY; // Verticale snelheid
  }

  move() {
    // Bubbels bewegen willekeurig
    this.x += this.speedX;
    this.y += this.speedY;

    // Bubbels stuiteren terug als ze de rand van het canvas raken
    if (this.x <= 0 || this.x >= width) {
      this.speedX *= -1;
    }
    if (this.y <= 0 || this.y >= height) {
      this.speedY *= -1;
    }
  }

  display() {
    image(this.img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
  }
}

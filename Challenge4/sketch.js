const questions = [
    "Would you rather read or do sports?",
    "Would you rather have invisibility or flight?",
    "Would you rather live in the mountains or at the beach?",
    "Would you rather prefer winter or summer?",
    "Would you rather play video games or go to the gym?",
    "Would you rather eat something salty or sweet?",
    "Would you rather watch a horror movie or a romantic movie?",
    "Would you rather study scientific subjects or humanistic subjects?",
    "Would you rather eat sushi or pizza?",
    //"Would you rather have a elegant style or an sporty style?",
];

const choices = [
    { left: "images/read.jpg", right: "images/sport.jpg" },
    { left: "images/invisibility.jpg", right: "images/flight.jpg" },
    { left: "images/mountain.jpg", right: "images/beach.jpg" },
    { left: "images/winter.jpg", right: "images/summer.jpg" },
    { left: "images/videogames.jpg", right: "images/gym.jpg" },
    { left: "images/salty.jpg", right: "images/sweet.jpg" },
    { left: "images/horrormovie.jpg", right: "images/romanticmovie.jpg" },
    { left: "images/scientific.jpg", right: "images/humanistic.jpg" },
    { left: "images/sushi.jpg", right: "images/pizza.jpg" },
    //{ left: "images/elegantstyle.jpg", right: "images/sportystyle.jpg" },
];

let currentQuestionIndex = 0;
let rightCount = 0;
let leftCount = 0;

function displayQuestion(index) {
    const question = questions[index];
    const choice = choices[index];

    // Toon de vraag
    document.getElementById('question').innerText = question;

    // Stel de bronnen van de afbeeldingen in
    document.getElementById('leftChoice').src = choice.left;
    document.getElementById('rightChoice').src = choice.right;

    // Toon de keuze knoppen en verberg de "Ga Verder" knop en het antwoord
    document.getElementById('choices').style.display = 'block';
    document.getElementById('continueButton').style.display = 'none';
    document.getElementById('answer').style.display = 'none';
}

// Detecteer bewegingen van het apparaat en neem keuzes op basis van de beweging
window.addEventListener("deviceorientation", handleOrientation, true);

function handleOrientation(event) {
    const gamma = event.gamma;

    if (gamma > 15) {
        // Beweging naar rechts
        chooseRight();
    } else if (gamma < -15) {
        // Beweging naar links
        chooseLeft();
    }
}

function chooseLeft() {
    leftCount++;
    //const currentChoice = "Left";
    //document.getElementById('answer').innerText = currentChoice;
    const choiceImage = document.getElementById('leftChoice').src;
    document.getElementById('answer').innerHTML = `<img src="${choiceImage}" alt="Left">`;
    // Antwoord en de "Ga Verder" knop tonen, keuze knoppen verbergen
    document.getElementById('answer').style.display = 'block';
    document.getElementById('continueButton').style.display = 'block';
    document.getElementById('choices').style.display = 'none';
}

function chooseRight() {
    rightCount++;
    //const currentChoice = "Right";
    //document.getElementById('answer').innerText = currentChoice;
    const choiceImage = document.getElementById('rightChoice').src;
    document.getElementById('answer').innerHTML = `<img src="${choiceImage}" alt="Right">`;
    // Antwoord en de "Ga Verder" knop tonen, keuze knoppen verbergen
    document.getElementById('answer').style.display = 'block';
    document.getElementById('continueButton').style.display = 'block';
    document.getElementById('choices').style.display = 'none';
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion(currentQuestionIndex);
    } else {
        // Alle vragen zijn beantwoord
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('resultContainer').style.display = 'block';
        // Resultaat op basis van de keuzes van de gebruiker
        displayResult();
    }
}

function displayResult() {
    let result;
    let resultImage;
    if (rightCount > leftCount) {
        resultImage = document.createElement('img');
        resultImage.src = "images/golden_retriever.jpg";
        resultImage.alt = "golden retriever";
    } else if (leftCount > rightCount) {
        resultImage = document.createElement('img');
        resultImage.src = "images/black_cat.jpg";
        resultImage.alt = "black cat";
    } else {
        result = "gelijkspel"; // mag nooit gebeuren --> daarom altijd oneven vragen
    }

    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = ''; 
    if (resultImage) {
        resultContainer.appendChild(resultImage);
    } else {
        resultContainer.innerText = result;
    }
}

// Start het spel door de eerste vraag weer te geven
displayQuestion(0);

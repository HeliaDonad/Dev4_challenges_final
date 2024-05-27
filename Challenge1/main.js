const synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();

utterance.lang = "nl-BE";
utterance.pitch = 1.2;
utterance.rate = 0.9;

synth.onvoiceschanged = () => {
  let voices = synth.getVoices().filter(matchVoiceToLang);
  console.log(voices);
  utterance.voice = voices[2];
}

function matchVoiceToLang(voice) {
  if (voice.lang == utterance.lang) {
    return true;
  }
  return false;
}

document.querySelector("#voorleesBtn").addEventListener("click", readQuestion);

const antwoordBtn = document.querySelector("#antwoordBtn");
const nextBtn = document.querySelector("#nextBtn"); // Knop voor volgende vraag
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'nl-BE';

let currentQuestionIndex = 0;

const questions = [
  {
    question: "In welke Belgische stad bevindt zich het beroemde surrealistische kunstmuseum ontworpen door René Magritte?",
    correctAnswer: "Brussel",
    image: "images/magritte.jpg"
  },
  {
    question: "Wat is het beroemde standbeeld dat bekend staat als het symbool van Brussel en afgebeeld wordt als een plassend jongetje?",
    correctAnswer: "Manneken Pis",
    image: "images/manneken-pis.jpg"
  },
  {
    question: "Welke Belgische stripheld heeft een hond genaamd Bobbie en beleeft spannende avonturen?",
    correctAnswer: "Kuifje",
    image: "images/kuifje.png"
  },
  {
    question: "Hoe noem je het grote metalen monument in Brussel?",
    correctAnswer: "Atomium",
    image: "images/atomium.jpg"
  },
  {
    question: "Hoe heet de slechterik die altijd probeert om de Smurfen te vangen?",
    correctAnswer: "Gargamel",
    image: "images/gargamel.jpg"
  },
];

function readQuestion() {
  const question = questions[currentQuestionIndex];
  utterance.text = question.question;
  document.querySelector("#output").innerHTML = ""; // Leeg de output container
  const imageContainer = document.querySelector("#image");
  imageContainer.innerHTML = `<img src="${question.image}" alt="Afbeelding bij vraag">`;
  synth.speak(utterance);
}

recognition.onresult = function(event) {
    console.log("Speech recognition result ontvangen...");
    const speechResult = event.results[0][0].transcript;
    console.log("Spraakherkenningsresultaat:", speechResult);
    const question = questions[currentQuestionIndex];
    const answerContainer = document.querySelector("#output");
    
    if (speechResult === question.correctAnswer) {
      answerContainer.innerHTML = "<span class='correct'>Correct: " + question.correctAnswer + "</span>";
      nextBtn.style.display = "inline"; // Toon de knop voor de volgende vraag
    } else {
      answerContainer.innerHTML = "<span class='incorrect'>Fout: " + speechResult + "</span>";
    }
    
    antwoordBtn.disabled = false;
};

antwoordBtn.addEventListener("click", function() {
    console.log("Antwoordknop geklikt...");
    recognition.start();
    antwoordBtn.disabled = true;
  });

nextBtn.addEventListener("click", function() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    readQuestion();
    nextBtn.style.display = "none"; // Verberg de knop voor de volgende vraag
  } else {
    document.querySelector("#output").innerHTML = "<span class='correct'>Proficiat! Alle vragen zijn beantwoord!</span>";
    document.querySelector("#answers").innerHTML = ""; // Leeg de antwoordlijst
  }
});

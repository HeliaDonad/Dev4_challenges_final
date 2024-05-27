const map = L.map('map').setView([0, 0], 2); // Default view

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// locaties + vragen
const sevenWonders = [
  { name: "Chichén Itzá", coords: [20.6830, -88.5686], question: "Welke oude Maya-stad staat bekend om zijn piramide, El Castillo, waarvan de trappen fungeren als een kalender met 365 treden?", answer: "Chichén Itzá" }, // Mexico
  { name: "Christus de Verlosser", coords: [-22.9519, -43.2105], question: "Op welke berg staat het iconische Jezusbeeld dat uitkijkt over Rio de Janeiro?", answer: "Corcovadoberg" }, // Brazilië
  { name: "Het Colosseum", coords: [41.8902, 12.4922], question: "Hoe heet het beroemde amfitheater in Rome dat ooit werd gebruikt voor gladiatorengevechten?", answer: "Colosseum" },
  { name: "De Chinese Muur", coords: [40.4319, 116.5704], question: "Welke oude nomadische stam vormde een van de belangrijkste bedreigingen voor China en leidde tot de bouw van de Grote Muur?", answer: "Hunnen" },
  { name: "Petra", coords: [30.3285, 35.4427], question: "Petra was ooit de hoofdstad van welk koninkrijk en staat bekend om zijn prachtige rotsarchitectuur?", answer: "Nabateese koninkrijk" }, // Jordanië
  { name: "Machu Picchu", coords: [-13.1631, -72.5450], question: "Hoe heet deze oude Inca-stad, hoog in de Andes en omringd door spectaculaire bergen?", answer: "Machu Picchu" }, // Peru
  { name: "Taj Mahal", coords: [27.1751, 78.0421], question: "In welk land bevindt zich de Taj Mahal?", answer: "India" }
];

let correctAnswers = 0; // juiste antwoorden
let visitedWonders = new Set(); // 

// marker voor wonderen
sevenWonders.forEach(wonder => {
  L.marker(wonder.coords).addTo(map)
    .bindPopup(`<b>${wonder.name}</b><br>Vind het antwoord op deze vraag: ${wonder.question}`);
});

// locatie verandering
map.on('locationfound', onLocationFound);
map.locate({ setView: true, maxZoom: 16, watch: true });

let locationMarker;
let locationCircle;
let destinationMarker;

function onLocationFound(e) {
  const userLat = e.latitude;
  const userLon = e.longitude;

  // afstand tss wereldwonderen
  sevenWonders.forEach(wonder => {
    const distance = calculateDistance(userLat, userLon, wonder.coords[0], wonder.coords[1]);
    if (distance < 0.1) { // Within 100 meters
      if (!visitedWonders.has(wonder.name)) { // werelwonder al gedaan of niet?
        visitedWonders.add(wonder.name); // wereldwonder gedaan
        askQuestion(wonder); // vraag stellen
      }
      if (visitedWonders.size === 7) { // alle wonderen gezien?
        congratulatePlayer();
      }
    }
  });

  var radius = e.accuracy;
  if (locationMarker) {
    locationMarker.setLatLng(e.latlng);
    locationCircle.setLatLng(e.latlng);
  } else {
    locationMarker = L.marker(e.latlng).addTo(map)
      .bindPopup("Neem het vliegtuig en verken het volgend modern wereldwonder!").openPopup();
    locationCircle = L.circleMarker(e.latlng, radius).addTo(map);
  }

  if (destinationMarker) {
    map.removeLayer(destinationMarker);
  }

  // afstand volgende wereldwonder
  const nextWonder = getNextWonder(e.latlng.lat, e.latlng.lng);
  if (nextWonder) {
    destinationMarker = new L.marker(nextWonder.coords, {
      draggable: true,
      autoPan: true
    }).addTo(map);
    destinationMarker.bindPopup(`Ga naar ${nextWonder.name}`).openPopup();
  }
}

// vraag stellen
function askQuestion(wonder) {
  const userAnswer = prompt(wonder.question);
  if (userAnswer) {
    // Correct of incorrect?
    if (userAnswer.toLowerCase() === wonder.answer.toLowerCase()) {
      correctAnswers++; // antwoorden +1
      alert("Correct!");
    } else {
      alert("Incorrect!");
    }
  }
}

// proficiat + einde tocht
function congratulatePlayer() {
  alert(`Proficiat! Je hebt alle zeven moderne wereldwonderen verkend!\nScore: ${correctAnswers}/7 voor de vragen.`);
}

// afstand tussen punten
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

// ga naar volgende wereldwonder
function getNextWonder(userLat, userLon) {
  let nearestWonder;
  let minDistance = Infinity;
  sevenWonders.forEach(wonder => {
    const distance = calculateDistance(userLat, userLon, wonder.coords[0], wonder.coords[1]);
    if (distance < minDistance && !visitedWonders.has(wonder.name)) {
      minDistance = distance;
      nearestWonder = wonder;
    }
  });
  return nearestWonder;
}

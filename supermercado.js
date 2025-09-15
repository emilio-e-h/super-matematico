// Firebase is initialized in the HTML file, so we can access it from here
// We need to wait for the Firebase initialization to be complete.
window.addEventListener('load', () => {
    window.firebaseInit();
});

// COPIA Y PEGA AQUÍ TU OBJETO firebaseConfig DE TU PROYECTO.
// EJEMPLO: const firebaseConfig = { ... };
const firebaseConfig = {
    // Pegar tu configuración aquí
  apiKey: "AIzaSyDL7VQsqu0ESib7wt-XZr82sPUf8nwJ2Hc",
  authDomain: "supermercado-app-169e8.firebaseapp.com",
  projectId: "supermercado-app-169e8",
  storageBucket: "supermercado-app-169e8.firebasestorage.app",
  messagingSenderId: "536220422321",
  appId: "1:536220422321:web:39eb290be34250ed095290",
  measurementId: "G-X0FJ1ST7P9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const products = [
    { name: "Manzanas", price: 2.50 },
    { name: "Plátanos", price: 1.80 },
    { name: "Leche", price: 3.25 },
    { name: "Pan", price: 2.00 },
    { name: "Huevos", price: 4.50 },
    { name: "Cereal", price: 5.75 },
    { name: "Queso", price: 7.90 },
    { name: "Jugo", price: 3.00 },
    { name: "Galletas", price: 2.20 },
    { name: "Pollo", price: 10.50 }
];

// UI elements
const loadingScreen = document.getElementById('loading-screen');
const registrationScreen = document.getElementById('registration-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const scoresScreen = document.getElementById('scores-screen');

const registrationForm = document.getElementById('registration-form');
const studentNameInput = document.getElementById('student-name');
const studentGroupInput = document.getElementById('student-group');

const challengeCounter = document.getElementById('challenge-counter');
const timerDisplay = document.getElementById('timer');
const productListContainer = document.querySelector('.product-list');
const challengeBox = document.getElementById('challenge-box');
const userAnswerInput = document.getElementById('user-answer');
const checkButton = document.getElementById('check-button');
const resultMessage = document.getElementById('result-message');
const finalScoreDisplay = document.getElementById('final-score');
const saveScoreButton = document.getElementById('save-score-button');
const viewAllScoresButton = document.getElementById('view-all-scores-button');
const scoresTableBody = document.getElementById('scores-table-body');
const backToResultsButton = document.getElementById('back-to-results-button');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const closeModalButton = document.getElementById('close-modal-button');

// Game state variables
let currentChallenge = [];
let correctTotal = 0;
let userScore = 0;
let currentChallengeNumber = 1;
const totalChallenges = 5;
let timerId;
const timeLimit = 90;
let timeLeft = timeLimit;

let studentName = "";
let studentGroup = "";

// Function to show modal messages
function showModal(title, message) {
    modalTitle.textContent = title;
    modalText.textContent = message;
    modal.style.display = 'flex';
}

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to render products on screen
function renderProducts() {
    productListContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <p class="product-name">${product.name}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
        `;
        productListContainer.appendChild(productCard);
    });
}

// Function to start the timer for a challenge
function startTimer() {
    timeLeft = timeLimit;
    timerDisplay.textContent = `${timeLeft}s`;
    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            handleChallengeResult(false, "¡Se acabó el tiempo!");
        }
    }, 1000);
}

// Function to generate a new challenge
function generateNewChallenge() {
    // Reset state for new challenge
    userAnswerInput.value = '';
    resultMessage.classList.add('hidden');
    checkButton.classList.remove('hidden');

    challengeCounter.textContent = `Desafío ${currentChallengeNumber} de ${totalChallenges}`;

    const shuffledProducts = shuffleArray([...products]);
    const numberOfItems = Math.floor(Math.random() * 3) + 2;
    currentChallenge = shuffledProducts.slice(0, numberOfItems);

    let challengeText = "Compra: ";
    let total = 0;
    currentChallenge.forEach((item, index) => {
        challengeText += `${item.name}`;
        if (index < currentChallenge.length - 1) {
            challengeText += " y ";
        }
        total += item.price;
    });

    correctTotal = total;
    challengeBox.textContent = challengeText;

    startTimer();
}

// Function to handle the result of a challenge
function handleChallengeResult(isCorrect, message) {
    clearInterval(timerId);
    checkButton.classList.add('hidden');
    resultMessage.classList.remove('hidden');

    if (isCorrect) {
        userScore++;
        resultMessage.textContent = `¡Correcto! El total es $${correctTotal.toFixed(2)}.`;
        resultMessage.className = 'result-message correct';
        showModal("¡Felicitaciones!", "¡Has calculado el total correctamente!");
    } else {
        resultMessage.textContent = `¡Incorrecto! La respuesta correcta era $${correctTotal.toFixed(2)}.`;
        resultMessage.className = 'result-message incorrect';
        showModal("Incorrecto", message);
    }

    setTimeout(() => {
        currentChallengeNumber++;
        if (currentChallengeNumber <= totalChallenges) {
            generateNewChallenge();
        } else {
            showFinalResults();
        }
    }, 2000);
}

// Function to display final results
function showFinalResults() {
    gameScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = `${userScore} / ${totalChallenges}`;
}

// Function to save score to Firestore
async function saveScoreToFirestore() {
    try {
        const scoresCollection = window.collection(window.db, `artifacts/${window.appId}/public/data/scores`);
        await window.addDoc(scoresCollection, {
            name: studentName,
            group: studentGroup,
            score: userScore,
            timestamp: new Date().toISOString()
        });
        showModal("Puntuación Guardada", "Tu puntuación se ha guardado exitosamente.");
        saveScoreButton.disabled = true;
        saveScoreButton.textContent = "Puntuación guardada";
    } catch (error) {
        console.error("Error al guardar la puntuación:", error);
        showModal("Error", "No se pudo guardar la puntuación. Por favor, inténtalo de nuevo.");
    }
}

// Function to load and display all scores
async function loadScoresFromFirestore() {
    scoresTableBody.innerHTML = '';
    try {
        const scoresCollection = window.collection(window.db, `artifacts/${window.appId}/public/data/scores`);
        const scoresSnapshot = await window.getDocs(scoresCollection);
        
        let scores = [];
        scoresSnapshot.forEach(doc => {
            scores.push(doc.data());
        });

        // Sort scores by timestamp in the client side (newest first)
        scores.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        scores.forEach(score => {
            const row = document.createElement('tr');
            row.className = 'border-b';
            row.innerHTML = `
                <td class="py-2 px-4">${score.name}</td>
                <td class="py-2 px-4">${score.group}</td>
                <td class="py-2 px-4">${score.score}</td>
                <td class="py-2 px-4">${new Date(score.timestamp).toLocaleString()}</td>
            `;
            scoresTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error al cargar las puntuaciones:", error);
        showModal("Error", "No se pudo cargar la lista de puntuaciones.");
    }
}

// Event Listeners
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    studentName = studentNameInput.value;
    studentGroup = studentGroupInput.value;
    registrationScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    renderProducts();
    generateNewChallenge();
});

checkButton.addEventListener('click', () => {
    const userAnswer = parseFloat(userAnswerInput.value);
    if (isNaN(userAnswer)) {
        showModal("Error", "Por favor, introduce un número válido.");
        return;
    }

    if (Math.abs(userAnswer - correctTotal) < 0.01) {
        handleChallengeResult(true, "");
    } else {
        handleChallengeResult(false, "Sigue practicando. El total correcto es $" + correctTotal.toFixed(2) + ".");
    }
});

saveScoreButton.addEventListener('click', saveScoreToFirestore);

viewAllScoresButton.addEventListener('click', () => {
    resultsScreen.classList.add('hidden');
    scoresScreen.classList.remove('hidden');
    loadScoresFromFirestore();
});

backToResultsButton.addEventListener('click', () => {
    scoresScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
});

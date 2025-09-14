// Data with products and prices
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

let currentChallenge = [];
let correctTotal = 0;

const productListContainer = document.querySelector('.product-list');
const challengeBox = document.getElementById('challenge-box');
const userAnswerInput = document.getElementById('user-answer');
const checkButton = document.getElementById('check-button');
const resultMessage = document.getElementById('result-message');
const newChallengeButton = document.getElementById('new-challenge-button');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');
const closeModalButton = document.getElementById('close-modal-button');

function showModal(title, message) {
    modalTitle.textContent = title;
    modalText.textContent = message;
    modal.style.display = 'flex';
}

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to render products
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

// Function to generate a new challenge
function generateNewChallenge() {
    const shuffledProducts = shuffleArray([...products]);
    const numberOfItems = Math.floor(Math.random() * 3) + 2; // Buy between 2 and 4 items
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

    userAnswerInput.value = '';
    resultMessage.textContent = '';
    resultMessage.classList.add('hidden');
    checkButton.classList.remove('hidden');
    newChallengeButton.classList.add('hidden');
}

// Event listener for the "Verificar" button
checkButton.addEventListener('click', () => {
    const userAnswer = parseFloat(userAnswerInput.value);
    if (isNaN(userAnswer)) {
        showModal("Error", "Por favor, introduce un número válido.");
        return;
    }

    resultMessage.classList.remove('hidden');
    if (Math.abs(userAnswer - correctTotal) < 0.01) { // Floating point comparison
        resultMessage.textContent = `¡Correcto! El total es $${correctTotal.toFixed(2)}.`;
        resultMessage.className = 'result-message correct';
        showModal("¡Felicitaciones!", "¡Has calculado el total correctamente!");
    } else {
        resultMessage.textContent = `¡Incorrecto! La respuesta correcta era $${correctTotal.toFixed(2)}.`;
        resultMessage.className = 'result-message incorrect';
        showModal("Incorrecto", "Sigue practicando. El total correcto es $" + correctTotal.toFixed(2) + ".");
    }

    checkButton.classList.add('hidden');
    newChallengeButton.classList.remove('hidden');
});

// Event listener for the "Nuevo Desafío" button
newChallengeButton.addEventListener('click', () => {
    generateNewChallenge();
});

// Initial load
window.onload = function() {
    renderProducts();
    generateNewChallenge();
};

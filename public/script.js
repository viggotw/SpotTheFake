// Constants to define the number of tasks per media type
const image_levels = 3;
const text_levels = 2;
const audio_levels = 2;
const video_levels = 3;

// Game state variables
let mediaPool;
let currentPair;
let correctCount = 0;
let totalCount = image_levels + text_levels + audio_levels + video_levels;
let roundCount = 0;
let currentTypeIndex = 0;
let tasksPresented = 0;

// Define media types order and levels
const mediaOrder = ['images', 'text', 'audio', 'videos'];
const levelLimits = {
    images: image_levels,
    text: text_levels,
    audio: audio_levels,
    videos: video_levels
};

// Track presented pairs to avoid repetition
let presentedPairs = {
    images: [],
    text: [],
    audio: [],
    videos: []
};

// Log of the current session
let gameLog = [];

// Initialize the game
function initGame() {
    console.log('Game started!');
    fetch('media/game_assets/pairs.json')
        .then(response => response.json())
        .then(data => {
            mediaPool = data;
            updateStats();  // Initialize stats display
            displayNextPair();
        })
        .catch(error => {
            console.error('Error loading media pairs:', error);
        });

    document.getElementById('select-left').addEventListener('click', () => checkAnswer('left'));
    document.getElementById('select-right').addEventListener('click', () => checkAnswer('right'));
    document.getElementById('next-question').addEventListener('click', displayNextPair);
}

// Display the next pair of media
function displayNextPair() {
    // Enable the buttons for new selection
    enableButtons();
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('info-box').style.display = 'none';

    const currentType = mediaOrder[currentTypeIndex];
    const availablePairs = mediaPool[currentType].filter((_, index) => !presentedPairs[currentType].includes(index));

    if (availablePairs.length === 0 || tasksPresented >= levelLimits[currentType]) {
        currentTypeIndex++;
        tasksPresented = 0;

        if (currentTypeIndex >= mediaOrder.length) {
            endGame();
            return;
        }

        displayNextPair();
        return;
    }

    const randomIndex = Math.floor(Math.random() * availablePairs.length);
    const selectedPair = availablePairs[randomIndex];
    const originalIndex = mediaPool[currentType].indexOf(selectedPair);

    presentedPairs[currentType].push(originalIndex);
    tasksPresented++;

    // Randomly decide which side gets the fake item
    const isFakeLeft = Math.random() < 0.5;

    currentPair = {
        type: currentType,
        left: isFakeLeft ? selectedPair.fake : selectedPair.real,
        right: isFakeLeft ? selectedPair.real : selectedPair.fake,
        correct: isFakeLeft ? 'left' : 'right',
        realItem: isFakeLeft ? selectedPair.fake : selectedPair.real,
        fakeItem: isFakeLeft ? selectedPair.real : selectedPair.fake,
        info: selectedPair.info,
        topImage: selectedPair.topImage
    };
    console.log("TEST");
    console.log('Current pair:', currentPair);
    if (currentPair.topImage) {
        const topImageDiv = document.getElementById('top-image');
        topImageDiv.innerHTML = `<img src="${currentPair.topImage}" alt="Top Image" style="width: 100%;">`;
    }
    else {
        const topImageDiv = document.getElementById('top-image');
        topImageDiv.innerHTML = ``;
    }

    const mediaPairDiv = document.getElementById('media-pair');
    mediaPairDiv.innerHTML = generateMediaHTML(currentPair);
}

// Generate HTML for different media types
function generateMediaHTML(pair) {
    switch (pair.type) {
        case 'images':
            return `
                <div><img src="${pair.left}" alt="Left Media" style="width: 100%;"></div>
                <div><img src="${pair.right}" alt="Right Media" style="width: 100%;"></div>
            `;
        case 'audio':
            return `
                <div><audio controls autoplay src="${pair.left}"></audio></div>
                <div><audio controls src="${pair.right}"></audio></div>
            `;
        case 'videos':
            return `
                <div><video controls loop autoplay width="100%"><source src="${pair.left}" type="video/mp4"></video></div>
                <div><video controls loop autoplay width="100%"><source src="${pair.right}" type="video/mp4"></video></div>
            `;
        case 'text':
            return `
                <div><iframe src="${pair.left}" style="width: 100%; height: 200px;" frameborder="0"></iframe></div>
                <div><iframe src="${pair.right}" style="width: 100%; height: 200px;" frameborder="0"></iframe></div>
            `;
        default:
            return `<div>Unsupported media type</div>`;
    }
}

// Check the user's answer
function checkAnswer(selected) {
    // Disable buttons to prevent multiple clicks
    disableButtons();

    roundCount++;
    const isCorrect = (selected === currentPair.correct);

    // Select the buttons
    const leftButton = document.getElementById('select-left');
    const rightButton = document.getElementById('select-right');
    
    // Highlight the selected button
    const selectedButton = document.getElementById(`select-${selected}`);
    if (isCorrect) {
        correctCount++;
    }

    // Show the info box with how to spot the fake
    const infoBox = document.getElementById('info-box');
    infoBox.style.display = 'block';
    if (isCorrect) {
        infoBox.style.backgroundColor = '#d4edda';
        infoBox.innerHTML = "<b>Riktig!</b><br>" + currentPair.info;
    } else {
        infoBox.style.backgroundColor = '#f8d7da';    
        infoBox.innerHTML = "<b>Feil!</b><br>" + currentPair.info;
    }

    // Show the next question button
    document.getElementById('next-question').style.display = 'block';
    
    // Log the current pair and user's selection
    gameLog.push({
        type: currentPair.type,
        realItem: currentPair.realItem,
        fakeItem: currentPair.fakeItem,
        selected: selected,
        correct: isCorrect,
        info: currentPair.info
    });

    updateStats();
}

// Enable the buttons
function enableButtons() {
    document.getElementById('select-left').disabled = false;
    document.getElementById('select-right').disabled = false;
}

function disableButtons() {
    const leftButton = document.getElementById('select-left');
    const rightButton = document.getElementById('select-right');
    leftButton.disabled = true;
    rightButton.disabled = true;
}

// Update stats display
function updateStats() {
    document.getElementById('stats').textContent = `Round ${roundCount} / ${totalCount}`;
}

// End the game and send logs to the server
function endGame() {
    sendLogToServer();
    window.location.href = `results.html?correct=${correctCount}&total=${totalCount}`;
}

// Send the log to the server
function sendLogToServer() {
    fetch('/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameLog),
    })
    .then(response => response.text())
    .then(data => {
        console.log('Log saved successfully:', data);
    })
    .catch((error) => {
        console.error('Error logging data:', error);
    });
}

// Start the game on page load
window.onload = initGame;

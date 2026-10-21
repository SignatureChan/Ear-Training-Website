// Connects the HTML interface to the exercise and audio functions

import { generateInterval, generateRandomPitch } from "./exercises.js";
import { playInterval, playNote } from "./audio.js";

console.log("Ear Training loaded!");

// Screens
const homeScreen = document.getElementById("home-screen");
const intervalScreen = document.getElementById("interval-screen");
const pitchScreen = document.getElementById("pitch-screen");

// Home-screen navigation
const intervalButton = document.getElementById("interval-button");
intervalButton.addEventListener("click", function () {
    homeScreen.style.display = "none";
    pitchScreen.style.display = "none";
    intervalScreen.style.display = "block";

    currentInterval = generateInterval();
    resetIntervalFeedback();
});

const pitchButton = document.getElementById("pitch-button");
pitchButton.addEventListener("click", function () {
    homeScreen.style.display = "none";
    intervalScreen.style.display = "none";
    pitchScreen.style.display = "block";
});

// Interval training
let currentInterval = null;
let correctAnswers = 0;
let incorrectAnswers = 0;

const listenButton = document.getElementById("listen-button");
const feedback = document.getElementById("feedback");
const revealedPitches = document.getElementById("revealed-pitches");
const nextQuestionButton = document.getElementById("interval-next-question-button");
const correctAnswerCount = document.getElementById("correctAnswerCount");
const incorrectAnswerCount = document.getElementById("incorrectAnswerCount");

const answerButtonsContainer = document.getElementById("answer-buttons");
const answerButtons = answerButtonsContainer.querySelectorAll("button");

function resetIntervalFeedback() {
    feedback.textContent = "";
    revealedPitches.textContent = "";
    nextQuestionButton.style.display = "none";
}

listenButton.addEventListener("click", function () {
    currentInterval ??= generateInterval();
    playInterval(currentInterval);
    console.log(currentInterval);
});

nextQuestionButton.addEventListener("click", function () {
    currentInterval = generateInterval();
    resetIntervalFeedback();
    playInterval(currentInterval);
    console.log(currentInterval);
});

answerButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (!currentInterval || nextQuestionButton.style.display === "block") {
            return;
        }

        if (button.textContent.trim() === currentInterval.interval) {
            correctAnswers++;
            feedback.textContent = "Correct!";
            correctAnswerCount.textContent =
                "You have gotten " + correctAnswers + " correct.";

            revealedPitches.textContent =
                `${currentInterval.first.note}${currentInterval.first.octave} → ` +
                `${currentInterval.second.note}${currentInterval.second.octave}`;

            nextQuestionButton.style.display = "block";
        } else {
            incorrectAnswers++;
            feedback.textContent = "Incorrect — try again.";
            incorrectAnswerCount.textContent =
                "You have gotten " + incorrectAnswers + " incorrect.";
        }
    });
});


//PITCH SCREEN

let currentPitch = null;
let pitchCorrectAnswers = 0;
let pitchIncorrectAnswers = 0;
let pitchSolved = false;

const pitchListenButton = document.getElementById("pitch-listen-button");
const pitchFeedback = document.getElementById("pitch-feedback");
const pitchRevealed = document.getElementById("pitch-revealed");
const pitchNextQuestionButton = document.getElementById("pitch-next-question-button");
const pitchCorrectAnswerCount = document.getElementById("pitch-correct-count");
const pitchIncorrectAnswerCount = document.getElementById("pitch-incorrect-count");

const pitchAnswerButtonsContainer = document.getElementById("pitch-answer-buttons");
const pitchAnswerButtons = pitchAnswerButtonsContainer.querySelectorAll("button");

pitchListenButton.addEventListener("click", function () {
    currentPitch ??= generateRandomPitch();
    console.log(currentPitch);
    playNote(currentPitch.note, currentPitch.octave);
    
});

pitchAnswerButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (!currentPitch || pitchSolved) {
            return;
        }

        // The button's data-note attribute stores its actual answer.
        const selectedNote = button.dataset.note;

        if (selectedNote === currentPitch.note) {
            pitchSolved = true;
            pitchCorrectAnswers++;

            pitchFeedback.textContent = "Correct!";

            pitchRevealed.textContent =
                `The note was ${currentPitch.note}${currentPitch.octave}.`;

            pitchNextQuestionButton.style.display = "block";

            pitchAnswerButtons.forEach(function (answerButton) {
                answerButton.disabled = true;
            });
        } else {
            pitchIncorrectAnswers++;
            pitchFeedback.textContent = "Incorrect — try again.";
        }

        updatePitchScore();
    });
});

function resetPitchQuestion() {
    // Generate one new pitch for this question.
    currentPitch = generateRandomPitch();
    pitchSolved = false;

    pitchFeedback.textContent = "";
    pitchRevealed.textContent = "";
    pitchNextQuestionButton.style.display = "none";

    pitchAnswerButtons.forEach(function (button) {
        button.disabled = false;
    });
}

pitchNextQuestionButton.addEventListener("click", function () {
    resetPitchQuestion();
    console.log(currentPitch);
    playNote(currentPitch.note, currentPitch.octave);
});

function updatePitchScore() {
    pitchCorrectAnswerCount.textContent =
        `You have gotten ${pitchCorrectAnswers} correct.`;

    pitchIncorrectAnswerCount.textContent =
        `You have gotten ${pitchIncorrectAnswers} incorrect.`;
}

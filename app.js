// Connects the HTML interface to the exercise and audio functions

import { generateInterval } from "./exercises.js";
import { playInterval } from "./audio.js";

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

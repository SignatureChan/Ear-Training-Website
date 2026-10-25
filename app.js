// connects the HTML interface to the exercise and audio functions

//imports necessary functions
import { generateInterval, generateRandomPitch } from "./exercises.js";
import { playInterval, playNote } from "./audio.js";

console.log("Ear Training loaded!");

// Screens
const homeScreen = document.getElementById("home-screen");
const intervalScreen = document.getElementById("interval-screen");
const pitchScreen = document.getElementById("pitch-screen");

// Pannels:
const settingsPannel = document.getElementById("settings-pannel");

//Settings:
const showSettingsButton = document.getElementById("show-settings-button");
let showingSettings = false;

showSettingsButton.addEventListener("click", function() {
    if (!showingSettings) {
        settingsPannel.style.display = "block";
        showingSettings = true;
    } else if (showingSettings) {
        settingsPannel.style.display = "none";
        showingSettings = false;
    }
    
    console.log("settings pressed.");
})

// Home-screen navigation
const intervalButton = document.getElementById("interval-button");
intervalButton.addEventListener("click", function () {
    homeScreen.style.display = "none";
    pitchScreen.style.display = "none";
    intervalScreen.style.display = "block";

    resetIntervalFeedback();
});

const pitchButton = document.getElementById("pitch-button");
pitchButton.addEventListener("click", function () {
    homeScreen.style.display = "none";
    intervalScreen.style.display = "none";
    pitchScreen.style.display = "block";
});

const intervalSelectionButtons = document.querySelectorAll(
    "#interval-selection-buttons button"
);

//the above code is the same as this, but it uses a css identifier instead of the html id. 
// const intervalSelectionContainer =
//     document.getElementById("interval-selection-buttons");

// const intervalSelectionButtons =
//     intervalSelectionContainer.querySelectorAll("button");

// All intervals are enabled by default.
const selectedIntervals = new Set(
    Array.from(intervalSelectionButtons, function (button) {
        return button.dataset.interval;
    })
);

// Initialize the buttons and add click behavior.
intervalSelectionButtons.forEach(function (button) {
    button.classList.add("selected");

    button.addEventListener("click", function () {
        const interval = button.dataset.interval;

        if (selectedIntervals.has(interval)) {
            // keep at least one interval enabled
            if (selectedIntervals.size === 1) {
                return;
            }

            selectedIntervals.delete(interval);
            button.classList.remove("selected");
        } else {
            selectedIntervals.add(interval);
            button.classList.add("selected");
        }
    });
});

const pitchSelectionButtons = document.querySelectorAll(
    "#pitch-selection-buttons button"
);

// All 12 notes are enabled by default.
const selectedPitches = new Set(
    Array.from(pitchSelectionButtons, function (button) {
        return button.dataset.pitch;
    })
);

// Set the initial appearance and behavior of each button.
pitchSelectionButtons.forEach(function (button) {
    button.classList.add("selected");

    button.addEventListener("click", function () {
        const pitch = button.dataset.pitch;

        if (selectedPitches.has(pitch)) {
            // one pitch must be enabled at least
            if (selectedPitches.size === 1) {
                return;
            }

            selectedPitches.delete(pitch);
            button.classList.remove("selected");
        } else {
            selectedPitches.add(pitch);
            button.classList.add("selected");
        }
    });
});


//Settings (persists throughout screens)
const revealAnswerToggle = document.getElementById("reveal-answer-toggle");

// Interval training
let currentInterval = null;
let intervalCorrectAnswers = 0;
let intervalIncorrectAnswers = 0;

const listenButton = document.getElementById("listen-button");
const feedback = document.getElementById("feedback");
const revealedPitches = document.getElementById("revealed-pitches");
const nextQuestionButton = document.getElementById("interval-next-question-button");
const intervalCorrectAnswerCount = document.getElementById("interval-correct-answer-count");
const intervalIncorrectAnswerCount = document.getElementById("interval-incorrectAnswerCount");

const intervalAnswerButtonsContainer = document.getElementById("interval-answer-buttons");
const intervalAnswerButtons = intervalAnswerButtonsContainer.querySelectorAll("button");

const intervalHomeButton = document.getElementById("interval-home-button");

function resetIntervalFeedback() { //reset feedback and colors
    feedback.textContent = "";
    revealedPitches.textContent = "";
    nextQuestionButton.style.display = "none";

    intervalAnswerButtons.forEach(function (button) {
        button.disabled = false;

        button.classList.remove(
            "answer-correct",
            "answer-incorrect",
            "answer-disabled"
        );
    });
}

listenButton.addEventListener("click", function () { 
    currentInterval ??= generateInterval(selectedIntervals);
    playInterval(currentInterval);
    console.log(currentInterval);
});

nextQuestionButton.addEventListener("click", function () { //reset interval and play the new interval upon going to the next question
    currentInterval = generateInterval(selectedIntervals);
    resetIntervalFeedback();
    playInterval(currentInterval);
    console.log(currentInterval);
});

intervalHomeButton.addEventListener("click", function () {
    intervalScreen.style.display = "none";
    homeScreen.style.display = "block";

    currentInterval = null;
    resetIntervalFeedback();
    updateIntervalScore();
    // intervalCorrectAnswers = 0;
    // intervalIncorrectAnswers = 0;

});

function updateIntervalScore() {
    intervalCorrectAnswerCount.textContent =
        `You have gotten ${intervalCorrectAnswers} correct.`;

    intervalIncorrectAnswerCount.textContent =
        `You have gotten ${intervalIncorrectAnswers} incorrect.`;
}

intervalAnswerButtons.forEach(function (button) { //check if the pressed button was correct or not. 
    button.addEventListener("click", function () {
        if (!currentInterval || nextQuestionButton.style.display === "block") {
            return;
        }

        if (button.textContent.trim() === currentInterval.interval) {
            intervalCorrectAnswers++;
            feedback.textContent = "Correct!";
            updateIntervalScore();

            revealedPitches.textContent =
                `${currentInterval.first.note}${currentInterval.first.octave} → ` +
                `${currentInterval.second.note}${currentInterval.second.octave}`;

            nextQuestionButton.style.display = "block";

            // highlight the correct answer in green.
            button.classList.add("answer-correct");

            // disable all choices and gray out the other answers.
            intervalAnswerButtons.forEach(function (answerButton) {
                answerButton.disabled = true;

                if (answerButton !== button && !answerButton.classList.contains("answer-incorrect")) {
                    answerButton.classList.add("answer-disabled");
                }
            });

        
        } else {
            intervalIncorrectAnswers++;

            feedback.textContent = "Incorrect — try again.";
            updateIntervalScore();

            // mark the selected wrong answer red and disable it.
            button.classList.add("answer-incorrect");
            button.disabled = true;

            if (revealAnswerToggle.checked) {
                feedback.textContent =
                    `Incorrect! The correct answer is ${currentInterval.interval}.`;

                revealedPitches.textContent =
                    `${currentInterval.first.note}${currentInterval.first.octave} → ` +
                    `${currentInterval.second.note}${currentInterval.second.octave}`;

                nextQuestionButton.style.display = "block";

                // Reveal the right interval and disable all choices.
                intervalAnswerButtons.forEach(function (answerButton) {
                    answerButton.disabled = true;

                    if (answerButton.textContent.trim() === currentInterval.interval) {
                        answerButton.classList.add("answer-correct");
                    } else if (answerButton !== button) {
                        answerButton.classList.add("answer-disabled");
                    }
                });
            }
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

const pitchHomeButton = document.getElementById("pitch-home-button");

pitchListenButton.addEventListener("click", function () { //generate and play the pitch when the listen button is clicked
    currentPitch ??= generateRandomPitch(selectedPitches);
    console.log(currentPitch);
    playNote(currentPitch.note, currentPitch.octave);
    
});

pitchAnswerButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (!currentPitch || pitchSolved) {
            return;
        }

        // the button's data-note attribute stores its actual answer.
        const selectedNote = button.dataset.note;

        
    if (selectedNote === currentPitch.note) {
        pitchSolved = true;
        pitchCorrectAnswers++;

        pitchFeedback.textContent = "Correct!";

        pitchRevealed.textContent =
            `The note was ${currentPitch.note}${currentPitch.octave}.`;

        pitchNextQuestionButton.style.display = "block";

        // make it green
        button.classList.add("answer-correct");

        updatePitchScore();

        // disable every button and gray out the remaining choices.
        pitchAnswerButtons.forEach(function (answerButton) {
            answerButton.disabled = true;

            if (answerButton !== button && !answerButton.classList.contains("answer-incorrect")) {
                answerButton.classList.add("answer-disabled");
            }
        });

    } else {
        pitchIncorrectAnswers++;
        updatePitchScore();

        pitchFeedback.textContent = "Incorrect — try again.";

        // Mark the selected wrong answer red and disable it.
        button.classList.add("answer-incorrect");
        button.disabled = true;

        console.log(revealAnswerToggle.checked);

        if (revealAnswerToggle.checked) {
            pitchSolved = true;

            pitchFeedback.textContent = "Incorrect! The correct answer is highlighted.";

            pitchRevealed.textContent =
                `The note was ${currentPitch.note}${currentPitch.octave}.`;

            pitchNextQuestionButton.style.display = "block";

            // Disable all remaining choices and reveal the correct one.
            pitchAnswerButtons.forEach(function (answerButton) {
                answerButton.disabled = true;

                if (answerButton.dataset.note === currentPitch.note) {
                    answerButton.classList.add("answer-correct");
                } else if (answerButton !== button) {
                    answerButton.classList.add("answer-disabled");
                }
            });
        }
    }

    });
});

function resetPitchQuestion() {
    // Generate one new pitch for this question.
    currentPitch = generateRandomPitch(selectedPitches);
    pitchSolved = false;

    pitchFeedback.textContent = "";
    pitchRevealed.textContent = "";
    pitchNextQuestionButton.style.display = "none";

    
pitchAnswerButtons.forEach(function (button) {
    button.disabled = false;

    // Remove colors too
    button.classList.remove(
        "answer-correct",
        "answer-incorrect",
        "answer-disabled"
    );
});

}

pitchNextQuestionButton.addEventListener("click", function () {
    resetPitchQuestion();

    console.log("New pitch:", currentPitch);
    console.log("Enabled notes:", [...selectedPitches]);

    playNote(currentPitch.note, currentPitch.octave);
});

function updatePitchScore() {
    pitchCorrectAnswerCount.textContent =
        `You have gotten ${pitchCorrectAnswers} correct.`;

    pitchIncorrectAnswerCount.textContent =
        `You have gotten ${pitchIncorrectAnswers} incorrect.`;
}

pitchHomeButton.addEventListener("click", function () {
    pitchScreen.style.display = "none";
    homeScreen.style.display = "block";

    currentPitch = null;
    resetPitchQuestion();
    // pitchCorrectAnswers = 0;
    // pitchIncorrectAnswers = 0;
    updatePitchScore();

    
});
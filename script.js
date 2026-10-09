

console.log("Ear Training loaded!");

//Screens
const homeScreen = document.getElementById("home-screen");
const intervalScreen = document.getElementById("interval-screen");
const pitchScreen = document.getElementById("pitch-screen");

//defines notes
const semitonesFromA = {
    "C": -9,
    "C#": -8,
    "D": -7,
    "D#": -6,
    "E": -5,
    "F": -4,
    "F#": -3,
    "G": -2,
    "G#": -1,
    "A": 0,
    "A#": 1,
    "B": 2
};

function noteToFrequency(note, octave) {
    const a4Frequency = 440; // Frequency of A4
    const semitoneOffset = semitonesFromA[note] + (octave - 4) * 12; // Calculate the semitone offset from A4
    const noteFrequency = a4Frequency * Math.pow(2, semitoneOffset / 12);
    return noteFrequency;
}

//producing audio
function playNote(note, octave, duration =1) {
    const frequency = noteToFrequency(note, octave);
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();

    oscillator.frequency.value = frequency; // set the frequency of the note

    oscillator.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration); // Play for the specified duration
}

// Note range for interval training
const minimumNote = { note: "C", octave: 4 };
const maximumNote = { note: "C", octave: 6 };

function getRandomStartingNote(intervalSemitones) {
    const minimumNumber = noteToNumber(minimumNote.note, minimumNote.octave);
    const maximumNumber = noteToNumber(maximumNote.note, maximumNote.octave);

    const maximumStartingNumber = maximumNumber - intervalSemitones;

    const randomNumber = Math.floor(
        Math.random() * (maximumStartingNumber - minimumNumber + 1)
    ) + minimumNumber;

    return numberToNote(randomNumber);
}

const intervals = {
    "Unison": 0,
    "Minor Second": 1,
    "Major Second": 2,
    "Minor Third": 3,
    "Major Third": 4,
    "Perfect Fourth": 5,
    "Tritone": 6,
    "Perfect Fifth": 7,
    "Minor Sixth": 8,
    "Major Sixth": 9,
    "Minor Seventh": 10,
    "Major Seventh": 11,
    "Octave": 12
}

function getRandomInterval() { //get random interval from "intervals"
    const intervalNames = Object.keys(intervals);

    const randomIndex = Math.floor(Math.random() * intervalNames.length);

    return intervalNames[randomIndex];
}

function noteToNumber(note, octave) {
    return semitonesFromA[note] + (octave * 12);
}

function numberToNote(number) {
    const adjustedNumber = number + 9

    const octave = Math.floor(adjustedNumber / 12);
    const semitone = adjustedNumber % 12;

    const noteNames = Object.keys(semitonesFromA);

    return {
        note: noteNames[semitone],
        octave: octave
    };
}

function transposeNote(note, octave, semitones) {
    const startingNum = noteToNumber(note, octave);
    const newNum = startingNum + semitones;

    return numberToNote(newNum);
}

function generateInterval() {
    const interval = getRandomInterval();
    const intervalSemitones = intervals[interval];

    const firstNote = getRandomStartingNote(intervalSemitones);

    const secondNote = transposeNote(
        firstNote.note,
        firstNote.octave,
        intervalSemitones
    );

    return {
        interval: interval,
        first: firstNote,
        second: secondNote
    };
}

let currentInterval = null;

function playInterval(interval) {
    playNote(interval.first.note, interval.first.octave);

    setTimeout(function() {
        playNote(interval.second.note, interval.second.octave);
    }, 1200);
}

//Buttons
const intervalButton = document.getElementById("interval-button");

intervalButton.addEventListener("click", function() {
    console.log("Interval button clicked!");
    homeScreen.style.display = "none";
    intervalScreen.style.display = "block";
    currentInterval = generateInterval();
    console.log(currentInterval);
});

const pitchButton = document.getElementById("pitch-button");

pitchButton.addEventListener("click", function() {
    console.log("Pitch button clicked!");
});

const listenButton = document.getElementById("listen-button");

listenButton.addEventListener("click", function() {
    
    currentInterval ??= generateInterval();
    console.log(currentInterval);
    playInterval(currentInterval);

});

const feedback = document.getElementById("feedback");
const revealedPitches = document.getElementById("revealed-pitches");

const nextQuestionButton = document.getElementById("next-question-button");
nextQuestionButton.addEventListener("click", function() {
    currentInterval = generateInterval();

    feedback.textContent = "";
    revealedPitches.textContent = "";

    playInterval(currentInterval);
    console.log(currentInterval);
    nextQuestionButton.style.display = "none";
})


var correctAnswers = 0;
var incorrectAnswers = 0;

const correctAnswer = document.getElementById("correctAnswerCount");


//ANSWER BUTTONS:
const allAnswerButtons = document.getElementById("answer-buttons");
const answerButtons = allAnswerButtons.querySelectorAll("button");
answerButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        console.log("You clicked:", button.textContent);
        if (button.textContent === currentInterval.interval) {
            correctAnswers++;
            console.log(correctAnswers);
            feedback.textContent = "Correct!";
            correctAnswer.textContent = "You have gotten " + correctAnswers + " correct.";
            revealedPitches.textContent =
                `${currentInterval.first.note}${currentInterval.first.octave} → ` +
                `${currentInterval.second.note}${currentInterval.second.octave}`;
            
            nextQuestionButton.style.display = "block";

        } else {
            feedback.textContent = "Incorrect — try again.";
        }
    });
});
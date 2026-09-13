console.log("Ear Training loaded!");

//Screens
const homeScreen = document.getElementById("home-screen");
const intervalScreen = document.getElementById("interval-screen");

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

    oscillator.frequency.value = frequency; // Set the frequency of the note

    oscillator.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration); // Play for the specified duration
}

//Buttons
const intervalButton = document.getElementById("interval-button");

intervalButton.addEventListener("click", function() {
    console.log("Interval button clicked!");
    homeScreen.style.display = "none";
    intervalScreen.style.display = "block";
});

const pitchButton = document.getElementById("pitch-button");

pitchButton.addEventListener("click", function() {
    console.log("Pitch button clicked!");
});

const listenButton = document.getElementById("listen-button");




listenButton.addEventListener("click", function() {
    playNote("C", 2, 2); // Play A4 note for 1 second
});
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

const notes = [
    { note: "C", octave: 4 },
    { note: "C#, octave: 4"},
    { note: "D", octave: 4 },
    { note: "D#, octave: 4"},
    { note: "E", octave: 4 },
    { note: "F", octave: 4 },
    { note: "F#, octave: 4"},
    { note: "G", octave: 4 },
    { note: "G#, octave: 4"},
    { note: "A", octave: 4 },
    { note: "A#, octave: 4"},
    { note: "B", octave: 4 },
    { note: "C", octave: 5 }
];

function getRandomNote() {
    const randomIndex = Math.floor(Math.random() * notes.length);

    return notes[randomIndex];
}

function generateInterval() {
    const firstNote = getRandomNote();
    const secondNote = getRandomNote();

    return {
        first: firstNote,
        second: secondNote
    };
}

const intervals = {
    0: "Unison",
    1: "Major Second",
    2: "Major Second",
    3: "Minor Third",
    4: "Major Third",
    5: "Perfect Fourth",
    6: "Tritone",
    7: "Perfect 5th",
    8: "Minor Sixth",
    9: "Major Sixth",
    10: "Minor Seventh",
    11: "Major Seventh",
    12: "Octave"
}

function calculateInterval(interval) {
    const firstPitch = notes.indexOf(interval.first);
    const secondPitch = notes.indexOf(interval.secondNote);
    let pitchDifference = secondPitch - firstPitch;
    console.log("first pitch: ");
    const descending = false;
    if (pitchDifference < 0) { //checks if its negative, or descending
        descending = true;
        pitchDifference = Math.abs(pitchDifference);
    }
    const namedInterval = intervals.pitchDifference;
    console.log(namedInterval);

    //C to D => 2 - 0 = 2 => Major Second
    //D to C => 0 -2 = 2 => Major Second (Descending)
    //

}


function playInterval(interval) {
    playNote(interval.first.note, interval.first.octave);

    setTimeout(function() {
        playNote(interval.second.note, interval.second.octave);
    }, 1200);
}
console.log(generateInterval());

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
    const interval = generateInterval();

    console.log(interval);

    playInterval(interval);
    calculateInterval(interval);
});
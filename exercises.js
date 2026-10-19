// Question generation for the training exercises

import {
    intervals,
    noteToNumber,
    numberToNote,
    transposeNote
} from "./music.js";

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

export function getRandomInterval() {
    const intervalNames = Object.keys(intervals);
    const randomIndex = Math.floor(Math.random() * intervalNames.length);
    return intervalNames[randomIndex];
}

export function generateInterval() {
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

// Question generation for the training exercises

import {
    intervals,
    noteToNumber,
    numberToNote,
    transposeNote,
    semitonesFromA
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

export function getRandomInterval(selectedIntervals) {
    const intervalNames = [...selectedIntervals];
    const randomIndex = Math.floor(Math.random() * intervalNames.length);
    return intervalNames[randomIndex];
}

export function generateInterval(selectedIntervals) {
    const interval = getRandomInterval(selectedIntervals);
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


export function generateRandomPitch(selectedPitches) {
    const maxNum = noteToNumber(maximumNote.note, maximumNote.octave);
    const minNum = noteToNumber(minimumNote.note, minimumNote.octave);

    // Build a list of all pitches within the allowed range.
    const possiblePitches = [];

    for (let number = minNum; number <= maxNum; number++) {
        const pitch = numberToNote(number);

        // Keep only pitches whose note name is enabled.
        if (selectedPitches.has(pitch.note)) {
            possiblePitches.push(pitch);
        }
    }

    // Choose one pitch randomly from the remaining possibilities.
    const randomIndex = Math.floor(
        Math.random() * possiblePitches.length
    );

    return possiblePitches[randomIndex];
}


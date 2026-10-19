// Music theory and pitch calculations

export const semitonesFromA = {
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

export const intervals = {
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
};

export function noteToFrequency(note, octave) {
    const a4Frequency = 440;
    const semitoneOffset = semitonesFromA[note] + (octave - 4) * 12;
    return a4Frequency * Math.pow(2, semitoneOffset / 12);
}

export function noteToNumber(note, octave) {
    return semitonesFromA[note] + octave * 12;
}

export function numberToNote(number) {
    // The number system is anchored to A, but the note-name list starts at C.
    const adjustedNumber = number + 9;
    const octave = Math.floor(adjustedNumber / 12);
    const semitone = adjustedNumber % 12;
    const noteNames = Object.keys(semitonesFromA);

    return {
        note: noteNames[semitone],
        octave: octave
    };
}

export function transposeNote(note, octave, semitones) {
    const startingNumber = noteToNumber(note, octave);
    return numberToNote(startingNumber + semitones);
}

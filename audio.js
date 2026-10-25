// audio playback functions

import { noteToFrequency } from "./music.js";

export function playNote(note, octave, duration = 1) {
    const frequency = noteToFrequency(note, octave);
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();

    oscillator.frequency.value = frequency;
    oscillator.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

export function playInterval(interval) {
    playNote(interval.first.note, interval.first.octave);

    setTimeout(function () {
        playNote(interval.second.note, interval.second.octave);
    }, 1200);
}

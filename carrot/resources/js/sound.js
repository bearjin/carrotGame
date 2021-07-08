'use strict';

const carrotSound = new Audio('./resources/sound/carrot_pull.mp3');
const bugSound = new Audio('./resources/sound/bug_pull.mp3');
const alertSound = new Audio('./resources/sound/alert.wav');
const bgSound = new Audio('./resources/sound/bg.mp3');
const winSound = new Audio('./resources/sound/game_win.mp3');

export function playCarrot() {
    playSound(carrotSound);
}

export function playBug() {
    playSound(bugSound);
}

export function playAlert() {
    playSound(alertSound);
}

export function playWin() {
    playSound(winSound);
}

export function playBackground() {
    playSound(bgSound);
}

export function stopBackground() {
    stopSound(bgSound);
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}
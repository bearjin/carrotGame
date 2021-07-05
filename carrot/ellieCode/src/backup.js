'use strict';

import Field from './field.js';
import * as Sound from './Sound.js';

export default class Game {
    constructor(game_duration_sec, carrotCount) {
        this.game_duration_sec = game_duration_sec;
        this.carrotCount = carrotCount;
        this.started = false;
        this.score = 0;
        this.timer = undefined;
        this.gameBtn = document.querySelector('.game_button');
        this.gameTimer = document.querySelector('.game_timer');
        this.gameScore = document.querySelector('.game_score');
        this.gameBtn.addEventListener('click', () => {
            if (this.started) {
                this.stopGame();
            } else {
                this.startGame();
            }
        });
    }

    startGame() {
        this.started = true;
        this.initGame();
        this.showStopButton();
        showTimerAndScore();
        startGameTimer();
        Sound.playBackground();
    }

    stopGame() {
        this.started = false;
        stopGameTimer();
        hideGameButton();
        gameFinishBanner.showWithText('REPLAY?');
        Sound.playBackground();
        Sound.stopBackground();
    }

    finishGame(win) {
        this.started = false;
        hideGameButton();
        if (win) {
            Sound.playWin();
        } else {
            Sound.playBug();
        }
        stopGameTimer();
        Sound.stopBackground();
        gameFinishBanner.showWithText(win ? 'YOU WIN' : 'YOU LOST');
    }

    showStopButton() {
        const icon = this.gameBtn.querySelector('.fas');
        icon.classList.add('fa-stop');
        icon.classList.remove('fa-play');
        this.gameBtn.style.visibility = 'visible';
    }

    hideGameButton() {
        this.gameBtn.style.visibility = 'hidden';
    }

    showTimerAndScore() {
        this.gameTimer.style.visibility = 'visible';
        this.gameScore.style.visibility = 'visible';
    }

    startGameTimer() {
        let remainingTimeSec = this.game_duration_sec;
        this.updateTimerText(remainingTimeSec);
        this.timer = setInterval(() => {
            if (remainingTimeSec <= 0) {
                clearInterval(this.timer);
                finishGame(this.carrotCount === this.score);
                return;
            }
            updateTimerText(--remainingTimeSec);
        }, 1000);
    }

    stopGameTimer() {
        clearInterval(this.timer);
    }

    updateTimerText(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.gameTimer.innerText = `${minutes}:${seconds}`;
    }

    initGame() {
        this.score = 0;
        this.gameScore.innerText = this.carrotCount;
        gameField.init();
    }

    updateScoreBoard() {
        this.gameScore.innerText = this.carrotCount - this.score;
    }
}
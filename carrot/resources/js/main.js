'use strict';

import Popup from './popup.js';
import Field from './field.js';
import * as sound from './sound.js';

const gameFinishBanner = new Popup();
gameFinishBanner.setClickListener(() => {
    carrotGame.initGame();
});

const gameField = new Field(10);
gameField.setClickListener(item => {
    if (item === 'carrot') {
        sound.playCarrot();
    } else if (item === 'bug') {
        sound.playBug();
        carrotGame.failGame();
    }
    carrotGame.checkScore();
});

class gameSetting {
    /**
     * 
     * @param {string} targetNum 생성 할 타겟 수 
     * @param {string} gameTime  게임 제한시간
     */
    constructor(gameTime) {
        this.$playBtn = document.querySelector('.play_btn');
        this.$score = document.querySelector('.game_score');
        this.$minTxt = document.querySelector('.timer_min');
        this.$secTxt = document.querySelector('.timer_sec');
        this.gameTime = gameTime;
        this.currentTime = gameTime;
        this.timerInterval;
        this.score;

        this.$playBtn.addEventListener('click', event => {
            const state = event.target.dataset.state;

            if (state === 'start') {
                this.pauseGame();
                sound.playBackground();
            } else if (state === 'pause') {
                this.reStartGame();
                sound.playBackground();
            } else if (state === 'init') {
                this.playGame();
                sound.playBackground();
            }
        });
    }

    /**
     * 게임세팅 초기화
     */
    resetSetting() {
        this.$minTxt.innerText = '00';
        this.$secTxt.innerText = '00';
        this.$score.innerText = 0;
        this.currentTime = this.gameTime;
        gameField.$area.innerHTML = '';
    }

    /**
     * 게임 재설정
     */
    initGame() {
        this.stopTimer();
        gameFinishBanner.hidePopUp();
        this.resetSetting();
        this.changeButton('init');
    }

    /**
     * 게임 시작하기
     */
    playGame() {
        this.startTimer();
        gameField.makeTarget();
        this.checkScore();
        gameFinishBanner.hidePopUp();
        this.changeButton('start');
    }

    /**
     * 게임 성공
     */
    successGame() {
        this.stopTimer();
        this.changeButton('init');
        gameFinishBanner.showPopUp("YOU WIN", "fa-laugh-squint");
    }

    /**
     * 게임 실패
     */
    failGame() {
        sound.stopBackground();
        this.stopTimer();
        this.changeButton('init');
        gameFinishBanner.showPopUp("YOU LOSE", "fa-sad-tear");
    }

    /**
     * 게임 일시정지
     */
    pauseGame() {
        this.stopTimer();
        this.changeButton('pause');
        gameFinishBanner.showPopUp("RESTART?", "fa-surprise");
    }

    /**
     * 게임 재시작
     */
    reStartGame() {
        this.startTimer();
        this.changeButton('start');
        gameFinishBanner.hidePopUp();
    }

    /**
     * 버튼 변경하기
     * @param {string} state 버튼 상태값 
     */
    changeButton(state) {
        if (state === 'start') {
            this.$playBtn.classList.add('fa-stop');
        } else {
            this.$playBtn.classList.remove('fa-stop');
        }
        this.$playBtn.setAttribute('data-state', state);
    }

    /**
     * 타이머 시작하기
     */
    startTimer() {
        let time = this.currentTime;
        this.updateTimerText(time);
        this.timerInterval = setInterval(() => {
            if (time <= 0) {
                this.stopTimer();
                this.failGame();
                sound.stopBackground();
                return;
            }
            this.updateTimerText(--time);
            this.currentTime = time;
        }, 1000);
    }

    /**
     * 타이머 멈추기
     */
    stopTimer() {
        clearInterval(this.timerInterval);
    }

    /**
     * 타이머 시간 업데이트
     * @param {string} time 현재 시간
     */
    updateTimerText(time) {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        min < 10 ? this.$minTxt.innerText = `0${min}` : this.$minTxt.innerText = `${min}`;
        sec < 10 ? this.$secTxt.innerText = `0${sec}` : this.$secTxt.innerText = `${sec}`;
    }

    /**
     * 스코어 체크하기
     */
    checkScore() {
        const $target = document.querySelectorAll('.carrot');
        const targetNum = $target.length;

        this.score = targetNum;
        this.$score.innerText = targetNum;

        if (this.score === 0) {
            this.successGame();
            sound.stopBackground();
            sound.playWin();
        }
    }
}

const carrotGame = new gameSetting(10);
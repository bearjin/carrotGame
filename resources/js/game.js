'use strict';

import Field from './field.js';
import * as sound from './sound.js';

export default class Game {
    /**
     * 
     * @param {string} targetNum 생성 할 타겟 수 
     * @param {string} gameTime  게임 제한시간
     */
    constructor(targetNum, gameTime) {
        this.$playBtn = document.querySelector('.play_btn');
        this.$score = document.querySelector('.game_score');
        this.$minTxt = document.querySelector('.timer_min');
        this.$secTxt = document.querySelector('.timer_sec');
        this.gameTime = gameTime;
        this.currentTime = gameTime;
        this.timerInterval;
        this.score;
        this.state;

        this.$playBtn.addEventListener('click', event => {
            this.state = event.target.dataset.state;

            if (this.state === 'start') {
                this.pause();
            } else if (this.state === 'pause') {
                this.reStart();
                this.popUphidden && this.popUphidden();
            } else if (this.state === 'init') {
                this.play();
                this.popUphidden && this.popUphidden();
            }
        });

        this.gameField = new Field(targetNum);
        this.gameField.setClickListener(item => {
            if (this.state === 'start') {
                return;
            }
            if (item === 'carrot') {
                sound.playCarrot();
            } else if (item === 'bug') {
                sound.playBug();
                this.fail();
            }
            this.checkScore();
        });
    }

    setPopUpHiddenListener(popUphidden) {
        this.popUphidden = popUphidden;
    }

    setGameStopListener(onGameStop) {
        this.onGameStop = onGameStop;
    }

    /**
     * 게임세팅 초기화
     */
    resetSetting() {
        this.$minTxt.innerText = '00';
        this.$secTxt.innerText = '00';
        this.$score.innerText = 0;
        this.currentTime = this.gameTime;
        this.gameField.$area.innerHTML = '';
    }

    /**
 * 게임 재설정
 */
    init() {
        this.stopTimer();
        this.resetSetting();
        this.changeButton('init');
    }

    /**
     * 게임 시작하기
     */
    play() {
        this.init();
        this.startTimer();
        this.gameField.makeTarget();
        this.checkScore();
        this.changeButton('start');
        sound.playBackground();
    }

    /**
     * 게임 성공
     */
    success() {
        this.stopTimer();
        this.changeButton('init');
        this.onGameStop && this.onGameStop('success');
        sound.stopBackground();
        sound.playWin();
    }

    /**
     * 게임 실패
     */
    fail() {
        this.stopTimer();
        this.changeButton('init');
        this.onGameStop && this.onGameStop('fail');
        sound.stopBackground();
        sound.playAlert();
    }

    /**
     * 게임 일시정지
     */
    pause() {
        this.stopTimer();
        this.changeButton('pause');
        this.onGameStop && this.onGameStop('pause');
        sound.stopBackground();
    }

    /**
     * 게임 재시작
     */
    reStart() {
        this.startTimer();
        this.changeButton('start');
        sound.playBackground();
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
                this.fail();
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
            this.success();
        }
    }
}
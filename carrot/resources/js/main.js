class gameSetting {
    /**
     * 
     * @param {string} targetNum 생성 할 타겟 수 
     * @param {string} gameTime  게임 제한시간
     */
    constructor(targetNum, gameTime) {
        this.$playBtn = document.querySelector('.play_btn');
        this.$replayBtn = document.querySelector('.replay_btn');
        this.$score = document.querySelector('.game_score');
        this.$area = document.querySelector('.game_area');
        this.$result = document.querySelector('.game_result');
        this.$resultTxt = document.querySelector('.game_result_txt');
        this.$minTxt = document.querySelector('.timer_min');
        this.$secTxt = document.querySelector('.timer_sec');
        this.targetNum = targetNum;
        this.gameTime = gameTime;
        this.currentTime = gameTime;
        this.timerInterval;
        this.score;
        this.targetSize = 80;
        this.bgAudio = new Audio('./resources/sound/bg.mp3');
        this.winAudio = new Audio('./resources/sound/game_win.mp3');
        this.carrotAudio = new Audio('./resources/sound/carrot_pull.mp3');
        this.bugAudio = new Audio('./resources/sound/bug_pull.mp3');
        this.alertAudio = new Audio('./resources/sound/alert.wav');

        this.$playBtn.addEventListener('click', event => {
            const state = event.target.dataset.state;

            if (state === 'start') {
                this.pauseGame();
                this.stopSound(this.bgAudio);
            } else if (state === 'pause') {
                this.reStartGame();
                this.playSound(this.bgAudio);
            } else if (state === 'init') {
                this.playGame();
                this.playSound(this.bgAudio);
            }
        });

        this.$replayBtn.addEventListener('click', () => {
            this.initGame();
        });

        this.$area.addEventListener('click', event => {
            const $target = event.target;
            if ($target.className === 'bug') {
                this.playSound(this.bugAudio);
                this.failGame();
            } else if ($target.className === 'carrot') {
                this.playSound(this.carrotAudio);
            }
            this.removeTarget($target);
            this.checkScore();
            if (this.score === 0) {
                this.successGame();
                this.stopSound(this.bgAudio);
                this.playSound(this.winAudio);
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
        this.$area.innerHTML = '';
    }

    /**
     * 게임 재설정
     */
    initGame() {
        this.stopTimer();
        this.hidePopUp();
        this.resetSetting();
        this.changeButton('init');
    }

    /**
     * 게임 시작하기
     */
    playGame() {
        this.startTimer();
        this.makeTarget();
        this.checkScore();
        this.hidePopUp();
        this.changeButton('start');
    }

    /**
     * 게임 성공
     */
    successGame() {
        this.stopTimer();
        this.changeButton('init');
        this.showPopUp("YOU WIN", "fa-laugh-squint");
    }

    /**
     * 게임 실패
     */
    failGame() {
        this.stopSound(this.bgAudio);
        this.stopTimer();
        this.changeButton('init');
        this.showPopUp("YOU LOSE", "fa-sad-tear");
    }

    /**
     * 게임 일시정지
     */
    pauseGame() {
        this.stopTimer();
        this.changeButton('pause');
        this.showPopUp("RESTART?", "fa-surprise");
    }

    /**
     * 게임 재시작
     */
    reStartGame() {
        this.startTimer();
        this.changeButton('start');
        this.hidePopUp();
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
        let time = this.gameTime;
        this.updateTimerText(time);
        this.timerInterval = setInterval(() => {
            if (time <= 0) {
                this.stopTimer();
                this.failGame();
                this.stopSound(this.bgAudio);
                return;
            }
            this.updateTimerText(--time);
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
    }

    /**
     * 타겟 생성하기
     */
    makeTarget() {
        const areaSize = this.$area.getBoundingClientRect();
        let img = "";

        for (let i = 0; i < this.targetNum; i++) {
            const randomNum = Math.floor(Math.random() * 2);
            const randomPositionX = Math.floor(Math.random() * (areaSize.width - this.targetSize));
            const randomPositionY = Math.floor(Math.random() * (areaSize.height - this.targetSize));

            if (randomNum === 0) {
                img += `
                    <img class="bug" src="./resources/img/bug.png" alt="벌레" style="left: ${randomPositionX}px; top:${randomPositionY}px;">
                `;
            } else {
                img += `
                    <img class="carrot" src="./resources/img/carrot.png" alt="당근" style="left: ${randomPositionX}px; top: ${randomPositionY}px;">
                `;
            }
        }
        this.$area.innerHTML = img;
    }

    /**
     * 타겟 제거하기
     * @param {element} target 타겟
     */
    removeTarget(target) {
        if (target.className === 'carrot') {
            this.$area.removeChild(target);
        }
    }

    /**
     * 팝업 쇼
     * @param {string} text 팝업 문구
     * @param {string} icon 아이콘 클래스 
     */
    showPopUp(text, icon) {
        this.$resultTxt.innerHTML = `
            <span class="result_txt">${text}</span>
            <i class="fas ${icon}"></i>
        `;
        this.$result.style.visibility = 'visible';
    }

    /**
     * 팝업 히든
     */
    hidePopUp() {
        this.$result.style.visibility = 'hidden';
    }

    /**
     * 사운드 시작
     * @param {element} sound 플레이할 사운드
     */
    playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    /**
     * 사운드 멈춤
     * @param {element} sound 플레이할 사운드
     */
    stopSound(sound) {
        sound.pause();
    }
}

const carrotGame = new gameSetting(10, 10);
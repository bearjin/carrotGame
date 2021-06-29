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
        this.bgAudio = new Audio('./resources/sound/bg.mp3');
        this.winAudio = new Audio('./resources/sound/game_win.mp3');
        this.carrotAudio = new Audio('./resources/sound/carrot_pull.mp3');
        this.bugAudio = new Audio('./resources/sound/bug_pull.mp3');

        this.onEvent();
    }

    /**
     * 게임 이벤트 등록
     */
    onEvent() {
        this.$playBtn.addEventListener('click', event => {
            const state = event.target.dataset.state;

            if (state === 'start') {
                this.pauseGame();
                this.bgAudio.pause();
            } else if (state === 'pause') {
                this.reStartGame();
                this.bgAudio.play();
            } else if (state === 'init') {
                this.playGame();
                this.bgAudio.play();
            }
        });
        this.$replayBtn.addEventListener('click', () => {
            this.initGame();
        });
        this.$area.addEventListener('click', event => {
            const $target = event.target;
            if ($target.className === 'bug') {
                this.bugAudio.play();
                this.failGame();
            } else if ($target.className === 'carrot') {
                this.carrotAudio.play();
            }
            this.removeTarget($target);
            this.checkScore();
            if (this.score === 0) {
                this.successGame();
                this.bgAudio.pause();
                this.winAudio.play();
            }
        });
    }

    /**
     * 게임 재설정
     */
    initGame() {
        clearInterval(this.timerInterval);
        this.$result.style.visibility = 'hidden';
        this.$minTxt.innerText = '00';
        this.$secTxt.innerText = '00';
        this.$score.innerText = 0;
        this.currentTime = this.gameTime;
        this.$area.innerHTML = '';
        this.$playBtn.classList.remove('fa-stop');
        this.$playBtn.setAttribute('data-state', 'init');
    }

    /**
     * 게임 시작하기
     */
    playGame() {
        this.startTimer();
        this.makeTarget();
        this.checkScore();
        this.$result.style.visibility = 'hidden';
        this.$playBtn.classList.add('fa-stop');
        this.$playBtn.setAttribute('data-state', 'start');
    }

    /**
     * 타이머 시작하기
     */
    startTimer() {
        let time = this.gameTime;
        let min = parseInt(time / 60);
        let sec = time % 60;
        min < 10 ? this.$minTxt.innerText = `0${min}` : this.$minTxt.innerText = `${min}`;
        sec < 10 ? this.$secTxt.innerText = `0${sec}` : this.$secTxt.innerText = `${sec}`;

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.currentTime = time--;
            if (time < 0) {
                clearInterval(this.timerInterval);
                this.failGame();
                this.bgAudio.pause();
                return;
            }
            min = parseInt(time / 60);
            sec = time % 60;
            min < 10 ? this.$minTxt.innerText = `0${min}` : this.$minTxt.innerText = `${min}`;
            sec < 10 ? this.$secTxt.innerText = `0${sec}` : this.$secTxt.innerText = `${sec}`;
        }, 1000);
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
            const randomPositionX = Math.floor(Math.random() * (areaSize.width - 80));
            const randomPositionY = Math.floor(Math.random() * (areaSize.height - 80));

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
     * @param {element} target 
     */
    removeTarget(target) {
        if (target.className === 'carrot') {
            this.$area.removeChild(target);
        }
    }

    /**
     * 게임 성공
     */
    successGame() {
        clearInterval(this.timerInterval);
        this.$resultTxt.innerHTML = `
            <span class="result_txt">YOU WIN</span>
            <i class="fas fa-laugh-squint"></i>
        `;
        this.$result.style.visibility = 'visible';
        this.$playBtn.classList.remove('fa-stop');
        this.$playBtn.setAttribute('data-state', 'init');
    }

    /**
     * 게임 실패
     */
    failGame() {
        clearInterval(this.timerInterval);
        this.$resultTxt.innerHTML = `
            <span class="result_txt">YOU LOSE</span>
            <i class="fas fa-sad-tear"></i>
        `;
        this.$result.style.visibility = 'visible';
        this.$playBtn.classList.remove('fa-stop');
        this.$playBtn.setAttribute('data-state', 'init');
        this.bgAudio.pause();
    }

    /**
     * 게임 일시정지
     */
    pauseGame() {
        clearInterval(this.timerInterval);
        this.$resultTxt.innerHTML = `
        <span class="result_txt">RESTART?</span>
        <i class="fas fa-surprise"></i>
        `;
        this.$result.style.visibility = 'visible';
        this.$playBtn.classList.remove('fa-stop');
        this.$playBtn.setAttribute('data-state', 'pause');
    }

    /**
     * 게임 재시작
     */
    reStartGame() {
        this.$result.style.visibility = 'hidden';
        this.$playBtn.classList.add('fa-stop');
        this.$playBtn.setAttribute('data-state', 'start');

        let time = this.currentTime;
        let min = parseInt(time / 60);
        let sec = time % 60;

        this.timerInterval = setInterval(() => {
            this.currentTime = time--;
            if (time < 0) {
                clearInterval(this.timerInterval);
                this.failGame();
                return;
            }
            min = parseInt(time / 60);
            sec = time % 60;
            min < 10 ? this.$minTxt.innerText = `0${min}` : this.$minTxt.innerText = `${min}`;
            sec < 10 ? this.$secTxt.innerText = `0${sec}` : this.$secTxt.innerText = `${sec}`;
        }, 1000);
    }
}

const carrotGame = new gameSetting(10, 10);
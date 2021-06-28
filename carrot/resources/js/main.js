class gameSetting {
    /**
     * 
     * @param {string} targetNum 생성 할 타겟 수 
     * @param {string} gameTime  게임 제한시간
     */
    constructor(targetNum, gameTime) {
        this.$playBtn = document.querySelector('.play_btn');
        this.$replayBtn = document.querySelector('.replay_btn');
        this.$area = document.querySelector('.game_area');
        this.$result = document.querySelector('.game_result');
        this.$resultTxt = document.querySelector('.game_result_txt');
        this.targetNum = targetNum;
        this.gameTime = gameTime;
        this.timerInterval;
        this.score;

        this.init();
    }

    /**
     * 게임 초기 설정하기 :: 이벤트 등록
     */
    init() {
        this.$playBtn.addEventListener('click', () => {
            this.playGame();
        });
        this.$replayBtn.addEventListener('click', () => {
            this.playGame();
        });
        this.$area.addEventListener('click', event => {
            const $target = event.target;
            this.removeTarget($target);
            this.checkScore();
            if (this.score === 0) {
                this.successGame();
            }
        });
    }

    /**
     * 게임 시작하기
     */
    playGame() {
        this.startTimer();
        this.makeTarget();
        this.checkScore();
        this.$result.style.visibility = 'hidden';
    }

    /**
     * 타이머 시작하기
     */
    startTimer() {
        const $minTxt = document.querySelector('.timer_min');
        const $secTxt = document.querySelector('.timer_sec');
        let time = this.gameTime;
        let min = parseInt(time / 60);
        let sec = time % 60;
        min < 10 ? $minTxt.innerText = `0${min}` : $minTxt.innerText = `${min}`;
        sec < 10 ? $secTxt.innerText = `0${sec}` : $secTxt.innerText = `${sec}`;

        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            time--;
            console.log(time);
            if (time < 0) {
                clearInterval(this.timerInterval);
                this.failGame();
                return;
            }
            min = parseInt(time / 60);
            sec = time % 60;
            min < 10 ? $minTxt.innerText = `0${min}` : $minTxt.innerText = `${min}`;
            sec < 10 ? $secTxt.innerText = `0${sec}` : $secTxt.innerText = `${sec}`;
        }, 1000);
    }

    /**
     * 스코어 체크하기
     */
    checkScore() {
        const $score = document.querySelector('.game_score');
        const $target = document.querySelectorAll('.carrot');
        const targetNum = $target.length;

        this.score = targetNum;
        $score.innerText = targetNum;
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
    }
}

const carrotGame = new gameSetting(10, 10);
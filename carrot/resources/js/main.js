const $playBtn = document.querySelector('.play_btn');
const $area = document.querySelector('.game_area');
const $result = document.querySelector('.game_result');

class gameOption {
    /**
     * 
     * @param {string} targetNum 생성 할 타겟 수 
     * @param {string} gameTime  게임 제한시간
     */
    constructor(targetNum, gameTime) {
        this.targetNum = targetNum;
        this.gameTime = gameTime;
    }

    /**
     * 게임 시작하기
     */
    playGame() {
        this.startTimer();
        this.makeTarget();
        this.checkScore();
    }

    /**
     * 타이머 시작하기
     */
    startTimer() {
        const $minTxt = document.querySelector('.timer_min');
        const $secTxt = document.querySelector('.timer_sec');
        let time = this.gameTime;
        let min;
        let sec;

        const timerInterval = setInterval(() => {
            console.log(time);
            if (time < 0) {
                clearInterval(timerInterval);
                return;
            }
            min = parseInt(time / 60);
            sec = time % 60;
            min < 10 ? $minTxt.innerText = `0${min}` : $minTxt.innerText = `${min}`;
            sec < 10 ? $secTxt.innerText = `0${sec}` : $secTxt.innerText = `${sec}`;
            time--;
        }, 1000);
    }

    /**
     * 스코어 체크하기
     */
    checkScore() {
        const $score = document.querySelector('.game_score');
        const $target = document.querySelectorAll('.carrot');
        const targetNum = $target.length;

        $score.innerText = targetNum;
    }

    /**
     * 타겟 생성하기
     */
    makeTarget() {
        const areaSize = $area.getBoundingClientRect();
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
        $area.innerHTML = img;
    }

    /**
     * 타겟 제거하기
     * @param {element} target 
     */
    removeTarget(target) {
        if (target.className === 'carrot') {
            $area.removeChild(target);
        }
    }
}

const carrotGame = new gameOption(10, 10);

$playBtn.addEventListener('click', () => {
    carrotGame.playGame();
});

$area.addEventListener('click', event => {
    const $target = event.target;
    carrotGame.removeTarget($target);
    carrotGame.checkScore();
});
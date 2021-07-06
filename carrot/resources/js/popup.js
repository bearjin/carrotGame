'use strict';

export default class Popup {
    constructor() {
        this.$result = document.querySelector('.game_result');
        this.$resultTxt = document.querySelector('.game_result_txt');
        this.$replayBtn = document.querySelector('.replay_btn');

        this.$replayBtn.addEventListener('click', () => {
            this.onClick && this.onClick();
        });
    }

    setClickListener(onClick) {
        this.onClick = onClick;
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
}
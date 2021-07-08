'use strict';

export default class Field {
    /**
     * 
     * @param {string} targetNum 생성 할 타겟 수 
     */
    constructor(targetNum) {
        this.$area = document.querySelector('.game_area');
        this.targetNum = targetNum;
        this.targetSize = 80;

        this.$area.addEventListener('click', event => {
            this.onClick(event);
        });
    }

    setClickListener(onItemClick) {
        this.onItemClick = onItemClick;
    }

    /**
     * 타겟 제거하기
     */
    onClick(event) {
        const target = event.target;
        if (target.className === 'carrot') {
            target.remove();
            this.onItemClick && this.onItemClick('carrot');
        } else if (target.className === 'bug') {
            this.onItemClick && this.onItemClick('bug');
        }
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
}
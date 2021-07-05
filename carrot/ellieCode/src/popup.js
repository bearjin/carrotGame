'use strict';

export default class PopUp {
    constructor() {
        this.popUp = document.querySelector('.pop-up');
        this.popUpRefresh = document.querySelector('.pop-up_refresh');
        this.popUpMessage = document.querySelector('.pop-up_message');
        this.popUpRefresh.addEventListener('click', () => {
            this.onClick && this.onClick();
            this.hide();
        });
    }

    setClickListener(onClick) {
        this.onClick = onClick;
    }

    showWithText(text) {
        this.popUpMessage.innerText = text;
        this.popUp.classList.remove('pop-up-hide');
    }

    hide() {
        this.popUp.classList.add('pop-up-hide');
    }
}
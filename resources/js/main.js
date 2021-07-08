'use strict';

import Popup from './popup.js';
import Game from './game.js';

const gameFinishBanner = new Popup();
const game = new Game(20, 20);

game.setGameStopListener(reason => {
    let message;
    let icon;
    switch (reason) {
        case 'pause':
            message = 'Replay';
            icon = 'fa-surprise';
            break;
        case 'success':
            message = 'YOU WIN';
            icon = 'fa-laugh-squint';
            break;
        case 'fail':
            message = 'YOU LOSE';
            icon = 'fa-sad-tear';
            break;
        default:
            throw new Error('not valid reason');
    }
    gameFinishBanner.showPopUp(message, icon);
});

game.setPopUpHiddenListener(() => {
    gameFinishBanner.hidePopUp();
})

gameFinishBanner.setClickListener(() => {
    game.init();
});
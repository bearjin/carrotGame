'use strict';

import PopUp from './popup.js';
import Game from './game.js';

const gameFinishBanner = new PopUp();
const game = new Game(10, 5, 5);

game.setGameStopListener(reason => {
    let message;
    switch (reason) {
        case 'cancel':
            message = 'Replay';
            break;
        case 'win':
            message = 'YOU WIN';
            break;
        case 'lose':
            message = 'YOU LOSE';
            break;
        default:
            throw new Error('not valid reason');
    }
    gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
    game.start();
});
var game = new Phaser.Game(900, 600, Phaser.Auto, 'gameDiv');

game.global = {
    user: 'anonymous',
    levels: [],
    index: 0
}

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('testMap', testMap);
game.state.add('playAll', playAll);
game.state.add('createMap', createMap);

game.state.start('boot');
var bootState = {

    create: function () {
        game.add.plugin(PhaserInput.Plugin);

        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.state.start('load');
    }
};
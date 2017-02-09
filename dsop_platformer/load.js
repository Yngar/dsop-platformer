var loadState = {
    preload: function () {
        //load assets here
        var loadingLabel = game.add.text(80, 150, 'loading...',
                        {font: '30px Courier', fill: '#ffffff'});
                        
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.image('tiles', 'assets/testTiles.png');
        
    },
    
    create: function() {
        
        game.state.start('menu');
    }
}
var loadState = {
    preload: function () {
        //load assets here
        var loadingLabel = game.add.text(80, 150, 'loading...',
                        {font: '30px Courier', fill: '#ffffff'});
                        
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('pear', 'assets/pear.png', 76, 75);
        game.load.image('tiles', 'assets/dsopTiles.png');
        game.load.image('toolbox', 'assets/Toolbox.png');
        game.load.image('cloud1', 'assets/Cloud1.png');
        game.load.image('cloud2', 'assets/Cloud2.png');
        game.load.image('cloud3', 'assets/Cloud3.png');
        game.load.image('cloud4', 'assets/Cloud4.png');
        game.load.image('cloud5', 'assets/Cloud5.png');
        game.load.image('DSOP', 'assets/DSOPLogo.png');
        game.load.image('newButton', 'assets/Button_NewLevel.png');
        game.load.image('testButton', 'assets/Button-TestLevel.png');
        game.load.image('playButton', 'assets/Button_PlayAll.png');
        game.load.image('jumpButton', 'assets/jumpButton.png');
        game.load.image('leftButton', 'assets/leftButton.png');
        game.load.image('rightButton', 'assets/rightButton.png');
        game.load.image('saveButton', 'assets/Save.png');
        game.load.image('touchButton', 'assets/Touch.png');
    },
    
    create: function() {
        
        game.state.start('menu');
    }
}
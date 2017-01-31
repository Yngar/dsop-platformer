var input;
var menuState = {
    create: function () {
        var nameLabel = game.add.text(80, 80, 'DSOP Level Design Workshop',
                            {font: '50px Arial', fill: '#ffffff'});
        
        var startLabel = game.add.text(80, game.world.height - 80,
                                    'press M to create level',
                                    {font: '25px Arial', fill: '#ffffff'});
        
        var mkey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        
        mkey.onDown.addOnce(this.start, this);
        input = game.add.inputField(10, 400);
    },
    
    start: function() {
        game.global.user = input.value;
        game.global.user = game.global.user.replace(/\W/g, '')
        game.state.start('createMap');
    },
}
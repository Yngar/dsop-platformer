var input;
var statusLabel;
var oReq;
var testLevel = false;
var menuState = {
    create: function () {        
        game.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
        
        var nameLabel = game.add.text(80, 80, 'DSOP Level Design Workshop',
                            {font: '50px Arial', fill: '#ffffff'});
        
        var startLabel = game.add.text(80, 450,
                                    'press C to create level\npress T to test level\npress P to play all levels',
                                    {font: '25px Arial', fill: '#ffffff'});
        statusLabel = game.add.text(100, 200,
                                    "enter a name the level will be saved as,\nthis name will be used to load and test the level" ,
                                    {font: '12px Arial', fill: '#ffffff'});
        
        var ckey = game.input.keyboard.addKey(Phaser.Keyboard.C);
        var tkey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        var pkey = game.input.keyboard.addKey(Phaser.Keyboard.P);

        
        ckey.onDown.addOnce(this.start, this);        
        tkey.onDown.addOnce(this.test, this);
        pkey.onDown.addOnce(this.play, this);

        input = game.add.inputField(10, 400);
        game.load.onLoadStart.add(this.loadStart, this);
        game.load.onFileComplete.add(this.fileComplete, this);
        game.camera.follow(null);
        game.camera.x = 0;
        game.camera.y = 0;
    },
    
    start: function() {
        game.global.user = input.value;
        game.global.user = game.global.user.replace(/\W/g, '')
        game.state.start('createMap');
    },
    
    test: function() {
        testLevel = true;
        game.global.user = input.value;
        game.global.user = game.global.user.replace(/\W/g, '')
        //try to load the file here and load the level if it succeeds, send a message if it fails
        game.load.tilemap('testTiles', 'saved_levels/' + game.global.user + '.csv');
        game.load.start();
    },
    
    play: function() {
        oReq = new XMLHttpRequest();
        oReq.addEventListener("load", this.reqListener);
        oReq.open("GET", 'https://phaser-yngar.c9users.io/dsop_platformer/levelList.php');
        oReq.send();
    },
    
    loadTestLevel: function() {
        game.state.start('testMap');
    },
    
    fileComplete: function (progress, cacheKey, success, totalLoaded, totalFiles) {
        console.log("file complete");
        if(success){
            if(testLevel)
                this.loadTestLevel();
            else
                game.state.start('playAll');
        }
        else
            statusLabel.setText("level with name " + game.global.user + " could not be found\nrefresh the page and try again");
    },
    
    loadStart: function () {
        statusLabel.setText("loading level");
    },
    
    startPlayAll: function () {
        game.load.tilemap('testTiles', 'saved_levels/' + game.global.levels[game.global.index]);
        game.load.start();
    },
    
    reqListener: function () {
        var levelString = this.responseText;
        levelString = levelString.replace('[', '');
        levelString = levelString.replace(']', '');
        levelString = levelString.split("\"").join('');
        game.global.levels = levelString.split(',');
        console.log(game.global.levels);
        menuState.startPlayAll();
    }
}
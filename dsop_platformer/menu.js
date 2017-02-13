var input;
var statusLabel;
var oReq;
var testLevel = false;
var menuState = {
    create: function () {        
        game.input.addPointer();
        game.input.addPointer();
        game.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
        //make background
        game.stage.backgroundColor = '#fef7b7';
        for(var i = 0; i < 2; i++){
            game.add.sprite(700 * i, 20, 'cloud1');
            game.add.sprite(700 * i, 100, 'cloud2');
            game.add.sprite(700 * i, 150, 'cloud3');
            game.add.sprite(700 * i, 250, 'cloud4');
            game.add.sprite(700 * i, 300, 'cloud5');
        }
        game.add.sprite(30, 400, 'DSOP');
        
        /*var nameLabel = game.add.text(80, 80, 'DSOP Level Design Workshop',
                            {font: '50px Arial', fill: '#ffffff'});
        
        var startLabel = game.add.text(80, 450,
                                    'press C to create level\npress T to test level\npress P to play all levels',
                                    {font: '25px Arial', fill: '#ffffff'});
                                    */
        statusLabel = game.add.text(500, 20,
                                    "enter a name the level will be saved as,\nthis name will be used to load and test the level" ,
                                    {font: '14px Arial', fill: '#000000', fontWeight: 'bold'});
        
        var ckey = game.input.keyboard.addKey(Phaser.Keyboard.C);
        var tkey = game.input.keyboard.addKey(Phaser.Keyboard.T);
        var pkey = game.input.keyboard.addKey(Phaser.Keyboard.P);

        
        /*ckey.onDown.addOnce(this.start, this);        
        tkey.onDown.addOnce(this.test, this);
        pkey.onDown.addOnce(this.play, this);
        */
        var createButton = game.add.button(game.world.centerX - 275, 150, 'newButton', this.start, this, 2, 1, 0);
        var testButton = game.add.button(game.world.centerX - 275, 300, 'testButton', this.test, this, 2, 1, 0);
        var playButton = game.add.button(game.world.centerX - 275, 450, 'playButton', this.play, this, 2, 1, 0);

        
        input = game.add.inputField(game.world.centerX - 150, 100, {
            font: '25px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Username'
        });
        game.load.onLoadStart.add(this.loadStart, this);
        game.load.onFileComplete.add(this.fileComplete, this);
        game.camera.follow(null);
        game.camera.x = 0;
        game.camera.y = 0;
    },
    
    start: function() {
        game.global.user = input.value;
        game.global.user = game.global.user.replace(/\W/g, '')
        if(game.global.user != ''){
            game.state.start('createMap');
        }
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
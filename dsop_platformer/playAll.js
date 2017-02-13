
var playAll = function(game){ 
    
}
var player;    

var HORIZONTAL_TOP_SPEED = 200;
var JUMP_VELOCITY = 200;
var WALLJUMP_HORIZONTAL = 50;
var WALLJUMP_VERTICAL = 200;
var HORIZONTAL_ACCEL = 300;

    //tilemap stuff
var map;
var MAP_WIDTH = 60;
var MAP_HEIGHT = 40;
var layer1;

var startX = -1;
var startY = -1;
var xSpawn = 32;
var ySpawn = 100;

var cursors;

var leftButton;
var rightButton;
var jumpButton;
var touchButton;
    
var cursorMode = true; //using arrows to move character or map

var touchingTile = false;
var UI;
var buttons = false;
var rightDown = false;
var leftDown = false;


playAll.prototype = {
    create: function() {
        MAP_WIDTH = 60;
        MAP_HEIGHT = 40;
        game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {  this.CameraMode();}, this);
        game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(function () {  this.Jump();}, this);
        game.stage.backgroundColor = '#fef7b7';
        for(var i = 0; i < 5; i++){
            game.add.sprite(700 * i, 550, 'cloud1');
            game.add.sprite(700 * i, 700, 'cloud2');
            game.add.sprite(700 * i, 900, 'cloud3');
            game.add.sprite(700 * i, 1090, 'cloud4');
            game.add.sprite(700 * i, 1300, 'cloud5');
        }
        //  Creates a blank tilemap
        map = game.add.tilemap('testTiles', 48, 48);
        game.world.setBounds(0, 0, MAP_WIDTH * map.tileWidth, MAP_HEIGHT * map.tileHeight);
        layer1 = map.createLayer(0);
        layer1.resizeWorld();

        //  Add a Tileset image to the map
        map.addTilesetImage('tiles');
        map.setCollision([11,12,13,17,19,20,21], true);      
        //add sprite and game stuff
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //Find start
        for(var y = 0; y < MAP_HEIGHT; y++){
            for(var x = 0; x < MAP_WIDTH; x++){
                var mapTile = map.getTile(x, y, layer1, true);
                if(mapTile.index == 9){
                    startX = x;
                    startY = y;
                }
            }
        }
        if(startX >= 0){
            xSpawn = startX * map.tileWidth;
            ySpawn = startY * map.tileWidth;
        }
        player = game.add.sprite(xSpawn, ySpawn, 'pear');
        
        game.physics.arcade.enable(player);
        player.body.setSize(36, 64, 18, 12);
        player.body.bounce.y = 0;
        player.body.bounce.x = 0;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [3, 4], 10, true);
        player.animations.add('right', [6, 7], 10, true);
        
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 1);
        touchButton = game.add.button(600, 16, 'touchButton', this.AddTouch, this, 2, 1, 0);

        map.setTileIndexCallback(17, this.Goal, this);
        map.setTileIndexCallback(12, this.UpSpikes, this);
        map.setTileIndexCallback(13, this.RightSpikes, this);
        map.setTileIndexCallback(20, this.DownSpikes, this);
        map.setTileIndexCallback(21, this.LeftSpikes, this);        
        UI = game.add.group();
        UI.add(touchButton);
    },

    update: function() {
        if(player.y > 1000)
            game.stage.backgroundColor = '#4D3668';
        else
            game.stage.backgroundColor = '#fef7b7';
        UI.x = this.camera.x + 28;
        UI.y = this.camera.y + 28;

        touchingTile = false;
        game.physics.arcade.collide(player, layer1, this.TileCollide, null, this);
        player.body.acceleration.x = 0;
        if(player.body.blocked.down)
            player.body.drag = new Phaser.Point(200, 200);
        else if (player.body.blocked.left || player.body.blocked.right)
            player.body.drag = new Phaser.Point(75, 75);
        else
            player.body.drag = new Phaser.Point(0, 0);
         if(cursorMode == true){
            if(!buttons){
            if (cursors.left.isDown)
                {
                    leftDown = true;
    
                }
                else if (cursors.right.isDown)
                {
                    rightDown = true;
                }
            }
            if(leftDown){
                //  Move to the left
                if(player.body.velocity.x > -HORIZONTAL_TOP_SPEED)
                    player.body.acceleration.x =  -HORIZONTAL_ACCEL;
                if(player.body.blocked.down)
                    player.animations.play('left');
                else if(player.body.blocked.left)
                    player.frame = 0;
                else if(player.body.velocity.y < 0)
                    player.frame = 2;
                else if(player.body.velocity.y > 0)
                    player.frame = 1;
            } else if(rightDown){
                //  Move to the right
                if(player.body.velocity.x < HORIZONTAL_TOP_SPEED)
                    player.body.acceleration.x = HORIZONTAL_ACCEL;
                if(player.body.blocked.down)
                    player.animations.play('right');
                else if(player.body.blocked.right)
                    player.frame = 10;
                else if(player.body.velocity.y < 0)
                    player.frame = 8;
                else if(player.body.velocity.y > 0)
                    player.frame = 9;
            }
            else
            {
                //  Stand still
                player.animations.stop();
                if(player.body.blocked.down)
                    player.frame = 5;
            }
            if (cursors.up.isDown)
            {

            }
            
            if (cursors.down.isDown){
                
                        
            }
        } else {
            if (cursors.left.isDown)
            {
                game.camera.x -= 4;
            }
            else if (cursors.right.isDown)
            {
                game.camera.x += 4;
            }
    
            if (cursors.up.isDown)
            {
                game.camera.y -= 4;
            }
            else if (cursors.down.isDown)
            {
                game.camera.y += 4;
            }
        }
        if(!buttons){
            leftDown = false;
            rightDown = false;
        }
        if(player.y >= 1820)
            this.Die();
    },
    
    Jump: function(){
        
        if(player.body.onFloor())
            player.body.velocity.y = -JUMP_VELOCITY;
        else{
            //check touching sides for wall jumps
            if(player.body.blocked.right){
                player.body.velocity.y = -WALLJUMP_VERTICAL;
                player.body.velocity.x = -HORIZONTAL_TOP_SPEED;
            } else if (player.body.blocked.left){
                player.body.velocity.y = -WALLJUMP_VERTICAL;
                player.body.velocity.x = HORIZONTAL_TOP_SPEED;
            }
        }
    },

    CameraMode: function(){
        cursorMode = !cursorMode;
        if(cursorMode){
            game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 1, 1);
        } else {
            game.camera.follow(null);
        }
    },
    
    render: function() {
    
        //game.debug.text('Current Layer: ' + currentLayer.name, 16, 550);
        //game.debug.text('1-3 Switch Layers. SPACE = Show All. Cursors = Move Camera', 16, 570);
          //game.debug.cameraInfo(game.camera, 32, 32);
    
       // game.debug.bodyInfo(player, 16, 24);

    },

    TileCollide: function( first, second) {
        touchingTile = true;
    },
    
    Goal: function(){
        game.global.index ++;
        game.state.start('menu');
    },
    
    Die: function(){
        player.body.x = startX * map.tileWidth;
        player.body.y = startY * map.tileWidth;
    },
    
    UpSpikes: function(sprite, tile){
        if(player.body.bottom - 1 < tile.top)
            this.Die();
        return true;
    },
    
    RightSpikes: function(sprite, tile){
        if(player.body.right + 1 > tile.right && player.body.bottom - 1 > tile.top && player.body.top + 1 < tile.bottom)
            this.Die();
        return true;
    }, 
    
    LeftSpikes: function(sprite, tile){
        if(player.body.left - 1 < tile.left && player.body.bottom - 1 > tile.top && player.body.top + 1 < tile.bottom)
            this.Die();
        return true;
    },
    
    DownSpikes: function(sprite, tile){
        if(player.body.top + 1 > tile.bottom)
            this.Die();
        return true;
    },        
    
    AddTouch: function(){
        buttons = true;
        leftButton = game.add.button(10 + game.camera.x, 400 , 'leftButton', null, this, 2, 1, 0);
        leftButton.onInputDown.add(this.pressLeft, this);
        leftButton.onInputUp.add(this.releaseLeft, this);
        UI.add(leftButton);
        rightButton = game.add.button(150 + game.camera.x, 400 , 'rightButton', null, this, 2, 1, 0);
        rightButton.onInputDown.add(this.pressRight, this);
        rightButton.onInputUp.add(this.releaseRight, this);
        UI.add(rightButton);
        jumpButton = game.add.button(700 + game.camera.x, 400 , 'jumpButton', null, this, 2, 1, 0);
        jumpButton.onInputDown.add(this.Jump);
        UI.add(jumpButton);
        touchButton.destroy();
    },
    
    pressLeft: function(){
        leftDown = true;
    },
    
    pressRight: function(){
        rightDown = true;
    },
    
    releaseLeft: function(){
        leftDown = false;
    },
    
    releaseRight: function(){
        rightDown = false;
    }
};

    

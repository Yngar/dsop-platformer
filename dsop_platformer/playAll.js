
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

var cursorMode = true; //using arrows to move character or map



playAll.prototype = {
    create: function() {
        MAP_WIDTH = 60;
        MAP_HEIGHT = 40;
        game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {  this.CameraMode();}, this);
        game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(function () {  this.Jump();}, this);
        game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(function () { this.Goal();}, this);
        game.stage.backgroundColor = '#2d2d2d';
        game.add.sprite(0, 0, 'sky');
        //  Creates a blank tilemap
        map = game.add.tilemap('testTiles', 32, 32);
        layer1 = map.createLayer(0);
        layer1.resizeWorld();

        //  Add a Tileset image to the map
        map.addTilesetImage('tiles');
        map.setCollisionBetween(1, 7);
    
        //add sprite and game stuff
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //Find start
        for(var y = 0; y < MAP_HEIGHT; y++){
            for(var x = 0; x < MAP_WIDTH; x++){
                var mapTile = map.getTile(x, y, layer1, true);
                if(mapTile.index == 0){
                    startX = x;
                    startY = y;
                }
            }
        }
        if(startX >= 0){
            xSpawn = startX * map.tileWidth;
            ySpawn = startY * map.tileWidth;
        }
        player = game.add.sprite(xSpawn, ySpawn, 'dude');
        
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0;
        player.body.bounce.x = 0;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        map.setTileIndexCallback(1, this.Goal, this);
        map.setTileIndexCallback(4, this.UpSpikes, this);
        map.setTileIndexCallback(5, this.RightSpikes, this);
        map.setTileIndexCallback(6, this.DownSpikes, this);
        map.setTileIndexCallback(7, this.LeftSpikes, this);
    },

    update: function() {
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
            if (cursors.left.isDown)
            {
                //  Move to the left
                if(player.body.velocity.x > -HORIZONTAL_TOP_SPEED)
                    player.body.acceleration.x =  -HORIZONTAL_ACCEL;
    
                player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                //  Move to the right
                if(player.body.velocity.x < HORIZONTAL_TOP_SPEED)
                    player.body.acceleration.x = HORIZONTAL_ACCEL;
    
                player.animations.play('right');
            }
            else
            {
                //  Stand still
                player.animations.stop();
    
                player.frame = 4;
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
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
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
        if(player.y < tile.top)
            this.Die();
    },
    
    RightSpikes: function(sprite, tile){
        if(player.x > tile.right)
            this.Die();
    }, 
    
    LeftSpikes: function(sprite, tile){
        if(player.x < tile.left)
            this.Die();
    },
    
    DownSpikes: function(sprite, tile){
        if(player.y > tile.bottom)
            this.Die();
    }
};
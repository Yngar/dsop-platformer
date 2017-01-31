
var createMap = function(game){ 
    
}
var player;    
var score = 0;
var scoreText;

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
var layer2;
var layer3;

var marker;
var currentTile = 0;
var currentLayer;

var cursors;
var showLayersKey;
var layer1Key;
var layer2Key;
var layer3Key;
    
    
var cursorMode = true; //using arrows to move character or map

var touchingTile = false;


createMap.prototype = {
    create: function() {
        MAP_WIDTH = 60;
        MAP_HEIGHT = 40;
        game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function () {  this.LogTiles();}, this);
        game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {  this.CameraMode();}, this);
        game.input.keyboard.addKey(Phaser.Keyboard.Z).onDown.add(function () {  this.Jump();}, this);
        game.stage.backgroundColor = '#2d2d2d';
        game.add.sprite(0, 0, 'sky');
        //  Creates a blank tilemap
        map = game.add.tilemap();
        map.tileWidth = 32;
        map.tileHeight = 32;
        map.width = 19;
        map.height = 6;
        game.world.setBounds(0, 0, MAP_WIDTH * map.tileWidth, MAP_HEIGHT * map.tileHeight);
        //  Add a Tileset image to the map
        map.addTilesetImage('tiles');
        map.setCollisionBetween(40, 43);
        map.setCollisionBetween(104, 107);
    
        layer1 = map.createBlankLayer('level1', MAP_WIDTH, MAP_HEIGHT, map.tileWidth, map.tileHeight);
    
        currentLayer = layer1;
        //layer1.debug = true; // uncheck to show which tiles have collision
    
        //  Create our tile selector at the top of the screen
        this.createTileSelector();
    
        game.input.addMoveCallback(this.updateMarker, this);
    
        //add sprite and game stuff
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        player = game.add.sprite(32, 100, 'dude');
        for(var i = 0; i < 6; i++){
                map.putTile(42, i, 12, currentLayer);
        }
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0;
        player.body.bounce.x = 0;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    },

        pickTile: function(sprite, pointer) {
        
        currentTile = game.math.snapToFloor(pointer.x, map.tileWidth) / map.tileWidth;
        var x = game.math.snapToFloor(pointer.x, map.tileWidth, 0);
        var y = game.math.snapToFloor(pointer.y, map.tileHeight, 0);
        
        x /= map.tileWidth;
        y /= map.tileHeight;
        
        currentTile = x + (y * map.width);
        console.log(y);

    },
    
    updateMarker: function() {
    
        marker.x = currentLayer.getTileX(game.input.activePointer.worldX) * map.tileWidth;
        marker.y = currentLayer.getTileY(game.input.activePointer.worldY) * map.tileHeight;
    
        if (game.input.mousePointer.isDown)
        {
            map.putTile(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), currentLayer);
            // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
        }
    
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
    
        game.debug.bodyInfo(player, 16, 24);

    },
    
    createTileSelector: function() {
    
        //  Our tile selection window
        var tileSelector = game.add.group();
    
        var tileSelectorBackground = game.make.graphics();
        tileSelectorBackground.beginFill(0x000000, 0.5);
        tileSelectorBackground.drawRect(0, 0, 800, 18);
        tileSelectorBackground.endFill();
    
        tileSelector.add(tileSelectorBackground);
    
        var tileStrip = tileSelector.create(1, 1, 'tiles');
        tileStrip.inputEnabled = true;
        tileStrip.events.onInputDown.add(this.pickTile, this);
    
        tileSelector.fixedToCamera = true;
    
        //  Our painting marker
        marker = game.add.graphics();
        marker.lineStyle(2, 0x000000, 1);
        marker.drawRect(0, 0, map.tileWidth, map.tileHeight);
    
    },
    
    LogTiles: function(){
        
        //Generate tileset data
        var tileset = "content=" + game.global.user + ":END:";
        for(var y = 0; y < MAP_HEIGHT; y++){
            for(var x = 0; x < MAP_WIDTH; x++){
                var mapTile = map.getTile(x, y, layer1, true);
                if(mapTile != null)
                tileset += mapTile.index + ",";
                else
                tileset += x;
            }
            tileset += "\n";
        }
        
        //Send it off to the server
        var data = tileset;
    
        var request = new XMLHttpRequest();
        request.open('POST', '/dsop_platformer/saveLevel.php', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function() {
          if (request.status >= 200 && request.status < 400){
            // Success!
            // here you could go to the leaderboard or restart your game .
            console.log("Saved successfuly");
          } else {
            // We reached our target server, but it returned an error
            console.log("Error");
          }
        };  
        request.send(data);
    
    },
    
    TileCollide: function( first, second) {
        touchingTile = true;
    }
};
var preload = function(game){}
 
preload.prototype = {
	preload: function(){ 
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.game.load.image('tiles', 'assets/testTiles.png');

	},
  	create: function(){
		this.game.state.start("Create");
	}
}
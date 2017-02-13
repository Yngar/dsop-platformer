var preload = function(game){}
 
preload.prototype = {
	preload: function(){ 
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('ground', 'assets/platform.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('pear', 'assets/pear_character.png', 75, 76);
    this.game.load.image('tiles', 'assets/dsopTiles.png');
    this.game.load.image('DSOP', 'assets/DSOPLogo.png');


	},
  	create: function(){
		this.game.state.start("Create");
	}
}
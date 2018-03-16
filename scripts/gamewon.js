MyGame.screens['game-won'] = (function(game) {
	'use strict';
	
	function initialize() {
		document.getElementById('game-back').addEventListener(
            'click',
			function() { location.reload();},);
    }
	function run() {

	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));

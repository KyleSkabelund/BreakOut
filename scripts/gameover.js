MyGame.screens['game-over'] = (function(game) {
	'use strict';
	
	function initialize() {
        document.getElementById('new-game').addEventListener(
			'click',
			function() { game.showScreen('game-play'); });

		document.getElementById('exit-game').addEventListener(
			'click',
			function() { location.reload();});
    }
	function run() {

	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));

MyGame.screens['main-menu'] = (function(game) {
	'use strict';
	
	function initialize() {
		var f = document.getElementById('id-title');
		var i = 0;
		
		f.style.color = "grey";
		setInterval(function() {
			f.style.opacity = i;
			
			i += .01;
			if(i > 1){
				i = 0;
				f.style.opacity = i;
				f.style.color = (f.style.color == "grey" ? "black" : "grey");
			} 
		}, 10);
		//
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {game.showScreen('game-play'); });
		
		document.getElementById('id-high-scores').addEventListener(
			'click',
			function() { game.showScreen('high-scores'); });
		
		document.getElementById('id-help').addEventListener(
			'click',
			function() { game.showScreen('help'); });
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { game.showScreen('about'); });

		
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));

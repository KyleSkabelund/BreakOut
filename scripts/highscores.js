MyGame.screens['high-scores'] = (function(game) {
	'use strict';
	let highScores = [];
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });

		for(var key in localStorage){
			if(localStorage.getItem(key)!=null){
				highScores.push(localStorage[key] +" " + key);
			}
		}
		highScores.sort();
		for(var i = 0; i < highScores.length; ++i){
			document.getElementById(i).innerHTML = highScores[i];
			if(i == 4)break;
		}	
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

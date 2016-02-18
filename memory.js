$(document).ready(function() {

	var Game = function(height,width) {
		this.height = height;
		this.width = width;
		this.maxValue = height*width/2;
		this.takenValues = "#";
		this.values = null;
		this.clicked1 = null;
		this.clicked2 = null;
		this.remainingMatches = height*width/2;
	};

	Game.prototype.taken = function(value) {
		var taken = true;
		var index = this.takenValues.indexOf("#" + value + "#");
		var lastIndex = this.takenValues.lastIndexOf("#" + value + "#");
		if ( index === -1 || index === lastIndex ) {
			taken = false;
		} 
		return taken;
	};

	Game.prototype.genValue = function() {
		var found = false;
		var value = -1;
		while ( !found ) {
			value = Math.floor(Math.random()*this.maxValue);
			if ( !this.taken(value) ) {
				found = true;
				this.takenValues += value + "#";
			}
		}
	    return value;
	};

	Game.prototype.genValues = function() {
		var values = [];
		for (var i = 0; i < this.height; i++) {
			values[i] = [];
			for (var j = 0; j < this.width; j++) {
				values[i][j] = this.genValue();
			}
		}
		return values;
	};

	Game.prototype.genHtml = function() {
		var board = "<table>";
		for (var i = 0; i < this.height; i++) {
			board += "<tr>";
			for (var j = 0; j < this.width; j++) {
				board += "<td class=\"tile\"><div>" + this.values[i][j] + "</div></td>";
			}
			board += "</tr>";
		}
		board += "</table>";
		return board;
	};

	Game.prototype.initBoard = function(chgvalues) {
		if ( chgvalues ) {
			this.takenValues = "#";
			this.values = this.genValues();
	    }
	    $('#board').empty();
		$('#board').append(this.genHtml());
		$('.tile').click(action);
	};

	Game.prototype.checkWinner = function() {
		this.clicked1.removeTile();
		this.clicked1 = null;
		this.clicked2.removeTile();
		this.clicked2 = null;
		if ( --this.remainingMatches === 0 ) {
			setTimeout(function () {
				$("#msg").append("<p>***WINNER***</p>");
			},800);
		}
	};

	Game.prototype.unsetClickedTiles = function() {
		this.clicked1.hideTile();
		this.clicked1 = null;
		this.clicked2.hideTile();
		this.clicked2 = null;
	};

	var Tile = function($td) {
		this.$td = $td;
		this.$div = $td.find('div');
		this.value = $td.find('div').text();
	};

	Tile.prototype.matches = function(tile) {
		var match = false;
		if ( this.value === tile.value ) {
			match = true;
		}
		return match;
	};

	Tile.prototype.showTile = function() {
		this.$div.css('opacity','1');
	};

	Tile.prototype.hideTile = function() {
		this.$div.animate({opacity: 0},750);
	};

	Tile.prototype.removeTile = function() {
		this.$td.fadeOut(750);
	};

	Tile.prototype.sameTileAs = function($tile) {
		return this.$td.is($tile);
	};

	var setClicked = function($tile) {
		var clicked = new Tile($tile);
		clicked.showTile();
		return clicked;
	};

	var action = function() {
		var $tile = $(this);
		if ( game.clicked1 === null ) {
			game.clicked1 = setClicked($tile);
		} else if ( !game.clicked1.sameTileAs($tile) ) {
			game.clicked2 = setClicked($tile);
			if ( game.clicked2.matches(game.clicked1) ) {
				game.checkWinner();
			} else {
				game.unsetClickedTiles();
			}
		}
	};

	// -------------------------------------------------------
	// Code only works for boards with an even number of tiles
	var game = new Game(4,8);
	game.initBoard(true);
	$('#new').click(function() {
		$('#msg').empty();
		game.initBoard(true);
		game.clicked1 = null;
		game.clicked2 = null;
		game.remainingMatches = game.height*game.width/2;
	});
	$('#reset').click(function() {
		$('#msg').empty();
		game.initBoard(false);
		game.clicked1 = null;
		game.clicked2 = null;
		game.remainingMatches = game.height*game.width/2;
	});

});

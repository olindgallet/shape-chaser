$(document).on("ready", function(){
	var stage,
		gameplay_layer,
		hud_layer,      
		point_layer,
		timer_layer;
		
	var timer_bar = {
		seconds: 10,
		shape:   make_rectangle(10,50,220,20, "orange"),
		text:    ""
	};
	
	var game_state = {
		current_grid:  [],
		current_location: 0,
		current_points: 0
	}
	
	var timer_id;
		
	var MINIMUM_WIDTH     = 240, 
		MINIMUM_HEIGHT    = 320,
		SHAPE_SIDE_LENGTH = 50,
		GAME_TIME         = 10;
	
	/**
	 * Generates a random shape.
	 */
	function make_shape_data(){
		var colors = ["red", "green", "blue", "yellow"];
		var shapes = ["square", "triangle", "circle", "rectangle"];
		return {
			color: colors[Math.floor(Math.random() * 4)],
			shape: shapes[Math.floor(Math.random() * 4)]
		};
	};
	
	/**
	 * Generates a shape from the available pool not including given shape.
	 * @param shape the shape to exclude
	 */
	function make_shape_excluding(shape){
		var response = make_shape_data();
		
		while (response.color == shape.color && response.shape == shape.shape){
			response = make_shape_data();
		}
		
		return response;
	}
	
	/**
	 * Makes a random shape with a random color at the specified location.
	 * @param the x-coordinate of the shape
	 * @param the y-coordinate of the shape
	 */
	function make_shape_at(x, y, color, shape){
		var shape_object = null;
		
		if (shape === "square"){
			shape_object = make_square(x, y, SHAPE_SIDE_LENGTH, color);
		} else if (shape === "triangle"){
			shape_object = make_triangle(x, y, SHAPE_SIDE_LENGTH, color);
		} else if (shape === "circle"){
			shape_object = make_circle(x, y, SHAPE_SIDE_LENGTH / 2, color);
		} else if (shape === "rectangle"){
			shape_object = make_rectangle(x, y, SHAPE_SIDE_LENGTH, SHAPE_SIDE_LENGTH / 2, color);
		}
		
		return shape_object;
	}
	
	/**
	 * Fills the grid with random shapes and selects a target shape.
	 */
	function fill_grid(){
		var i = 0;
		game_state.current_location                          = Math.floor(Math.random() * 9); 
		game_state.current_grid[game_state.current_location] = make_shape_data();
		while (i < 9){
			if (i != game_state.current_location){
				game_state.current_grid[i] = make_shape_excluding(game_state.current_grid[game_state.current_location]);
			}
			gameplay_layer.addChildAt(make_shape_at(get_grid_spot(i + 1).x, get_grid_spot(i + 1).y, game_state.current_grid[i].color, game_state.current_grid[i].shape), i);
			i = i + 1;
		}
	}
	/**
	 * Generates coordinates based on the location number on the
	 * following grid:
	 * 1 | 2 | 3
	 * 4 | 5 | 6
	 * 7 | 8 | 9
	 * @param location the corresponding location (1-9) on the grid
	 */
	function get_grid_spot(location){
		var x = 10;
		var y = 100;
		
		if (location === 2){
			x = 95;
			y = 100;
		} else if (location === 3){
			x = 180;
			y = 100;
		} else if (location === 4){
			x = 10;
			y = 180;
		} else if (location === 5){
			x = 95;
			y = 180;
		} else if (location === 6){
			x = 180;
			y = 180;
		} else if (location === 7){
			x = 10;
			y = 260;
		} else if (location === 8){
			x = 95;
			y = 260;
		} else if (location === 9){
			x = 180;
			y = 260;
		}
		
		return {
			x: x,
			y: y
		}
	}
	
	/**
	 * Gets the grid location at the specified x and y coordinate.
	 */
	function get_grid_at(x, y){
		var location = 0;
		if        (x >= 5 && x <= 65 && y >= 95 && y <= 155){
			location = 1;
		} else if (x >= 90 && x <= 150 && y >= 95 && y <= 155){
			location = 2;
		} else if (x >= 175 && x <= 235 && y >= 95 && y <= 155){
			location = 3;
		} else if (x >= 5 && x <= 65 && y >= 175 && y <= 235){
			location = 4;
		} else if (x >= 90 && x <= 150 && y >= 175 && y <= 235){
			location = 5;
		} else if (x >= 175 && x <= 235 && y >= 175 && y <= 235){
			location = 6;
		} else if (x >= 5 && x <= 65 && y >= 255 && y <= 315){
			location = 7;
		} else if (x >= 90 && x <= 150 && y >= 255 && y <= 315){
			location = 8;
		} else if (x >= 175 && x <= 235 && y >= 255 && y <= 315){
			location = 9;
		}
		return location;
	}
	
	/**
	 * Constructs a rectangle with the specified parameters
	 * @param x      the x-coordinate of the top-left point of the rectangle
	 * @param y      the y-coordinate of the top-left point of the rectangle
	 * @param width  the width of the rectangle
	 * @param height the height of the rectangle
	 * @param color  the color of the rectangle
	 */
	function make_rectangle(x, y, width, height, color){
		var rectangle = new createjs.Shape();
		rectangle.graphics.beginFill(color)
						  .beginStroke(color);
		rectangle.graphics.moveTo(x, y)
				 .lineTo(x + width, y)
				 .lineTo(x + width, y + height)
				 .lineTo(x, y + height)
				 .lineTo(x, y);
		return rectangle;
	}
	
	/**
	 * Constructs a square with the specified parameters
	 * @param x      the x-coordinate of the top-left point of the square
	 * @param y      the y-coordinate of the top-left point of the square
	 * @param side   the length of a side
	 * @param color  the color of the square
	 */
	function make_square(x, y, side, color){
		var square = new createjs.Shape();
		square.graphics.beginFill(color)
					   .beginStroke(color);
		square.graphics.moveTo(x,y)
					   .lineTo(x + side, y)
					   .lineTo(x + side, y + side)
					   .lineTo(x, y + side)
					   .lineTo(x, y);
		return square;
	}

	/**
	 * Constructs an equilateral triangle with the specified parameters
	 * @param x     the x-coordinate of the top-left point of the box occupied by the triangle
	 * @param y     the y-coordinate of the top-left point of the box occupied by the triangle
	 * @param side  the length of a side
	 * @param color the color of the triangle
	 */
	function make_triangle(x, y, side, color){
		var triangle = new createjs.Shape();
		triangle.graphics.beginFill(color)
						 .beginStroke(color);
		triangle.graphics.moveTo(Math.floor(x + (side / 2)), y)
						 .lineTo(x + side, y + side)
						 .lineTo(x, y + side)
						 .lineTo(Math.floor(x + (side / 2)), y)
		return triangle;
	}
	
	/**
	 * Constructs a circle with the specified parameters
	 * @param x      the x-coordinate of the top left point of the box occupied by the circle
	 * @param y      the y-coordinate of the top left point of the box occupied by the circle
	 * @param radius the radius of the circle
	 * @param color  the color of the circle 
	 */
	function make_circle(x, y, radius, color){
		var circle = new createjs.Shape();
		circle.graphics.beginFill(color)
		               .beginStroke(color)
					   .drawCircle(x + radius, y + radius, radius);
		return circle;
	}
	
	/**
	 * Constructs text with the specified parameters
	 * @param x     the x-coordinate of the top left point of the box occupied by the text
	 * @param y     the y-coordinate of the top left point of the box occupied by the text
	 * @param text  the text to display
	 * @param color the color to display the text
	 */
	function make_text(x, y, text, size, color){
		var response          = new createjs.Text(text, size + "px Arial", color);
		response.x            = x;
		response.y            = y;
		response.textBaseline = "alphabetic";
		return response;
	}
	
	/**
	 * Resizes the canvas to fit the screen.
	 * http://community.createjs.com/discussions/easeljs/655-gameplay_layer-scaling-xy-upon-windows-heightwidth
	 */
	function resize_canvas(){
		stage.canvas.width  = window.innerWidth;
		stage.canvas.height = window.innerHeight;
		
		var myRatio     = MINIMUM_WIDTH / MINIMUM_HEIGHT;
		var windowRatio = stage.canvas.width / stage.canvas.height;
		if (myRatio > windowRatio) {
			gameplay_layer.scaleX = gameplay_layer.scaleY = hud_layer.scaleX = hud_layer.scaleY = timer_layer.scaleX = timer_layer.scaleY = point_layer.scaleX = point_layer.scaleY = stage.canvas.width / MINIMUM_WIDTH;
		} else {
			gameplay_layer.scaleX = gameplay_layer.scaleY = hud_layer.scaleX = hud_layer.scaleY = timer_layer.scaleX = timer_layer.scaleY = point_layer.scaleX = point_layer.scaleY = stage.canvas.height / MINIMUM_HEIGHT;
		}
		
		stage.update();
	}	
	
	/**
	 * Deals with the clicks.
	 * If a click matches the given shape, make a new game.
	 */
	function handle_input(evt){
		var point = gameplay_layer.globalToLocal(evt.stageX, evt.stageY);

		if (get_grid_at(point.x, point.y) == game_state.current_location + 1){
			game_state.current_points = game_state.current_points + 1;
			stage.removeAllChildren();
			generate_game();
		}
	}
	
	/**
	 * Handles the replay screen.
	 * Currently the no option doesn't work.
	 */
	function handle_replay(evt){
		var point = hud_layer.globalToLocal(evt.stageX, evt.stageY);
		
		if (get_grid_at(point.x, point.y) == 5){
			timer_bar.seconds = GAME_TIME;
			timer_bar.shape   = make_rectangle(10,50,220,20, "orange");
			game_state.current_points = 0;
			stage.removeChild(hud_layer);
			
			init();
			generate_game();
			timer_id = setInterval(loop, 1000);
		} else if (get_grid_at(point.x, point.y) == 6){
			//close window
		}
	}
	
	/**
	 * Does the timer.
	 * Upon 
	 */
	function loop(){
		if (timer_bar.seconds <= 0){
			clearInterval(timer_id);
			stage.removeChild(timer_layer);
			stage.removeChild(hud_layer);
			stage.removeChild(point_layer);
			stage.removeChild(gameplay_layer);
			
			hud_layer = new createjs.Container();
			hud_layer.addChild(make_text(get_grid_spot(1).x, get_grid_spot(1).y, "Your points: " + game_state.current_points, 18, "#000"));
			hud_layer.addChild(make_text(get_grid_spot(4).x, get_grid_spot(4).y + 20, "Replay?", 18, "#000"));
			
			hud_layer.addChild(make_rectangle(get_grid_spot(5).x,get_grid_spot(5).y, 50, 40, "green"));
			hud_layer.addChild(make_text(get_grid_spot(5).x, get_grid_spot(5).y + 20, "YES", 18, "#000"));
			
			hud_layer.addChild(make_rectangle(get_grid_spot(6).x,get_grid_spot(6).y, 50, 40, "red"));
			hud_layer.addChild(make_text(get_grid_spot(6).x, get_grid_spot(6).y + 20, "NO", 18, "#000"));
			
			stage.addChild(hud_layer);
			stage.removeEventListener('click', handle_input, false);
			stage.addEventListener('click', handle_replay, false);
			
			resize_canvas();
			stage.update();
		} else {
			stage.removeChild(timer_layer);
			timer_layer = new createjs.Container();
			
			timer_bar.seconds = timer_bar.seconds - 1;
			timer_bar.shape   = make_rectangle(10,50,220 * (timer_bar.seconds / GAME_TIME),20, "orange");
			timer_bar.text    = make_text(210, 70, timer_bar.seconds + "", 14, "#000");
			
			timer_layer.addChild(timer_bar.shape);
			timer_layer.addChild(timer_bar.text);
			stage.addChild(timer_layer);
			
			resize_canvas();
			stage.update();
		}
		
	}
	
	/**
	 * Sets up the resize 
	 */
	function init(){
		stage             = new createjs.Stage("myCanvas");
		timer_bar.seconds = GAME_TIME;
		timer_bar.text    = make_text(210, 70, GAME_TIME+"", 14, "#000");
		
		createjs.Touch.enable(stage);
	}
	
	/**
	 * Generates the game.
	 * By game, I mean the HUD, timer, and gameplay grid.
	 */
	function generate_game(){
		gameplay_layer = new createjs.Container();
		hud_layer      = new createjs.Container();
		point_layer    = new createjs.Container();
		timer_layer    = new createjs.Container();
	
		fill_grid();
	
		var text = "Find the " + game_state.current_grid[game_state.current_location].color + ' ' + game_state.current_grid[game_state.current_location].shape + "."; 
	
		hud_layer.addChild(make_text(10, 30, text, 20, "green"));
		
		timer_bar.text    = make_text(210, 70, timer_bar.seconds + "", 14, "#000");
		timer_layer.addChild(timer_bar.shape);
		timer_layer.addChild(timer_bar.text);
		
		point_layer.addChild(make_text(10, 80, game_state.current_points + " points", 10, "#000"));
				
		stage.addChild(gameplay_layer);
		stage.addChild(hud_layer);
		stage.addChild(timer_layer);
		stage.addChild(point_layer);
		
		stage.addEventListener('click', handle_input, false);
		
		resize_canvas();
		stage.update();
	}
	
	
	window.addEventListener('resize', resize_canvas, false);
	window.addEventListener('orientationchange', resize_canvas, false);
	init();
	generate_game();
	timer_id = setInterval(loop, 1000);
	
});
$(document).on("ready", function(){
	var stage,
		gameplay_layer,
		hud_layer,      
		menu_layer;
		
	var timer_bar = {
		percent: 1,
		seconds: 60,
		shape:   make_rectangle(10,50,220,20, "orange"),
		text:    make_text(210, 70, "60", 14, "#000")
	};
	
	var game_state = {
		current_grid:  [],
		current_location: 0
	}
	
	var game_time;
	var timer_id;
		
	var MINIMUM_WIDTH     = 240, 
		MINIMUM_HEIGHT    = 320,
		SHAPE_SIDE_LENGTH = 50;
		FPS               = 30;
	
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
		//var shape_data = make_shape_data();
		
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
	 *
	 * http://community.createjs.com/discussions/easeljs/655-gameplay_layer-scaling-xy-upon-windows-heightwidth
	 */
	function resize_canvas(){
		stage.canvas.width  = window.innerWidth;
		stage.canvas.height = window.innerHeight;
		
		var myRatio     = MINIMUM_WIDTH / MINIMUM_HEIGHT;
		var windowRatio = stage.canvas.width / stage.canvas.height;
		if (myRatio > windowRatio) {
			gameplay_layer.scaleX = gameplay_layer.scaleY = hud_layer.scaleX = hud_layer.scaleY = stage.canvas.width / MINIMUM_WIDTH;
		} else {
			gameplay_layer.scaleX = gameplay_layer.scaleY = hud_layer.scaleX = hud_layer.scaleY = stage.canvas.height / MINIMUM_HEIGHT;
		}
		
		stage.update();
	}	
	
	function handle_input(evt){
		var point = gameplay_layer.globalToLocal(evt.stageX, evt.stageY);

		if (get_grid_at(point.x, point.y) == game_state.current_location + 1){
			gameplay_layer.removeAllChildren();
			hud_layer.removeAllChildren();
			
			fill_grid();
			var text = "Find the " + game_state.current_grid[game_state.current_location].color + ' ' + game_state.current_grid[game_state.current_location].shape + "."; 
	
			hud_layer.addChild(make_text(10, 30, text, 20, "green"));
			hud_layer.addChild(timer_bar.shape);
			hud_layer.addChild(timer_bar.text);		
			
			
			stage.update();
		}
	}
	
	function loop(){
		if (timer_bar.percent <= .1){
			hud_layer.removeChild(timer_bar.shape);
			stage.update();
			clearInterval(timer_id);
		} else {
			hud_layer.removeChild(timer_bar.shape);
			timer_bar.percent = timer_bar.percent - .1;
			timer_bar.shape   = make_rectangle(10,50,220 * (timer_bar.percent),20, "orange");
			
			hud_layer.addChild(timer_bar.shape);
			hud_layer.addChild(timer_bar.text);
			stage.update();
		}
		
		//generate the shape
		//fill grid with shapes + bonus shape
		//run time
		// check for input
		// if input matches shape
		//    add one point
		//  else
		//     regenerate state
		
	}
	
	function init(){
		window.addEventListener('resize', resize_canvas, false);
		window.addEventListener('orientationchange', resize_canvas, false);
	
		stage          = new createjs.Stage("myCanvas");
		gameplay_layer = new createjs.Container();
		hud_layer      = new createjs.Container();
		menu_layer     = new createjs.Container();
	
		createjs.Touch.enable(stage);
		gameplay_layer.addEventListener('click', handle_input, false);
	
	
		fill_grid();
	
		var text = "Find the " + game_state.current_grid[game_state.current_location].color + ' ' + game_state.current_grid[game_state.current_location].shape + "."; 
	
		hud_layer.addChild(make_text(10, 30, text, 20, "green"));

		hud_layer.addChild(timer_bar.shape);
		hud_layer.addChild(timer_bar.text);
	
		stage.addChild(gameplay_layer);
		stage.addChild(hud_layer);
	
		resize_canvas();
		stage.update();
	}
	
	
	init();
	//timer_id = setInterval(loop, 1000);
	
});
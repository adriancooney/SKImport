/**
 * Create a new point.
 * @param {Number} x 
 * @param {Number} y
 */
var Point = function(x, y, maxX, maxY, color, fill) {
	this.radius = 3;
	this.lineWidth = 1;
	this._scale = 1;
	this.maxX = maxX;
	this.maxY = maxY;

	this.stroke = color;
	this.fill = fill;

	this.strokeStyle = color;
	this.fillStyle = fill;

	// Create the item
	this.item = document.createElement("li");
	this.input = document.createElement("input");
	this.item.appendChild(this.input);

	var self = this;
	this.input.addEventListener("focus", function() { self.onselect.apply(self, arguments); });
	this.input.point = this;

	// handle the up, down, left, right in the input and some other fancy functions
	var _manual = false, i = 0, incr = 1;
	this.input.addEventListener("keydown", function(key) {
		if(_manual === false && !(key.metaKey || key.altKey || key.ctrlKey || key.altGraphKey || key.which === 9)) key.preventDefault();

		// Adjust the increment for faster scrubbing while holding
		if(key.repeat && ++i > 10 || key.shiftKey) incr = 10;
		else if(!key.repeat) i = 0, incr = 1;

		switch(key.which) {
			case 40: // Down
				self.move(self.x, self.y + incr);
			break;

			case 39: // Right
				self.move(self.x + incr, self.y);
			break;

			case 38: // Up
				self.move(self.x, self.y - incr);
			break;

			case 37: // Left
				self.move(self.x - incr, self.y);
			break;

			case 8: // Backspace
				_manual = String(this.value);
				this.select();
			break;

			case 13: // Enter
				if(_manual) {
					var point = Point.parsePoint(this.value);

					console.log("Point", point);

					if(point && (point[0] >= 0 && point[0] <= self.maxX) && (point[1] >= 0 && point[1] <= self.maxY)) {
						self.move(point[0], point[1]);
					} else {
						this.classList.add("invalid");
						var that = this;
						setTimeout(function() { that.classList.remove("invalid") }, 500);
						this.value = _manual;
					}

					_manual = false;
				}
			break;
		}
	});

	// Update the point
	this.move(x || 0, y || 0);
};

/**
 * Point events.
 */
Point.prototype.onselect = function(){};
Point.prototype.onchange = function(){};

/**
 * Move a point to a position.
 * @param  {Number} x 
 * @param  {Number} y 
 */
Point.prototype.move = function(x, y) {
	if(x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY) {
		this.x = x;
		this.y = y;
		this.input.value = Math.floor(this.x * this._scale) + "," + Math.floor(this.y * this._scale);
		this.onchange.call(this);
	}
};

/**
 * Render a point onto a canvas.
 * @param  {CanvasRenderingContext2D} ctx 
 */
Point.prototype.render = function(ctx) {
	ctx.save();
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fillStyle = this.fillStyle;
	ctx.strokeStyle = this.strokeStyle;
	ctx.lineWidth = this.lineWidth;
	ctx.fill();
	ctx.stroke();
	ctx.restore();
};

/**
 * Highlight the point in the canvas and the points column.
 */
Point.prototype.highlight = function() {
	this.input.classList.add("active");

	this.lineWidth = 3;
	this.fillStyle = "rgba(255, 0, 0, 0.5)";
	this.strokeStyle = "#f00";

	if(this.input !== document.activeElement) {
		var self = this;
		setTimeout(function() { self.input.focus(); }, 0); // Focus the next point. Weird bug tho.
	}
};

/**
 * Unhighlight the key. See #highlight.
 * @return {[type]} [description]
 */
Point.prototype.unhighlight = function() {
	this.input.classList.remove("active");
	this.lineWidth = 1;
	this.fillStyle = this.fill;
	this.strokeStyle = this.stroke;
};

/**
 * Detect whether a coordinate is inside a rendered point.
 * @param  {Number}  x 
 * @param  {Number}  y 
 * @return {Boolean} 
 */
Point.prototype.isInside = function(x, y) {
	return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) < this.radius;
};

Point.prototype.scale = function(scale) {
	this._scale = scale;
	this.move(this.x, this.y);
};

/**
 * Parse a point string and return a parsed point.
 * @param  {String} point Point string e.g. 100,100
 * @return {Array}       [x, y]
 */
Point.parsePoint = function(point) {
	if(point.match(/([-\d]+)\s?,\s?([-\d]+)/))
		return [parseInt(RegExp.$1), parseInt(RegExp.$2)];
	else return false;
};

Point.prototype.toString = function() {
	return "[" + this.x + ", " + this.y + "]";
};

Point.prototype.remove = function() {
	this.item.parentNode.removeChild(this.item);
};
var Body = function(color, maxX, maxY) {
	this.points = [];
	this._scale = 1;
	this.maxX = maxX;
	this.maxY = maxY;

	// Set the color
	this.color = color;
	this.fill = "rgba(" + [0, 0, 0].map(function(v, i) { return parseInt(color.substr(1 + (i * 2), 2), 16); }).join(",") + ", 0.3)"

	// Create the body column
	this.item = document.createElement("div");
	this.title = document.createElement("h3");
	this.add = document.createElement("button");

	this.item.setAttribute("class", "column body");
	this.title.innerHTML = "<span class=\"color-block\" style=\"background-color: " + color + "\"></span>Body";
	this.add.textContent = "+";

	this.item.appendChild(this.title);
	this.item.appendChild(this.add);

	// Create the initial point
	this.addPoint(0, 0, color);

	// Bind the event handler
	var self = this;
	this.add.addEventListener("click", function() {
		self.addPoint();
	});
};

/*
 * Body events.
 */
Body.prototype.onselect = function() {};
Body.prototype.onchange = function() {};

/**
 * Push a new point into a body.
 * @param  {Point} point 
 */
Body.prototype.push = function(point) {
	this.item.insertBefore(point.item, this.add);
	this.points.push(point);
};

/**
 * Add a new point to a body.
 * @param {Number} x 
 * @param {Number} y
 */
Body.prototype.addPoint = function(x, y) {
	if(!x && !y) x = this.currentPoint ? this.currentPoint.x : Math.floor(this.maxX/2), y = this.currentPoint ? this.currentPoint.y : Math.floor(this.maxY/2);

	// Create a new point with the new color
	var point = new Point(x, y, this.maxX, this.maxY, this.color, this.fill);

	// Select it currently
	this.selectPoint(point);

	// Handle when the point is selected
	point.onselect = this.selectPoint.bind(this, point);

	// Handle when the point changes
	var self = this;
	point.onchange = function() { self.onchange.call(self); };

	// Add it to the list of points
	this.push(point);
};

/**
 * Select and highlight a point within a body.
 * @param  {Point} point 
 */
Body.prototype.selectPoint = function(point) {
	
	if(this.currentPoint) this.currentPoint.unhighlight();
	this.currentPoint = point;
	this.currentPoint.highlight();

	this.onselect.call(this);
};

/**
 * Deselect the currently highlighted point within a body.
 * @param  {Point} point 
 */
Body.prototype.deselectPoint = function(point) {
	if(this.currentPoint) this.currentPoint.unhighlight();
	this.currentPoint = null;
};

Body.prototype.render = function(ctx) {
	var points = this.points,
		length = points.length;

	ctx.save();
	ctx.scale(this._scale, this._scale);

	// Render the body fill
	if(length > 2) {
		ctx.beginPath();
		for(var i = 0; i < length; i++) {
			if(i === 0) ctx.moveTo(points[i].x, points[i].y);
			else ctx.lineTo(points[i].x, points[i].y);
		}
		ctx.closePath();
		ctx.fillStyle = this.fill;
		ctx.fill();
	}

	// Render each point
	for(var i = 0; i < length; i++) {
		var current = points[i],
			next = points[i + 1];

		if(next || (!next && length > 2 && (next = points[0]))) {
			ctx.beginPath();
			ctx.moveTo(current.x, current.y);
			ctx.lineTo(next.x, next.y);
			ctx.strokeStyle = this.color;
			ctx.stroke();
		} 

		points[i].render(ctx);
	}

	ctx.restore();

};

Body.prototype.scale = function(scale) {
	this._scale = scale;
	for(var i = 0, points = this.points, length = points.length; i < length; i++) {
		points[i].scale(scale);
	}
};

Body.prototype.remove = function() {
	this.item.parentNode.removeChild(this.item);
};

Body.prototype.removePoint = function(point) {
	point.remove();
	this.points.splice(this.points.indexOf(point), 1);
	this.onchange.call(this);
};
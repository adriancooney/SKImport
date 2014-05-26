var Sprite = function(image) {
	this.bodies = [];
	this.container = document.querySelector(".bodies");
	this.currentBody = null;
	this.name = null; // For exporting
	this.image = image;
	this._scale = 1;
};

Sprite.prototype.push = function(body) {
	this.bodies.push(body);
	this.container.appendChild(body.item);
	body.title.innerHTML += " " + this.bodies.length
};

Sprite.prototype.addBody = function() {
	var self = this,
		body = new Body(Sprite.colors.shift() || "How many fucking paths do you need.", this.image.width, this.image.height);

	body.onselect = function() {
		if(self.currentBody && self.currentBody !== this) {
			self.currentBody.deselectPoint();
			self.currentBody = this;
		}

		self.onchange.call(self);
	};

	body.onchange = function() { self.onchange.call(self); };

	// Call the onselect because of it's late set
	body.onselect.call(body);

	// Set it as the current body
	this.currentBody = body;

	// And push the body
	this.push(body);
};

Sprite.prototype.removeBody = function(body) {
	body.remove();
	this.bodies.splice(this.bodies.indexOf(body), 1);
	this.onchange.call(this);
};

Sprite.prototype.onchange = function() {};

Sprite.colors = ["#00FFFF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E", "#6495ED", "#DC143C", "#00FFFF", "#00008B", "#008B8B", "#B8860B", "#A9A9A9", "#006400", "#BDB76B", "#8B008B", "#556B2F", "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1", "#9400D3", "#00BFFF", "#696969", "#1E90FF", "#B22222", "#228B22", "#DCDCDC", "#DAA520", "#808080", "#008000", "#ADFF2F", "#CD5C5C", "#4B0082", "#E6E6FA", "#7CFC00", "#ADD8E6", "#E0FFFF", "#D3D3D3", "#90EE90", "#20B2AA", "#87CEFA", "#778899", "#B0C4DE", "#00FF00", "#32CD32", "#800000", "#66CDAA", "#0000CD", "#BA55D3", "#9370DB", "#3CB371", "#7B68EE", "#00FA9A", "#48D1CC", "#C71585", "#191970", "#000080", "#808000", "#6B8E23", "#DA70D6", "#EEE8AA", "#98FB98", "#AFEEEE", "#DB7093", "#CD853F", "#DDA0DD", "#B0E0E6", "#800080", "#BC8F8F", "#4169E1", "#8B4513", "#2E8B57", "#A0522D", "#C0C0C0", "#87CEEB", "#6A5ACD", "#708090", "#00FF7F", "#4682B4", "#D2B48C", "#008080", "#D8BFD8", "#40E0D0", "#EE82EE", "#9ACD32"];

Sprite.prototype.render = function(ctx) {
	ctx.canvas.width = ctx.canvas.width;

	ctx.save();
	ctx.scale(this._scale, this._scale);
	ctx.drawImage(this.image, 0, 0);
	ctx.restore();

	for(var i = 0, bodies = this.bodies, length = bodies.length; i < length; i++)
		bodies[i].render(ctx);
};

Sprite.prototype.scale = function(scale) {
	this._scale = scale;
	for(var i = 0, bodies = this.bodies, length = bodies.length; i < length; i++)
		bodies[i].scale(scale);
};

Sprite.prototype.save = function() {
	var data = this.export({
		scale: 1
	});

	data.image = this.image.src;
	return data;
};

Sprite.prototype.export = function(options) {
	var data = {},
		defaults = {
			flipY: true,
			scale: this._scale,
			origin: [0.5, 0.5]
		};

	// Merge the options
	if(options) 
		for(var key in options) defaults[key] = options[key];

	options = defaults;

	// Set the name
	data.name = this.name || sprite;

	// Get and scale the width and height
	var width = this.image.width * options.scale,
		height = this.image.height * options.scale;

	data.width = width;
	data.height = height;

	// Sort out the points
	var self = this;
	data.bodies = this.bodies.map(function(body) {
		return body.points.map(function(point) {
			var x = point.x,
				y = point.y;

			// Scale the point
			if(options.scale !== undefined) {
				x *= options.scale;
				y *= options.scale;
			}

			// Flip the axis
			if(options.flipY)
				y = height - y;

			// Move around the anchor
			x -= width * options.origin[0];
			y -= height * options.origin[1];

			return [ Math.floor(x), Math.floor(y) ];
		});
	});

	return data;
};
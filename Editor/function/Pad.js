var Pad = function(canvas) {
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this._scale = 1;
	this._tick = function() {};
};

Pad.prototype.resize = function(width, height) {
	this.canvas.width = width * this._scale;
	this.canvas.height = height * this._scale;
};

Pad.prototype.importSprite = function(sprite) {
	var image = sprite.image,
		width = image.width,
		height = image.height;

	this.width = width;
	this.height = height;
	this.resize(width, height);

	this.ctx.drawImage(image, 0, 0);
};

Pad.prototype.tick = function(fn) {
	this._tick = fn;
	this.step();
};

Pad.prototype.step = function() {
	this._tick(this.ctx);
};

Pad.prototype.scale = function(scale) {
	this._scale = scale;
	this.resize(this.width, this.height);
};
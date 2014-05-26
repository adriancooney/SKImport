(function() {

	/*
	 * Canvas setup
	 */
	var pad = new Pad(document.getElementById("sprite-pad"));

	// Handle file drag and drop
	// Kill the native dragging events
	["dragenter", "dragover"].forEach(function(e) { window.addEventListener(e, function(i) { i.preventDefault(); return false; }); });

	function handleFile(e) {
		e.preventDefault();

		var file = (e.dataTransfer ? e.dataTransfer : e.target).files[0],
			reader = new FileReader(),
			name = null;

		// Name the sprite
		if(!file.type.match(/image|json/)) return alert("Please drop a sprite image or save file silly pants.");
		if(file.name.match(/([^\.\/]+)\.[^\.]+$/)) name = RegExp.$1; // For exporting

		reader.onload = function (event) {
			if(file.type.match(/json/)) {
				try {
					var json = window.atob(event.target.result.substr(29)),
						data = JSON.parse(json);

					if(!data.bodies || !data.image || !data.name) throw new Error;

					importSprite(data);
				} catch(e) {
					return alert("Invalid save file. Are you sure it's the *save* file and not the exported file?");
				}
			} else {
				var image = new Image;
				image.onload = function() {
					newSprite(name, image);
				};
				image.src = event.target.result;
			}
		};

		reader.readAsDataURL(file);

		return false;
	}

	// Use the file drop force
	window.addEventListener("drop", handleFile);
	document.getElementById("add-image").addEventListener("change", handleFile);

	/**
	 * Create a new sprite
	 */
	function newSprite(name, image, isImport) {
		// Empty the container
		document.querySelector(".bodies").innerHTML = "";

		// Bind the event listeners
		var sprite = new Sprite(image);

		// Add the name
		sprite.name = name;

		// Add the first body
		if(!isImport) sprite.addBody(); // Ew.
		document.getElementById("add-body").addEventListener("click", sprite.addBody.bind(sprite));

		document.getElementById("remove-body").addEventListener("click", function() {
			if(sprite.bodies.length) sprite.removeBody(sprite.currentBody);
		});

		document.getElementById("remove-point").addEventListener("click", function() {
			if(sprite.currentBody && sprite.currentBody.points.length) sprite.currentBody.removePoint(sprite.currentBody.currentPoint)
		});

		// Display
		pad.importSprite(sprite);

		// Define the pad render function
		pad.tick(function(ctx) {
			sprite.render(ctx);
		});

		// Handle when the sprite changes
		sprite.onchange = function() {
			pad.step();
		};

		// Bind some handy keyboard shortcuts
		window.addEventListener("keydown", function(key) {
			if(key.metaKey) {
				if([80, 66, 219, 221].indexOf(key.which) !== -1) key.preventDefault();

				switch(key.which) {
					case 80: // Cmd + p
						if(sprite.currentBody) sprite.currentBody.addPoint();
						pad.step();
					break;

					case 66: // cmd + b
						sprite.addBody();
						pad.step();
					break;

					case 219: case 221: // cmd + [/]
						if(sprite.bodies.length > 1) {
							var index = sprite.bodies.indexOf(sprite.currentBody),
								next = sprite.bodies[(key.which === 219) ? index - 1 : index + 1];

							if(!next) next = sprite.bodies[key.which === 219 ? sprite.bodies.length - 1 : 0];

							next.points[0].highlight();
						}
					break;
				}
			}

			if(key.which === 9) {
				key.preventDefault();
				var current = sprite.currentBody.currentPoint.item,
					next = key.shiftKey ? current.previousSibling : current.nextSibling;

				if(next && next.tagName === "LI") next.children[0].focus();
				else {
					var lis = current.parentNode.querySelectorAll("li");
					if(lis.length > 2) (key.shiftKey ? lis[lis.length - 1] : lis[0]).children[0].focus();
				}
			}
		});

		// TODO: Fix this. Scaling is weird here. Very weird.
		// Scaling
		var scaleInput = document.getElementById("scale"),
			retina = document.getElementById("scale-retina");

		// Reset the values
		scaleInput.value = 1;
		retina.checked = false;

		scaleInput.addEventListener("change", function() { 
			var s = parseFloat(this.value);

			if(s == 2) retina.checked = true;
			else retina.checked = false;

			scale(sprite, s);
		});

		retina.addEventListener("change", function() {
			if(retina.checked) {
				scale(sprite, 0.5);
				retina.checked = true;
				scaleInput.value = 0.5;
			} else { 
				scale(sprite, parseFloat(scaleInput.value));
				retina.checked = false;
			}
		});

		/*
		 * Exporting/import/saving
		 */
		Array.prototype.forEach.call(document.querySelectorAll("#export, #save"), function(button) {
			button.addEventListener("click", function() {
				var type = this.textContent.toLowerCase(),
					data = sprite[type]();

				var a = window.open("data:application/json;charset=utf8," + encodeURIComponent(JSON.stringify(data)), "width=300,height=300");
				a.focus();
			});
		});

		// Handle the canvas click
		pad.canvas.addEventListener("click", function(mouse) {
			if(sprite.currentBody && sprite.currentBody.currentPoint) {
				sprite.currentBody.currentPoint.move(mouse.offsetX, mouse.offsetY);
				sprite.currentBody.currentPoint.highlight();
			}
		});

		return sprite;
	}

	function scale(sprite, s) {
		// Scale
		pad.scale(s);
		sprite.scale(s);

		// Render
		pad.step();
	}

	function importSprite(data) {
		var image = new Image;

		image.onload = function() {
			var sprite = newSprite(data.name, image, true);

			data.bodies.forEach(function(body, i) {
				sprite.addBody();
				body.forEach(function(point, i) {
					if(i === 0) sprite.currentBody.points[0].move(point[0], point[1]);
					else sprite.currentBody.addPoint(point[0], point[1]);
				});
			});
		};

		image.src = data.image;
	}

	window.importSprite = importSprite;
})();
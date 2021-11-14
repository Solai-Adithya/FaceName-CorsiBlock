// Block object for use in corsi-blocks program
// el is the svg element of the block
// id is the id string for that block
// loc is an array with the x and y coordinates of the block (in pixels)
// light is a boolean for highlight status
var Block = function(id, location, svg) {
	this.el = svg ? svg : null;
	this.ID = createBlockId(id);
	this.loc = location;
	this.light = false;
}

// takes a unique number or string to create a unique id for a block,
// intended to be used as the id field in an svg element
var createBlockId = function(idNumber) {
	return 'block'.concat(idNumber);
}

Block.prototype.setSVG = function(svg) {
	this.el = svg;
}

Block.prototype.getSVG = function() {
	return this.el;
}

Block.prototype.getID = function() {
	return this.ID;
}

Block.prototype.getLoc = function() {
	return this.loc;
}

Block.prototype.highlight = function() {
	this.light = true;
}

Block.prototype.unhighlight = function() {
	this.light = false;
}

Block.prototype.isHighlighted = function() {
	return this.light;
}

Block.prototype.log = function() {
	console.log(this);
}

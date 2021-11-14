// sequenceNum is an integer which represents the placement of this sequence in a game
// sequence is a list of integers which can be translated into the ids of the blocks in this sequence
// idx is the current block to be highlighted in the sequence
// userSequence is where the user input will be stored
var Sequence = function(sequenceNum, sequence) {
	this.sequenceNum = sequenceNum;
	this.sequence = sequence;
	this.span = sequence.length;

	this.idx = 0;

	this.userSequence = [];
	this.correct = false;
}

Sequence.prototype.getSequenceNumber = function() {
	return this.sequenceNum;
}

Sequence.prototype.getSequence = function() {
	return this.sequence;
}

Sequence.prototype.getSpan = function() {
	return this.sequence.length;
}

Sequence.prototype.nextBlock = function() {
	return this.sequence[this.idx++];
}

Sequence.prototype.isDone = function() {
	return this.idx >= this.sequence.length;
}

Sequence.prototype.addUserInput = function(blockChoice) {
	this.userSequence.push(parseInt(blockChoice.slice(5)));
	console.log(blockChoice.slice(5));
}

Sequence.prototype.clearUserInput = function() {
	this.userSequence = [];
}

Sequence.prototype.getUserInput = function() {
	return this.userSequence;
}

Sequence.prototype.checkSolution = function() {
	if (this.sequence.length !== this.userSequence.length) {
		this.correct = false;
		return;
	}

	for (var i = 0; i < this.sequence.length; i++) {
		if (this.sequence[i] !== this.userSequence[i]) {
			this.correct = false;
			return;
		}
	}

	this.correct = true;
	return this.correct;
}

Sequence.prototype.isCorrect = function() {
	return this.correct;
}

Sequence.prototype.log = function() {
	console.log(this);
}
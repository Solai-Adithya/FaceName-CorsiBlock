// The game object is where the sequences are defined.
// It also keeps track of the state of the experiment.

var Game = function() {
	this.userID = null;
	this.userGroupNum = null;
	this.spans=[2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9]
	this.sequences = [];
	this.idx = 0;

	this.mistakesInCurrentSpanLength = 0;
	this.allowedMistakes = 1;
	this.stage = null;
	this.numCorrect = 0;
	this.longestSpan = 0;
	this.results = [];
}

Game.prototype.genSequences = function(){
	for(let i=0;i<this.spans.length;i++){
		var tmpS=new Set();
		var k=this.spans[i];
		while(k>tmpS.size){
			tmpS.add(Math.floor(Math.random()*9));
		}
		var tmp=[];
		const myIterator = tmpS.values();
		for (const entry of myIterator) {
			tmp.push(entry);
		}
	console.log(tmp);
	this.sequences.push(new Sequence(i,tmp));
	}
}

Game.prototype.setUserID = function(id) {
	this.userID = id;
}

Game.prototype.setUserGroupNum = function(num) {
	this.userGroupNum = num;
}

Game.prototype.getUserID = function() {
	return this.userID;
}

Game.prototype.getUserGroupNum = function() {
	return this.userGroupNum;
}

Game.prototype.newSpan = function() {
	if (this.idx === 0) return true;
	return this.sequences[this.idx].getSpan() > this.sequences[this.idx-1].getSpan();
}

Game.prototype.mistake = function() {
	this.mistakesInCurrentSpanLength++;
}

Game.prototype.tooManyMistakes = function() {
	return this.mistakesInCurrentSpanLength > this.allowedMistakes;
}

Game.prototype.mistakeReset = function() {
	this.mistakesInCurrentSpanLength = 0;
}

Game.prototype.outOfSequences = function() {

	return this.idx >= this.sequences.length-1;
}

Game.prototype.increment = function() {
	this.idx++;
}

Game.prototype.nextSequence = function() {
	return this.sequences[this.idx];
}

Game.prototype.setStage = function(stage) {
	console.log('Now in ' + stage + ' stage.');
	this.stage = stage;
}

Game.prototype.getStage = function() {
	return this.stage;
}

Game.prototype.inDisplayStage = function() {
	return this.stage === 'display';
}

Game.prototype.inUserStage = function() {
	return this.stage === 'user';
}

Game.prototype.inResultStage = function() {
	return this.stage === 'result';
}

Game.prototype.isDone = function() {
	return this.stage === 'done';
}

Game.prototype.collectScores = function() {
	this.results = [];
	this.numCorrect = 0;
	this.longestSpan = 0;
	for (var i = 0; i < this.sequences.length; i++) {
		var s = this.sequences[i]
			 ,span = s.getSpan()
		   ,c = s.isCorrect();
		this.results.push(c);
		if (c) {
			this.numCorrect++;
			if (span > this.longestSpan) this.longestSpan = span;
		}
	}
}

Game.prototype.reportScores = function() {
	return [this.numCorrect, this.longestSpan];
}

Game.prototype.log = function() {
	console.log(this);
}
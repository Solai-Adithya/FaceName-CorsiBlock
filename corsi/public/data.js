// Data is drawn from the game object, the sequence object, and the date object.
// Data is recorded for every click of a block or button.
// See the row with 'done' as the response for the full response to a particular sequence.

var Row = function() {
	this.date;
	this.t;
	this.subject;
	this.seqNumber;
	this.seqLength;
	this.seqString;
	this.respString;
	this.response;
	this.latency;
	this.correct;
	this.nCorrectTotal;
	this.blockSpan;

// Summary score proposed by Kessels et al. (2000).
// Computed as 'values.blockspan' * 'values.ncorrecttotal'.
	this.totalScore;
}

var Data = function() {
	this.rows = [];
}

Data.prototype.addDatum = function(datum) {
	this.rows.push(datum);
}
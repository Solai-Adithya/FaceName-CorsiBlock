/*
	Configurable task parameters
 */
//Color of block initially( unclicked)

var blockColor = 'rgb(0,0,255)'
//Color of highlighted blocks.
   ,tapColor = 'rgb(255, 255, 0)'
// Color of game board.
   ,boardColor = 'black'
// Button color.
   ,buttonColor = 'rgb(200,200,200)'
// Bolck's size in milli meters'.
   ,blockSize = 25//mm
// The size used for the user ID entry screen and the calibration screen
   ,tmpBoardSize = 1000
// Game board width in mm
   ,boardWidth = 255//mm
// Game board height in mm.
   ,boardHeight = 205//mm
   ,buttonWidth
   ,buttonHeight
// Number of times mistakes allowed for a span length
   ,allowedMistakes = 1
   ,showFeedback = true
   //shows summary of score
   ,showScores = true
// "time between highlighting of blocks
   ,tapInterval = 1000

   ,postTapInterval = 250
// Duration of performance feedback after recalling a sequence.
// Right now there is always a countdown, so the minimum is 3 seconds.
   ,feedbackDuration = 1000
   ,cal_mm 
// Length of the calibration line in pixels.
   ,cal_px = 500
// Computes a given display's mm-to-pixel-ration based on calibration data.
 	 ,mmtopx;

var blockLocs;

var blocks;

// This must be called for the program to work.
var calibrateVals = function() {
   // Used in all mm-to-pixel (and vice versa) conversions.
   // Computes a given display's mm-to-pixel-ration based on calibration data.
      mmtopx = cal_mm/cal_px
   // Returns blocks' display sizes in pixels.
      ,blockSize = Math.round((blockSize/mmtopx))
   // Returns game board width in pixels.
      ,boardWidth = Math.round((boardWidth/mmtopx))
   // Returns gameboard height in pixels.
      ,boardHeight = "100vh"

      ,buttonWidth = boardWidth/5
      ,buttonHeight = "5vh";

   // The locations of the blocks within the board
   blockLocs = [[75/mmtopx, 155/mmtopx*0.65]
                ,[175/mmtopx, 145/mmtopx*0.65]
                ,[25/mmtopx, 120/mmtopx*0.65]
                ,[135/mmtopx, 110/mmtopx*0.65]
                ,[65/mmtopx, 90/mmtopx*0.65]
                ,[10/mmtopx, 60/mmtopx*0.65]
                ,[190/mmtopx, 50/mmtopx*0.65]
                ,[130/mmtopx, 20/mmtopx*0.65]
                ,[70/mmtopx, 30/mmtopx*0.65]];

   blocks = [new Block(0, blockLocs[0])
             ,new Block(1, blockLocs[1])
             ,new Block(2, blockLocs[2])
             ,new Block(3, blockLocs[3])
             ,new Block(4, blockLocs[4])
             ,new Block(5, blockLocs[5])
             ,new Block(6, blockLocs[6])
             ,new Block(7, blockLocs[7])
             ,new Block(8, blockLocs[8])];
}
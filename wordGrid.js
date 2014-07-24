/*
wordGrid.js - Ryan Juve - July 2014

finds english words present in 4x4 grids of letters
*/

// array prototype addition
// like array.indexOf but takes in regex and looks for partial matches
if (typeof Array.prototype.reIndexOf === 'undefined') {
    Array.prototype.reIndexOf = function (rx) {
        for (var i in this) {
            if (this[i].toString().match(rx)) {
                return i;
            }
        }
        return -1;
    };
}

// node require statements
var       fs = require('fs'),
	  	conf = require('nconf')
	  prompt = require('prompt'),
	progress = require('progress');

// globals
var wordArray = [], gridArray = [], result = [];

//fs call to grab word list
fs.readFile('./dictionary.txt', function(err, data) {
	// if file not found
	if (err) throw new Error('dictionary.txt not found!');
	// split words.txt by newlines and push onto wordArray
	data.toString().split('\n').forEach(function(elem) {
		wordArray.push(elem);
	})

	checkForWordGrid();
});

// checks for --grid flag or prompts user for grid entry
function checkForWordGrid() {
	conf.argv();
	if (conf.get('grid') !== undefined) {
		fs.readFile(conf.get('grid'), function(err, data) {
			if (err) throw new Error('grid file not found!');

			data.toString().split('\n').forEach(function(elem) {
				gridArray.push(elem.split(''));
			});

			checkGridSize();
		})
	} else {
		console.log('\n========================\n grid not supplied! please enter four lines of four characters each \n========================\n')
		prompt.start();
		prompt.get(['line1','line2','line3','line4'], function(err, res) {
			gridArray.push(res.line1);
			gridArray.push(res.line2);
			gridArray.push(res.line3);
			gridArray.push(res.line4);

			checkGridSize();
		})
	}
}

//checks that gridArray is 4x4
function checkGridSize() {
	if (gridArray.length !== 4) {
		throw new Error('grid doesnt have four lines!')
	}
	gridArray.forEach(function(elem, index) {
		if (elem.length !== 4) {
			throw new Error('grid line #' +(index+1)+' doesnt have four characters!')
		}
	})

	findWordsInGrid();
}

// solve dat puzzle
function findWordsInGrid() {
	console.log('--- GRID ---')
	console.log(gridArray[0][0],gridArray[0][1],gridArray[0][2],gridArray[0][3]);
	console.log(gridArray[1][0],gridArray[1][1],gridArray[1][2],gridArray[1][3])
	console.log(gridArray[2][0],gridArray[2][1],gridArray[2][2],gridArray[2][3])
	console.log(gridArray[3][0],gridArray[3][1],gridArray[3][2],gridArray[3][3])

	var i,j;
	var bar = new progress('progress:[:bar] :percent  time elapsed: :elapsed secs', {total: 16});
	for (i = 0; i < 4; i++) {
		for (j = 0; j < 4; j++) {
			recur([[i,j]])
			bar.tick();
		}
	}

	console.log(JSON.stringify(result));
}

function recur(array) {
	var str = '';
	var last;
	//build up word string
	array.forEach(function(elem) {
		str += gridArray[elem[0]][elem[1]];
		last = elem;
	});
	//check word string
	isWord(str);
	// check if string is part of a word, return if not 
	var regex = new RegExp(str);
	if (wordArray.reIndexOf(regex) === -1) {
		return;
	}

	// grab last array indexes for convenience
	var x = last[0],
		y = last[1];

	///////check if an extension of the string is possible
	//if up
	if ( x - 1 >= 0 && testArray(array, [x - 1, y]) !== -1 ) {
		var newArray = JSON.parse(JSON.stringify(array)) //easy deep copy, possibly expensive
		newArray.push([x-1,y]);
		recur(newArray);
	}	
	//if left
	if ( y - 1 >= 0 && testArray(array, [x, y - 1]) !== -1 ) {
		var newArray = JSON.parse(JSON.stringify(array)) //easy deep copy, possibly expensive
		newArray.push([x,y-1]);
		recur(newArray);
	}
	//if down
	if ( x + 1 < 4 && testArray(array, [x + 1 , y]) !== -1 ) {
		var newArray = JSON.parse(JSON.stringify(array)) //easy deep copy, possibly expensive
		newArray.push([x+1,y]);
		recur(newArray);
	}
	//if right
	if ( y + 1 < 4 && testArray(array, [x, y + 1]) !== -1 ) {
		var newArray = JSON.parse(JSON.stringify(array)) //easy deep copy, possibly expensive
		newArray.push([x,y+1]);
		recur(newArray);
	}
}

// tests if value array is present in testArray
function testArray(testArray, value) {
	var ret = 0
	testArray.forEach(function(elem) {
		if (arraysEqual(elem,value)) {
			ret = -1;
		}
	})

	return ret;
}

// checks two arrays for equivalency
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

//tests if string is a word and if it hasnt already been found, adds it to results
function isWord(str) {
	if (wordArray.indexOf(str) !== -1 && result.indexOf(str) === -1) {
		result.push(str);
	}
}
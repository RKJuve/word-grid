/*
wordGrid.js - Ryan Juve - July 2014

finds english words present in 4x4 grids of letters
*/



///array prototype mess
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


var       fs = require('fs'),
	  	conf = require('nconf')
	  prompt = require('prompt'),
	progress = require('progress');

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
			start([[i,j]])
			bar.tick();
		}
	}

	console.log(JSON.stringify(result));
}

function start(array) {
	var str = '';
	var last;
	array.forEach(function(elem) {
		str += gridArray[elem[0]][elem[1]];
		last = elem;
	});

	isWord(str);

	var regex = new RegExp(str);
	if (wordArray.reIndexOf(regex) === -1) {
		return;
	}

	var x = last[0],
		y = last[1];

	//if up
	if ( x - 1 >= 0 && testArray(array, [x - 1, y]) !== -1 ) {
		var newArray = JSON.parse(JSON.stringify(array))
		newArray.push([x-1,y]);
		start(newArray)
	}	
	//if left
	if ( y - 1 >= 0 && testArray(array, [x, y - 1]) !== -1 ) {
		var newArray = JSON.parse(JSON.stringify(array))
		newArray.push([x,y-1]);
		start(newArray)
	}
	//if down
	if ( x + 1 < 4 && testArray(array, [x + 1 , y]) !== -1 ) {
		var newArray = JSON.parse(JSON.stringify(array))
		newArray.push([x+1,y]);
		start(newArray)
	}
	//if right
	if ( y + 1 < 4 && testArray(array, [x, y + 1]) !== -1 ) {
		var newArray = JSON.parse(JSON.stringify(array))
		newArray.push([x,y+1]);
		start(newArray)
	}
}




///array prototype mess
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

function testArray(array, value) {
	var ret = 0
	array.forEach(function(elem) {
		if (arraysEqual(elem,value)) {
			ret = -1
		}
	})

	return ret;
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function isWord(str) {
	if (wordArray.indexOf(str) !== -1 && result.indexOf(str) === -1) {
		console.log
		result.push(str);
	}
}
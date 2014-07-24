/*
wordGrid.js - Ryan Juve - July 2014

finds english words present in 4x4 grids of letters
*/

var   fs = require('fs'),
  	conf = require('nconf')
  prompt = require('prompt');

var wordArray = [], gridArray = [];

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
	console.log(gridArray)
}
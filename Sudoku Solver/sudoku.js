let puzzleValues = [
	[0,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,0,0, 0,0,0],

	[0,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,0,0, 0,0,0],

	[0,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,0,0, 0,0,0],
	[0,0,0, 0,0,0, 0,0,0]
];

let currentSquare = [0,0];

function clickf(x,y) {
	currentSquare = [x,y];
}

function moveCursorToEnd(el) {
	setTimeout(function() {
		if (typeof el.selectionStart == "number") {
			el.selectionStart = el.selectionEnd = el.value.length;
		} else if (typeof el.createTextRange != "undefined") {
			el.focus();
			var range = el.createTextRange();
			range.collapse(false);
			range.select();
		}
	}, 1);
}

function focusSquare(x,y) {
	currentSquare = [x,y];
	let ele = document.getElementById("x_" + x + "_y_" + y);
	moveCursorToEnd(ele);
}

document.addEventListener('keydown', function(event) {
	switch (event.key) {
		case "ArrowDown":
			if (currentSquare[1] < 8) {
				currentSquare[1]++;
			}
		  	break;
		case "ArrowUp":
			if (currentSquare[1] > 0) {
				currentSquare[1]--;
			}
		  	break;
		case "ArrowLeft":
			if (currentSquare[0] > 0) {
				currentSquare[0]--;
			}
		  	break;
		case "ArrowRight":
			if (currentSquare[0] < 8) {
				currentSquare[0]++;
			}
			break;
		default:
		  	return;
	  }

	  document.getElementById("x_" + currentSquare[0] + "_y_" + currentSquare[1]).focus();
});

function printTable(iterations, puz) {
	let puzzleArea = document.getElementById("puzzle");
	let puzzlehtml = "<table>";
	for (let y = 0; y < 9; y++) {
		puzzlehtml += "<tr>" ;
		for (let x = 0; x < 9; x++) {
			puzzlehtml += "<td><input id='x_" + x + "_y_" + y + "' type='text' value='" + (
				puz[x][y] == 0 ? "" : puz[x][y]
				) + "' onfocus='focusSquare("+x+","+y+")' oninput='change("+x+","+y+")' onclick='clickf("+x+","+y+")'></td>";
		}
		puzzlehtml += "</tr>";
	}
	if (iterations > 0) {
		puzzlehtml += "<p>Solved in " + iterations + " iterations!</p>";
	}
	puzzleArea.innerHTML = puzzlehtml + "<br/><button onclick='solve()'>Solve!</button><button onclick='generate()'>New Puzzle</button>";
}

function fetchBlockersRow(puz,y,bl) {
	for (let xx = 0; xx < 9; xx++) {
		if (puz[xx][y] != 0) {
			bl.push(puz[xx][y]);
		}
	}
}
function getBlockersRow(puz,y) {
	let bl = []
	fetchBlockersRow(puz,y,bl);
	return bl;
}

function fetchBlockersCol(puz,x,bl) {
	for (let yy = 0; yy < 9; yy++) {
		if (puz[x][yy] != 0) {
			bl.push(puz[x][yy]);
		}
	}
}
function getBlockersCol(puz,x) {
	let bl = []
	fetchBlockersCol(puz,x,bl);
	return bl;
}

function fetchBlockersSquare(puz,x,y,bl) {
	let blockx = 3 * (x / 3 | 0);
	let blocky = 3 * (y / 3 | 0);
	for (let xx = blockx; xx < blockx+3; xx++) {
		for (let yy = blocky; yy < blocky+3; yy++) {
			if (puz[xx][yy] != 0) {
				bl.push(puz[xx][yy]);
			}
		}
	}
}
function getBlockersSquare(puz,x,y) {
	let bl = []
	fetchBlockersSquare(puz,x,y,bl);
	return bl;
}

function getBlockers(puz,x,y) {
	let bl = [];
	fetchBlockersRow(puz,y,bl);
	fetchBlockersCol(puz,x,bl);
	fetchBlockersSquare(puz,x,y,bl);
	return [...new Set(bl)];
}

function allowedFromBlocked(blockers) {
	return [1,2,3,4,5,6,7,8,9].filter(s => !blockers.includes(s));
}

function getAllowed(puz,x,y) {
	return allowedFromBlocked(getBlockers(puz,x,y));
}

function resetSquare(ele) {
	ele.style.backgroundColor = "#FFFFFF";
	ele.value = ""; 
}

function change(x,y) {
	puzzleValues[x][y] = 0;
	let valbox = document.getElementById("x_" + x + "_y_" + y);
	let filterval = valbox.value.replace(/\D/g, "");
	if (filterval.length == 0) { 
		resetSquare(valbox);
		return;
	}
	let lastdigit = filterval[filterval.length-1];
	if (lastdigit == "0") { 
		resetSquare(valbox);
		return;
	}
	let newval = Number(lastdigit);
	let allowed = getAllowed(puzzleValues,x,y); 
	if (!allowed.includes(newval)) {
		valbox.style.backgroundColor = "#FF0000";
	} else if (allowed.length == 1) {
		valbox.style.backgroundColor = "#00FF00";
	} else {
		valbox.style.backgroundColor = "#FFFFFF";
	}
	valbox.value = newval;
	puzzleValues[x][y] = newval;
}

function solved(puz) {
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if (puz[x][y] == 0) {
				return false;
			}
		}
	}
	return true;
}

function solveSquare(puz, x, y) {
	let allowed = allowedFromBlocked(getBlockersSquare(puz,x,y));
	let colBlockers = [getBlockersCol(puz,x),getBlockersCol(puz,x+1),getBlockersCol(puz,x+2)];
	let rowBlockers = [getBlockersRow(puz,y),getBlockersRow(puz,y+1),getBlockersRow(puz,y+2)];
	allowed.forEach(n => {
		let squares = [[0,0,0],[0,0,0],[0,0,0]];
		for (let i = 0; i < 3; i++){
			if (colBlockers[i].includes(n)) {
				squares[i][0] = 1;
				squares[i][1] = 1;
				squares[i][2] = 1;
			}
		}
		for (let i = 0; i < 3; i++) {
			if (rowBlockers[i].includes(n)) {
				squares[0][i] = 1;
				squares[1][i] = 1;
				squares[2][i] = 1;
			}
		}
		let found = false;
		let foundcoords = [0,0];
		for (let i = 0; i < 3; i++){
			for (let j = 0; j < 3; j++){
				if (puz[x+i][y+j] != 0) {
					squares[i][j] = 1;
				}
				if (squares[i][j] == 0) {
					if (found) {
						return;
					} else {
						found = true;
						foundcoords = [i+x,j+y];
					}
				}
			}
		}
		if (found) {
			puz[foundcoords[0]][foundcoords[1]] = n;
		}
	});
}

function solveR(it, puz) {
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if (puz[x][y] == 0) {
				let vals = getAllowed(puz,x,y);
				if (vals.length == 1) {
					puz[x][y] = vals[0];
				}
			}
		}
	}
	// also check for each row and column and square for numbers that can only go in one slot
	for (let i = 0; i < 3; i++){
		for (let j = 0; j < 3; j++){
			solveSquare(puz, i*3, j*3);
		}
	}
	if (solved(puz)) {		
		return it;
	} else {
		if (it > 8) {
			return 0;
		}
		solveR(it+1, puz);
	}
}

function solve() {
	printTable(solveR(1, puzzleValues), puzzleValues);
}

function shuffle(array){
	for(let i = array.length - 1; i > 0; i--){
		const j = Math.floor(Math.random() * i)
		const temp = array[i]
		array[i] = array[j]
		array[j] = temp
	  }
}

function generate() {
	setTimeout(function() {
		let newPuzzle =  [
			[0,0,0, 0,0,0, 0,0,0],
			[0,0,0, 0,0,0, 0,0,0],
			[0,0,0, 0,0,0, 0,0,0],
		
			[0,0,0, 0,0,0, 0,0,0],
			[0,0,0, 0,0,0, 0,0,0],
			[0,0,0, 0,0,0, 0,0,0],
		
			[0,0,0, 0,0,0, 0,0,0],
			[0,0,0, 0,0,0, 0,0,0],
			[0,0,0, 0,0,0, 0,0,0]
		];

		let needsrestart = true;
		while (needsrestart) {
			needsrestart = false;
			for (let x = 0; x < 9; x++) {
				for (let y = 0; y < 9; y++) {
					if (newPuzzle[x][y] != 0) continue;
					let allowed = getAllowed(newPuzzle,x,y);
					if (allowed.length == 0) {
						if (x > 7) {
							for (let j = 0; j < 9; j++) {
								newPuzzle[j][y] = 0;
							}
							needsrestart = true;
						} else {
							for (let j = 0; j < y; j++) {
								newPuzzle[x][j] = 0;
							}
						}
						puzzleValues = newPuzzle;
						printTable(0, newPuzzle);
					} else {
						shuffle(allowed);
						newPuzzle[x][y] = allowed[Math.floor(Math.random() * allowed.length)];
					}
				}
				setTimeout(function() {
					printTable(0, newPuzzle);
				}, 1);
				solveR(1, newPuzzle);
				setTimeout(function() {
					printTable(0), newPuzzle;
				}, 1);
			}
		}
		while (true) {
			let x = Math.floor(Math.random() * 9);
			let y = Math.floor(Math.random() * 9);
			let oldval = newPuzzle[x][y];
			newPuzzle[x][y] = 0;

			if (solveR(1, Array.from(newPuzzle)) == 0) {
				newPuzzle[x][y] = oldval;
				break;
			}
		}
		puzzleValues = newPuzzle;
		printTable(0, puzzleValues);
	}, 1);
}

// display our puzzle
printTable(0, puzzleValues);
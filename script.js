var cell1, cell2;
var gameOver;
var gridCells = document.querySelectorAll('.grid-cell');
var score = document.getElementById('score');
var restart = document.getElementById('restart-btn');

onload = () => {

	document.addEventListener('keydown', (event) => {
		if (gameOver)
			return;
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			movement(event.key);
		}
	});

	restart.addEventListener('click', () => {
		start();
	});

	start();
}

function start(){

	score.textContent = 0;
	gameOver = false;
	cell1 = Math.floor(Math.random() * gridCells.length);
	cell2 = Math.floor(Math.random() * gridCells.length);
	while (cell2 === cell1) {
		cell2 = Math.floor(Math.random() * gridCells.length);
	}
	for (let i = 0; i < gridCells.length; i++) {
		gridCells[i].textContent = '';
	}
	gridCells[cell1].textContent = 2 * ((Math.floor(Math.random() * 2) + 1));
	gridCells[cell2].textContent = 2 * ((Math.floor(Math.random() * 2) + 1));
}

function leftMovement(){
	for (let i = 0; i < gridCells.length; i++) {
		if (i % 4 === 0 || gridCells[i].textContent === '')
			continue;
		if (gridCells[i - 1].textContent === '') {
			gridCells[i - 1].textContent = gridCells[i].textContent;
			gridCells[i].textContent = '';
			if (i < gridCells.length) {
				i -= 2;
			}
			continue;
		}
		mergeCells(gridCells[i - 1], gridCells[i]);
	}
}

function rightMovement(){
	for (let i = gridCells.length - 1; i >= 0; i--) {
		if (i % 4 === 3 || gridCells[i].textContent === '')
			continue;
		if (gridCells[i + 1].textContent === '') {
			gridCells[i + 1].textContent = gridCells[i].textContent;
			gridCells[i].textContent = '';
			if (i < gridCells.length) {
				i += 2;
			}
			continue;
		}
		mergeCells(gridCells[i + 1], gridCells[i]);
	}
}

function upMovement(){
	for (let i = 0; i < gridCells.length; i++) {
		if (i - 4 < 0 || gridCells[i].textContent === '')
			continue;
		if (gridCells[i - 4].textContent === '') {
			gridCells[i - 4].textContent = gridCells[i].textContent;
			gridCells[i].textContent = '';
			if (i > 7) {
				i -= 5;
			}
			continue;
		}
		mergeCells(gridCells[i - 4], gridCells[i]);
	}
}

function downMovement(){
	for (let i = gridCells.length - 1; i >= 0; i--) {
		if (i + 4 >= gridCells.length || gridCells[i].textContent === '')
			continue;
		if (gridCells[i + 4].textContent === '') {
			gridCells[i + 4].textContent = gridCells[i].textContent;
			gridCells[i].textContent = '';
			if (i < gridCells.length - 7) {
				i += 5;
			}
			continue;
		}
		mergeCells(gridCells[i + 4], gridCells[i]);
	}
}

function movement(direction){
	if (direction === 'ArrowUp') {
		upMovement();
	}
	else if (direction === 'ArrowDown') {
		downMovement();
	}
	else if (direction === 'ArrowLeft') {
		leftMovement();
	}
	else if (direction === 'ArrowRight') {
		rightMovement();
	}
	addNewTile();
	checkGameOver();
}

function mergeCells(merge, empty) {
	if (merge.textContent === empty.textContent){

		score.textContent = parseInt(score.textContent) + parseInt(merge.textContent) * 2;
		merge.textContent = parseInt(merge.textContent) * 2;
		empty.textContent = '';
	}
}

function addNewTile() {
	emptyCells = [];
	for (let i = 0; i < gridCells.length; i++) {
		if (gridCells[i].textContent === '') {
			emptyCells.push(i);
		}
	}
	if (emptyCells.length != 0) {
			let newTileIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
			gridCells[newTileIndex].textContent = 2 * (Math.floor(Math.random() * 2) + 1);
	}
	else{
		gameOver = true;
		alert('Game Over! No more moves possible.');
	}
}

function checkGameOver() {
	let emptyCell = true;
	for (let i = 0; i < gridCells.length; i++) {
		if (gridCells[i].textContent === '2048') {
			gameOver = true;
			alert('Congratulations! You reached 2048!');
		}
		if (gridCells[i].textContent === '') {
			emptyCell = true;
		}
	}
	if (!emptyCell) {

		gameOver = true;
		alert('Game Over! No more moves possible.');
	}
	
}

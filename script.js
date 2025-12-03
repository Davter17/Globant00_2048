var cell1, cell2;
var gameOver;
var gridCells = document.querySelectorAll('.grid-cell');
var score = document.getElementById('score');
var restart = document.getElementById('restart-btn');
var lastMerged = null;

var randomMovesPower = document.getElementById('random-moves-btn');
var fillPower = document.getElementById('fill-gaps-btn');
var duplicatePower = document.getElementById('duplicate-tiles-btn');
var randomizePower = document.getElementById('randomize-tiles-btn');

var gameMessage = document.getElementById('game-message');
var messageTitle = document.getElementById('message-title');
var messageText = document.getElementById('message-text');
var continueBtn = document.getElementById('continue-btn');
var restartMessageBtn = document.getElementById('restart-message-btn');
var hasWon = false;

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

	continueBtn.addEventListener('click', () => {
		hideMessage();
		gameOver = false;
	});

	restartMessageBtn.addEventListener('click', () => {
		hideMessage();
		start();
	});

	randomMovesPower.addEventListener('click', () => {
		let moves = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
		let moveCount = 0;
		
		let interval = setInterval(() => {
			if (moveCount >= 10 || gameOver) {
				clearInterval(interval);
				return;
			}
			
			let randomMove = moves[Math.floor(Math.random() * moves.length)];
			movement(randomMove);
			moveCount++;
		}, 300);
	});

	fillPower.addEventListener('click', () => {
		for (let i = 0; i < gridCells.length; i++) {
			if (gridCells[i].textContent === '') {
				gridCells[i].textContent = 2 * (Math.floor(Math.random() * 2) + 1);
			}
		}
	});

	duplicatePower.addEventListener('click', () => {
		for (let i = 0; i < gridCells.length; i++) {
			if (gridCells[i].textContent !== '') {
				gridCells[i].textContent = parseInt(gridCells[i].textContent) * 2;
			}
		}
		checkGameOver();
	});

	randomizePower.addEventListener('click', () => {
		let values = [];
		let index = [];
		for (let i = 0; i < gridCells.length; i++) {
			if (gridCells[i].textContent !== '') {
				values.push(gridCells[i].textContent);
				index.push(i);
				gridCells[i].textContent = '';
			}
		}
		for (let i = 0; i < values.length; i++) {
			let randIndex = index[Math.floor(Math.random() * index.length)];
			gridCells[randIndex].textContent = values[i];
			index = index.filter((value) => value !== randIndex);
		}
	});


	start();
}

function start(){

	score.textContent = 0;
	gameOver = false;
	hasWon = false;
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

	lastMerged = null;
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
	if (merge.textContent === empty.textContent && merge !== lastMerged) {
		score.textContent = parseInt(score.textContent) + parseInt(merge.textContent) * 2;
		merge.textContent = parseInt(merge.textContent) * 2;
		empty.textContent = '';
		lastMerged = merge;
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
		showMessage('Game Over!', 'No more moves possible.', false);
	}
}

function checkGameOver() {
	let emptyCell = false;
	for (let i = 0; i < gridCells.length; i++) {
		if (gridCells[i].textContent === '2048' && !hasWon) {
			gameOver = true;
			hasWon = true;
			showMessage('Congratulations!', 'You reached 2048!', true);
		}
		if (gridCells[i].textContent === '') {
			emptyCell = true;
		}
	}
	if (!emptyCell) {
		gameOver = true;
		for (let i = 0; i < gridCells.length; i++) {
			let row = Math.floor(i / 4);
			let col = i % 4;
			let currentValue = gridCells[i].textContent;
			
			if (col < 3 && gridCells[i + 1].textContent === currentValue) {
				gameOver = false;
				break;
			}
			if (row < 3 && gridCells[i + 4].textContent === currentValue) {
				gameOver = false;
				break;
			}
		}
		if (gameOver)
			showMessage('Game Over!', 'No more moves possible.', false);
	}
	
}

function showMessage(title, text, isWin) {
	messageTitle.textContent = title;
	messageText.textContent = text;
	
	if (isWin) {
		continueBtn.style.display = 'inline-block';
	} else {
		continueBtn.style.display = 'none';
	}
	
	gameMessage.classList.remove('hidden');
	gameMessage.classList.add('show');
}

function hideMessage() {
	gameMessage.classList.remove('show');
	gameMessage.classList.add('hidden');
}

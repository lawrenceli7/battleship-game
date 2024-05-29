import {
  activateRandomizeShips,
  displayGameOver,
  markHit,
  markMiss,
  renderBoard,
} from "./dom";
import Player from "./player";

const playerOne = new Player("human");
const playerOneGameboard = playerOne.gameboard;

const playerTwo = new Player("computer");
const playerTwoGameboard = playerTwo.gameboard;

const players = [playerOne, playerTwo];
let activePlayer = players[0];

const switchTurns = () => {
  activePlayer = activePlayer === players[0] ? players[1] : players[0];
};

const playerOneWon = () => {
  return playerTwoGameboard.allShipsSunk;
};

const playerTwoWon = () => {
  return playerOneGameboard.allShipsSunk;
};

const getRandomCoordinates = () => {
  const randomRow = Math.floor(Math.random() * 10);
  const randomCol = Math.floor(Math.random() * 10);
  return [randomRow, randomCol];
};

const takeTurn = (e) => {
  if (activePlayer !== players[0]) {
    return;
  }

  const attackedCoordinates = [e.target.dataset.row, e.target.dataset.column];
  if (playerTwoGameboard.receiveAttack(attackedCoordinates)) {
    if (playerTwoGameboard.hasShipAt(attackedCoordinates)) {
      markHit(e.target);
      if (playerOneWon()) {
        displayGameOver("You win!");
        return;
      }
    } else {
      markMiss(e.target);
    }
  } else {
    return;
  }
  switchTurns();

  setTimeout(() => {
    let randomCoordinates = getRandomCoordinates();

    while (!playerOneGameboard.receiveAttack(randomCoordinates)) {
      randomCoordinates = getRandomCoordinates();
    }

    const [chosenRow, chosenCol] = randomCoordinates;
    const attackedSquare = document.querySelector(
      `#player-one-board > .square:nth-child(${chosenRow * 10 + chosenCol + 1})`
    );

    if (playerOneGameboard.hasShipAt(randomCoordinates)) {
      markHit(attackedSquare);
      if (playerTwoWon()) {
        displayGameOver("Computer wins!");
        return;
      }
    } else {
      markMiss(attackedSquare);
    }
    switchTurns();
  }, 500);
};

const randomizeShips = () => {
  playerOneGameboard.randomizeShips();
  playerTwoGameboard.randomizeShips();

  renderBoard(
    document.querySelector("#player-one-board"),
    playerOneGameboard,
    false
  );
  renderBoard(
    document.querySelector("#player-two-board"),
    playerTwoGameboard,
    true,
    takeTurn
  );
};

const runGame = () => {
  activateRandomizeShips(randomizeShips);
  randomizeShips();
};

export default runGame;

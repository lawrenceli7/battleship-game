import Ship from "./ship";

class Gameboard {
  board;
  length;
  ships;
  hits;
  misses;
  allShipsSunk;

  constructor() {
    this.length = 10;
    this.board = [...Array(this.length)].map(() =>
      Array(this.length).fill(null)
    );
    this.ships = [];
    this.hits = new Set();
    this.misses = new Set();
    this.allShipsSunk = false;
  }

  get length() {
    return this.length;
  }

  get ships() {
    return this.ships;
  }

  get misses() {
    return [...this.misses].map((miss) => JSON.parse(miss));
  }

  get allShipsSunk() {
    return this.allShipsSunk;
  }

  isOnBoard(coordinates) {
    const [row, col] = coordinates;
    return (
      row >= 0 && row < this.board.length && col >= 0 && col < this.board.length
    );
  }

  hasShipAt(coordinates) {
    const [row, col] = coordinates;
    return !!this.board[row][col];
  }

  getShipAt(coordinates) {
    if (!this.hasShipAt(coordinates)) {
      throw new Error("No ship!");
    }
    const [row, col] = coordinates;
    return this.board[row][col];
  }

  isValidShipPlacement(startCoordinates, endCoordinates) {
    if (!this.isOnBoard(startCoordinates) || !this.isOnBoard(endCoordinates)) {
      return false;
    }

    if (
      startCoordinates[0] !== endCoordinates[0] &&
      startCoordinates[1] !== endCoordinates[1]
    ) {
      throw new Error("Ships cannot be placed diagonally!");
    }

    if (startCoordinates[0] === endCoordinates[0]) {
      let [row, col1] = startCoordinates;
      let col2 = endCoordinates[1];

      if (col1 > col2) {
        [col1, col2] = [col2, col1];
      }

      for (let j = col1; j <= col2; j++) {
        if (this.hasShipAt([row, j])) {
          return false;
        }
      }

      return true;
    } else {
      let [row1, col] = startCoordinates;
      let row2 = endCoordinates[0];

      if (row1 > row2) {
        [row1, row2] = [row2, row1];
      }

      for (let i = row1; i <= row2; i++) {
        if (this.hasShipAt([i, col])) {
          return false;
        }
      }

      return true;
    }
  }

  placeShipHorizontally(startCoordinates, endCoordinates) {
    let [row, col1] = startCoordinates;
    let col2 = endCoordinates[1];

    if (col1 > col2) {
      [col1, col2] = [col2, col1];
    }

    const ship = new Ship(col2 - col1 + 1);
    this.ships.push(ship);
    for (let j = col1; j <= col2; j++) {
      this.board[row][j] = ship;
    }
  }

  placeShipVertically(startCoordinates, endCoordinates) {
    let [row1, col] = startCoordinates;
    let row2 = endCoordinates[0];

    if (row1 > row2) {
      [row1, row2] = [row2, row1];
    }

    const ship = new Ship(row2 - row1 + 1);
    this.ships.push(ship);
    for (let i = row1; i <= row2; i++) {
      this.board[i][col] = ship;
    }
  }

  placeShip(startCoordinates, endCoordinates) {
    if (this.isValidShipPlacement(startCoordinates, endCoordinates)) {
      if (startCoordinates[0] === endCoordinates[0]) {
        this.placeShipHorizontally(startCoordinates, endCoordinates);
      } else {
        this.placeShipVertically(startCoordinates, endCoordinates);
      }
    }
  }

  placeShipRandomly(shipLength) {
    if (typeof shipLength === "undefined") {
      throw new Error("Missing ship's length!");
    }
    let isShipVertical = Math.random() < 0.5;
    let rowStart = Math.floor(Math.random() * 10);
    let colStart = Math.floor(Math.random() * 10);
    let rowEnd;
    let colEnd;
    if (isShipVertical) {
      rowEnd = rowStart + shipLength - 1;
      colEnd = colStart;
    } else {
      rowEnd = rowStart;
      colEnd = colStart + shipLength - 1;
    }
    while (!this.isValidShipPlacement([rowStart, colStart], [rowEnd, colEnd])) {
      rowStart = Math.floor(Math.random() * 10);
      colStart = Math.floor(Math.random() * 10);
      if (isShipVertical) {
        rowEnd = rowStart + shipLength - 1;
        colEnd = colStart;
      } else {
        rowEnd = rowStart;
        colEnd = colStart + shipLength - 1;
      }
    }
    this.placeShip([rowStart, colStart], [rowEnd, colEnd]);
  }

  reset() {
    this.length = 10;
    this.board = [...Array(this.length)].map(() =>
      Array(this.length).fill(null)
    );
    this.ships = [];
    this.hits = new Set();
    this.misses = new Set();
    this.allShipsSunk = false;
  }

  randomizeShips() {
    this.reset();
    this.placeShipRandomly(5);
    this.placeShipRandomly(4);
    this.placeShipRandomly(3);
    this.placeShipRandomly(3);
    this.placeShipRandomly(2);
  }

  receiveAttack(coordinates) {
    if (!this.isOnBoard(coordinates)) {
      throw new Error("Out of bounds!");
    }

    if (
      this.hits.has(JSON.stringify(coordinates)) ||
      this.misses.has(JSON.stringify(coordinates))
    ) {
      return false;
    }

    if (this.hasShipAt(coordinates)) {
      const ship = this.getShipAt(coordinates);
      ship.hit();
      this.hits.add(JSON.stringify(coordinates));

      this.allShipsSunk = this.ships.every((ship) => ship.isSunk());
    } else {
      this.misses.add(JSON.stringify(coordinates));
    }
    return true;
  }
}

export default Gameboard;

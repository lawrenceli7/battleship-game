import { beforeEach, describe, expect, test } from "@jest/globals";
import Gameboard from "../src/js/gameboard";
import Ship from "../src/js/ship";

let gameboard;
beforeEach(() => {
  gameboard = new Gameboard();
});

describe("retrieving ship", () => {
  test("hasShipAt correctly reports if a ship is present or not", () => {
    expect(gameboard.hasShipAt([0, 0], [0, 2])).toBe(false);
    expect(gameboard.hasShipAt([0, 1])).toBe(false);
    expect(gameboard.hasShipAt([0, 2])).toBe(false);
    gameboard.placeShip([0, 0], [0, 2]);
    expect(gameboard.hasShipAt([0, 0])).toBe(true);
    expect(gameboard.hasShipAt([0, 1])).toBe(true);
    expect(gameboard.hasShipAt([0, 2])).toBe(true);
    expect(gameboard).toMatchSnapshot();
  });

  test("getShipAt returns the correct ship", () => {
    gameboard.placeShip([4, 2], [4, 5]);
    expect(gameboard.hasShipAt([4, 2])).toBe(true);
    expect(gameboard.getShipAt([4, 2])).toEqual(gameboard.getShipAt([4, 5]));
    expect(gameboard.getShipAt([4, 2])).toMatchSnapshot();
  });

  test("getShipAt throws if no ship at given coordinates", () => {
    expect(() => {
      gameboard.getShipAt([0, 0]);
    }).toThrow();
  });
});

describe("placing ship", () => {
  test("placeShip creates ship of correct length", () => {
    gameboard.placeShip([1, 1], [1, 4]);
    gameboard.placeShip([6, 3], [4, 3]);
    gameboard.placeShip([0, 0], [0, 1]);
    expect(gameboard.getShipAt([1, 1]).length).toBe(4);
    expect(gameboard.getShipAt([6, 3]).length).toBe(3);
    expect(gameboard.getShipAt([0, 0]).length).toBe(2);
    expect(gameboard).toMatchSnapshot();
  });

  test("places ship horizontally left to right", () => {
    const row1 = 2;
    const col1 = 3;
    const row2 = 2;
    const col2 = 5;
    gameboard.placeShip([row1, col1], [row2, col2]);

    expect(gameboard.getShipAt([row1, col1])).toBeInstanceOf(Ship);
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard.length; j++) {
        if (i === row1 && col1 <= j && j <= col2) {
          expect(gameboard.hasShipAt([i, j])).toBe(true);
        } else {
          expect(gameboard.hasShipAt([i, j])).toBe(false);
        }
      }
    }
    expect(gameboard).toMatchSnapshot();
  });

  test("places ship horizontally right to left", () => {
    const row1 = 8;
    const col1 = 9;
    const row2 = 8;
    const col2 = 7;
    gameboard.placeShip([row1, col1], [row2, col2]);

    expect(gameboard.getShipAt([row1, col1])).toBeInstanceOf(Ship);
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard.length; j++) {
        if (i === row1 && col2 <= j && j <= col1) {
          expect(gameboard.hasShipAt([i, j])).toBe(true);
        } else {
          expect(gameboard.hasShipAt([i, j])).toBe(false);
        }
      }
    }

    expect(gameboard).toMatchSnapshot();
  });

  test("places ship vertically top to bottom", () => {
    const row1 = 4;
    const col1 = 5;
    const row2 = 8;
    const col2 = 5;
    gameboard.placeShip([row1, col1], [row2, col2]);

    expect(gameboard.getShipAt([row1, col1])).toBeInstanceOf(Ship);
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard.length; j++) {
        if (j === col1 && row1 <= i && i <= row2) {
          expect(gameboard.hasShipAt([i, j])).toBe(true);
        } else {
          expect(gameboard.hasShipAt([i, j])).toBe(false);
        }
      }
    }
    expect(gameboard).toMatchSnapshot();
  });

  test("places ship vertically bottom to top", () => {
    const row1 = 4;
    const col1 = 9;
    const row2 = 1;
    const col2 = 9;
    gameboard.placeShip([row1, col1], [row2, col2]);

    expect(gameboard.getShipAt([row1, col1])).toBeInstanceOf(Ship);
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard.length; j++) {
        if (j === col1 && row2 <= i && i <= row1) {
          expect(gameboard.hasShipAt([i, j])).toBe(true);
        } else {
          expect(gameboard.hasShipAt([i, j])).toBe(false);
        }
      }
    }
    expect(gameboard).toMatchSnapshot();
  });

  test("throws if ship placed diagonally", () => {
    expect(() => {
      gameboard.placeShip([4, 4], [6, 6]);
    }).toThrow();
  });

  test("does not place ship off the board", () => {
    const oldShips = gameboard.ships;
    gameboard.placeShip([-1, 1], [2, 1]);
    gameboard.placeShip([0, -3], [0, 1]);
    gameboard.placeShip([9, 9], [11, 9]);
    gameboard.placeShip([2, 8], [2, 10]);
    const newShips = gameboard.ships;
    expect(oldShips).toEqual(newShips);
  });

  test("does not place ship on occupied coordinates", () => {
    gameboard.placeShip([1, 1], [1, 4]);
    const oldShips = gameboard.ships;

    gameboard.placeShip([0, 1], [2, 1]);

    const newShips = gameboard.ships;
    expect(oldShips).toEqual(newShips);
  });

  test("can randomly place 5 ships", () => {
    gameboard.randomizeShips();
    expect(gameboard.ships.length).toBe(5);
  });
});

describe("receiving attacks", () => {
  test("correct ship is hit when receiving attack", () => {
    gameboard.placeShip([2, 3], [2, 5]);
    gameboard.placeShip([0, 1], [2, 1]);

    const shipToBeHit = gameboard.getShipAt([2, 3]);
    expect(shipToBeHit.hits).toBe(0);
    gameboard.receiveAttack([2, 3]);
    gameboard.receiveAttack([2, 4]);
    expect(shipToBeHit.hits).toBe(2);

    const shipToNotBeHit = gameboard.getShipAt([0, 1]);
    expect(shipToNotBeHit.hits).toBe(0);
    expect(gameboard).toMatchSnapshot();
  });

  test("reports whether or not all of its ships have been sunk", () => {
    gameboard.placeShip([1, 1], [1, 2]);
    gameboard.placeShip([3, 3], [3, 4]);
    expect(gameboard.allShipsSunk).toBe(false);

    gameboard.receiveAttack([1, 1]);
    gameboard.receiveAttack([1, 2]);
    expect(gameboard.allShipsSunk).toBe(false);

    gameboard.receiveAttack([3, 3]);
    gameboard.receiveAttack([3, 4]);
    expect(gameboard.allShipsSunk).toBe(true);
  });

  test("throws if receiving attack off the board", () => {
    expect(() => {
      gameboard.receiveAttack([-1, -1]);
    }).toThrow();
    expect(() => {
      gameboard.receiveAttack([10, 4]);
    }).toThrow();
  });

  test("prevents hit at same spot more than once", () => {
    gameboard.placeShip([1, 1], [1, 2]);
    gameboard.receiveAttack([1, 1]);
    gameboard.receiveAttack([1, 1]);
    const ship = gameboard.getShipAt([1, 1]);
    expect(ship.hits).toBe(1);
  });
});

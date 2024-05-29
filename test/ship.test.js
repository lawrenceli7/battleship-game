import { describe, expect, test } from "@jest/globals";
import Ship from "../src/js/ship";

describe("ship length", () => {
  test("has correct length", () => {
    expect(new Ship(4)).toHaveProperty("length", 4);
    expect(new Ship(2)).toHaveProperty("length", 2);

    expect(new Ship(4)).toMatchSnapshot();
    expect(new Ship(2)).toMatchSnapshot();
  });

  test("throws if length not between 2 and 5", () => {
    expect(() => {
      new Ship(0);
    }).toThrow();
    expect(() => {
      new Ship(1);
    }).toThrow();
    expect(() => {
      new Ship(2);
    }).not.toThrow();
    expect(() => {
      new Ship(3);
    }).not.toThrow();
    expect(() => {
      new Ship(4);
    }).not.toThrow();
    expect(() => {
      new Ship(5);
    }).not.toThrow();
    expect(() => {
      new Ship(6);
    }).toThrow();
    expect(() => {
      new Ship(7);
    }).toThrow();

    expect(new Ship(2)).toMatchSnapshot();
    expect(new Ship(4)).toMatchSnapshot();
  });
});

describe("receiving hits", () => {
  test("keeps track of number of times hit", () => {
    const ship = new Ship(4);
    expect(ship).toHaveProperty("hits", 0);

    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship).toHaveProperty("hits", 3);

    ship.hit();
    expect(ship).toHaveProperty("hits", 4);

    expect(ship).toMatchSnapshot();
  });

  test("caps number of hits at ship length", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship).toHaveProperty("hits", 3);

    expect(ship).toMatchSnapshot();
  });

  test("is sunk if number of hits equals ship length", () => {
    const ship = new Ship(2);
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);

    expect(ship).toMatchSnapshot();
  });
});

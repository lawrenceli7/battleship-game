import { expect, test } from "@jest/globals";
import Gameboard from "../src/js/gameboard";
import Player from "../src/js/player";

test("is either of type human or computer", () => {
  expect(() => {
    new Player("human");
  }).not.toThrow();
  expect(() => {
    new Player("computer");
  }).not.toThrow();
  expect(() => {
    new Player("bird");
  }).toThrow();
  expect(() => {
    new Player("barbell");
  }).toThrow();
});

test("contains its own gameboard", () => {
  const human = new Player("human");
  expect(human.gameboard).toBeInstanceOf(Gameboard);

  const computer = new Player("computer");
  expect(computer.gameboard).toBeInstanceOf(Gameboard);

  expect(computer.gameboard).not.toBe(human.gameboard);

  expect(human).toMatchSnapshot();
  expect(computer).toMatchSnapshot();
});

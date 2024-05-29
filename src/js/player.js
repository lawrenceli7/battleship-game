import Gameboard from "./gameboard";

class Player {
  type;
  gameboard;

  constructor(type) {
    if (type !== "human" && type !== "computer") {
      throw new Error("Invalid player type!");
    }
    this.type = type;
    this.gameboard = new Gameboard();
  }

  get type() {
    return this.type;
  }

  get gameboard() {
    return this.gameboard;
  }
}

export default Player;

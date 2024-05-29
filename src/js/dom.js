const renderBoard = (container, gameboard, isEnemy, sqClickCb = null) => {
  if (isEnemy && !sqClickCb) {
    throw new Error("Callback not provided!");
  }

  container.replaceChildren();

  for (let i = 0; i < gameboard.length; i++) {
    for (let j = 0; j < gameboard.length; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.dataset.row = i;
      square.dataset.column = j;
      if (!isEnemy && gameboard.hasShipAt([i, j])) {
        square.classList.add("ship");
      }
      if (isEnemy) {
        square.addEventListener("click", sqClickCb);
        square.classList.add("enemy-square");
      }
      container.appendChild(square);
    }
  }
};

const markMiss = (square) => {
  square.classList.add("miss");
};

const markHit = (square) => {
  square.classList.add("hit");
};

const activateRandomizeShips = (callback) => {
  document
    .querySelector("#randomize-ships-btn")
    .addEventListener("click", callback);
};

const displayGameOver = (message) => {
  document.querySelector("#game-over-modal").showModal();
  document.querySelector("#winner").textContent = `${message}`;
  document
    .querySelector("#play-again-btn")
    .addEventListener("click", () => window.location.reload());
};

export {
  activateRandomizeShips,
  displayGameOver,
  markHit,
  markMiss,
  renderBoard,
};

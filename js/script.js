let playerInputName = document.getElementById("playerInputName");
let startGameBtn = document.getElementById("startGameBtn");
let rockBtn = document.getElementById("rockBtn");
let paperBtn = document.getElementById("paperBtn");
let scissorBtn = document.getElementById("scissorBtn");
let nameOutput = document.getElementById("nameOutput");
let computerScoreOutput = document.getElementById("computerScoreOutput");
let computerWeaponOutput = document.getElementById("computerWeaponOutput");
let playerScoreOutput = document.getElementById("playerScoreOutput");
let playerWeaponOutput = document.getElementById("playerWeaponOutput");
let weaponsOfChoice = ["rock", "paper", "scissors"];
let playerWeapon = 0;
let playerScore = 0;
let computerScore = 0;
let randomNumberGenerator = Math.round(Math.random() * 2);
let computerWeapon = weaponsOfChoice[randomNumberGenerator];
let playerObj;

startGameBtn.addEventListener("keypress", (event) => {
  event.preventDefault();
  nameOutput.innerText = playerInputName.value;
  computerScoreOutput.innerText = `Computer score: ${computerScore}`;
  playerScoreOutput.innerText = `Player score: ${playerScore}`;
});

startGameBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  nameOutput.innerText = playerInputName.value;
  computerScoreOutput.innerText = `Computer score: ${computerScore}`;
  playerScoreOutput.innerText = `Player score: ${playerScore}`;
  playerObj = await getUser(playerInputName.value);
});

rockBtn.addEventListener("click", async () => {
  playerWeapon = weaponsOfChoice[0];
  randomNumberGenerator = Math.round(Math.random() * 2);
  computerWeapon = weaponsOfChoice[randomNumberGenerator];
  playerWeaponOutput.innerText = "Player chose Rock";

  if (computerWeapon === "paper") {
    computerScore++;
    computerScoreOutput.innerText = `Computer score: ${computerScore}`;
    computerWeaponOutput.innerText = "Computer chose paper.";
  } else if (computerWeapon === "scissors") {
    playerScore++;
    await userWin(playerObj);
    playerScoreOutput.innerText = `Player score: ${playerScore}`;
    computerWeaponOutput.innerText = "Computer chose scissors.";
  } else {
    computerWeaponOutput.innerText = "Computer chose Rock.";
  }
  if (computerScore === 1) {
    await userLose(playerObj);
  }
});

scissorBtn.addEventListener("click", async () => {
  playerWeapon = weaponsOfChoice[2];
  randomNumberGenerator = Math.round(Math.random() * 2);
  computerWeapon = weaponsOfChoice[randomNumberGenerator];
  playerWeaponOutput.innerText = "Player chose Scissor";
  if (computerWeapon === "rock") {
    computerScore++;
    computerScoreOutput.innerText = `Computer score: ${computerScore}`;
    computerWeaponOutput.innerText = "Computer chose Rock.";
  } else if (computerWeapon === "paper") {
    playerScore++;
    await userWin(playerObj);
    playerScoreOutput.innerText = `Player score: ${playerScore}`;
    computerWeaponOutput.innerText = "Computer chose scissors.";
  } else {
    computerWeaponOutput.innerText = "Computer chose Scissor.";
  }

  if (computerScore === 1) {
    await userLose(playerObj);
  }
});

paperBtn.addEventListener("click", async () => {
  playerWeapon = weaponsOfChoice[1];
  randomNumberGenerator = Math.round(Math.random() * 2);
  computerWeapon = weaponsOfChoice[randomNumberGenerator];
  playerWeaponOutput.innerText = "Player chose Paper";
  if (computerWeapon === "scissors") {
    computerScore++;
    computerScoreOutput.innerText = `Computer score: ${computerScore}`;
    computerWeaponOutput.innerText = "Computer chose scissors.";
  } else if (computerWeapon === "rock") {
    playerScore++;
    await userWin(playerObj);
    playerScoreOutput.innerText = `Player score: ${playerScore}`;
    computerWeaponOutput.innerText = "Computer chose Rock.";
  } else {
    computerWeaponOutput.innerText = "Computer chose Paper!";
  }

  if (computerScore === 1) {
    await userLose(playerObj);
  }
});

function resetTheGame() {
  playerScore = 0;
  computerScore = 0;
  computerScoreOutput.innerText = "";
  playerScoreOutput.innerText = "";
  computerWeaponOutput.innerText = "";
  playerWeaponOutput.innerText = "";
}

const baseUrl =
  "https://highscores-868d4-default-rtdb.europe-west1.firebasedatabase.app/";

//GET
async function getHighScores() {
  try {
    const url = baseUrl + `scores.json`;

    //Vänta på URL.
    const response = await fetch(url);

    //Konvertera datan till JSON.
    const scores = await response.json();

    //Skapar en array av objektes key & value.
    const scoresArray = Object.entries(scores);

    //Jämför första indexet med nästa och jämför scorsen och sorterar därefter.
    const sortedHighschores = scoresArray.sort(
      (a, b) => b[1].score - a[1].score
    );

    let highscoreOne = document.getElementById("highscoreOne");
    let highscoreTwo = document.getElementById("highscoreTwo");
    let highscoreThree = document.getElementById("highscoreThree");
    let highscoreFour = document.getElementById("highscoreFour");
    let highscoreFive = document.getElementById("highscoreFive");

    //Loopar igenom de sorterade highscorsen på rad 155 och skriver ut de i DOM.
    sortedHighschores.forEach((score, index) => {
      if (index === 0) {
        highscoreOne.innerText = `${score[1].userName}: ${score[1].score}`;
      }
      if (index === 1) {
        highscoreTwo.innerText = `${score[1].userName}: ${score[1].score}`;
      }
      if (index === 2) {
        highscoreThree.innerText = `${score[1].userName}: ${score[1].score}`;
      }
      if (index === 3) {
        highscoreFour.innerText = `${score[1].userName}: ${score[1].score}`;
      }
      if (index === 4) {
        highscoreFive.innerText = `${score[1].userName}: ${score[1].score}`;
      }
    });
  } catch (error) {
    let header = document.createElement("h1");
    header.innerText = `Something is wrong`;
    document.body.appendChild(header);
    console.log("Something is wrong");
  }
}

//POST
async function updatePlayer(player) {
  const url = baseUrl + `scores/${player.userName}.json`;

  const init = {
    method: "PUT",
    body: JSON.stringify(player),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  const response = await fetch(url, init);
  const data = await response.json();
}

//Om användaren vinner - uppdatera deras score med 1 och lägg till deras användarnamn till playerObj och kalla på getHighScores så att det nya namnet dyker upp på highscores listan om den ska det.
const userWin = async (playerObj) => {
  setTimeout(async function () {
    await updatePlayer(playerObj);
    await getHighScores();
  }, 100);
};

async function getUser(userNameInput) {
  const url = baseUrl + `scores.json`;
  const response = await fetch(url);
  const scores = await response.json();

  //Om namnet som användaren skriver in redan existerar returnera namnet annars sätt score till 0
  //och adda namnet till databasen. Namnet läggs enbart till om användaren vinner ett game.
  //Om användaren är ny är score 0 - om användaren INTE är det , använd score från databasen.
  if (userNameInput in scores) {
    return scores[userNameInput];
  } else {
    return { score: 0, userName: userNameInput };
  }
}

getHighScores();

const userLose = async (playerObj) => {
  setTimeout(async function () {
    console.log(playerObj.score);
    console.log(playerScore);
    if (playerScore >= playerObj.score) {
      playerObj.score = playerScore;
    }
    alert("YOU LOSE");

    await updatePlayer(playerObj);
    await getHighScores();
    resetTheGame();
  }, 100);
};

import { DeckClass } from "./classes/Deck.js";
import { GameClass } from "./classes/Game.js";

let Deck = new DeckClass();

let playerCardsElement = document.getElementById("playerCards");
let computerCardsElement = document.getElementById("computerCards");
let playCardElement = document.getElementById("playAreaImage");
let drawButtonElement = document.getElementById("drawButton");
let passButtonElement = document.getElementById("passButton");
let startButtonElement = document.getElementById("startButton");
let deckImageElement = document.getElementById("deckImage");
let computerUnoElement = document.getElementById("computerUno");
let playerUnoElement = document.getElementById("playerUno");
let challengeButtonElement = document.getElementById("challengeBtn");
let scoreElement = document.getElementById("scoreP");
let playCard2 = document.getElementById("playAreaImage2");

let playerArea = document.getElementById("playerArea");
let computerArea = document.getElementById("computerArea");

Deck.getImage().onload = function () {
    Deck.createDeck(startGame);
};

let Game = null;

function startGame() {
    let player = JSON.parse(localStorage.getItem("unoPlayer"));
    if (!player) {
        window.location = "./index.html";
    } else {
        let playerName = player.playerName;
        document.getElementById(
            "playerName"
        ).innerHTML = `${playerName}'s Cards`;

        Game = new GameClass(
            Deck,
            playCardElement,
            computerCardsElement,
            playerCardsElement,
            drawButtonElement,
            playerArea,
            computerArea,
            passButtonElement,
            startButtonElement,
            deckImageElement,
            computerUnoElement,
            playerUnoElement,
            challengeButtonElement,
            scoreElement,
            playCard2
        );
    }
}

document.getElementById("challengeBtn").addEventListener("click", function () {
    Game.challenge();
});

document.getElementById("drawButton").addEventListener("click", function () {
    Game.drawFromDeck();
});

document.getElementById("startButton").addEventListener("click", function () {
    Game.startGame();
});

document.getElementById("passButton").addEventListener("click", function () {
    Game.passPlay();
});

document.getElementById("quitButton").addEventListener("click", (event) => {
    event.preventDefault();
    if (confirm("Do you want to QUIT the game?")) {
        localStorage.removeItem("unoPlayer");
        window.location = "/index.html";
    }
});

window.onbeforeunload = function (e) {
    e.returnValue = "onbeforeunload";
    return "onbeforeunload";
};

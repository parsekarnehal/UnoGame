class GameClass {
    #backImagePath;
    #Deck;
    #playerCards = [];
    #computerCards = [];
    #gameOver = true;
    #playCardElement;
    #computerCardsElement;
    #playerCardsElement;
    #playerDraw = true;
    #discardDeck = [];
    #drawButtonElement;
    #playerArea;
    #computerArea;
    #drawCount = 1;
    #playerTurn = true;
    #passButtonElement;
    #startButtonElement;
    #deckImageElement;
    #playerUnoElement;
    #computerUnoElement;
    #challengeButtonElement;
    #showComputerCards = false;
    #scoreElement;
    #computerScore = 0;
    #playerScore = 0;
    #drawnTwo = false;
    #playCard2;

    constructor(
        deck,
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
    ) {
        this.#Deck = deck;
        this.#playCardElement = playCardElement;
        this.#backImagePath = "image/cardBack.png";
        this.#playerCardsElement = playerCardsElement;
        this.#computerCardsElement = computerCardsElement;
        this.#drawButtonElement = drawButtonElement;
        this.#playerArea = playerArea;
        this.#computerArea = computerArea;
        this.#passButtonElement = passButtonElement;
        this.#startButtonElement = startButtonElement;
        this.#deckImageElement = deckImageElement;
        this.#computerUnoElement = computerUnoElement;
        this.#playerUnoElement = playerUnoElement;
        this.#challengeButtonElement = challengeButtonElement;
        this.#scoreElement = scoreElement;
        this.#playCard2 = playCard2;
        this.#setInitialCards();
        this.#updateGame();
    }

    // setting up initial computer and player cards to 7 each
    #setInitialCards() {
        this.#playerCards = this.#Deck.draw(7, this.#reshuffleDeck);
        this.#playerCards.map((el) => {
            el.imgElement.onclick = () => {
                this.#playCard(el);
            };
        });
        this.#computerCards = this.#Deck.draw(7, this.#reshuffleDeck);
    }

    // Reshuffle deck if empty with discard deck cards
    #reshuffleDeck() {
        let lastCard = this.#discardDeck.shift();
        this.#Deck.setDeck(this.#discardDeck);
        this.#discardDeck = [];
        this.#discardDeck.push(lastCard);
        this.#Deck.shuffle();
    }

    // Check for skip, reverse and draw 2 cards
    #checkForCard(cardName) {
        if (this.#discardDeck[0].name === cardName) {
            if (cardName === "Draw Two") {
                if (!this.#drawnTwo) {
                    if (this.#playerTurn) {
                        this.#playerCards = this.#playerCards.concat(
                            this.#Deck.draw(2, this.#reshuffleDeck)
                        );
                    } else {
                        this.#computerCards = this.#computerCards.concat(
                            this.#Deck.draw(2, this.#reshuffleDeck)
                        );
                    }
                }
                this.#drawnTwo = true;
            }

            this.#playerTurn = !this.#playerTurn;
            this.#playerDraw = !this.#playerDraw;
        }
    }

    // Check if card exists if wild draw 4 card played
    #isGuilty(array) {
        for (var i = 0; i < array.length; i++) {
            if (
                array[i].name === this.#discardDeck[1].name ||
                array[i].color === this.#discardDeck[1].color
            ) {
                return true;
            }
        }
        return false;
    }

    // Play the first card after wild draw 4
    #playFirstCard(array) {
        let card = array.shift();
        card.imgElement.src = card.canvas;
        this.#discardDeck.unshift(card);
    }

    // Challenge function if wild draw 4 card is played
    challenge() {
        this.#showComputerCards = true;
        this.#refreshComputerCards();
        this.#playCard2.append(this.#discardDeck[1].imgElement);
        setTimeout(() => {
            let isGuilty = this.#isGuilty(
                this.#playerTurn ? this.#computerCards : this.#playerCards
            );
            if (isGuilty) {
                if (this.#playerTurn) {
                    this.#computerCards = this.#computerCards.concat(
                        this.#Deck.draw(6, this.#reshuffleDeck)
                    );
                    this.#playFirstCard(this.#playerCards);
                } else {
                    this.#playerCards = this.#playerCards.concat(
                        this.#Deck.draw(6, this.#reshuffleDeck)
                    );
                    this.#playFirstCard(this.#computerCards);
                }
            } else {
                if (this.#playerTurn) {
                    this.#playerCards = this.#playerCards.concat(
                        this.#Deck.draw(4, this.#reshuffleDeck)
                    );
                    this.#playFirstCard(this.#computerCards);
                } else {
                    this.#computerCards = this.#computerCards.concat(
                        this.#Deck.draw(4, this.#reshuffleDeck)
                    );
                    this.#playFirstCard(this.#playerCards);
                }
            }

            this.#showComputerCards = false;
            this.#challengeButtonElement.style.display = "none";
            this.#drawCount = 1;
            this.#playCard2.style.display = "none";
            this.passPlay();
        }, 3000);
    }

    // Check if card can be played
    #checkCardValidity(card) {
        if (
            this.#discardDeck[0].name === "Wild" ||
            card.name === "Wild" ||
            card.name === "Wild draw 4" ||
            this.#discardDeck[0].color === card.color ||
            this.#discardDeck[0].name === card.name
        ) {
            if (this.#playerTurn) {
                this.#playerScore += card.point;
                this.#playerCards = this.#playerCards.filter((el) => {
                    return el != card;
                });
            } else {
                this.#computerScore += card.point;
                this.#computerCards = this.#computerCards.filter((el) => {
                    return el != card;
                });
                card.imgElement.src = card.canvas;
            }
            this.#discardDeck.unshift(card);

            this.passPlay();
            return true;
        } else {
            return false;
        }
    }

    // play for players
    #playCard(card) {
        if (!this.#gameOver) {
            if (this.#playerTurn) {
                this.#drawnTwo = false;
                this.#checkCardValidity(card);
            }
        }
    }

    // Refresh function for the entire game
    #updateGame() {
        if (!this.#gameOver) {
            // If reverse card, play again since two player
            this.#checkForCard("Reverse");

            // If skip card, play again since two player
            this.#checkForCard("Skip");

            // If Draw two card is played
            this.#checkForCard("Draw Two");

            // refresh player cards
            while (this.#playCardElement.firstChild) {
                this.#playCardElement.removeChild(
                    this.#playCardElement.firstChild
                );
            }

            // Update played card
            this.#playCardElement.append(this.#discardDeck[0].imgElement);
            this.#startButtonElement.style.display = "none";

            // If Wild draw 4 card played
            if (this.#discardDeck[0].name === "Wild draw 4") {
                this.#playCard2.append(`Previous card`);
                this.#playCard2.append(this.#discardDeck[1].imgElement);
                this.#drawCount = 4;
                // If players turn he can challenge
                if (this.#playerTurn) {
                    this.#challengeButtonElement.style.display = "unset";
                } else {
                    // If computers turn, challenge functionality if off
                    setTimeout(() => {
                        this.#computerCards = this.#computerCards.concat(
                            this.#Deck.draw(
                                this.#drawCount,
                                this.#reshuffleDeck
                            )
                        );
                        this.#drawCount = 1;
                        this.#playFirstCard(this.#playerCards);
                        this.#challengeButtonElement.style.display = "none";
                        this.#playCard2.style.display = "none";
                        this.passPlay();
                    }, 3000);
                }
            }

            // Player displays UNO for last card
            if (this.#playerCards.length === 1) {
                this.#playerUnoElement.style.display = "unset";
            } else {
                this.#playerUnoElement.style.display = "none";
            }

            // Computer displays UNO for last card
            if (this.#computerCards.length === 1) {
                this.#computerUnoElement.style.display = "unset";
            } else {
                this.#computerUnoElement.style.display = "none";
            }

            // If deck becomes empty reshuffle the discard deck as deck
            if (this.#Deck.getDeck().length === 0) {
                this.#reshuffleDeck();
            }

            // Toggle play turn
            if (this.#playerTurn) {
                this.#playerArea.style.border = "4px solid green";
                this.#computerArea.style.border = "none";
            } else {
                this.#playerArea.style.border = "none";
                this.#computerArea.style.border = "4px solid green";
            }

            // If computers turn to play
            if (!this.#playerTurn && !this.#playerDraw) {
                let played = false;
                // Wait before computer plays
                setTimeout(() => {
                    for (var i = 0; i < this.#computerCards.length; i++) {
                        // Check if valid play card exists
                        if (this.#checkCardValidity(this.#computerCards[i])) {
                            played = true;
                            break;
                        }
                    }
                    if (!played) {
                        // Draw one card if no valid card to play
                        this.#computerCards = this.#computerCards.concat(
                            this.#Deck.draw(1, this.#reshuffleDeck)
                        );
                        // Check validity of the new drawn card
                        if (
                            !this.#checkCardValidity(
                                this.#computerCards[
                                    this.#computerCards.length - 1
                                ]
                            )
                        ) {
                            this.passPlay();
                        }
                    }
                }, 3000);
            }

            // Draw button display toggle
            if (this.#playerDraw) {
                this.#drawButtonElement.style.display = "unset";
                this.#deckImageElement.style.opacity = "0.25";
                this.#drawButtonElement.innerHTML = `Draw ${this.#drawCount}`;
            } else {
                this.#drawButtonElement.style.display = "none";
                this.#deckImageElement.style.opacity = "1";
            }

            // Pass button display toggle
            if (this.#playerTurn && !this.#playerDraw) {
                this.#passButtonElement.style.display = "block";
            } else if (!this.#playerTurn) {
                this.#passButtonElement.style.display = "none";
            }
        } else {
            // Start button show
            this.#startButtonElement.style.display = "inline";
        }

        // Refresh scores;
        this.#scoreElement.innerHTML = `Computer score: ${
            this.#computerScore
        }<br/>Player score: ${this.#playerScore}`;

        // Refresh players cards
        while (this.#playerCardsElement.firstChild) {
            this.#playerCardsElement.removeChild(
                this.#playerCardsElement.firstChild
            );
        }
        this.#playerCards.map((el) => {
            this.#playerCardsElement.append(el.imgElement);
            el.imgElement.onclick = () => {
                this.#playCard(el);
            };
        });

        this.#refreshComputerCards();

        // Check for game over
        if (this.#computerCards.length === 0 || this.#computerScore >= 500) {
            this.#showComputerCards = true;
            this.#refreshComputerCards();
            this.#gameOver = true;
            alert("Computer Won!, To Restart Game please confirm reload");
            window.location.reload();
        } else if (this.#playerCards.length === 0 || this.#playerScore >= 500) {
            this.#gameOver = true;
            alert(
                "Defeated the computer, You won!, To Restart Game please confirm reload"
            );
            window.location.reload();
        }
    }

    // Refresh computers cards
    #refreshComputerCards() {
        while (this.#computerCardsElement.firstChild) {
            this.#computerCardsElement.removeChild(
                this.#computerCardsElement.firstChild
            );
        }
        this.#flipComputerCards(this.#showComputerCards);
    }

    // Show computer cards if Guilty for playing wild draw 4
    #flipComputerCards(show) {
        this.#computerCards.map((el) => {
            if (show) {
                el.imgElement.src = el.canvas;
            } else {
                el.imgElement.src = this.#backImagePath;
            }
            this.#computerCardsElement.append(el.imgElement);
        });
    }

    // Draw cards from deck on button click
    drawFromDeck() {
        if (!this.#gameOver) {
            let drawArray = this.#Deck.draw(
                this.#drawCount,
                this.#reshuffleDeck
            );
            if (this.#playerTurn) {
                drawArray.map((el) => {
                    el.imgElement.onclick = () => {
                        this.#playCard(el);
                    };
                });
                this.#playerCards = this.#playerCards.concat(drawArray);
                this.#playerDraw = false;

                if (this.#drawCount === 4) {
                    this.#passButtonElement.style.button = "none";
                    this.#challengeButtonElement.style.button = "none";
                    this.#playerTurn = !this.#playerTurn;
                    this.#playerDraw = this.#playerTurn;
                    this.#drawCount = 1;
                    this.#playCard2.style.display = "none";
                }
            }
            this.#updateGame();
        }
    }

    // Pass play to computer
    passPlay() {
        this.#playerTurn = !this.#playerTurn;
        this.#playerDraw = this.#playerTurn;
        this.#updateGame();
    }

    // Initial game start function
    startGame() {
        let firstCard = this.#Deck.draw(
            this.#drawCount,
            this.#reshuffleDeck
        )[0];

        // If wild draw 4 card turns up at beginning
        while (firstCard.name === "Wild draw 4") {
            this.#Deck.addToDeck(firstCard);
            this.#Deck.shuffle();
            firstCard = this.#Deck.draw(
                this.#drawCount,
                this.#reshuffleDeck
            )[0];
        }
        this.#discardDeck.unshift(firstCard);
        this.#gameOver = false;

        // If reverse or skip card turns up as the first card play again since two players
        if (
            this.#discardDeck[0].name === "Reverse" ||
            this.#discardDeck[0].name === "Skip"
        ) {
            this.passPlay();
        }

        // If draw two card at the beginning
        if (this.#discardDeck[0].name === "Draw Two") {
            this.#playerCards = this.#playerCards.concat(
                this.#Deck.draw(2, this.#reshuffleDeck)
            );
            this.#drawnTwo = true;
            this.passPlay();
        }

        this.#updateGame();
    }
}

export { GameClass };

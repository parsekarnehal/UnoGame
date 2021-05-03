class DeckClass {
    #image;
    #deck = [];
    #cardName = [
        { name: "0", point: 0 },
        { name: "1", point: 1 },
        { name: "2", point: 2 },
        { name: "3", point: 3 },
        { name: "4", point: 4 },
        { name: "5", point: 5 },
        { name: "6", point: 6 },
        { name: "7", point: 7 },
        { name: "8", point: 8 },
        { name: "9", point: 9 },
        { name: "Skip", point: 20 },
        { name: "Reverse", point: 20 },
        { name: "Draw Two", point: 20 },
        { name: "Wild", point: 50 },
        { name: "Wild draw 4", point: 50 },
    ];

    constructor() {
        this.#image = new Image();
        this.#image.src = "image/cardDeck.png";
    }

    getImage() {
        return this.#image;
    }

    #getCardName(i, j) {
        if (j > 3 && i == 13) {
            return this.#cardName[14].name;
        } else {
            return this.#cardName[i].name;
        }
    }

    #getCardScore(i, j) {
        if (j > 3 && i == 13) {
            return this.#cardName[14].point;
        } else {
            return this.#cardName[i].point;
        }
    }

    #getCardColor(i, j) {
        if (i < 13) {
            if (j == 0 || j == 4) {
                return "Red";
            } else if (j == 1 || j == 5) {
                return "Yellow";
            } else if (j == 2 || j == 6) {
                return "Green";
            } else if (j == 3 || j == 7) {
                return "Blue";
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    createDeck(callback) {
        let cardHeight = this.#image.height / 8;
        let cardWidth = this.#image.width / 14;
        for (let i = 0; i < 14; i++) {
            for (let j = 0; j < 8; j++) {
                let canvas = document.createElement("canvas");
                canvas.width = cardWidth;
                canvas.height = cardHeight;
                let context = canvas.getContext("2d");
                context.drawImage(
                    this.#image,
                    i * cardWidth,
                    j * cardHeight,
                    cardWidth,
                    cardHeight,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                if (!(j > 3 && i == 0)) {
                    let imageElement = document.createElement("img");
                    let cardName = this.#getCardName(i, j);
                    imageElement.className = "cards";
                    imageElement.alt = cardName;
                    imageElement.src = canvas.toDataURL();
                    let card = {
                        color: this.#getCardColor(i, j),
                        name: cardName,
                        point: this.#getCardScore(i, j),
                        canvas: canvas.toDataURL(),
                        isComputer: true,
                        imgElement: imageElement,
                    };
                    this.#deck.push(card);
                }
            }
        }
        this.shuffle();
        callback();
    }

    shuffle() {
        for (let i = this.#deck.length - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random() * (i + 1));
            const oldValue = this.#deck[newIndex];
            this.#deck[newIndex] = this.#deck[i];
            this.#deck[i] = oldValue;
        }
    }

    draw(count, callback) {
        if (this.#deck.length == 0) {
            callback();
        }

        let drawArray = [];
        for (var i = 0; i < count; i++) {
            drawArray.push(this.#deck.shift());
        }
        return drawArray;
    }

    getDeck() {
        return this.#deck;
    }

    setDeck(deck) {
        this.#deck = deck;
    }

    addToDeck(card) {
        this.#deck.unshift(card);
    }
}

export { DeckClass };

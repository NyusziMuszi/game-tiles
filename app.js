"use strict";

document.addEventListener("DOMContentLoaded", () => {
  //////////////////////////////////////////////////
  //// SELECTOR /////
  const grid = document.querySelector(".grid");

  // const clock = document.getElementById("timer");

  // const minutesSpan = clock.querySelector(".minutes");
  // const secondsSpan = clock.querySelector(".seconds");

  //////////////////////////////////////////////////

  const audio = {
    doubleClick:
      "sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3",
    lose: "sounds/game-over-arcade-6435.mp3",
    singleMatch: "sounds/ui-click-97915.mp3",
    doubleMatch: "sounds/1569137762_4d8517ff53a75ac.mp3",
    win: "sounds/game-bonus-144751.mp3",

    timeIsRunningOut:
      "sounds/short-success-sound-glockenspiel-treasure-video-game-6346.mp3",

    soundEffectPlay: function (type) {
      const sound = new Audio(type);
      sound.play();
    },
  };

  class Tile {
    constructor(id, type) {
      this.id = id; //based on grid order
      this.type = type; //deck
      this.layers = [
        {
          layer: 0,
          imgURL: `images/${type}/layer0/`,
          matched: false,
          imgID: 0,
          matched: false,
        },
        {
          layer: 1,
          imgURL: `images/${type}/layer1/`,
          matched: false,
          imgID: 0,
          matched: false,
        },
        {
          layer: 2,
          imgURL: `images/${type}/layer2/`,
          matched: false,
          imgID: 0,
          matched: false,
        },
      ];

      this.background = [
        `images/${type}/background/1.png`,
        `images/${type}/background/2.png`,
      ];
      this.tileSelect = document.getElementById(id); // currently clicked
      // this.current = false;
    }

    attachEventHandlers() {
      this.tileSelect.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(event) {
      if (Board.clickedTiles.length < 1) {
        //first click
        this.tileSelect.classList.add("currentTile"); ///add highlight to current square
        Board.saveSelected(this);
      } else {
        //second click onwards
        Board.checkDoubleClick(this);
        this.tileSelect.classList.add("currentTile"); ///add highlight to current square
        Board.saveSelected(this);

        Board.clearHighlight(); ///remove highlight from previous square
        Board.compareSelection(this);
        Board.goAnywhere(this);
        Board.stateOutcome(this);
      }
    }
  }

  ///////////
  const Board = {
    width: 5,
    height: 6,

    tiles: [],
    imgArray: [1, 2, 3, 4, 5, 6],
    pairOccurence: [2, 4, 4, 6, 6, 8],
    clickedTiles: [],
    matchedLayers: [],
    lastClicked: 100,
    lastMatchTileID: 100,
    lastMatchLayerID: [],
    lastMatchImgID: [],
    state: "start",
    // currentState: ["normal", "double", "win", "lose"],

    get size() {
      return this.width * this.height;
    },
    //

    ///create 30 tile objects
    initialiser: function () {
      for (let i = 0; i <= this.size - 1; i++) {
        this.tiles[i] = new Tile(i, 2);
      }
      return this.tiles;
    },

    ///shuffle algo
    shuffle: function (arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    ///make 15 pairs of 1 to 6 numbers at random
    imagePairMaker: function (arr, occurance) {
      const images = [];
      occurance = this.shuffle([...occurance]);
      for (let i = 0; i < arr.length; i++) {
        for (let x = 0; x < occurance[i]; x++) {
          images.push(arr[i]);
        }
      }
      return this.shuffle(images);
    },

    ///make URLs and add them to the tiles
    assignImages: function (layer, source) {
      for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].layers[layer].imgURL += source[i];
        this.tiles[i].layers[layer].imgURL += ".png";
        this.tiles[i].layers[layer].imgID += source[i];
      }
    },

    ///render board
    renderer: function () {
      ///assigning 3 sets of paired images to the 3 layers
      for (let i = 0; i < 3; i++) {
        this.assignImages(
          i,
          this.imagePairMaker(this.imgArray, this.pairOccurence)
        );
      }
      ///make DOM
      for (let i = 0; i < this.tiles.length; i++) {
        const square = document.createElement("div");

        //background
        square.innerHTML += `<div class="layer">
        <img src="${this.tiles[i].background[i % 2]}" class="image" />
      </div>`;

        //layers
        for (let x = 0; x < 3; x++) {
          square.innerHTML += `<div class="layer" div id="${i}_${x}_${this.tiles[i].layers[x].imgID}" >
            <img src="${this.tiles[i].layers[x].imgURL}" class="image" />
          </div>`;
        }

        ///add attributes
        square.setAttribute("class", "square");
        square.setAttribute("id", i);

        grid.appendChild(square);

        ///add eventhandlers
        this.tiles[i].tileSelect = document.getElementById(i);
        this.tiles[i].attachEventHandlers();
      }
    },
    //////////////////
    //////////////////
    //////////////////
    //////////////////

    saveSelected: function (tile) {
      //save all tiles that has been clicked into clickedTiles array
      this.clickedTiles.push(tile);

      //save the tile that was clicked before the current one
      if (this.clickedTiles.length > 1) {
        this.lastClicked = this.clickedTiles[this.clickedTiles.length - 2];
      }
    },

    clearHighlight: function () {
      document
        .getElementById(this.lastClicked.id)
        .classList.remove("currentTile");
    },

    checkDoubleClick: function (tile) {
      if (this.clickedTiles[this.clickedTiles.length - 1].id === tile.id) {
        this.state = "doubleClick";
      }
    },

    goAnywhere: function (tile) {
      let allMatched = [];
      //is the current tile empty
      for (let x = 0; x < tile.layers.length; x++) {
        if (tile.layers[x].matched === true) {
          allMatched.push("yes");
        }
      }
      // console.log(allMatched, tile.id);

      if (allMatched.length === tile.layers.length) {
        console.log("go anywhere");
      }
    },

    compareSelection: function (tile) {
      for (let x = 0; x < tile.layers.length; x++) {
        //match, that has not been found yet
        if (
          tile.layers[x].imgID === this.lastClicked.layers[x].imgID &&
          tile.layers[x].matched == false &&
          this.lastClicked.layers[x].matched == false
        ) {
          this.lastMatchTileID = tile.id;
          this.lastMatchLayerID.push(x);
          this.lastMatchImgID.push(this.lastClicked.layers[x].imgID);
          this.state = "match";
        }
      }
      if (this.lastMatchLayerID.length === 0) {
        this.state = "lose";
      }
    },
    stateOutcome: function (tile) {
      switch (this.state) {
        case "match":
          console.log("match");

          //remove image from view
          for (let i = 0; i < this.lastMatchLayerID.length; i++) {
            console.log(
              `${tile.id}_${this.lastMatchLayerID[i]}_${this.lastMatchImgID[i]}`
            );
            document
              .getElementById(
                `${tile.id}_${this.lastMatchLayerID[i]}_${this.lastMatchImgID[i]}`
              )
              .classList.add("hidden");
            document
              .getElementById(
                `${this.lastClicked.id}_${this.lastMatchLayerID[i]}_${this.lastMatchImgID[i]}`
              )
              .classList.add("hidden");

            //disable layer
            this.lastClicked.layers[this.lastMatchLayerID[i]].matched = true;
            tile.layers[this.lastMatchLayerID[i]].matched = true;
          }
          //play success audio
          if (this.lastMatchLayerID.length < 2) {
            console.log("single", this.lastMatchLayerID.length);
            audio.soundEffectPlay(audio.singleMatch);
          } else {
            console.log("double", this.lastMatchLayerID.length);
            audio.soundEffectPlay(audio.doubleMatch);
          }

          //clear lastMatchLayerID
          this.lastMatchLayerID = [];
          this.lastMatchImgID = [];

          break;

        case "double":
          console.log("double");
          audio.soundEffectPlay(audio.doubleClick);

          break;
        case "goAnywhere":
          console.log("goAnywhere");
          audio.soundEffectPlay(audio.doubleClick);

          break;
        case "win":
          console.log("win");
          audio.soundEffectPlay(audio.win);

          break;
        case "lose":
          console.log("lose");
          audio.soundEffectPlay(audio.lose);
          //display overlay
          //restart button
          //all properties reloaded

          break;
      }
    },

    // setBackground: function () {}
  };

  Board.initialiser();
  Board.renderer();
  console.log(Board.tiles);
});

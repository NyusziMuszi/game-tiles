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
    doubleClick: "sounds/mixkit-negative-tone-interface-tap-2569.wav",
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
      this.type = type; //deck style
      this.matched = false; //is the tile fully cleared?
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
      this.state = "default";
      if (Board.clickedTiles.length < 1) {
        //first click
        this.tileSelect.classList.add("currentTile"); ///add highlight to current square
        Board.saveSelected(this);
      } else {
        //second click onwards
        this.tileSelect.classList.add("currentTile"); ///add highlight to current square
        //check for double clicking
        if (Board.detectDoubleClick(this)) {
          console.log("doubleClick");
          audio.soundEffectPlay(audio.doubleClick);

          return;
        } else {
          Board.saveSelected(this);

          Board.clearHighlight(); ///remove highlight from previous square
          Board.compareSelection(this);
          // Board.detectWin();
          Board.stateOutcome(this);
        }

        // Board.goAnywhere(this);
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
    matchedLayers: [],
    clickedTiles: [],
    lastClicked: 100,
    lastMatchTileID: 100,
    lastMatchLayerID: [],
    lastMatchImgID: [],
    state: "start",

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

        //background if any
        if (this.tiles[i].background.length > 0) {
          square.innerHTML += `<div class="layer">
        <img src="${
          this.tiles[i].background[i % this.tiles[i].background.length]
        }" class="image" />
      </div>`;
        }

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
      // console.log("saveSelected", this.clickedTiles);
      // console.log("saveSelected last", this.lastClicked);
    },

    clearHighlight: function () {
      if (this.state == "doubleClick") return;

      document
        .getElementById(this.lastClicked.id)
        .classList.remove("currentTile");
    },

    detectDoubleClick: function (tile) {
      if (this.clickedTiles[this.clickedTiles.length - 1].id === tile.id) {
        return true;
      } else {
        return false;
      }
    },

    compareSelection: function (tile) {
      //if the tile is empty don't compare
      if (this.lastClicked.matched === true) {
        return;
      }
      for (let x = 0; x < tile.layers.length; x++) {
        //match, that has not been found yet
        if (
          tile.layers[x].imgID === this.lastClicked.layers[x].imgID &&
          tile.layers[x].matched == false &&
          this.lastClicked.layers[x].matched == false
        ) {
          //setting layer to found
          tile.layers[x].matched = true;
          this.lastClicked.layers[x].matched = true;
          //storing info for image removal
          this.lastMatchTileID = tile.id;
          //could be multiple matches
          this.lastMatchLayerID.push(x);
          this.lastMatchImgID.push(tile.layers[x].imgID);

          this.state = "match";
        }
      }

      if (
        this.lastMatchLayerID.length === 0 &&
        this.lastClicked.matched !== true
      ) {
        this.state = "lose";
      }
    },

    detectEmptyTile: function (tile) {
      //if all matched (empty) set the whole tile to matched (check current and previous)
      if (
        tile.layers[0].matched === true &&
        tile.layers[1].matched === true &&
        tile.layers[2].matched === true
      ) {
        tile.matched = true;
      }

      if (
        this.lastClicked.layers[0].matched === true &&
        this.lastClicked.layers[1].matched === true &&
        this.lastClicked.layers[2].matched === true
      ) {
        //if all matched (empty) set the whole tile to matched
        this.lastClicked.matched = true;
      }
    },
    detectWin: function () {
      let counter = 0;

      for (let i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].matched) counter++;
      }
      console.log(counter);

      if (counter === this.tiles.length) {
        this.state = "win";
        console.log("win");
        audio.soundEffectPlay(audio.win);
      }
    },

    stateOutcome: function (tile) {
      switch (this.state) {
        case "match":
          console.log("match");

          //remove image from view
          for (let i = 0; i < this.lastMatchLayerID.length; i++) {
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
          }
          this.detectEmptyTile(tile);
          //go anywhere
          if (tile.matched === true) {
            // console.log("before", this.clickedTiles);
            // this.clickedTiles.pop();
            console.log("go anywhere");
            // console.log("after", this.clickedTiles);
          }
          //play success audio
          if (this.lastMatchLayerID.length < 2) {
            audio.soundEffectPlay(audio.singleMatch);
          } else {
            audio.soundEffectPlay(audio.doubleMatch);
          }
          this.detectWin();

          //clear lastMatchLayerID
          this.lastMatchLayerID = [];
          this.lastMatchImgID = [];

          break;

        // case "win":
        //   console.log("win");
        //   audio.soundEffectPlay(audio.win);

        //   break;
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

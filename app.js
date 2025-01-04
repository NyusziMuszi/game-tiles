"use strict";

document.addEventListener("DOMContentLoaded", () => {
  //////////////////////////////////////////////////
  //// SELECTOR /////
  const grid = document.querySelector(".grid");

  //////////////////////////////////////////////////
  //// Tiles /////

  class Tile {
    constructor(id, type) {
      this.id = id; //based on grid order
      this.type = type; //deck
      this.layers = [
        {
          layer: 0,
          imgURL: "images/layer0/",
          matched: false,
          id: 0,
          matched: false,
        },
        {
          layer: 1,
          imgURL: "images/layer1/",
          matched: false,
          id: 0,
          matched: false,
        },
        {
          layer: 2,
          imgURL: "images/layer2/",
          matched: false,
          id: 0,
          matched: false,
        },
      ];

      this.background = ["images/background/1.png", "images/background/2.png"];
      this.tileSelect = document.getElementById(id); // currently clicked
      // this.current = false;
    }

    attachEventHandlers() {
      this.tileSelect.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(event) {
      if (board.clickedTiles.length < 1) {
        //first click
        this.tileSelect.classList.add("currentTile"); ///add highlight to current square
        board.saveSelected(this);
      } else {
        //second click onwards
        this.tileSelect.classList.add("currentTile"); ///add highlight to current square
        board.saveSelected(this);
        board.clearHighlight();
        board.compareSelection(this);
        board.goAnywhere(this);
      }
    }
  }

  ///////////
  const board = {
    width: 5,
    height: 6,

    tiles: [],
    imgArray: [1, 2, 3, 4, 5, 6],
    pairOccurence: [2, 4, 4, 6, 6, 8],
    clickedTiles: [],
    matchedLayers: [],
    lastClicked: 100,
    get size() {
      return this.width * this.height;
    },

    ///create 30 tile objects
    initialiser: function () {
      for (let i = 0; i <= this.size - 1; i++) {
        this.tiles[i] = new Tile(i, "none");
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
        this.tiles[i].layers[layer].id += source[i];
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
        for (let x = 0; x < 3; x++) {
          square.innerHTML += `<div class="layer" div id="${i}_${x}_${this.tiles[i].layers[x].id}" >
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

    clearHighlight: function () {
      document
        .getElementById(this.lastClicked.id)
        .classList.remove("currentTile");
    },

    saveSelected: function (tile) {
      //don't allow double click
      if (
        this.clickedTiles.length !== 0 &&
        this.clickedTiles[this.clickedTiles.length - 1].id === tile.id
      ) {
        console.log("you can't click double");
      } else {
        //save all tiles that has been clicked into clickedTiles array
        this.clickedTiles.push(tile);

        //save the id of the tile that was clicked before the current one
        if (this.clickedTiles.length > 1) {
          this.lastClicked = this.clickedTiles[this.clickedTiles.length - 2];
        }
      }
      // console.log("clickedtiles", this.clickedTiles);
      // console.log("lastclicked", this.lastClicked);
      // console.log("current", tile.id);
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
        //see if the last 2 in the select array have matching images on the same layers, and that those have not yet been found
        if (
          tile.layers[x].id === this.lastClicked.layers[x].id &&
          tile.layers[x].matched == false &&
          this.lastClicked.layers[x].matched == false
        ) {
          //remove image from view
          document
            .getElementById(`${tile.id}_${x}_${tile.layers[x].id}`)
            .classList.add("hidden");
          document
            .getElementById(
              `${this.lastClicked.id}_${x}_${this.lastClicked.layers[x].id}`
            )
            .classList.add("hidden");

          //disable layer
          this.lastClicked.layers[x].matched = true;
          tile.layers[x].matched = true;
        }
      }
    },

    // setBackground: function () {}
  };

  const timer = {
    active: false,
    startTime: 10,

    // initialiser: function () {
    //   for (let i = 0; i <= this.size - 1; i++) {
    //     this.tiles[i] = new Tile(i, "none");
    //   }
    //   return this.tiles;
    // },
  };

  board.initialiser();
  board.renderer();
  console.log(board.tiles);
});

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
      this.tileSelect = document.getElementById(id);
      this.current = false;
      this.highlight = false;
    }

    attachEventHandlers() {
      this.tileSelect.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(event) {
      board.saveSelected(this);
      board.clearHighlight();
      this.highlight = true;
      this.choosen = true;
      this.renderHighlight();

      board.compareSelection(this);
    }
    renderHighlight() {
      this.tileSelect.classList.add("currentTile"); ///add highlight to current square
    }
  }

  ///////////
  const board = {
    width: 5,
    height: 6,

    tiles: [],
    ImgArray: [1, 2, 3, 4, 5, 6],
    pairOccurence: [2, 4, 4, 6, 6, 8],
    clickedTiles: [],
    matchedLayers: [],
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
          this.imagePairMaker(
            this.ImgArray,
            this.pairOccurence,
            this.ImgArrayPaired
          )
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
      for (let i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].highlight === true) {
          this.tiles[i].highlight === false;
          document.getElementById(i).classList.remove("currentTile");
        }
      }
    },

    saveSelected: function (tile) {
      //don't allow double click
      if (
        this.clickedTiles.length !== 0 &&
        this.clickedTiles[this.clickedTiles.length - 1].id === tile.id
      ) {
        console.log("you can't click double");
      } else {
        this.clickedTiles.push(tile);
      }
      console.log(this.clickedTiles);
    },

    compareSelection: function (tile) {
      //after the first 2 are saved
      if (this.clickedTiles.length >= 2) {
        for (let x = 0; x < tile.layers.length; x++) {
          let layers;
          //match the last 2 in the select array have matching images on the same layers, and those have not yet been found
          if (
            tile.layers[x].id ===
              this.clickedTiles[this.clickedTiles.length - 2].layers[x].id &&
            tile.layers[x].matched == false &&
            this.clickedTiles[this.clickedTiles.length - 2].layers[x].matched ==
              false
          ) {
            console.log(tile.id, "match");
            //remove image from view

            document
              .getElementById(`${tile.id}_${x}_${tile.layers[x].id}`)
              .classList.add("hidden");
            document
              .getElementById(
                `${this.clickedTiles[this.clickedTiles.length - 2].id}_${x}_${
                  this.clickedTiles[this.clickedTiles.length - 2].layers[x].id
                }`
              )
              .classList.add("hidden");
            //disable layer
            this.clickedTiles[this.clickedTiles.length - 2].layers[
              x
            ].matched = true;
            tile.layers[x].matched = true;
          }
        }
      }
    },

    // setBackground: function () {}
  };

  board.initialiser();
  board.renderer();
  console.log(board.tiles);
});

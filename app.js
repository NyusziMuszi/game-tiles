"use strict";

document.addEventListener("DOMContentLoaded", () => {
  //////////////////////////////////////////////////
  //// SELECTOR /////
  const grid = document.querySelector(".grid");

  //////////////////////////////////////////////////
  //// Tiles /////

  class Tile {
    constructor(id) {
      this.id = id; //based on grid order
      this.layers = [
        { level: 1, imgURL: "images/level1/", matched: false },
        { level: 2, imgURL: "images/level2/", matched: false },
        { level: 3, imgURL: "images/level3/", matched: false },
      ];

      this.background = 1;
      this.tileSelect = document.getElementById(id);
      this.current = false;
      this.highlight = false;
    }

    attachEventHandlers() {
      this.tileSelect.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(event) {
      board.clearHighlight();
      this.highlight = true;
      this.renderHighlight();

      this.current = true;
    }
    renderHighlight() {
      this.tileSelect.classList.add("currentTile"); ///add highlight to current square
    }
  }

  ////////////////////////////
  //generate 30 tile objects

  const board = {
    width: 5,
    height: 6,

    tiles: [],
    matchedLayers: [],
    get size() {
      return this.width * this.height;
    },

    boardInitialiser: function () {
      for (let i = 1; i <= this.size; i++) {
        this.tiles[i - 1] = new Tile(i);
      }
      return this.tiles;
    },

    clearHighlight: function () {
      for (let i = 0; i < this.tiles.length; i++) {
        if (this.tiles[i].highlight === true) {
          this.tiles[i].highlight === false;
          document.getElementById(i).classList.remove("currentTile");
          console.log("highlight");
        }
      }
    },

    // setBackground: function () {}
  };
  board.boardInitialiser();

  // console.log(board.tiles);

  ////////////////////////////
  // shuffle
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  ////////////////////////////
  // image pairs
  let ImgArray = [1, 2, 3, 4, 5, 6];
  let pairOccurence = [2, 4, 4, 6, 6, 8];
  const ImgArrayPaired = [];

  function imagePairMaker(arr, occurance, output) {
    occurance = shuffle([...occurance]);
    for (let i = 0; i < arr.length; i++) {
      for (let x = 0; x < occurance[i]; x++) {
        output.push(arr[i]);
      }
    }
    return shuffle(output);
  }

  function assignImages(layer, source) {
    for (let i = 0; i < board.tiles.length; i++) {
      board.tiles[i].layers[layer].imgURL += source[i];
      board.tiles[i].layers[layer].imgURL += ".png";
    }
  }

  for (let i = 0; i < 3; i++) {
    assignImages(i, imagePairMaker(ImgArray, pairOccurence, ImgArrayPaired));
  }

  /////////////////////////////////////////////////
  //render the board
  function renderBoard() {
    for (let i = 0; i < board.tiles.length; i++) {
      const square = document.createElement("div");

      square.innerHTML += `
            <div class="layer" data-layer="one">
              <img src="${board.tiles[i].layers[0].imgURL}" class="image" />
            </div>
            <div class="layer" data-layer="two">
              <img src="${board.tiles[i].layers[1].imgURL}" class="image" />
            </div>
            <div class="layer" data-layer="three">
              <img src="${board.tiles[i].layers[2].imgURL}" class="image" />
            </div>
        `;
      square.setAttribute("class", "square");
      square.setAttribute("id", i);
      grid.appendChild(square);
      board.tiles[i].tileSelect = document.getElementById(i);
      board.tiles[i].attachEventHandlers();
    }
  }

  renderBoard();

  //   //////////////////////////////////////////////////
  //   //// FUNCTION /////
  //   //check array for matches
  //   const check_duplicate_in_array = (input_array) => {
  //     const duplicates = input_array.filter(
  //       (item, index) => input_array.indexOf(item) !== index
  //     );
  //     return Array.from(new Set(duplicates));
  //   };

  //   //check game for matches
  //   function checkForMatch() {
  //     // const tiles = document.querySelectorAll("img");
  //     let matches = check_duplicate_in_array(layersChosen);
  //     //check if it is already contained in the array (false click)

  //     //win condition
  //     // if (layersFound == 45) {
  //     //   alert("wow, you won");
  //     // }

  //     if (squaresChosen[0] === squaresChosen[1]) {
  //       //selected the same one
  //       console.log("dont't select the same");
  //     } else if (matches.length !== 0) {
  //       //found a match

  //       // matches.forEach((m) => {
  //       //   if (layersFound.includes(m)) {
  //       //     matches = matches.filter((m) => !forDeletion.includes(m));

  //       //     console.log("false match");
  //       //   }
  //       // });
  //       console.log("It is a match");
  //       layersFound.push(...matches);

  //       for (let i = 0; i < 3; i++) {
  //         for (let x = 0; x < matches.length; x++) {
  //           if (
  //             document
  //               .getElementById(squaresChosen[0])
  //               .children[i].getAttribute("data-layer-name") == matches[x]
  //           ) {
  //             document
  //               .getElementById(squaresChosen[0])
  //               .children[i].classList.add("hidden");

  //             document
  //               .getElementById(squaresChosen[1])
  //               .children[i].classList.add("hidden");
  //           }
  //         }
  //       }
  //     } else {
  //       //if you guess wrong
  //       alert("Sorry this is not a match, it is game over.");
  //       //--start over button
  //     }
  //   }

  //   function selectTile() {
  //
  //     squaresChosen.push(this.getAttribute("id")); // add chosen square ids to array

  //     for (let i = 0; i < 3; i++) {
  //       layersChosen.push(this.children[i].getAttribute("data-layer-name")); // add chosen layer names to array
  //     }
  //     console.log("layersChosen:", layersChosen, "squaresChosen:", squaresChosen);

  //     if (squaresChosen.length === 2) {
  //       checkForMatch();
  //     }
  //     if (squaresChosen.length >= 2) {
  //       // keep updating to the latest 2 squares
  //       squaresChosen.shift();
  //       layersChosen.splice(0, 3);
  //     }
  //   }
});

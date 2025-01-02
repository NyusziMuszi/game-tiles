"use strict";

document.addEventListener("DOMContentLoaded", () => {
  //////////////////////////////////////////////////
  //// Cards /////

  class Tile {
    constructor(id) {
      this.id = id; //based on grid order
      this.layer1 = { level: 1, imgURL: "images/level1/", matched: false };
      this.layer2 = { level: 2, imgURL: "images/level2/", matched: false };
      this.layer3 = { level: 3, imgURL: "images/level3/", matched: false };
    }
  }

  ////////////////////////////
  //generate 30 tile objects
  const tiles = [];

  function tileMaker(n, array) {
    for (let i = 1; i <= n; i++) {
      tiles[i - 1] = new Tile(i);
    }
    return tiles;
  }
  tileMaker(30, tiles);

  ////////////////////////////
  //image shuffle
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
  const ImgArrayLevel1 = [];
  const ImgArrayLevel2 = [];
  const ImgArrayLevel3 = [];

  let pairOccurence = [2, 4, 4, 6, 6, 8];

  function imagePairMaker(arr, occurance, output) {
    occurance = shuffle([...occurance]);

    for (let i = 0; i < arr.length; i++) {
      for (let x = 0; x < occurance[i]; x++) {
        output.push(arr[i]);
      }
    }

    return shuffle(output);
  }

  imagePairMaker(ImgArray, pairOccurence, ImgArrayLevel1);
  imagePairMaker(ImgArray, pairOccurence, ImgArrayLevel2);
  imagePairMaker(ImgArray, pairOccurence, ImgArrayLevel3);

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].layer1.imgURL += ImgArrayLevel1[i];
    tiles[i].layer1.imgURL += ".png";

    tiles[i].layer2.imgURL += ImgArrayLevel2[i];
    tiles[i].layer2.imgURL += ".png";

    tiles[i].layer3.imgURL += ImgArrayLevel3[i];
    tiles[i].layer3.imgURL += ".png";
  }
  console.log(tiles);

  //   //////////////////////////////////////////////////
  //   //// SELECTOR /////
  const grid = document.querySelector(".grid");

  //   /////////////////////////////////////////////////
  //create the board
  function createBoard() {
    for (let i = 0; i < tiles.length; i++) {
      const square = document.createElement("div");

      square.innerHTML += `
            <div class="layer" data-layer-name="${tiles[i].id}" data-layer-type="one">
              <img src="${tiles[i].layer1.imgURL}" class="image" />
            </div>
            <div class="layer" data-layer-name="${tiles[i].id}" data-layer-type="two">
              <img src="${tiles[i].layer2.imgURL}" class="image" />
            </div>
            <div class="layer" data-layer-name="${tiles[i].id}" data-layer-type="three">
              <img src="${tiles[i].layer3.imgURL}" class="image" />
            </div>
        `;
      square.setAttribute("class", "square");
      square.setAttribute("id", i);
      // square.addEventListener("click", selectTile);
      grid.appendChild(square);
    }
  }

  createBoard();
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

  //   let selectedTile = "-1"; // initially nothing is selected

  //   function selectTile() {
  //     ///toggling selected Tile class
  //     if (selectedTile == -1) {
  //       //skip the first round
  //     } else if (this.getAttribute("id") !== selectedTile) {
  //       document.getElementById(selectedTile).classList.remove("currentTile"); ///remove highlight to previous square
  //     }
  //     selectedTile = this.getAttribute("id"); // storing current selection
  //     this.classList.add("currentTile"); ///add highlight to current square

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

  //   createBoard();
});

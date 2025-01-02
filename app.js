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

  const tiles = [];

  //generate 30 tile objects
  function tileMaker(n, array) {
    for (let i = 1; i <= n; i++) {
      tiles[i - 1] = new Tile(i);
    }
    return tiles;
  }

  tileMaker(30, tiles);

  //image shuffle
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let ImgArray = [1, 2, 3, 4, 5, 6];
  let pairOccurence = [2, 4, 4, 6, 6, 8];

  // image pairs
  function imagePairMaker(arr, occurance) {
    let ImgPairArray = [];
    occurance = shuffle([...occurance]);

    for (let i = 0; i < arr.length; i++) {
      for (let x = 0; x < occurance[i]; x++) {
        ImgPairArray.push(arr[i]);
      }
    }
    return ImgPairArray;
  }

  console.log(imagePairMaker(ImgArray, pairOccurence));

  //   //////////////////////////////////////////////////
  //   //// SELECTOR /////
  //   const grid = document.querySelector(".grid");

  //   //////////////////////////////////////////////////
  //// ARRAYS /////
  let layersChosen = [];
  let squaresChosen = [];
  let layersFound = [];

  //create the board
  function createBoard() {
    for (let i = 0; i < tiles.length; i++) {
      const square = document.createElement("div");

      square.innerHTML += `
            <div class="layer" data-layer-name="${tileArray1[random].name}" data-layer-type="one">
              <img src="${tileArray1[random].img}" class="image" />
            </div>
            <div class="layer" data-layer-name="${tileArray2[random].name}" data-layer-type="two">
              <img src="${tileArray2[random].img}" class="image" />
            </div>
            <div class="layer" data-layer-name="${tileArray3[random].name}" data-layer-type="three">
              <img src="${tileArray3[random].img}" class="image" />
            </div>
        `;
      square.setAttribute("class", "square");
      square.setAttribute("id", i);

      tileArray1.sort(() => 0.5 - Math.random());
      tileArray2.sort(() => 0.5 - Math.random());
      tileArray3.sort(() => 0.5 - Math.random());
      square.addEventListener("click", selectTile);
      grid.appendChild(square);
    }
  }

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

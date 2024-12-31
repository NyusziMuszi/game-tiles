document.addEventListener("DOMContentLoaded", () => {
  //list all card options
  const tileArray1 = [
    {
      name: "1",
      img: "images/one 1.png",
    },
    {
      name: "2",
      img: "images/one 2.png",
    },
    {
      name: "3",
      img: "images/one 3.png",
    },
    {
      name: "4",
      img: "images/one 4.png",
    },
    {
      name: "5",
      img: "images/one 5.png",
    },
    {
      name: "6",
      img: "images/one 6.png",
    },
  ];
  const tileArray2 = [
    {
      name: "1",
      img: "images/two 1.png",
    },
    {
      name: "2",
      img: "images/two 2.png",
    },
    {
      name: "3",
      img: "images/two 3.png",
    },
    {
      name: "4",
      img: "images/two 4.png",
    },
    {
      name: "5",
      img: "images/two 5.png",
    },
    {
      name: "6",
      img: "images/two 6.png",
    },
  ];

  const tileArray3 = [
    {
      name: "1",
      img: "images/three 1.png",
    },
    {
      name: "2",
      img: "images/three 2.png",
    },
    {
      name: "3",
      img: "images/three 3.png",
    },
    {
      name: "4",
      img: "images/three 4.png",
    },
    {
      name: "5",
      img: "images/three 5.png",
    },
    {
      name: "6",
      img: "images/three 6.png",
    },
  ];

  tileArray1.sort(() => 0.5 - Math.random());
  tileArray2.sort(() => 0.5 - Math.random());
  tileArray3.sort(() => 0.5 - Math.random());

  const grid = document.querySelector(".grid");
  const resultDisplay = document.querySelector("#result");
  let layersChosen = [];
  let layersChosen = [];
  let cardsWon = [];
  let random = 0;

  //create your board
  function createBoard() {
    for (let i = 0; i < 30; i++) {
      random = Math.floor(Math.random() * 6);
      const square = document.createElement("div");

      square.innerHTML += `
     
        
           <div class="layer one" data-layer-value="${tileArray1[random].name}" data-layer-type="one">
           <img src="${tileArray1[random].img}" class="image" />
        </div>
         <div class="layer two" data-layer-value="${tileArray2[random].name}" data-layer-type="two">
           <img src="${tileArray2[random].img}" class="image" />
        </div>
                 <div class="layer three" data-layer-value="${tileArray3[random].name}" data-layer-type="three">
           <img src="${tileArray3[random].img}" class="image" />
   
        


      </div> 
      `;
      square.setAttribute("data-id", i);
      square.setAttribute("class", "square");

      tileArray1.sort(() => 0.5 - Math.random());
      tileArray2.sort(() => 0.5 - Math.random());
      tileArray3.sort(() => 0.5 - Math.random());
      square.addEventListener("click", selectTile);
      grid.appendChild(square);
    }
  }

  //check for matches
  function checkForMatch() {
    const cards = document.querySelectorAll("img");
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (optionOneId == optionTwoId) {
      cards[optionOneId].setAttribute("src", "images/blank.png");
      cards[optionTwoId].setAttribute("src", "images/blank.png");
      alert("You have clicked the same image!");
    } else if (layersChosen[0] === layersChosen[1]) {
      alert("You found a match");
      cards[optionOneId].setAttribute("src", "images/white.png");
      cards[optionTwoId].setAttribute("src", "images/white.png");
      cards[optionOneId].removeEventListener("click", flipCard);
      cards[optionTwoId].removeEventListener("click", flipCard);
      cardsWon.push(layersChosen);
    } else {
      cards[optionOneId].setAttribute("src", "images/blank.png");
      cards[optionTwoId].setAttribute("src", "images/blank.png");
      alert("Sorry, try again");
    }
    layersChosen = [];
    cardsChosenId = [];
    resultDisplay.textContent = cardsWon.length;
    if (cardsWon.length === cardArray.length / 2) {
      resultDisplay.textContent = "Congratulations! You found them all!";
    }
  }

  function selectTile() {
    this.classList.add("currentTile");
    let tileIDs = [];
    for (let i = 0; i < 3; i++) {
      tileIDs.push(this.children[i].getAttribute("data-layer-value"));
    }
    console.log(tileIDs);
    layersChosen.push(tileIDs);
    // cardsChosenId.push(cardId);
    // this.setAttribute("src", cardArray[cardId].img);
    // if (cardsChosen.length === 2) {
    //   setTimeout(checkForMatch, 500);
    // }
  }

  createBoard();
});

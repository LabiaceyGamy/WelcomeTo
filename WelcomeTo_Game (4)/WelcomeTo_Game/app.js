document.addEventListener("DOMContentLoaded", () => {

  //shuffle button
  document.getElementById("shuffle-btn").addEventListener("click", () => {
  // Combine all cards back into one array
  let allCards = [...piles[0], ...piles[1], ...piles[2]];

  // Clear piles
  piles[0] = [];
  piles[1] = [];
  piles[2] = [];

  // Shuffle
  shuffle(allCards);

  // Re-split evenly into 3 piles
  for (let i = 0; i < allCards.length; i++) {
    piles[i % 3].push(allCards[i]);
  }

  // Clear back cards from view (optional)
  for (let i = 1; i <= 3; i++) {
    const backContainer = document.getElementById(`back-cards-${i}`);
    if (backContainer) backContainer.innerHTML = "";
  }

  // Re-render
  renderPiles();
});

// List of card filenames
const cardFileNames = [
  "1_Fence.png", "1_Market.png", "1_Park.png",
  "2_Fence.png", "2_Market.png", "2_Park.png",
  "3_Bis.png", "3_Construction.png", "3_Fence.png", "3_Pool.png",
  "4_Bis.png", "4_Construction.png", "4_Market.png", "4_Park.png", "4_Pool.png",
  "5_Fence.png", "5_Market.png", "5_Park.png",
  "6_Bis.png", "6_Construction.png", "6_Fence.png", "6_Market.png", "6_Park.png", "6_Pool.png",
  "7_Construction.png", "7_Fence.png", "7_Market.png", "7_Park.png", "7_Pool.png",
  "8_Bis.png", "8_Construction.png", "8_Fence.png", "8_Market.png", "8_Park.png", "8_Pool.png",
  "9_Construction.png", "9_Fence.png", "9_Market.png", "9_Park.png",
  "10_Construction.png", "10_Fence.png", "10_Pool.png",
  "11_Fence.png", "11_Market.png", "11_Park.png",
  "12_Construction.png", "12_Market.png", "12_Park.png",
  "13_Bis.png", "13_Construction.png", "13_Fence.png", "13_Pool.png",
  "14_Fence.png", "14_Market.png", "14_Park.png",
  "15_Fence.png", "15_Market.png", "15_Park.png"
];

const backCardPaths = {
  Bis: "cards/B_Bis.png",
  Construction: "cards/B_Construction.png",
  Fence: "cards/B_Fence.png",
  Market: "cards/B_Market.png",
  Park: "cards/B_Park.png",
  Pool: "cards/B_Pool.png"
};

const piles = [[], [], []];
const pilesDivs = [
  document.getElementById("pile-1"),
  document.getElementById("pile-2"),
  document.getElementById("pile-3")
];

// Utility: shuffle array in place
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Step 1: shuffle a copy of cardFileNames
const shuffledCards = [...cardFileNames];
shuffle(shuffledCards);

// Step 2: Distribute cards one by one into piles randomly, removing each chosen card
while (shuffledCards.length > 0) {
  for (let i = 0; i < piles.length; i++) {
    if (shuffledCards.length === 0) break;
    // Pick a random index from shuffledCards
    const randIndex = Math.floor(Math.random() * shuffledCards.length);
    const card = shuffledCards.splice(randIndex, 1)[0]; // Remove from shuffledCards
    piles[i].push(card);
  }
}

function renderPiles() {
  piles.forEach((pile, pileIndex) => {
    const pileDiv = pilesDivs[pileIndex];
    pileDiv.innerHTML = ""; // clear previous cards

    // Create or get back cards container for this pile
    let backCardsContainer = document.getElementById(`back-cards-${pileIndex + 1}`);
    if (!backCardsContainer) {
      backCardsContainer = document.createElement("div");
      backCardsContainer.id = `back-cards-${pileIndex + 1}`;
      backCardsContainer.style.width = "100px";
      backCardsContainer.style.minHeight = "160px";
      backCardsContainer.style.border = "2px dashed lime";
      backCardsContainer.style.marginRight = "10px";
      backCardsContainer.style.display = "block";
      pileDiv.parentNode.insertBefore(backCardsContainer, pileDiv);
    }

    // We do NOT clear backCardsContainer here, because
    // back cards are managed inside the click handler now.

    pile.forEach((fileName, i) => {
      const img = document.createElement("img");
      img.src = `cards/${fileName}`;
      img.classList.add("card");
      img.style.position = "absolute";
      img.style.top = `${i * 2}px`;
      img.style.left = "0px";
      img.style.zIndex = i;

      if (i === pile.length - 1) {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => {
          // Flip top cards for all 3 piles
          for (let j = 0; j < 3; j++) {
            const thisPile = piles[j];
            if (thisPile.length > 0) {
              const flippedCard = thisPile.pop();
              const type = flippedCard.split("_")[1].replace(".png", "");
              const backPath = backCardPaths[type];

              // Get the back cards container for this pile, create if missing
              let backContainer = document.getElementById(`back-cards-${j + 1}`);
              if (!backContainer) {
                backContainer = document.createElement("div");
                backContainer.id = `back-cards-${j + 1}`;
                backContainer.style.width = "100px";
                backContainer.style.minHeight = "160px";
                backContainer.style.border = "2px dashed lime";
                backContainer.style.marginRight = "10px";
                backContainer.style.display = "block";
                pilesDivs[j].parentNode.insertBefore(backContainer, pilesDivs[j]);
              }

              // Remove previous back card if exists
              const lastBack = backContainer.querySelector("img.back-card");
              if (lastBack) backContainer.removeChild(lastBack);

              // Remove the top card visually from the pile div
              const pileDivToUpdate = pilesDivs[j];
              const topCardImg = pileDivToUpdate.querySelector("img:last-child");
              if (topCardImg) pileDivToUpdate.removeChild(topCardImg);

              // Add new back card if path is valid
              if (backPath) {
                const backImg = document.createElement("img");
                backImg.src = backPath;
                backImg.className = "back-card";
                backImg.style.width = "100px";
                backImg.style.height = "160px";
                backImg.style.display = "block";
                backImg.style.border = "1px solid #000"; // optional for visibility
                backContainer.appendChild(backImg);
              }
            }
          }
          // Re-render all piles after flipping cards
          renderPiles();
        });
      }

      pileDiv.style.position = "relative";
      pileDiv.appendChild(img);
    });
  });
}


renderPiles();
































  const container = document.getElementById("app-container");

  function setPosition(element, x, y) {
    element.classList.add("positioned");

    //y -= 50;

    element.style.left = `${x}px`;
    element.style.top = `-${y}px`;
  }

  //creates the png of the circle on the pool when the blue button is pressed
  function createCircleButton(x, y) {
    const btn = document.createElement("button");
    btn.className = "white-button";

    // 1) We assume setPosition(btn, x, y) does:
    //      btn.style.position = "absolute"
    //      btn.style.left = `${x}px`
    //      btn.style.top  = `${y}px`
    setPosition(btn, x, y);
    container.appendChild(btn);

    btn.addEventListener("click", () => {
      // 2) Create the <img>
      const img = document.createElement("img");
      img.src       = "images/circle.png";
      img.alt       = "Circle";
      img.className = "displayed-image";
      img.style.position = "absolute";
      img.style.zIndex   = "1000"; // ensure it’s on top

      // 3) Compute the button’s rectangle relative to the container
      const btnRect       = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // 4) Now find the button’s center in container-coordinates:
      const centerX = btnRect.left   - containerRect.left + btnRect.width  / 2;
      const centerY = btnRect.top    - containerRect.top  + btnRect.height / 2;

      // 5) Place the image so its center lines up with the button’s center
      img.style.left     = `${centerX}px`;
      img.style.top      = `${centerY - 15}px`;
      img.style.transform = "translate(-50%, -50%)";

      // 6) Append the <img> directly into the container
      container.appendChild(img);
      btn.remove();
    });
  }

  function createFence(x, y) {
    const box = document.createElement("div");
    box.className = "white-box positioned";

    // Initial styles
    box.style.width = "6px";
    box.style.height = "65px";
    box.style.backgroundColor = "purple";
    box.style.opacity = "0.5";
    box.style.transition = "opacity 0.3s ease";
    box.style.cursor = "pointer"; 

    // Toggle opacity on click
    box.addEventListener("click", () => {
      box.style.opacity = box.style.opacity === "1" ? "0.5" : "1";
    });

    setPosition(box, x, y); // Use your pixel-based positioning
    container.appendChild(box);
  }

  function createHoriFence(x, y) {
    const box = document.createElement("div");
    box.className = "white-box positioned";

    // Initial styles
    box.style.width = "40px";
    box.style.height = "6px";
    box.style.backgroundColor = "purple";
    box.style.opacity = "0.5";
    box.style.transition = "opacity 0.3s ease";
    box.style.cursor = "pointer";

    // Toggle opacity on click
    box.addEventListener("click", () => {
      box.style.opacity = box.style.opacity === "1" ? "0.5" : "1";
    });

    setPosition(box, x, y); // Use your pixel-based positioning
    container.appendChild(box);
  }

  function createTextbox(x, y) {
    const textbox = document.createElement("input");
    textbox.type = "text";
    textbox.placeholder = "Place number";
    setPosition(textbox, x, y);
    container.appendChild(textbox);
  }

  function createCheckbox(x, y) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "check-" + x + "-" + y;
    checkbox.className = "positioned";
    setPosition(checkbox, x, y);
    container.appendChild(checkbox);
  }

  function createRotatedCheckbox(x, y) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "positioned rotated-checkbox";
    setPosition(checkbox, x, y);  
    container.appendChild(checkbox);

    //console.log("x: " + x + " - y: " + y);
  }

  function createCircularCheckbox(x, y, label) {
    const box = document.createElement("custom-checkbox");
    box.className = "custom-checkbox positioned";
    box.textContent = label;
    setPosition(box, x, y);

    box.addEventListener("click", () => {
      box.classList.toggle("checked");
    });

    container.appendChild(box);
    //console.log("x: " + x + "\ny: " + y + "\nLabel: " + label);
  }

  function instantiateElements(config) {
    if (config.circle) {
      const circles = Array.isArray(config.circle) ? config.circle : [config.circle];
      circles.forEach(pos => createCircleButton(pos.x, (pos.y * 1.01) + 225));
    }

    if (config.whitebox) {
      const boxes = Array.isArray(config.whitebox) ? config.whitebox : [config.whitebox];
      boxes.forEach(pos => createWhiteBoxButton(pos.x,(pos.y * 1.01) + 225));
    }

    if (config.textbox) {
      const texts = Array.isArray(config.textbox) ? config.textbox : [config.textbox];
      texts.forEach(pos => createTextbox(pos.x - 11, (pos.y * 1.01) + 225));
    }

    if (config.checkbox) {
      const checks = Array.isArray(config.checkbox) ? config.checkbox : [config.checkbox];
      checks.forEach(pos => createCheckbox(pos.x, (pos.y * 1.01) + 225));
    }

    if (config.rotatedCheckbox) {
      const raws = Array.isArray(config.rotatedCheckbox) ? config.rotatedCheckbox : [config.rotatedCheckbox];
      raws.forEach(pos => createRotatedCheckbox(pos.x, (pos.y * 1.01) + 225));
    }

    if (config.circularCheckbox) {
      const circles = Array.isArray(config.circularCheckbox) ? config.circularCheckbox : [config.circularCheckbox];
      circles.forEach(pos => createCircularCheckbox(pos.x, (pos.y * 1.01) + 225, pos.label));
    }
  }

  function placeFences(count, startX, y, spacing, hori) {
    y += 225;
    for (let i = 0; i < count; i++) {
      const x = startX + i * spacing;
      if(!hori){
        createFence(x, y);
      }
      else{
        createHoriFence(x, y);
      }
      
    }
  }
   
  //place vertical fences
  placeFences(9, 559, 575, 40.5, false);
  placeFences(10, 520, 465, 40.5, false);
  placeFences(11, 478, 355, 40.5, false);

  //the Horizontal fences
  placeFences(10, 520, 580, 40.5, true);
  placeFences(11, 480, 470, 40.5, true);
  placeFences(12, 440, 360, 40.5, true);

  function createName(x, y, width, height) {
    const container = document.getElementById("app-container");

    const textbox = document.createElement("input");
    textbox.type = "text";
    textbox.placeholder = "Put in town name";
    textbox.style.position = "absolute";
    textbox.style.left = `${x}px`;
    textbox.style.top = `-${y}px`;

    textbox.style.width = `${width}px`;
    textbox.style.height = `${height}px`;

    container.appendChild(textbox);
  }

createName(405, 760, 80, 25);


  instantiateElements({
    
    circle: [

      //add 20 subtract 33
      //1st row
      { x: "618", y: "572" },
      { x: "783", y: "572"},
      { x: "822", y: "572"},
      //2nd row
      { x: "496", y: "465"}, 
      { x: "620", y: "465"}, 
      { x: "785", y: "465"}, 
      //3rd row
      { x: "496", y: "355"}, 
      { x: "700", y: "355"}, 
      { x: "863", y: "355"}, 
    ],
    //checkboxes
    checkbox: [
    //1st row of parks
    { x: "860", y: "615" },
    { x: "880", y: "615" },
    { x: "900", y: "615" },
    { x: "922", y: "615" },
    //2nd row of parks
    { x: "840", y: "505" },
    { x: "860", y: "505" },
    { x: "880", y: "505" },
    { x: "900", y: "505" },
    { x: "922", y: "505" },
    //3rd row of parks
    { x: "820", y: "395" },
    { x: "840", y: "395" },
    { x: "860", y: "395" },
    { x: "880", y: "395" },
    { x: "900", y: "395" },
    { x: "922", y: "395" },

    //business

    //first row
    { x: "638", y: "169" },
    //second
    { x: "665", y: "178" },
    { x: "665", y: "160" },
    //third
    { x: "690", y: "188" },
    { x: "690", y: "170" },
    { x: "690", y: "152" },
    //fourth
    { x: "720", y: "197" },   
    { x: "720", y: "180" },
    { x: "720", y: "163" }, 
    { x: "720", y: "147" },
    //fifth
    { x: "747", y: "207" },   
    { x: "747", y: "190" },
    { x: "747", y: "173" }, 
    { x: "747", y: "157" },
    //sixth
    { x: "774", y: "216" },   
    { x: "774", y: "198.5" },
    { x: "774", y: "182" }, 
    { x: "774", y: "166" },


    //bis
    //first column
    { x: "820", y: "215" },   
    { x: "820", y: "190" },
    { x: "820", y: "165" }, 
    { x: "820", y: "140" },
    { x: "820", y: "115" },   
    //second column
    { x: "870", y: "215" },
    { x: "870", y: "190" }, 
    { x: "870", y: "165" },
    { x: "870", y: "140" },

    //pools
    //first column
    { x: "498", y: "195" },   
    { x: "498", y: "175" },
    { x: "498", y: "155" }, 
    { x: "498", y: "135" },
    { x: "498", y: "115" },   
    //second column
    { x: "542", y: "195" },
    { x: "542", y: "175" }, 
    { x: "542", y: "155" },
    { x: "542", y: "135" },
    ],

    textbox: [
      //1st row
      { x: "530", y: "557" },
      { x: "570", y: "557" },
      { x: "612", y: "550" },
      { x: "653", y: "557" },
      { x: "693", y: "557" },
      { x: "735", y: "557" },
      { x: "775", y: "550" },
      { x: "816", y: "550" },
      { x: "856", y: "557" },
      { x: "897", y: "557" },

      //2nd row
      { x: "490", y: "440" },
      { x: "530", y: "445" },
      { x: "571", y: "446" },
      { x: "612", y: "440" },
      { x: "653", y: "445" },
      { x: "693", y: "445" },
      { x: "735", y: "445" },
      { x: "775", y: "440" },
      { x: "815", y: "445" },
      { x: "855", y: "445" },
      { x: "895", y: "445" },

      //3rd row
      { x: "448", y: "338" },
      { x: "490", y: "332" },
      { x: "530", y: "338" },
      { x: "571", y: "338" },
      { x: "612", y: "338" },
      { x: "653", y: "338" },
      { x: "693", y: "338" },
      { x: "735", y: "338" },
      { x: "775", y: "338" },
      { x: "815", y: "338" },
      { x: "855", y: "338" },
      { x: "895", y: "338" },

      //the one thing where its like a combo or wtv
      { x: "413", y: "220" },
      { x: "413", y: "172" },
      { x: "413", y: "122" },

      //adding everything up
      { x: "413", y: "80" },
      { x: "465", y: "80" },
      { x: "520", y: "80" },
      { x: "585", y: "80" },
      { x: "645", y: "80" },
      { x: "672", y: "80" },
      { x: "700", y: "80" },
      { x: "729", y: "80" },
      { x: "759", y: "80" },
      { x: "789", y: "80" },
      { x: "847", y: "80" },
      { x: "897", y: "80" },
      { x: "940", y: "80" },

      //market
      { x: "645", y: "120" },
      { x: "672", y: "120" },
      { x: "700", y: "120" },
      { x: "729", y: "120" },
      { x: "759", y: "120" },
      { x: "789", y: "120" },

      //parks
      { x: "463", y: "185" },
      { x: "463", y: "155" },
      { x: "463", y: "125" },
    ],

    rotatedCheckbox: [
      //first row
      { x: "573.5", y: "204"},
      { x: "598", y: "204"},
      //second row
      { x: "585", y: "194"},
      //third row
      { x: "573.5", y: "180"},
      { x: "598", y: "180"},
      //fourth row
      { x: "585", y: "170"},
      //fifth row
      { x: "573.5", y: "160"},
      { x: "598", y: "160"},
      //sixth row
      { x: "585", y: "148"},
      //seventh
      { x: "573.5", y: "135"},
      { x: "598", y: "135"},
    ],

    circularCheckbox: [
      { x: "896", y: "256" , label: "0" },
      { x: "896", y: "232" , label: "3" },

      { x: "896", y: "185" , label: "0" },
      { x: "896", y: "160" , label: "0" },
      { x: "896", y: "135" , label: "3" },


      { x: "560", y: "118" , label: "7" },
      { x: "582", y: "118" , label: "4" },
      { x: "605", y: "118" , label: "1" },
    ],

  });
});



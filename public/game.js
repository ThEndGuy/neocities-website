let pets = 0; // RESET TO 0 WHEN DEPLOYING
// let clickSound = new Audio("universfield-bubble-pop-06-351337.ogg") // this is the local audio for testing
//
let clickSound = new Audio("https://files.catbox.moe/ucru76.ogg");
let tadaSound = new Audio("https://files.catbox.moe/4g8iiy.ogg");
const petIcon = `<img src="/petting.gif" style="height: 1.2em; vertical-align: middle; display: inline-block;">`;

// Test change

let gameSettings = {
  isMuted: false,
};

let gameSettingsTable = [{ key: "isMuted", id: "muteCheckbox" }];

let petSettings = {
  globalModifier: 1,
  autoClickCost: 20,
  autoClickCount: 0,
  autoClickTimer: null,
  autoClickFreq: 1000,
};

// Settings menu

settingsToggleButton.addEventListener("click", () => {
  settingsOverlay.style.display = "flex";
});

settingsCloseButton.addEventListener("click", () => {
  settingsOverlay.style.display = "none";
});

settingsOverlay.addEventListener("click", (event) => {
  if (event.target == settingsOverlay) {
    settingsOverlay.style.display = "none";
  }
});

gameSettingsTable.forEach((setting) => {
  const box = document.getElementById(setting.id);
  if (!box) {
    return;
  }
  gameSettings[setting.key] = box.checked;
  box.addEventListener("change", (event) => {
    gameSettings[setting.key] = event.target.checked;
  });
});

// Settings menu over

capyButton.onpointerdown = (event) => {
  event.preventDefault();
  increasePets(1);
  fancyClick(capyButtonImage);

  createFloatingText(event, 1);
  playSound(clickSound);
};

function playSound(sound, vol = 0.5) {
  if (gameSettings.isMuted) {
    return;
  }
  const soundClone = sound.cloneNode();
  soundClone.volume = vol;
  soundClone.play();
}

function updatePetCounter() {
  petCount.style.visibility = "visible";
  petCount.innerHTML = `${pets} ${petIcon}`;
}

function updateAutoClickerTooltip() {
  autoclickButtonTooltip.innerHTML = `Owned: ${petSettings.autoClickCount}<br>Cost: ${petSettings.autoClickCost} ${petIcon}<br>Each AutoPetter pets 1 time per second<br>You are petting at ${petSettings.autoClickCount} ${petIcon}/s`;
}

function increasePets(number) {
  pets += number * petSettings.globalModifier;
  updatePetCounter();
}

function createFloatingText(event, number) {
  const popup = document.createElement("div");
  popup.classList.add("floating-txt");
  popup.innerHTML = "+" + number;
  const loc = document.querySelector("#capyButton");
  let x, y;

  const bound = loc.getBoundingClientRect();
  if (event instanceof PointerEvent) {
    x = event.clientX;
    y = event.clientY;
  } else {
    x = bound.left + bound.width / 2;
    y = bound.top;
  }

  popup.style.position = "fixed";
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 800);
}

// Anims

function getPet(element) {
  if (element.classList.contains("bounce-effect")) {
    return;
  }

  element.style.transformOrigin = "bottom center";
  element.classList.remove("petted-anim");
  const pettingHand = document.createElement("img");
  pettingHand.src = "/fastpetting.gif";
  pettingHand.classList.add("petting-hand-gif");
  const rect = element.getBoundingClientRect();
  pettingHand.style.position = "fixed";
  pettingHand.style.scale = "50% 50%";
  pettingHand.style.left = `${rect.left}px`;
  pettingHand.style.top = `${rect.top * 0.85}px`;
  document.body.appendChild(pettingHand);

  element.style.animation = "none";
  void element.offsetWidth; // force to update the button apparently??
  element.style.animation = "";
  element.classList.add("petted-anim");
  setTimeout(() => {
    pettingHand.remove();
  }, 400);
}

function fancyClick(element) {
  element.style.transformOrigin = "center";
  document
    .querySelectorAll(".petting-hand-gif")
    .forEach((hand) => hand.remove());
  element.classList.remove("petted-anim");
  element.classList.remove("bounce-effect");
  element.style.animation = "none";
  void element.offsetWidth; // force to update the button apparently??
  element.style.animation = "";
  element.classList.add("bounce-effect");
}

capyButtonImage.addEventListener("animationend", (event) => {
  if (event.animationName === "bounceEffect") {
    capyButtonImage.classList.remove("bounce-effect");
  }
  if (event.animationName === "pettedAnim") {
    capyButtonImage.classList.remove("petted-anim");
  }
});

function playUnlockAnim(element) {
  if (element.style.opacity === "") {
    element.style.opacity = "0";
  }
  let currentOpac = parseFloat(element.style.opacity);
  currentOpac += 0.05;
  element.style.opacity = currentOpac;

  return currentOpac >= 1;
}

// UPGRADES
autoclickButton.onpointerdown = (event) => {
  if (autoclickButton.style.visibility !== "visible") {
    return;
  }
  if (pets < petSettings.autoClickCost) {
    return;
  } else {
    pets -= petSettings.autoClickCost;
    pets = parseInt(pets);
    updatePetCounter();
    petSettings.autoClickCost *= 1.2;
    petSettings.autoClickCost = parseInt(petSettings.autoClickCost);
  }
  if (petSettings.autoClickTimer === null) {
    enableAutoClicker();
  } else {
    increaseAutoClickPower();
  }
  autoclickButton.innerHTML = `Buy AutoPetter:<br>${petSettings.autoClickCost} ${petIcon}`;
  updateAutoClickerTooltip();
};

function enableAutoClicker() {
  if (petSettings.autoClickTimer !== null) {
    return;
  }
  petSettings.autoClickCount = 1;
  petSettings.autoClickTimer = setInterval(
    triggerAutoClick,
    petSettings.autoClickFreq,
  );
}
function increaseAutoClickPower() {
  petSettings.autoClickCount += 1;
}
function triggerAutoClick() {
  increasePets(petSettings.autoClickCount);

  createFloatingText(null, petSettings.autoClickCount);
  getPet(capyButtonImage);

  playSound(clickSound, 0.2);
}

// UPGRADES END

function playEventAnim(event) {
  if (!event.fired) {
    if (playUnlockAnim(event.button)) {
      event.fired = true;
      event.button.style.opacity = "";
    }
  }
}
function setEnabled(button) {
  button.classList.remove("disabled-button");
}
function setDisabled(button) {
  button.classList.add("disabled-button");
}

// Shamelessly stolen from https://github.com/tsoding/button/blob/main/index.js
//
function playEvents() {
  if (pets < petSettings.autoClickCost) {
    setDisabled(autoclickButton);
  } else {
    setEnabled(autoclickButton);
  }
  for (const event of eventsTable) {
    if (event.onCount <= pets) {
      event.action();
    }
  }
}

eventsTable = [
  {
    onCount: 20,
    fired: false,
    button: autoclickButton,
    tooltip: autoclickButtonTooltip,
    action: function () {
      this.button.style.visibility = "visible";
      if (!this.fired) {
        this.button.innerHTML = `Buy AutoPetter<br>(${petSettings.autoClickCost} ${petIcon})`;
        this.tooltip.style.visibility = ""; // set it to none so the tooltip code works
        updateAutoClickerTooltip();
        playEventAnim(this);
      }
    },
  },
  // {
  //   onCount: 30,
  //   fired: false,
  //   button: menuButton2,
  //   action: function () {
  //     this.button.style.visibility = "visible";
  //     playEventAnim(this);
  //   },
  // },
  {
    onCount: 100,
    fired: false,
    button: null,
    action: function () {
      if (!this.fired) {
        this.fired = true;
        playSound(tadaSound);
        aboveCapyText.innerHTML = "You did it!!";
      }
    },
  },
];

function newFrame() {
  playEvents();
  window.requestAnimationFrame(newFrame);
}
window.requestAnimationFrame(newFrame);

const inputRange = document.getElementById("password-generator__char-length-slider");
const activeColor = "#A4FFAF";
const inactiveColor = "#18171F";

inputRange.addEventListener("input", function() {
  const ratio = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
});

const passwordDisplay = document.querySelector(".password-generator__password-output");
const passwordCopyText = document.querySelector(".password-generator__copy-text");
const passwordCopyBtn = document.querySelector(".password-generator__copy-btn");

const passwordForm = document.querySelector(".password-generator__password-settings");
const CharCount = document.querySelector(".password-generator__char-count");
const lengthSlider = document.querySelector(".password-generator__char-length-slider");
const checkBoxes = document.querySelectorAll(".password-generator__checkbox");

const strengthDesc = document.querySelector(".password-generator__rating-text");
const strengthBars = document.querySelectorAll(".password-generator__rating-bar");

const Character_sets = {
  uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
  lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
  number: ["0123456789", 10],
  symbols: ["!@#$%^&*()", 10]
};

let canCopy = false;

const getSliderVal = () => {
  CharCount.textContent = lengthSlider.value;
}

const styleRangSlider = () => {
  const min = lengthSlider.min;
  const max = lengthSlider.max;
  const val = lengthSlider.value;

  lengthSlider.style.backgroundSize =
      ((val - min) * 100) / (max - min) + "% 100%";
};

const handlSliderInput = () => {
  getSliderVal();
  styleRangSlider();
};

//
//  Reset Bar Styles
//
const resetBarStyles = () => {
  strengthBars.forEach((bar) => {
      bar.style.backgroundColor = "transparent";
      bar.style.borderColor = "hsl(252, 11%, 91%)";
  })
};

const Stylebars = ([...barElement], color) => {
  barElement.forEach(bar => {
      bar.style.backgroundColor = color;
      bar.style.borderColor = color;
  });
};

const StyleMeter = (rating) => {
  const text = rating[0];
  const numBars = rating[1];
  const barToFill = Array.from(strengthBars).slice(0, numBars);

  resetBarStyles();
  strengthDesc.textContent = text;

  switch(numBars) {
      case 1:
          return Stylebars(barToFill, "hsl(0, 91%, 63%");
      case 2:
          return Stylebars(barToFill, "hsl(13, 95%, 66%");
      case 3:
          return Stylebars(barToFill, "hsl(42, 91%, 68%");
      case 4:
          return Stylebars(barToFill, "hsl(127, 100%, 82%");
      default:
          throw new Error("Invalid Value from Num Bars");
  }

};

//
//  Reset Bar Styles
//

const CalcStrength = (passwordLength, charPoolSize) => {
  const strength = passwordLength * Math.log2(charPoolSize);

  if(strength < 25) {
      return ["Too Week", 1];
  }else if(strength >= 25 && strength < 50) {
      return ["Week", 2];
  }else if(strength >= 50 && strength < 75) {
      return ["Medium", 3];
  }else {
      return ["Strong", 4];
  }
}

const generatePassword = (e) => {
  e.preventDefault();
  validInput();

  let generatePassword = "";
  let includeSets = [];
  let charPool = 0;

  checkBoxes.forEach((box) => {
      if(box.checked) {
          includeSets.push(Character_sets[box.value][0]);
          charPool += Character_sets[box.value][1];
          console.log(box.value[0]);
          console.log(box.value[1]);
      }
  });

  if(includeSets) {
      for(let i = 0; i < lengthSlider.value; i++) {
          const randSetIndex = Math.floor(Math.random() * includeSets.length);
          const randSet = includeSets[randSetIndex];

          const randCharIndex = Math.floor(Math.random() * randSet.length);
          const randChar = randSet[randCharIndex];

          generatePassword += randChar;
      }
  }

  const strength = CalcStrength(lengthSlider.value, charPool);
  StyleMeter(strength);
  canCopy = true;
  passwordDisplay.textContent = generatePassword;
}

// valid
const validInput = () => {
  if(Array.from(checkBoxes).every((box) => box.checked === false)) {
      alert("Make Sure to check at least one Check Box");
  }
};

const copyPassword = async() => {
  if(!passwordDisplay.textContent || passwordCopyText.textContent) return;

  if(!canCopy) return;

  setTimeout(() => {
      passwordCopyText.style.transition = "all 1s";
      passwordCopyText.style.opacity = 0;
  }, 1000);

  setInterval(() => {
      passwordCopyText.style.removeProperty("opacity");
      passwordCopyText.style.removeProperty("transition");
      passwordCopyText.textContent = "";
  }, 1000);

  await navigator.clipboard.writeText(passwordDisplay.text);
  passwordCopyText.textContent = "Copied";
}

CharCount.textContent = lengthSlider.value;

lengthSlider.addEventListener("input", handlSliderInput);
passwordForm.addEventListener("submit", generatePassword);
passwordCopyBtn.addEventListener("click", copyPassword);
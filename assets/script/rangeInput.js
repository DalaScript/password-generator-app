const neonGreen = "#A4FFAF";
const veryDarkGrey = "#18171F";
const red = "#F64A4A";
const orange = "#FB7C58";
const yellow = "#F8CD65";


const passwordOutPut = document.querySelector(".password-generator__password-output");
const passwordCopyText = document.querySelector(".password-generator__copy-text");
const passwordCopyBtn = document.querySelector(".password-generator__copy-btn");

const passwordSettings = document.querySelector(".password-generator__password-settings");
const charCount = document.querySelector(".password-generator__char-count");
const charLengthSlider = document.querySelector(".password-generator__char-length-slider");
const checkBoxes = document.querySelectorAll(".password-generator__checkbox");

const strengthText = document.querySelector(".password-generator__rating-text");
const strengthBars = document.querySelectorAll(".password-generator__rating-bar");

const characterSets = {
  uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
  lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
  numbers: ["0123456789", 10],
  symbols: ["!@#$%^&*()", 10]
};

let canCopy = false;

const getSliderVal = () => {
  charCount.textContent = charLengthSlider.value;
};

const styleRangeSlider = () => {
  const min = charLengthSlider.min;
  const max = charLengthSlider.max;
  const val = charLengthSlider.value;

  const ratio = (val - min) / (max - min) * 100;
  charLengthSlider.style.background = `linear-gradient(90deg, ${neonGreen} ${ratio}%, ${veryDarkGrey} ${ratio}%)`;
};

const handlSliderInput = () => {
  getSliderVal();
  styleRangeSlider();
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
  strengthText.textContent = text;

  switch (numBars) {
    case 1:
      return Stylebars(barToFill, red);
    case 2:
      return Stylebars(barToFill, orange);
    case 3:
      return Stylebars(barToFill, yellow);
    case 4:
      return Stylebars(barToFill, neonGreen);
    default:
      throw new Error("Invalid Value from Num Bars");
  }
};

//
//  Reset Bar Styles
//

const calcStrength = (passwordLength, charPoolSize) => {
  const strength = passwordLength * Math.log2(charPoolSize);
  console.log(Math.log2(charPoolSize))
  strengthText.style.display = "inline";

  if (strength < 25) {
    return ["Too Week", 1];
  } else if (strength >= 25 && strength < 50) {
    return ["Week", 2];
  } else if (strength >= 50 && strength < 75) {
    return ["Medium", 3];
  } else {
    return ["Strong", 4];
  }
}

const generatePassword = (e) => {
  e.preventDefault();
  // validInput();

  let generatePassword = "";
  let includeSets = [];
  let charPool = 0;

  if (Array.from(checkBoxes).every((box) => box.checked === false) || charLengthSlider.value == 0) {
    alert("Make Sure to check at least one Check Box and select character length");
  } else {

    checkBoxes.forEach((box) => {
      if (box.checked) {
        includeSets.push(characterSets[box.value][0]);
        charPool += characterSets[box.value][1];
      }
    });

    if (includeSets) {
      for(let i = 0; i < charLengthSlider.value; i++) {
        const randSetIndex = Math.floor(Math.random() * includeSets.length);
        const randSet = includeSets[randSetIndex];

        const randCharIndex = Math.floor(Math.random() * randSet.length);
        const randChar = randSet[randCharIndex];

        generatePassword += randChar;
      }
    }

    const strength = calcStrength(charLengthSlider.value, charPool);
    StyleMeter(strength);
    canCopy = true;
    passwordOutPut.classList.add("password-generator__password-output--active");
    passwordOutPut.textContent = generatePassword;
  }
}

// valid
const validInput = () => {
  if (Array.from(checkBoxes).every((box) => box.checked === false)) {
    alert("Make Sure to check at least one Check Box");
  } else if (charLengthSlider.value == 0) {
    alert("Make sure you select the character length");
  }
};

const copyPassword = async () => {
  console.log(!passwordOutPut.textContent);
  if (!passwordOutPut.textContent) return;

  if (!canCopy) return;

  passwordCopyText.style.opacity = 1;

  setInterval(() => {
    passwordCopyText.style.opacity = 0;
  }, 1000);
  
  passwordOutPut.select();
  await navigator.clipboard.writeText(passwordOutPut.textContent);
}

charLengthSlider.addEventListener("input", handlSliderInput);
passwordSettings.addEventListener("submit", generatePassword);
passwordCopyBtn.addEventListener("click", copyPassword);
"use strict";

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var neonGreen = "#A4FFAF";
var veryDarkGrey = "#18171F";
var red = "#F64A4A";
var orange = "#FB7C58";
var yellow = "#F8CD65";
var passwordOutPut = document.querySelector(".password-generator__password-output");
var passwordCopyText = document.querySelector(".password-generator__copy-text");
var passwordCopyBtn = document.querySelector(".password-generator__copy-btn");
var passwordSettings = document.querySelector(".password-generator__password-settings");
var charCount = document.querySelector(".password-generator__char-count");
var charLengthSlider = document.querySelector(".password-generator__char-length-slider");
var checkBoxes = document.querySelectorAll(".password-generator__checkbox");
var strengthText = document.querySelector(".password-generator__rating-text");
var strengthBars = document.querySelectorAll(".password-generator__rating-bar");
var characterSets = {
  uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
  lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
  numbers: ["0123456789", 10],
  symbols: ["!@#$%^&*()", 10]
};
var canCopy = false;

var getSliderVal = function getSliderVal() {
  charCount.textContent = charLengthSlider.value;
};

var styleRangeSlider = function styleRangeSlider() {
  var min = charLengthSlider.min;
  var max = charLengthSlider.max;
  var val = charLengthSlider.value;
  var ratio = (val - min) / (max - min) * 100;
  charLengthSlider.style.background = "linear-gradient(90deg, ".concat(neonGreen, " ").concat(ratio, "%, ").concat(veryDarkGrey, " ").concat(ratio, "%)");
};

var handlSliderInput = function handlSliderInput() {
  getSliderVal();
  styleRangeSlider();
}; //
//  Reset Bar Styles
//


var resetBarStyles = function resetBarStyles() {
  strengthBars.forEach(function (bar) {
    bar.style.backgroundColor = "transparent";
    bar.style.borderColor = "hsl(252, 11%, 91%)";
  });
};

var Stylebars = function Stylebars(_ref, color) {
  var _ref2 = _toArray(_ref),
      barElement = _ref2.slice(0);

  barElement.forEach(function (bar) {
    bar.style.backgroundColor = color;
    bar.style.borderColor = color;
  });
};

var StyleMeter = function StyleMeter(rating) {
  var text = rating[0];
  var numBars = rating[1];
  var barToFill = Array.from(strengthBars).slice(0, numBars);
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
}; //
//  Reset Bar Styles
//


var calcStrength = function calcStrength(passwordLength, charPoolSize) {
  var strength = passwordLength * Math.log2(charPoolSize);
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
};

var generatePassword = function generatePassword(e) {
  e.preventDefault(); // validInput();

  var generatePassword = "";
  var includeSets = [];
  var charPool = 0;

  if (Array.from(checkBoxes).every(function (box) {
    return box.checked === false;
  }) || charLengthSlider.value == 0) {
    alert("Make Sure to check at least one Check Box and select character length");
  } else {
    checkBoxes.forEach(function (box) {
      if (box.checked) {
        includeSets.push(characterSets[box.value][0]);
        charPool += characterSets[box.value][1];
      }
    });

    if (includeSets) {
      for (var i = 0; i < charLengthSlider.value; i++) {
        var randSetIndex = Math.floor(Math.random() * includeSets.length);
        var randSet = includeSets[randSetIndex];
        var randCharIndex = Math.floor(Math.random() * randSet.length);
        var randChar = randSet[randCharIndex];
        generatePassword += randChar;
      }
    }

    var strength = calcStrength(charLengthSlider.value, charPool);
    StyleMeter(strength);
    canCopy = true;
    passwordOutPut.classList.add("password-generator__password-output--active");
    passwordOutPut.textContent = generatePassword;
  }
}; // valid


var validInput = function validInput() {
  if (Array.from(checkBoxes).every(function (box) {
    return box.checked === false;
  })) {
    alert("Make Sure to check at least one Check Box");
  } else if (charLengthSlider.value == 0) {
    alert("Make sure you select the character length");
  }
};

var copyPassword = function copyPassword() {
  return regeneratorRuntime.async(function copyPassword$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (passwordOutPut.textContent) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return");

        case 2:
          if (canCopy) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return");

        case 4:
          passwordCopyText.style.opacity = 1;
          setInterval(function () {
            passwordCopyText.style.opacity = 0;
          }, 1000);
          _context.next = 8;
          return regeneratorRuntime.awrap(navigator.clipboard.writeText(passwordOutPut.textContent));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

charLengthSlider.addEventListener("input", handlSliderInput);
passwordSettings.addEventListener("submit", generatePassword);
passwordCopyBtn.addEventListener("click", copyPassword);
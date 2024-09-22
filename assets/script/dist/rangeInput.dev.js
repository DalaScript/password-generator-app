"use strict";

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var inputRange = document.getElementById("password-generator__char-length-slider");
var activeColor = "#A4FFAF";
var inactiveColor = "#18171F";
inputRange.addEventListener("input", function () {
  var ratio = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = "linear-gradient(90deg, ".concat(activeColor, " ").concat(ratio, "%, ").concat(inactiveColor, " ").concat(ratio, "%)");
});
var passwordDisplay = document.querySelector(".password-generator__password-output");
var passwordCopyText = document.querySelector(".password-generator__copy-text");
var passwordCopyBtn = document.querySelector(".password-generator__copy-btn");
var passwordForm = document.querySelector(".password-generator__password-settings");
var CharCount = document.querySelector(".password-generator__char-count");
var lengthSlider = document.querySelector(".password-generator__char-length-slider");
var checkBoxes = document.querySelectorAll(".password-generator__checkbox");
var strengthDesc = document.querySelector(".password-generator__rating-text");
var strengthBars = document.querySelectorAll(".password-generator__rating-bar");
var Character_sets = {
  uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
  lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
  number: ["0123456789", 10],
  symbols: ["!@#$%^&*()", 10]
};
var canCopy = false;

var getSliderVal = function getSliderVal() {
  CharCount.textContent = lengthSlider.value;
};

var styleRangSlider = function styleRangSlider() {
  var min = lengthSlider.min;
  var max = lengthSlider.max;
  var val = lengthSlider.value;
  lengthSlider.style.backgroundSize = (val - min) * 100 / (max - min) + "% 100%";
};

var handlSliderInput = function handlSliderInput() {
  getSliderVal();
  styleRangSlider();
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
  strengthDesc.textContent = text;

  switch (numBars) {
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
}; //
//  Reset Bar Styles
//


var CalcStrength = function CalcStrength(passwordLength, charPoolSize) {
  var strength = passwordLength * Math.log2(charPoolSize);

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
  e.preventDefault();
  validInput();
  var generatePassword = "";
  var includeSets = [];
  var charPool = 0;
  checkBoxes.forEach(function (box) {
    if (box.checked) {
      includeSets.push(Character_sets[box.value][0]);
      charPool += Character_sets[box.value][1];
      console.log(box.value[0]);
      console.log(box.value[1]);
    }
  });

  if (includeSets) {
    for (var i = 0; i < lengthSlider.value; i++) {
      var randSetIndex = Math.floor(Math.random() * includeSets.length);
      var randSet = includeSets[randSetIndex];
      var randCharIndex = Math.floor(Math.random() * randSet.length);
      var randChar = randSet[randCharIndex];
      generatePassword += randChar;
    }
  }

  var strength = CalcStrength(lengthSlider.value, charPool);
  StyleMeter(strength);
  canCopy = true;
  passwordDisplay.textContent = generatePassword;
}; // valid


var validInput = function validInput() {
  if (Array.from(checkBoxes).every(function (box) {
    return box.checked === false;
  })) {
    alert("Make Sure to check at least one Check Box");
  }
};

var copyPassword = function copyPassword() {
  return regeneratorRuntime.async(function copyPassword$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(!passwordDisplay.textContent || passwordCopyText.textContent)) {
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
          setTimeout(function () {
            passwordCopyText.style.transition = "all 1s";
            passwordCopyText.style.opacity = 0;
          }, 1000);
          setInterval(function () {
            passwordCopyText.style.removeProperty("opacity");
            passwordCopyText.style.removeProperty("transition");
            passwordCopyText.textContent = "";
          }, 1000);
          _context.next = 8;
          return regeneratorRuntime.awrap(navigator.clipboard.writeText(passwordDisplay.text));

        case 8:
          passwordCopyText.textContent = "Copied";

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

CharCount.textContent = lengthSlider.value;
lengthSlider.addEventListener("input", handlSliderInput);
passwordForm.addEventListener("submit", generatePassword);
passwordCopyBtn.addEventListener("click", copyPassword);
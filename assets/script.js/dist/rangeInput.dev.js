"use strict";

var inputRange = document.getElementById("password-generator__range-input");
var activeColor = "#A4FFAF";
var inactiveColor = "#18171F";
console.log(inputRange);
inputRange.addEventListener("input", function () {
  var ratio = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = "linear-gradient(90deg, ".concat(activeColor, " ").concat(ratio, "%, ").concat(inactiveColor, " ").concat(ratio, "%)");
});
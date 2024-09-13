const inputRange = document.getElementById("password-generator__range-input");
const activeColor = "#A4FFAF";
const inactiveColor = "#18171F";

inputRange.addEventListener("input", function() {
  const ratio = (this.value - this.min) / (this.max - this.min) * 100;
  this.style.background = `linear-gradient(90deg, ${activeColor} ${ratio}%, ${inactiveColor} ${ratio}%)`;
});
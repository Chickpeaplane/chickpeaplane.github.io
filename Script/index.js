const squarePattern = document.querySelector('.square-pattern');

// Dynamically calculate the number of columns and rows based on the viewport size
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

// Assuming each square takes up 1vw x 1vw space (as defined in the CSS)
const columns = 100
const rows = Math.floor(viewportHeight / (viewportWidth/100));   // 1vw height

const totalSquares = columns * rows; // Total squares required

const colors = [
    "#FF0000", "#FF9900", "#EAFF00", "#49FF00",
    "#00FFB7", "#00A6FF", "#AA00FF", "#FF00E1"
];

// Function to calculate probability based on distance from edges
let height = 0.03;
let base = 1.1;
function calculateEdgeProbability(x, y) {
    return Math.max((base ** (-x)) - height, (base ** (-(100 - x))) - height);
}

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
        const square = document.createElement('div');

        // Calculate the probability of this square changing color based on its position
        const prob = calculateEdgeProbability(x, y);

        if (Math.random() < prob) {
            square.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        } else {
            square.style.backgroundColor = "#000000";
        }

        square.style.border = "1px solid #000000"
        squarePattern.appendChild(square);
    }
}
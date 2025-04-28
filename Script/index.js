const leftSquarePattern = document.querySelector('#left-square-pattern');
const rightSquarePattern = document.querySelector('#right-square-pattern');
const header = document.querySelector('header');
const headerContent = document.querySelector('.content');

const colours = [
    "#FF0000", "#FF9900", "#EAFF00", "#49FF00",
    "#00FFB7", "#00A6FF", "#AA00FF", "#FF00E1"
];

const height = 0.03;
const interceptFactor = 38 // Percentage of the screen after which the spawn rate is zero
const randomColourFactor = 0.1;
function calculateColour(x, y, rows, columns) {
    let base = Math.pow(height, -100/(interceptFactor * columns))
    const probability = Math.max((base ** (-x-0.5)) - height, (base ** (-(columns - x - 0.5))) - height);
    if (Math.random() < probability) {
        const randomColourFloat = Math.max(Math.min((y / rows) + (Math.random() * randomColourFactor * Math.sign(Math.random() - 0.5)), 1), 0);
        return colours[Math.floor(randomColourFloat * colours.length)];
    } else {
        return null;
    }
}

function generateBackground() {
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    let columns = 100;
    let rows = Math.floor(viewportHeight / (viewportWidth / columns)) + 1;

    document.documentElement.style.setProperty('--columns', `${columns/2}`);

    leftSquarePattern.innerHTML = "";
    rightSquarePattern.innerHTML = "";

    // Create squares for the left and right square patterns
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const square = document.createElement('div');

            // Calculate the probability of this square changing color based on its position
            const colour = calculateColour(x, y, rows, columns);

            if (colour) {
                square.style.backgroundColor = colour;
                square.style.border = "1px solid #000000";
                if (x < columns/2) {
                    square.style.gridColumn = x+1;
                    square.style.gridRow = y+1;
                    leftSquarePattern.appendChild(square);
                } else {
                    square.style.gridColumn = x-(columns/2 - 1);
                    square.style.gridRow = y+1;
                    rightSquarePattern.appendChild(square);
                }
            }
        }
    }
}

generateBackground();

window.addEventListener("resize", generateBackground)
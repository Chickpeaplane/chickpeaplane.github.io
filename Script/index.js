const leftSquarePattern = document.querySelector('#left-square-pattern');
const rightSquarePattern = document.querySelector('#right-square-pattern');
const header = document.querySelector('header');
const headerContent = document.querySelector('.content');
const projectMain = document.querySelector('#projects');
const contactMain = document.querySelector('#contact');

const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;

const columns = 100;
const rows = Math.floor(viewportHeight / (viewportWidth / 100)) + 1;

const colours = [
    "#FF0000", "#FF9900", "#EAFF00", "#49FF00",
    "#00FFB7", "#00A6FF", "#AA00FF", "#FF00E1"
];

const height = 0.03;
const base = 1.1;
const randomColourFactor = 0.1;
function calculateColour(x, y) {
    const probability = Math.max((base ** (-x)) - height, (base ** (-(99 - x))) - height);
    if (Math.random() < probability) {
        const randomColourFloat = Math.min((y / rows) + (Math.random() * randomColourFactor), 1);
        return colours[Math.floor(randomColourFloat * colours.length)];
    } else {
        return null;
    }
}

function generateBackground() {
    leftSquarePattern.innerHTML = "";
    rightSquarePattern.innerHTML = "";
    // Create squares for the left and right square patterns
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const square = document.createElement('div');

            // Calculate the probability of this square changing color based on its position
            const colour = calculateColour(x, y);

            if (colour) {
                square.style.backgroundColor = colour;
                square.style.border = "1px solid #000000";
                if (x < 50) {
                    square.style.gridColumn = x+1;
                    square.style.gridRow = y+1;
                    leftSquarePattern.appendChild(square);
                } else {
                    square.style.gridColumn = x-49;
                    square.style.gridRow = y+1;
                    rightSquarePattern.appendChild(square);
                }
            }
        }
    }
}

const scrollMax = header.offsetHeight;
const scrollSections = 3;
let sectionIndex = 0;
let prevSection = 0;

// Flag to prevent multiple scroll events being processed too quickly
let canScroll = true;
const debounceTime = 1000; // Minimum time before allowing scroll action (in ms)

// Scroll event listener to trigger animations
window.addEventListener('wheel', (event) => {
    if (!canScroll) return; // Ignore scroll if the delay hasn't passed yet

    canScroll = false; // Disable scroll until the debounce time is over

    // Wait for the debounce time before re-enabling scrolling
    setTimeout(() => {
        canScroll = true;
    }, debounceTime);

    sectionIndex += Math.sign(event.deltaY);
    sectionIndex = Math.max(Math.min(sectionIndex, scrollSections-1), 0);

    console.log(sectionIndex);

    if (sectionIndex === 0 && prevSection !== 0) {
        generateBackground();
        // Reset to initial state when at the top
        leftSquarePattern.style.opacity = 1;
        leftSquarePattern.style.transform = 'translateX(0)';
        rightSquarePattern.style.opacity = 1;
        rightSquarePattern.style.transform = 'translateX(0)';
        headerContent.style.opacity = 1;

        projectMain.style.transform = `translateY(0)`;
        projectMain.style.opacity = 0;
        prevSection = sectionIndex;

    } else if (sectionIndex === 1 && prevSection !== 1) {
        leftSquarePattern.style.opacity = 0; // Fade out left pattern
        leftSquarePattern.style.transform = `translateX(-100vw)`; // Slide left
        rightSquarePattern.style.opacity = 0; // Fade out right pattern
        rightSquarePattern.style.transform = `translateX(100vw)`; // Slide right
        headerContent.style.opacity = 0; // Fade out header content

        contactMain.style.transform = `translateY(0%)`; // Slide up main content
        contactMain.style.opacity = 0; // Fade out main content
        prevSection = sectionIndex;

        projectMain.style.transform = `translateY(-25%)`; // Slide up main content
        projectMain.style.opacity = 1; // Fade out main content
        prevSection = sectionIndex;

    } else if (sectionIndex === 2 && prevSection !== 2) {
        projectMain.style.transform = `translateY(-50%)`; // Slide up main content
        projectMain.style.opacity = 0; // Fade out main content
        prevSection = sectionIndex;

        contactMain.style.transform = `translateY(-25%)`; // Slide up main content
        contactMain.style.opacity = 1; // Fade out main content
        prevSection = sectionIndex;
    }
});

generateBackground();

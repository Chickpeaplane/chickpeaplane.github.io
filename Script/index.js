const colours = [
    "#FF0000", "#FF9900", "#EAFF00", "#49FF00",
    "#00FFB7", "#00A6FF", "#AA00FF", "#FF00E1"
];

const height = 0.03;
const interceptFactor = 38; // Percentage of the screen after which the spawn rate is zero
const randomColourFactor = 0.1;
function calculateColour(x, y, rows, columns) {
    x += 0.5
    y  += 0.5
    let base = Math.pow(height, -100/(interceptFactor * columns))
    const probability = Math.max((base ** (-x)) - height, (base ** (-(columns - x))) - height);
    if (Math.random() < probability) {
        const randomColourFloat = Math.max(Math.min((y / rows) + (Math.random() * randomColourFactor * Math.sign(Math.random() - 0.5)), 1), 0);
        return colours[Math.floor(randomColourFloat * colours.length)];
    } else {
        return null;
    }
}

const leftSquareCanvas = document.getElementById("left-squares");
const rightSquareCanvas = document.getElementById("right-squares");

const leftSquareCanvasContext = leftSquareCanvas.getContext("2d");
const rightSquareCanvasContext = rightSquareCanvas.getContext("2d");

function generateBackground() {
    leftSquareCanvas.width = window.innerWidth / 2;
    leftSquareCanvas.height = window.innerHeight;

    rightSquareCanvas.width = window.innerWidth / 2;
    rightSquareCanvas.height = window.innerHeight;

    const canvasSizeRatio = window.innerWidth / 2 / window.innerHeight;

    let columns = 100;

    let rows = Math.floor(window.innerHeight / (window.innerWidth / columns)) + 1;

    if (canvasSizeRatio < 0.7) {
        rows = Math.round(window.innerHeight / 10);
        columns = window.innerWidth / 10;
    }

    const squareGap = window.innerHeight / rows * 0.1;
    const squareSize = (window.innerHeight - squareGap) / rows *0.9;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns/2; x++) {
            const callingColourARG  = [x, y, rows, columns];

            let colour = calculateColour(...callingColourARG);
            if (colour) {
                leftSquareCanvasContext.fillStyle = colour;
                leftSquareCanvasContext.beginPath();
                leftSquareCanvasContext.fillRect(x*(squareSize+squareGap) + squareGap, y*(squareSize+squareGap) + squareGap, squareSize, squareSize);

                leftSquareCanvasContext.stroke();

            }

            colour = calculateColour(...callingColourARG);
            if (colour) {
                rightSquareCanvasContext.fillStyle = colour;
                rightSquareCanvasContext.beginPath();
                rightSquareCanvasContext.fillRect(rightSquareCanvas.width - x*(squareSize+squareGap), y*(squareSize+squareGap) + squareGap, squareSize, squareSize);

                rightSquareCanvasContext.stroke();
                
            }
        }
    }
}


generateBackground();

window.addEventListener("resize", generateBackground);

/*
Scrolling animations
*/

const sections = document.getElementsByClassName("section");
const spacePerSections = getComputedStyle(document.documentElement).getPropertyValue('--distance-per-section').trim();

const container = document.getElementById("container");

for (let index = 0; index < sections.length; index ++ ) {
    sections[index].style.setProperty('--section-index', index);
}

document.documentElement.style.setProperty('--amount-of-sections', `${sections.length}`);

function updateSectionDisplay() {
    let index = 0;
    for (const section of sections) {
        if (container.scrollTop >= index * spacePerSections + spacePerSections/1) {
            section.style.maxHeight = "0px";
        } else section.style.maxHeight = "";
        index ++;
    }
}

container.addEventListener("scroll", () => {
    updateSectionDisplay()
    const scrollDistance = container.scrollTop;
    document.documentElement.style.setProperty('--scroll', `${scrollDistance}`);
});

async function loadProjects() {
    const githubUsername = "Chickpeaplane";
    const url = `https://api.github.com/users/${githubUsername}/repos`;

    const loader = document.getElementById("projects-loader");
    const projectsHolder = document.getElementById("projects-holder");

    loader.style.display = "flex";
    projectsHolder.style.display = "none";

    const response = await fetch(url);
    const repositories = await response.json();
    const sortedRepositories = repositories.sort(function (a, b) { return b.watchers_count - a.watchers_count });

    projectsHolder.innerHTML = "";

    for (const repo of repositories) {
        const projectInformation = document.createElement("div");
        projectInformation.classList.add("project-information");

        const projectGithubLink = document.createElement("a")
        projectGithubLink.classList.add("github-link")
        projectGithubLink.href = repo.html_url;
        projectGithubLink.target = "_blank";
        const githubIcon = document.createElement("img");
        githubIcon.classList.add("github-link-icon")
        githubIcon.src = "Image/github.svg";
        githubIcon.alt = "Link to GitHub";
        projectGithubLink.appendChild(githubIcon);
        projectInformation.appendChild(projectGithubLink)

        const projectTitle = document.createElement("h2");
        projectTitle.textContent = repo.name.replaceAll("-", " ");
        projectInformation.appendChild(projectTitle);

        const projectLanguage = document.createElement("p");
        projectLanguage.textContent = repo.language || "Not specified";
        projectInformation.appendChild(projectLanguage);

        const projectDescription = document.createElement("p");
        projectDescription.textContent = repo.description;
        projectInformation.appendChild(projectDescription);

        const projectLink = document.createElement("a");
        projectLink.target = "_blank";
        projectLink.href = repo.homepage || repo.html_url;
        projectInformation.appendChild(projectLink);

        const projectTopicsHolder = document.createElement("div");
        projectTopicsHolder.classList.add("project-topic-holder")

        for (const topic of repo.topics) {
            const topicP = document.createElement("p");
            topicP.classList.add("project-topic")
            topicP.textContent = topic.replaceAll("-", " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
            projectInformation.appendChild(topicP);
        }

        projectInformation.appendChild(projectTopicsHolder);

        projectInformation.addEventListener("click", (event) => {
            if (event.target == projectGithubLink || event.target == githubIcon) {
                projectGithubLink.click();
            } else {
                projectLink.click();
            }
        })
        projectInformation.addEventListener("mousemove", (e) => {
            const rect = projectInformation.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (y / rect.height) * -10;
            const rotateY = (x / rect.width) * 10;
            projectInformation.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            projectInformation.style.transition = 'transform 0.3s ease-out, background-position 0.3s ease-out';
            const bgX = (x / rect.width) * 25 + 50;
            const bgY = (y / rect.height) * 25 + 50;
            projectInformation.style.backgroundPosition = `${bgX}% ${bgY}%`;
        });
        projectInformation.addEventListener("mouseleave", () => {
            projectInformation.style.transition = 'transform 0.3s ease-out, background-position 0.3s ease-out';
            projectInformation.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            projectInformation.style.backgroundPosition = '50% 50%';

            setTimeout(() => {
                projectInformation.style.transition = '';
            }, 300);
        });

        projectsHolder.appendChild(projectInformation);
    };
    
    loader.style.display = "none";
    projectsHolder.style.display = "flex";
}

loadProjects()

document.getElementById('year').textContent = new Date().getFullYear();
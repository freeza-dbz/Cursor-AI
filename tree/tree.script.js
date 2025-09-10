const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

let leaves = [];
let fruits = [];

// ----------------- TREE DRAWING -----------------
function drawBranch(x, y, length, angle, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = "#55331aff";
    ctx.moveTo(x, y);

    const xEnd = x + length * Math.cos(angle);
    const yEnd = y - length * Math.sin(angle);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();

    if (length < 10) return;

    const branches = Math.random() > 0.8 ? 3 : 2;
    for (let i = 0; i < branches; i++) {
        const newLength = length * (0.7 + Math.random() * 0.11);
        const newAngle = angle + (Math.random() * 0.8 - 0.4);
        const newWidth = width * 0.7;
        drawBranch(xEnd, yEnd, newLength, newAngle, newWidth);
    }
}

// 🌳 Draw scattered root branches
function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startY = canvas.height;

    // Create 5 scattered root branches
    for (let i = 0; i < 5; i++) {
        const startX = canvas.width / 2 + (Math.random() * 200 - 100);
        const angle = (Math.PI / 2) + (Math.random() * 0.6 - 0.3);
        const length = 100 + Math.random() * 30;
        const width = 8 + Math.random() * 4;

        drawBranch(startX, startY, length, angle, width);
    }

    // Redraw existing leaves & fruits
    leaves.forEach(drawLeaf);
    fruits.forEach(drawFruit);
}

// ----------------- LEAVES & FRUITS -----------------
function addLeaf() {
    const comment = prompt("Enter a comment for this leaf:", "Completed Lesson 1");
    if (comment === null) return; // cancelled

    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 1.5);
    const leaf = { x, y, comment };
    leaves.push(leaf);
    drawLeaf(leaf);
}


function addFruit() {
    const comment = prompt("Enter a comment for this fruit:", "Quiz 1 Achievement");
    if (comment === null) return; // cancelled

    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 1.5);
    const fruit = { x, y, comment };
    fruits.push(fruit);
    drawFruit(fruit);
}


function drawLeaf(leaf) {
    ctx.beginPath();
    ctx.fillStyle = "#2ecc71";

    ctx.moveTo(leaf.x, leaf.y); // tip
    ctx.bezierCurveTo(
        leaf.x - 10, leaf.y - 15, // left curve
        leaf.x - 10, leaf.y + 15,
        leaf.x, leaf.y + 20 // bottom
    );
    ctx.bezierCurveTo(
        leaf.x + 10, leaf.y + 15, // right curve
        leaf.x + 10, leaf.y - 15,
        leaf.x, leaf.y // back to tip
    );

    ctx.fill();
    ctx.strokeStyle = "#145a32"; // darker vein
    ctx.stroke();

    // center vein
    ctx.beginPath();
    ctx.moveTo(leaf.x, leaf.y);
    ctx.lineTo(leaf.x, leaf.y + 20);
    ctx.stroke();
}


function drawFruit(fruit) {
    const gradient = ctx.createRadialGradient(fruit.x - 5, fruit.y - 5, 3, fruit.x, fruit.y, 14);
    gradient.addColorStop(0, "#fff");      // shiny spot
    gradient.addColorStop(0.2, "#f9e79f"); // lighter yellow
    gradient.addColorStop(1, "#f1c40f");   // main fruit color

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(fruit.x, fruit.y, 14, 0, 2 * Math.PI);
    ctx.fill();

    // optional: fruit outline
    ctx.strokeStyle = "#b7950b";
    ctx.lineWidth = 2;
    ctx.stroke();
}


// ----------------- COMMENT HANDLING -----------------
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check leaves
    for (let leaf of leaves) {
        if (Math.hypot(mouseX - leaf.x, mouseY - leaf.y) < 20) {
            const newComment = prompt("Leaf Comment:", leaf.comment);
            if (newComment !== null) leaf.comment = newComment;
            return;
        }
    }

    // Check fruits
    for (let fruit of fruits) {
        if (Math.hypot(mouseX - fruit.x, mouseY - fruit.y) < 20) {
            const newComment = prompt("Fruit Comment:", fruit.comment);
            if (newComment !== null) fruit.comment = newComment;
            return;
        }
    }
});

// ----------------- BUTTON EVENTS -----------------
document.getElementById("add-leaf").addEventListener("click", addLeaf);
document.getElementById("add-fruit").addEventListener("click", addFruit);

// Initial tree
drawTree();

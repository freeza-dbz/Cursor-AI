const branches = document.querySelectorAll(".branch");

document.getElementById("add-leaf").addEventListener("click", () => {
    const branch = pickRandomBranch();
    const comment = prompt("Enter a note for this leaf (e.g., 'Lesson 5: Fractions'):");
    if (comment) addElement(branch, "leaf", comment);
});

document.getElementById("add-fruit").addEventListener("click", () => {
    const branch = pickRandomBranch();
    const comment = prompt("Enter a note for this fruit (e.g., 'Quiz: Solar System'):");
    if (comment) addElement(branch, "fruit", comment);
});

function pickRandomBranch() {
    const index = Math.floor(Math.random() * branches.length);
    return branches[index];
}

function addElement(branch, type, comment) {
    const el = document.createElement("div");
    el.classList.add(type);
    el.dataset.comment = comment; // store comment as data attribute

    // random position on branch
    const x = Math.random() * branch.offsetWidth;
    const y = Math.random() * (branch.offsetHeight + 30);
    el.style.left = `${branch.offsetLeft + x}px`;
    el.style.top = `${branch.offsetTop - y}px`;

    // on click, show comment
    el.addEventListener("click", () => {
        alert(`${type.toUpperCase()} Note: ${el.dataset.comment}`);
    });

    branch.parentElement.appendChild(el);
}

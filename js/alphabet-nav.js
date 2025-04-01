document.addEventListener("DOMContentLoaded", function () {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const nav = document.getElementById("alphabetNav");
    alphabet.forEach(letter => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `brands-${letter}.html`;
        link.textContent = letter;
        li.appendChild(link);
        nav.appendChild(li);
    });
});

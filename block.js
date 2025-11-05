// remove all youtube videos with negativity in the title
let contents = [];
const scanAndRemove = () => {
    if (!contents.length) return;

    document.querySelectorAll(".yt-core-attributed-string").forEach((el) => {
        if (contents.some(word => el.textContent.toLowerCase().includes(word))) {
            const parentChain = el.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
            if (parentChain) {
                parentChain.remove();
            }
        }
    });
};

// Fetch the word list
fetch("https://raw.githubusercontent.com/Sevastipol/negativewords/refs/heads/main/bad.txt")
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch word list");
        return response.text();
    })
    .then(data => {
        contents = data
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);
        setInterval(scanAndRemove, 500);
    })
    .catch(err => {
        console.error("Error loading word list:", err);
    });

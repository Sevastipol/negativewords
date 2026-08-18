let negativeRegex;

const scanAndRemove = () => {
    if (!negativeRegex) return;

    const titles = document.querySelectorAll('.yt-core-attributed-string:not([data-checked="true"])');

    for (const el of titles) {
        el.dataset.checked = "true";

        if (negativeRegex.test(el.textContent)) {
            const videoContainer = el.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer');
            
            if (videoContainer) {
                videoContainer.remove();
            }
        }
    }
};

fetch("https://raw.githubusercontent.com/Sevastipol/negativewords/refs/heads/main/bad.txt")
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch word list");
        return response.text();
    })
    .then(data => {
        const words = data
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

        negativeRegex = new RegExp(words.join('|'), 'i');

        scanAndRemove();

        const observer = new MutationObserver(() => {
            scanAndRemove();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    })
    .catch(err => {
        console.error("Error loading word list:", err);
    });

document.addEventListener("DOMContentLoaded", function () {
    const linksContainer = document.getElementById("linksContainer");
    const selectAllBtn = document.getElementById("selectAll");
    const deselectAllBtn = document.getElementById("deselectAll");
    const downloadBtn = document.getElementById("download");

    // Request links from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: extractLinks
            },
            (results) => {
                if (results && results[0] && results[0].result) {
                    let extractedLinks = JSON.parse(results[0].result); // Parse JSON string
                    console.log("Extracted Links:", extractedLinks);
                    displayLinks(extractedLinks);
                } else {
                    console.error("No results returned from content script.");
                }
            }
        );
    });

    // Display links with checkboxes
    function displayLinks(links) {
        linksContainer.innerHTML = "";
        links.forEach((link, index) => {
            const div = document.createElement("div");
            div.classList.add("link-item");
            div.innerHTML = `<input type="checkbox" class="link-checkbox" id="chk${index}" data-url="${link}">
                             <label for="chk${index}">${link}</label>`;
            linksContainer.appendChild(div);
        });

        updateSelectedCount();
    }

    // Select All
    selectAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".link-checkbox").forEach(cb => cb.checked = true);
        updateSelectedCount();
    });

    // Deselect All
    deselectAllBtn.addEventListener("click", () => {
        document.querySelectorAll(".link-checkbox").forEach(cb => cb.checked = false);
        updateSelectedCount();
    });

    // Update selection count
    function updateSelectedCount() {
        const selectedCount = document.querySelectorAll(".link-checkbox:checked").length;
        downloadBtn.textContent = `Download (${selectedCount})`;
    }

    // Update count when checkboxes are toggled
    linksContainer.addEventListener("change", updateSelectedCount);
});


function extractLinks() {
    let links = [...document.querySelectorAll("a[href]")].map(a => a.href);
    return JSON.stringify([...new Set(links)]); // Convert to JSON string
}

document.addEventListener("DOMContentLoaded", function () {
    const linksContainer = document.getElementById("linksContainer");
    const selectAllBtn = document.getElementById("selectAll");
    const deselectAllBtn = document.getElementById("deselectAll");
    const downloadBtn = document.getElementById("download");

    // Request list of attachments from the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: extractAttachments
            },
            (results) => {
                if (results && results[0] && results[0].result) {
                    let extractedLinks = JSON.parse(results[0].result);
                    displayLinks(extractedLinks);
                }
            }
        );
    });

    // Display extracted links with checkboxes
    function displayLinks(links) {
        linksContainer.innerHTML = "";
        links.forEach((link, index) => {
            const div = document.createElement("div");
            div.classList.add("link-item");
            div.innerHTML = `<input type="checkbox" class="link-checkbox" id="chk${index}" data-id="${link.id}">
                             <label for="chk${index}">${link.name}</label>`;
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

    // Handle Download Button Click
    downloadBtn.addEventListener("click", () => {
        const selectedIds = [];
        document.querySelectorAll(".link-checkbox:checked").forEach(cb => {
            selectedIds.push(cb.getAttribute("data-id"));
        });

        if (selectedIds.length > 0) {
            // alert("Downloading selected attachments. Please wait for the download to complete.");
            chrome.runtime.sendMessage({ action: "simulateClick", ids: selectedIds });
            alert("Downloading selected attachments. Please wait for the download to complete.");
        }
    });
});


function extractAttachments() {
    let attachments = [];

    document.querySelectorAll("#rfq-display-attachments-list a").forEach((a, index) => {
        let fileName = a.innerText.trim();
        let id = a.id; // Get the unique ID of the <a> tag

        if (fileName && id) {
            attachments.push({ name: fileName, id: id });
        }
    });

    return JSON.stringify([...new Set(attachments)]); // Remove duplicates
}

function simulateUserClicks(selectedIds) {
    selectedIds.forEach(id => {
        let attachment = document.getElementById(id);
        if (attachment) {
            attachment.click(); // Simulate user clicking the link
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "simulateClick" && message.ids) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: simulateUserClicks,
                args: [message.ids]
            });
        });
    }
});

// Capture download requests and process them silently
chrome.downloads.onCreated.addListener((downloadItem) => {
    if (downloadItem.url) {
        chrome.downloads.download({
            url: downloadItem.url,
            filename: "RFQ_Attachments/" + downloadItem.filename,
            conflictAction: "uniquify",
            saveAs: false
        });

        // Cancel the original user-initiated download to prevent duplicate downloads
        chrome.downloads.cancel(downloadItem.id);
    }
});


function simulateUserClicks(selectedIds) {
    selectedIds.forEach(id => {
        let attachment = document.getElementById(id);
        if (attachment) {
            attachment.click(); // Simulate user clicking the link
        }
    });
}

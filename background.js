chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "downloadFiles" && message.urls) {
        let folderName = "Downloaded_Files_" + new Date().toISOString().replace(/[:.]/g, '-'); // Folder name with timestamp
        message.urls.forEach(url => {
            let filename = url.split('/').pop();
            chrome.downloads.download({
                url: url,
                filename: folderName + "/" + filename,
                conflictAction: "uniquify",
                saveAs: false
            });
        });
    }
});

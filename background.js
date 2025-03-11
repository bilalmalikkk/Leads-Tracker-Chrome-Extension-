chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getActiveTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                sendResponse({ url: tabs[0].url });
            } else {
                sendResponse({ url: "" });
            }
        });
        return true; // ✅ Keeps the `sendResponse` function alive for async callback
    }
});

const executeIfAllowed = func => (...args) => {
    chrome.storage.local.get([StorageKeys.extensionState], state => {
        const extensionState = state[StorageKeys.extensionState];
        if (extensionState === ExtensionStates.on) {
            func(...args);
        }
    });
}

function getWebdiplomacyPageFromPathname(pathname) {
    const path = pathname.replaceAll("/", "").replaceAll(".php", "");

    return WebdiplomacyPathsToPageMap[path];
}

function createMessage(type, content = {}) {
    return {
        type,
        ...content
    };
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, SYNCHRONOUS);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function setIntervalStartNow(func, delay) {
    func();
    return setInterval(func, delay);
}

const createMessageListener = MessageHandlers => (request, sender, sendResponse) => {
    MessageHandlers[request.type](request, sender, sendResponse);
};
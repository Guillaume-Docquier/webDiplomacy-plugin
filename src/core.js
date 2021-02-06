const executeIfAllowed = func => (...args) => {
    chrome.storage.local.get([StorageKeys.extensionState], state => {
        const extensionState = state[StorageKeys.extensionState];
        if (extensionState === ExtensionStates.on) {
            func(...args);
        }
    });
}

function getWebdiplomacyPageFromUrlString(urlString) {
    const url = new URL(urlString);
    const path = url.pathname.replaceAll("/", "").replaceAll(".php", "");

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
    console.groupCollapsed(`Received ${request.type} message`);

    const handler = MessageHandlers[request.type];
    if (handler) {
        console.log(`Handler found: ${handler.name}`);
        handler(request, sender, sendResponse);
    }
    else {
        console.error("No handler found!");
    }

    console.groupEnd();
};

function domStringToDomElement(domString) {
    const parser = new DOMParser();

    return parser.parseFromString(domString, MIME_TYPE_HTML);
}
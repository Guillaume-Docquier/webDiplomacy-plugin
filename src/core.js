const executeIfAllowed = (func, settingKey = "") => (...args) => {
    chrome.storage.local.get([StorageKeys.extensionState, settingKey], state => {
        const extensionState = state[StorageKeys.extensionState];
        if (extensionState === Toggle.ON) {
            const setting = state[settingKey];
            if (!setting || setting === Toggle.ON) {
                func(...args);
            }
            else {
                console.log(`Setting ${settingKey} is ${setting}. Invocation of ${func.name} denied`);
            }
        }
    });
}

function getWebdiplomacyPageFromUrlString(urlString) {
    const url = new URL(urlString);
    const path = url.pathname.replaceAll("/", "").replaceAll(".php", "");

    return WebdiplomacyPathsToPageMap[path];
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

function createMessage(type, content = {}) {
    console.log(`[OUT] ${type}`);
    const message = {
        type,
        ...content
    };

    return message;
}

const createMessageListener = MessageHandlers => (request, sender, sendResponse) => {
    console.log(`[IN] ${request.type}`);
    const handler = MessageHandlers[request.type];
    if (handler) {
        handler(request, sender, sendResponse);
    }
    else {
        console.error(`No handler found for message ${request.type}`);
    }
};

function domStringToDomElement(domString) {
    const parser = new DOMParser();

    return parser.parseFromString(domString, MIME_TYPE_HTML);
}

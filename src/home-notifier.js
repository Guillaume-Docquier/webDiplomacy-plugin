const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const SYNCHRONOUS = false;
const MIME_TYPE_HTML = "text/html";
const DECIMAL_RADIX = 10;

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, SYNCHRONOUS);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function parseNotice(noticeDOMElement) {
    const gameNameWrapper = noticeDOMElement.getElementsByClassName("homeForumSubject")[0];
    const gameNameAnchor = gameNameWrapper.getElementsByTagName("a")[0];

    return {
        gameId: Number.parseInt(noticeDOMElement.getAttribute("gameid"), DECIMAL_RADIX),
        gameName: gameNameAnchor ? gameNameAnchor.textContent : gameNameWrapper.textContent,
        unixTimestamp: Number.parseInt(noticeDOMElement.getElementsByClassName("timestamp")[0].getAttribute("unixtime"), DECIMAL_RADIX),
        event: noticeDOMElement.getElementsByClassName("homeForumMessage")[0].textContent
    };
}

function checkForUpdates() {
    console.log("Checking for updates");
    const homePage = httpGet(window.location.href);
    const parser = new DOMParser();
    const doc = parser.parseFromString(homePage, MIME_TYPE_HTML);

    checkForNoticesUpdates(doc);

    document.body = doc.body;
}

function checkForNoticesUpdates(newDocument) {
    const notices =  Array.prototype.map.call(newDocument.getElementsByClassName("homeNotice"), parseNotice);

    chrome.storage.local.get([StorageKeys.lastNoticeTimestamp, StorageKeys.trackedGameIds], state => {
        const lastNoticeTimestamp = state[StorageKeys.lastNoticeTimestamp];
        const trackedGameIds = state[StorageKeys.trackedGameIds];

        chrome.storage.local.set({ lastNoticeTimestamp: notices[0].unixTimestamp });
        if (lastNoticeTimestamp) {
            const newNotices = notices.filter(notice => notice.unixTimestamp > lastNoticeTimestamp && trackedGameIds.includes(notice.gameId));
            if (newNotices.length > 0) {
                // TODO Probably notify latest for each game or summarize each game?
                console.log("New notices found!", newNotices);
                chrome.runtime.sendMessage({ type: MessageTypes.noticeNotification, notice: newNotices[0] });
            }
        }
    });
}

console.log("Running webDiplomacy-plugin/home-notifier");
chrome.storage.local.set({ lastNoticeTimestamp: 1611031121, trackedGameIds: [341804] }); // TODO Make the trackedGameIds configurable
executeIfAllowed(checkForUpdates)();
setInterval(executeIfAllowed(checkForUpdates), 10 * SECONDS)
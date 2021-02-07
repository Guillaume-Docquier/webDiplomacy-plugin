const SYNCHRONOUS = false;
const MEMBERS_TABLE_COUNTRIES_ROW_INDEX = 0;
const MEMBERS_TABLE_MESSAGES_ROW_INDEX = 2;

const MessageHandlers = {
    [MessageTypes.fetchYourself]: fetchYourselfHandler,
    [MessageTypes.updatePageContent]: updatePageContentHandler
};

function fetchYourselfHandler() {
    const newContent = checkForUpdates();
    chrome.runtime.sendMessage(createMessage(MessageTypes.newHomePage, { newContent }));
}

function updatePageContentHandler({ newContent }) {
    const doc = domStringToDomElement(newContent);
    document.body = doc.body;
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
    const homePage = httpGet(window.location.href);
    const doc = domStringToDomElement(homePage);

    checkForNewNotices(doc);
    checkForNewMessages(doc);

    document.body = doc.body;

    return homePage;
}

function checkForNewNotices(newDocument) {
    const notices = Array.prototype.map.call(newDocument.getElementsByClassName("homeNotice"), parseNotice);

    chrome.storage.local.get([StorageKeys.lastNoticeTimestamp], state => {
        const lastNoticeTimestamp = state[StorageKeys.lastNoticeTimestamp];

        chrome.storage.local.set({ [StorageKeys.lastNoticeTimestamp]: notices[0].unixTimestamp });
        if (lastNoticeTimestamp) {
            const newNotices = notices.filter(notice => notice.unixTimestamp > lastNoticeTimestamp);
            if (newNotices.length > 0) {
                // TODO Probably notify latest for each game or summarize each game?
                console.log("New notices found!", newNotices);
                executeIfAllowed(chrome.runtime.sendMessage, Settings.notifyOfNewNotice)(createMessage(MessageTypes.newNotice, { notice: newNotices[0] }));
            }
        }
    });
}

function parseMessagesStatus(gameDom) {
    const gameId = Number.parseInt(gameDom.getAttribute("gameid"), DECIMAL_RADIX);
    const gameName = gameDom.getElementsByClassName("homeGameTitleBar")[0].textContent;

    const messageData = {};
    const membersTableRows = gameDom.getElementsByClassName("homeMembersTableTr");
    const countryTds = membersTableRows[MEMBERS_TABLE_COUNTRIES_ROW_INDEX].getElementsByTagName("td");
    for (let i = 0; i < countryTds.length; i++) {
        const country = countryTds[i].getElementsByTagName("span")[0].textContent;
        messageData[country] = false;
    }

    if (membersTableRows[MEMBERS_TABLE_MESSAGES_ROW_INDEX]) {
        const messageTds = membersTableRows[MEMBERS_TABLE_MESSAGES_ROW_INDEX].getElementsByTagName("td");
        for (let i = 0; i < countryTds.length; i++) {
            const country = countryTds[i].getElementsByTagName("span")[0].textContent;
            const hasNewMessage = messageTds[i].getElementsByTagName("a").length > 0;
            messageData[country] = hasNewMessage;
        }
    }

    return {
        gameId,
        gameName,
        messageData
    };
}

function checkForNewMessages(newDocument) {
    const newGamesMessageStatuses = Array.prototype.map.call(
            newDocument.getElementsByClassName("homeGamesStats")[0].getElementsByClassName("gamePanelHome"),
            parseMessagesStatus
        )
        .filter(messages => messages)
        .reduce((acc, messageStatus) => {
            acc[messageStatus.gameId] = messageStatus;

            return acc;
        }, {});

    chrome.storage.local.get([StorageKeys.gamesMessageStatuses], state => {
        const gamesMessageStatuses = state[StorageKeys.gamesMessageStatuses];

        for (const gameIdString in newGamesMessageStatuses) {
            const gameId = Number.parseInt(gameIdString, DECIMAL_RADIX);
            const gamesMessageStatus = gamesMessageStatuses[gameId];
            if (gamesMessageStatus) {
                const gamesMessageData = gamesMessageStatus.messageData;
                const newGamesMessageData = newGamesMessageStatuses[gameId].messageData;
                const newSenders = [];
                for (const country in gamesMessageData) {
                    if (!gamesMessageData[country] && newGamesMessageData[country]) {
                        newSenders.push(country);
                    }
                }

                if (newSenders.length > 0) {
                    console.log("New messages found!", gameId, newSenders);
                    const newMessages = {
                        gameId,
                        gameName: newGamesMessageStatuses[gameId].gameName,
                        from: newSenders
                    };
                    executeIfAllowed(chrome.runtime.sendMessage, Settings.notifyOfNewMessage)(createMessage(MessageTypes.newMessages, { newMessages }));
                }
            }
        }

        chrome.storage.local.set({ [StorageKeys.gamesMessageStatuses]: newGamesMessageStatuses });
    });
}

function initializeHomeState() {
    // test lastNoticeTimestamp: 1611031121
    /* test gamesMessageStatuses {
        341804: {
            gameId: 341804,
            gameName: "3e guerre mondiale dans un uni...",
            messageData: {
                Aus: false,
                Eng: false,
                Fra: false,
                Ger: false,
                Ita: false,
                Rus: false,
                Tur: false
            }
        }
    }*/
    chrome.storage.local.set({
        [StorageKeys.lastNoticeTimestamp]: 0,
        [StorageKeys.gamesMessageStatuses]: {}
    });
}

console.log("Running webDiplomacy-plugin/home-notifier");
initializeHomeState();
chrome.runtime.onMessage.addListener(createMessageListener(MessageHandlers));
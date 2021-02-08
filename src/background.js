const MessageHandlers = {
    [MessageTypes.wakeUp]: wakeUpHandler,
    [MessageTypes.newNotice]: newNoticeHandler,
    [MessageTypes.newMessages]: newMessagesHandler,
    [MessageTypes.newHomePage]: newHomePageHandler
};

function wakeUpHandler() {
    console.log("Yes yes, I'm awake!");
}

function newNoticeHandler({ notice }) {
    const { gameId, unixTimestamp, event, gameName } = notice;

    chrome.notifications.create(`${gameId}-${unixTimestamp}`, {
        type: NotificationTypes.basic,
        iconUrl: "webDiplomacy-logo.png",
        title: `Diplomacy: ${gameName}`,
        message: event,
        contextMessage: "Web Diplomacy Update"
    });
}

function newMessagesHandler({ newMessages }) {
    const { gameId, gameName, from } = newMessages;

    chrome.notifications.create(`${gameId}-${Date.now()}`, {
        type: NotificationTypes.basic,
        iconUrl: "webDiplomacy-logo.png",
        title: `Diplomacy: ${gameName}`,
        message: `New messages from ${from.join(", ")}`,
        contextMessage: "Web Diplomacy Update"
    });
}

function newHomePageHandler({ newContent }, sender) {
    chrome.tabs.query({ url: WEBDIPLOMACY_URL_PATTERNS }, webDiplomacyTabs => {
        if (webDiplomacyTabs && webDiplomacyTabs.length > 0) {
            const tabsToUpdate = webDiplomacyTabs.filter(tab => getWebdiplomacyPageFromUrlString(tab.url) === WebdiplomacyPages.HOME && tab.id !== sender.tab.id);
            for (let tab of tabsToUpdate) {
                chrome.tabs.sendMessage(tab.id, createMessage(MessageTypes.updatePageContent, { newContent }));
            }
        }
    });
}

function initializeSettings() {
    chrome.storage.local.get(Object.values(Settings), state => {
        for (let settingName in Settings) {
            if (!state[settingName]) {
                state[settingName] = DefaultSettings[settingName];
            }
        }

        console.log("Settings", state);
        chrome.storage.local.set(state);
    });
}

function initializeBrowserActionIcon() {
    chrome.storage.local.get([StorageKeys[Settings.extensionState]], state => {
        let extensionState = state[StorageKeys[Settings.extensionState]];
        if (!extensionState) {
            extensionState = DefaultSettings[Settings.extensionState];
        }
    
        chrome.browserAction.setIcon({ path: `webDiplomacy-logo-${extensionState}.png`});
    });
}

function checkForUpdates() {
    chrome.tabs.query({ url: WEBDIPLOMACY_URL_PATTERNS }, webDiplomacyTabs => {
        if (webDiplomacyTabs && webDiplomacyTabs.length > 0) {
            const tabsByPage = Object.values(WebdiplomacyPages).reduce((pages, page) => {
                pages[page] = [];

                return pages;
            }, {});

            for (let tab of webDiplomacyTabs) {
                const page = getWebdiplomacyPageFromUrlString(tab.url);
                if (page) {
                    const url = new URL(tab.url);
                    tabsByPage[page].push({
                        ...tab,
                        url,
                        gameId: url.searchParams.get(GAME_ID_SEARCH_PARAM)
                    });
                }
            }

            if (tabsByPage[WebdiplomacyPages.HOME].length > 0) {
                // Ask a single home page to refresh
                const tab = tabsByPage[WebdiplomacyPages.HOME][0];

                console.log("Asking a home page to fetch itself");
                chrome.tabs.sendMessage(tab.id, createMessage(MessageTypes.fetchYourself));
            }
            else if (tabsByPage[WebdiplomacyPages.GAME].length > 0) {
                // Ask a single game page of every game to refresh
                const gamesAsked = {};
                for (let { id: tabId, gameId } of tabsByPage[WebdiplomacyPages.GAME]) {
                    if (!gamesAsked[gameId]) {
                        gamesAsked[gameId] = true;

                        console.log(`Asking game ${gameId} to fetch itself`);
                        chrome.tabs.sendMessage(tabId, createMessage(MessageTypes.fetchYourself));
                    }
                }
            }
        }
    });
}

console.log("Running webDiplomacy-plugin/background");
initializeSettings();
initializeBrowserActionIcon();
chrome.runtime.onMessage.addListener(createMessageListener(MessageHandlers));
setIntervalStartNow(executeIfAllowed(checkForUpdates), 10 * SECONDS);

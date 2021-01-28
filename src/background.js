const MessageHandlers = {
    [MessageTypes.newNotice]: newNoticeHandler,
    [MessageTypes.newMessages]: newMessagesHandler
};

function newNoticeHandler({ notice }) {
    console.log("Handling new webDiplomacy notice");
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
    console.log("Handling new webDiplomacy messages");
    const { gameId, gameName, from } = newMessages;

    chrome.notifications.create(`${gameId}-${Date.now()}`, {
        type: NotificationTypes.basic,
        iconUrl: "webDiplomacy-logo.png",
        title: `Diplomacy: ${gameName}`,
        message: `New messages from ${from.join(", ")}`,
        contextMessage: "Web Diplomacy Update"
    });
}

function messageListener(request, sender, sendResponse) {
    MessageHandlers[request.type](request, sender, sendResponse);
}

function toggleExtensionState() {
    chrome.storage.local.get([StorageKeys.extensionState], state => {
        const extensionState = state[StorageKeys.extensionState];

        const newExtensionState = extensionState === ExtensionStates.on ? ExtensionStates.off : ExtensionStates.on;
        chrome.storage.local.set({ [StorageKeys.extensionState]: newExtensionState });
        chrome.browserAction.setIcon({ path: `webDiplomacy-logo-${newExtensionState}.png`});
    });
};

function initializeBrowserActionIcon() {
    chrome.storage.local.get([StorageKeys.extensionState], state => {
        let extensionState = state[StorageKeys.extensionState];
        if (!extensionState) {
            extensionState = ExtensionStates.on;
            chrome.storage.local.set({ [StorageKeys.extensionState]: extensionState });
        }
    
        chrome.browserAction.setIcon({ path: `webDiplomacy-logo-${extensionState}.png`});
    });
}

initializeBrowserActionIcon();
chrome.browserAction.onClicked.addListener(toggleExtensionState);
chrome.runtime.onMessage.addListener(messageListener);
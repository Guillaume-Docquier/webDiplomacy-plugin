const MessageHandlers = {
    [MessageTypes.noticeNotification]: noticeNotificationHandler
};

function noticeNotificationHandler({ notice }) {
    const { gameId, unixTimestamp, event, gameName } = notice;

    chrome.notifications.create(`${gameId}-${unixTimestamp}`, {
        type: NotificationTypes.basic,
        iconUrl: "webDiplomacy-logo.png",
        title: `Diplomacy: ${gameName}`,
        message: event,
        contextMessage: "Web Diplomacy Update"
    });
}

function messageListener(request, sender, sendResponse) {
    MessageHandlers[request.type](request, sender, sendResponse);
}

function toggleExtensionState() {
    chrome.storage.local.get([StorageKeys.extensionState], state => {
        const extensionState = state[StorageKeys.extensionState] || ExtensionStates.on;

        const newExtensionState = extensionState === ExtensionStates.on ? ExtensionStates.off : ExtensionStates.on;
        chrome.storage.local.set({ extensionState: newExtensionState });
        chrome.browserAction.setIcon({ path: `webDiplomacy-logo-${newExtensionState}.png`});
    });
};

chrome.browserAction.onClicked.addListener(toggleExtensionState);
chrome.runtime.onMessage.addListener(messageListener);
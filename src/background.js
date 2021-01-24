const MessageHandlers = {
    [MessageTypes.newNotice]: newNoticeHandler
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

    chrome.tabs.query({ url: MessengerUrlPattern }, messengerTabs => {
        chrome.storage.local.get([StorageKeys.messengerConversationIds], state => {
            const messengerConversationIds = state[StorageKeys.messengerConversationIds];

            const tabsToNotify = {};
            for (const { id: tabId, url } of messengerTabs) {
                const urlParts = url.split("/");
                const conversationId = Number.parseInt(urlParts[urlParts.length - 1]);
                if (messengerConversationIds.includes(conversationId)) {
                    tabsToNotify[conversationId] = tabId;
                }
            }

            console.log(tabsToNotify);
            for (const conversationId in tabsToNotify) {
                const tabId = tabsToNotify[conversationId];
                console.log(`Notifying messenger conversation "${conversationId}" of new notice`);
                chrome.tabs.sendMessage(tabId, { notice, conversationId });
            }
        });
    });
}

function messageListener(request, sender, sendResponse) {
    MessageHandlers[request.type](request, sender, sendResponse);
}

function toggleExtensionState() {
    chrome.storage.local.get([StorageKeys.extensionState], state => {
        const extensionState = state[StorageKeys.extensionState] || ExtensionStates.on;

        const newExtensionState = extensionState === ExtensionStates.on ? ExtensionStates.off : ExtensionStates.on;
        chrome.storage.local.set({ [StorageKeys.extensionState]: newExtensionState });
        chrome.browserAction.setIcon({ path: `webDiplomacy-logo-${newExtensionState}.png`});
    });
};

chrome.storage.local.set({ [StorageKeys.messengerConversationIds]: [3315564371868011] }); // TODO Make the convo configurable
chrome.browserAction.onClicked.addListener(toggleExtensionState);
chrome.runtime.onMessage.addListener(messageListener);
const StorageKeys = {
    extensionState: "extensionState",
    lastNoticeTimestamp: "lastNoticeTimestamp",
    trackedGameIds: "trackedGameIds",
    messengerConversationIds: "messengerConversationIds"
};

const MessageTypes = {
    newNotice: "new-notice"
};

const ExtensionStates = {
    on: "on",
    off: "off"
};

// https://developer.chrome.com/docs/extensions/reference/notifications/#type-TemplateType
const NotificationTypes = {
    basic: "basic",
    image: "image",
    list: "list",
    progress: "progress"
};

const MessengerUrlPattern = "https://www.messenger.com/t/*";
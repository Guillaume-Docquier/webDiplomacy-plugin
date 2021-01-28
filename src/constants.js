const StorageKeys = {
    extensionState: "extensionState",
    lastNoticeTimestamp: "lastNoticeTimestamp",
    trackedGameIds: "trackedGameIds",
    gamesMessageStatuses: "gamesMessageStatuses"
};

const MessageTypes = {
    newNotice: "newNotice",
    newMessages: "newMessages"
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

const DECIMAL_RADIX = 10;
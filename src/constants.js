const StorageKeys = {
    extensionState: "extensionState",
    lastNoticeTimestamp: "lastNoticeTimestamp",
    trackedGameIds: "trackedGameIds"
};

const MessageTypes = {
    noticeNotification: "notice-notification"
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
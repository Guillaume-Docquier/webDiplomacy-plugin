const Settings = {
    extensionState: "extensionState",
    notifyOfNewNotice: "notifyOfNewNotice",
    notifyOfNewMessage: "notifyOfNewMessage",
    largeMapEnabled: "largeMapEnabled",
    defaultMapSize: "defaultMapSize"
};

const MapSize = {
    SMALL: "small",
    LARGE: "large"
};

const Toggle = {
    ON: "on",
    OFF: "off"
};

const DefaultSettings = {
    [Settings.extensionState]: Toggle.ON,
    [Settings.notifyOfNewNotice]: Toggle.ON,
    [Settings.notifyOfNewMessage]: Toggle.ON,
    [Settings.largeMapEnabled]: Toggle.ON,
    [Settings.defaultMapSize]: MapSize.LARGE
};

const StorageKeys = {
    [Settings.extensionState]: Settings.extensionState,
    [Settings.notifyOfNewNotice]: Settings.notifyOfNewNotice,
    [Settings.notifyOfNewMessage]: Settings.notifyOfNewMessage,
    [Settings.largeMapEnabled]: Settings.largeMapEnabled,
    [Settings.defaultMapSize]: Settings.defaultMapSize,
    lastNoticeTimestamp: "lastNoticeTimestamp",
    gamesMessageStatuses: "gamesMessageStatuses"
};

const MessageTypes = {
    wakeUp: "wakeUp",
    newNotice: "newNotice",
    newMessages: "newMessages",
    fetchYourself: "fetchYourself",
    newHomePage: "newHomePage",
    updatePageContent: "updatePageContent"
};

// https://developer.chrome.com/docs/extensions/reference/notifications/#type-TemplateType
const NotificationTypes = {
    basic: "basic",
    image: "image",
    list: "list",
    progress: "progress"
};

const DECIMAL_RADIX = 10;

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

const WEBDIPLOMACY_URL_PATTERNS = [
    "*://www.webdiplomacy.net/*",
    "*://webdiplomacy.net/*"
];

const WebdiplomacyPages = {
    HOME: "home",
    GAME: "game"
};

const WebdiplomacyPathsToPageMap = {
    "": WebdiplomacyPages.HOME,
    "index": WebdiplomacyPages.HOME,
    "board": WebdiplomacyPages.GAME,
};

const GAME_ID_SEARCH_PARAM = "gameID";

const MIME_TYPE_HTML = "text/html";

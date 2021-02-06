const StorageKeys = {
    extensionState: "extensionState",
    lastNoticeTimestamp: "lastNoticeTimestamp",
    gamesMessageStatuses: "gamesMessageStatuses"
};

const MessageTypes = {
    newNotice: "newNotice",
    newMessages: "newMessages",
    fetchYourself: "fetchYourself",
    newHomePage: "newHomePage",
    updatePageContent: "updatePageContent"
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
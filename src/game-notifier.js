const MessageHandlers = {
    [MessageTypes.fetchYourself]: fetchYourselfHandler,
};

function fetchYourselfHandler() {
    console.log("TODO");
}

function initializeGameState() {
    console.log("TODO");
}

console.log("Running webDiplomacy-plugin/game-notifier");
initializeGameState();
chrome.runtime.onMessage.addListener(createMessageListener(MessageHandlers));
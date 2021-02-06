const MessageHandlers = {
    [MessageTypes.fetchYourself]: fetchYourselfHandler,
};

function fetchYourselfHandler() {
    console.log("fetchYourselfHandler");
}

function initializeGameState() {
    console.log("initializeGameState");
}

console.log("Running webDiplomacy-plugin/game-notifier");
initializeGameState();
chrome.runtime.onMessage.addListener(createMessageListener(MessageHandlers));
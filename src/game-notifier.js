const MessageHandlers = {
    [MessageTypes.fetchYourself]: fetchYourselfHandler,
};

function fetchYourselfHandler() {
}

function initializeGameState() {
}

console.log("Running webDiplomacy-plugin/game-notifier");
initializeGameState();
chrome.runtime.onMessage.addListener(createMessageListener(MessageHandlers));
chrome.runtime.sendMessage(createMessage(MessageTypes.wakeUp));

const AriaLabel = "aria-label";
const LikeButtonAriaLabelPrefix = "Envoyer un";

// I can't seem to send a message via the dom unfortunately...
// Sending a like is easy enough, however!
// Might want to try this out though:
// https://developer.nexmo.com/messages/code-snippets/messenger/send-text
function sendNoticeInMessenger({ notice, conversationId }) {
    console.log(`Sending a like to conversation ${conversationId} because "${notice.event}"`);
    const ariaLabelDivs = document.querySelectorAll(`div[${AriaLabel}]`);
    const likeButtonCandidates = Array.prototype.filter.call(ariaLabelDivs, ariaLabelDiv => ariaLabelDiv.getAttribute(AriaLabel).startsWith(LikeButtonAriaLabelPrefix));
    if (likeButtonCandidates.length > 0) {
        likeButtonCandidates[0].click();
    }
}

console.log("Running webDiplomacy-plugin/notify-in-messenger");
chrome.runtime.onMessage.addListener(sendNoticeInMessenger);

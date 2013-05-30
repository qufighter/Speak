chrome.extension.onRequest.addListener(
function(request, sender, sendResponse) {
var text = window.getSelection().toString();
sendResponse({t:text});
});
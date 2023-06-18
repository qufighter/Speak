// this file is part of the serial speed reader extension and allows us to get the text selection when requested
chrome.extension.onRequest.addListener(
function(request, sender, sendResponse) {
var text = window.getSelection().toString();
sendResponse({t:text});
});

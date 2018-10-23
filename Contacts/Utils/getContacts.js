let ident = chrome.identity;
let ContactsDetails = {};
function getUserContacts(){
    ident.getAuthToken({
        interactive: true
    }, function(token) {
        if (chrome.runtime.lastError) {
            alert(chrome.runtime.lastError.message);
            return;
        }
        var x = new XMLHttpRequest();
        x.open('GET', 'https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=' + token);
        x.onload = function() {
            ContactsDetails = x.response;
        };
        x.send();
    });
}
chrome.extension.onMessage.addListener(function(request, sender, sendMessage) {
    if (request.method == "getServerInfo")
      sendMessage({url: localStorage['doubanpacURL'],
                   username: localStorage['doubanpacUSERNAME'],
                   password: localStorage['doubanpacPASSWORD']});
    else
      sendMessage({});
});
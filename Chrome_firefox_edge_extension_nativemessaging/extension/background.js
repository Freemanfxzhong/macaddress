var tabId = null
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {    
  console.log('hello')
  messageType = message.type || null;
  messageValue = message.value || null;
  if (messageType){
    if (messageType == "connect"){
      tabId = sender.tab.id
      connect();
    } else if (messageType == "send text"){
      sendNativeMessage(messageValue);
    }
  } 

  //    window.perfWatch[sender.tab.id] = message.essential || null;
});




function sendNativeMessage(message) {
  port.postMessage(message);
}

function onNativeMessage(message) {  
  sendMessageToTab({ type: "background send back text", value: message });
}

function onDisconnected() {
  port = null;
  sendMessageToTab({ type: "connect disconnected", value: "" });
}

function connect() {
  var hostName = "com.hsbc.chrome.poc";
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  sendMessageToTab({ type: "connect done", value: "" });
}

function sendMessageToTab(message){
  // just for poc only.. assume only 1 tab for poc
  //chrome.tabs.sendMessage(tabId, message);
  chrome.storage.local.set({message: message}, function() {
    console.log('Value is set to ' + message);
  });
}
console.log('<----- Content script started running ----->');

function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}

injectScript(chrome.runtime.getURL('inject-script.js'), 'body');

setInterval(() => {
    chrome.storage.local.get("message", ({ message }) => {
        if (message==null) return;
        messageType = message.type || null;
        messageValue = message.value || null;
        chrome.storage.local.set({message: null}, function() {
            console.log('Message is set to null');
          });
        if (messageType == "connect done"){
            connectDone();
        } else if (messageType == "background send back text"){
            onBackgroundMessage(messageValue);
        } else if (messageType == "connect disconnected"){
            onDisconnected();
        }
      });
}, 500);

window.addEventListener("message", function (event) {
    // only accept messages from the current tab
    if (event.source == window)
        return;
  

      messageType = event.data.type || null;
      messageValue = event.data.value || null;
      if (messageType == "connect done"){
        connectDone();
      } else if (messageType == "background send back text"){
        onBackgroundMessage(messageValue);
      } else if (messageType == "connect disconnected"){
        onDisconnected();
      }
  
  }, false);
  
  var connected = false;
  
  var getKeys = function(obj){
     var keys = [];
     for(var key in obj){
        keys.push(key);
     }
     return keys;
  }
  
  
  function appendMessage(text) {
    document.getElementById('response').innerHTML += "<p>" + text + "</p>";
  }
  
  function updateUiState() {
    if (connected) {
      document.getElementById('connect-button').style.display = 'none';
      document.getElementById('input-text').style.display = 'block';
      document.getElementById('send-message-button').style.display = 'block';
    } else {
      document.getElementById('connect-button').style.display = 'block';
      document.getElementById('input-text').style.display = 'none';
      document.getElementById('send-message-button').style.display = 'none';
    }
  }
  
  function sendNativeMessage() {
    message = {"text": document.getElementById('input-text').value};
    chrome.runtime.sendMessage({ type: "send text", value: message });
    appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
  }
  
  function onBackgroundMessage(message) {
    appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  }
  
  function onDisconnected() {
    connected=false;
    appendMessage("disconnected");
    updateUiState();
  }
  
  function connect() {
    chrome.runtime.sendMessage({ type: "connect", value: "" });
  }
  
  function connectDone() {
    appendMessage("Connection has been setup.");
    connected=true;
    updateUiState();
  }
  
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('send-message-button').addEventListener(
      'click', sendNativeMessage);
  updateUiState();
  

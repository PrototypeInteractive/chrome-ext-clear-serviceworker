// Copyright (c) 2017 Prototype.net

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });
}



function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url) {
    renderStatus('Clearing All Service Workers Attached To ' + url);
    var callback = function () {
        renderStatus('Cleared And Reloading...' + url);
        chrome.tabs.getSelected(null, function(tab) {
          var code = 'window.location.reload();';
          chrome.tabs.executeScript(tab.id, {code: code});
        });
      };

      var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
      var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
      chrome.browsingData.remove({
        "since": oneWeekAgo
      }, {
        "serviceWorkers" : true
      }, callback);
      /*navigator.serviceWorker.getRegistrations().then(function(registrations) {
       for(let registration of registrations) {
       registrations.forEach(function(v) { console.log('service worker: ' + v); alert('s'); });
      } });*/
  });
});

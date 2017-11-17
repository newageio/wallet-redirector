(function awaitPostMessage() {
  var isReactNativePostMessageReady = !!window.originalPostMessage;
  var queue = [];
  var currentPostMessageFn = function store(message) {
    if (queue.length > 100) queue.shift();
    queue.push(message);
  };
  if (!isReactNativePostMessageReady) {
    var originalPostMessage = window.postMessage;
    Object.defineProperty(window, 'postMessage', {
      configurable: true,
      enumerable: true,
      get: function () {
        return currentPostMessageFn;
      },
      set: function (fn) {
        currentPostMessageFn = fn;
        isReactNativePostMessageReady = true;
        setTimeout(sendQueue, 0);
      }
    });
    window.postMessage.toString = function () {
      return String(originalPostMessage);
    };
  }

  function sendQueue() {
    while (queue.length > 0) window.postMessage(queue.shift());
  }
}());

function sendPostMessage(result) {
  const target = window.self !== window.parent ? window.parent : window;
  target.postMessage(JSON.stringify({ result: result }), '*');
}
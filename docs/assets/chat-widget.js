/* AwesomeQA/Pluno community widget loader */
(function () {
  var script = document.createElement('script');
  script.id = 'pluno-chat-widget-script';
  script.type = 'text/javascript';
  script.src = 'https://app.pluno.ai/web-support/chat-widget.js';
  script.setAttribute('communityId', '3b9c0413-c24b-4cd8-8ff0-981c964a32dd');
  script.setAttribute('config', JSON.stringify({ position: 'bottom-right' }));
  document.head.appendChild(script);
})(); 
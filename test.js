var WebSocket = require('faye-websocket'),
    ws        = new WebSocket.Client('ws://localhost:8001/subscribe?user_id=654321&recipient_id=123456');

ws.on('open', function(event) {
  console.log('open');
  setInterval(function(){
    ws.send('baozoumanhua!');
  },2000);
});

ws.on('message', function(event) {
  console.log('message', event.data);
});

ws.on('close', function(event) {
  console.log('close', event.code, event.reason);
  ws = null;
});
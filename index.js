var WebSocket = require('faye-websocket');
var   http    = require('http');
var    mysql  = require('mysql');
var Url = require('url');
var date = require('date');


var server = http.createServer();
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'momo_production'
});
connection.connect(function(err){
  if(err) {
    console.log("mysql connect is failed")
    return;
  }
  console.log('mysql is connected');
})

connection.query('SELECT * FROM momo_production.messages;', function(err, rows, fields) {
  if (err) throw err;
 
  console.log('The solution is: ', rows[rows.length-1]);
});

var sqlAddMessage = 'INSERT INTO messages(Content,Owner_id,Sender_id,Recipient_id,Created_at,Updated_at) VALUES (?,?,?,?,?,?) ';
var nowDate = new Date();

server.on('upgrade', function(request, socket, body) {
  if (WebSocket.isWebSocket(request)) {
    var url = Url.parse(request.url, true);
    var ws = new WebSocket(request, socket, body);
    ws.on('message', function(event) {
      ws.send(event.data);
      console.log(event.data);
     connection.query(sqlAddMessage,[event.data, url.query.user_id, url.query.user_id, url.query.recipient_id, nowDate, nowDate],function(err){
      if(err){
        console.log('save is err:'+err.message);
        return;
      }
      console.log('the sender is saved');
      // connection.query('SELECT * FROM momo_production.messages;', function(err, rows, fields) {
      //   if (err) throw err;
       
      //   console.log('The solution is: ', rows[rows.length-1]);
      // });
     })
     connection.query(sqlAddMessage,[event.data,url.query.recipient_id, url.query.user_id, url.query.recipient_id, nowDate, nowDate],function(err){
      if(err){
        console.log('save2 is err:'+ err.message);
        return;
      }
      console.log('the recipient is saved');
     })
    });

    ws.on('close', function(event) {
      console.log('close', event.code, event.reason);
      ws = null;
    });
  }
});

server.listen(8001);

/**
 * Define context for socket.io routes
 */
var utils = require("connect").utils,
    cookie = require("cookie"),
    Session = require("connect").middleware.session.Session,
    auth = require("./auth"),
    messages = require("./routes/messages.js");

// array of objects in the form: {sessionId, userId, userName, userEmail}
var connectedUsers = [];

// socket.io events
module.exports = function(app, io) {
  // add authorization for socket.io
  io.configure(function() {
    io.set("authorization", function(data, accept) {
      // data - handshake data received by the server. This should include session cookie
      // accept - callback function, that should triggered at the end of authorization route
      var signedCookies = cookie.parse(data.headers.cookie);
      var cookies = utils.parseSignedCookies(signedCookies, app.sessionSecret);
      data.sessionID = cookies["express.sid"];
      data.sessionStore = app.sessionStore;
      data.sessionStore.get(data.sessionID, function(err, session) {
        console.log("== SESSION: ", session);
        if (err || !session) {
          return accept("Invalid session", false);
        }
        else {
          data.session = new Session(data, session);
          return accept(null, true);
        }
      });
    });
  });
  io.on("connection", function(socket) {
    var session = socket.handshake.session;
    var userId = session.passport.user;
    socket.on("userConnected", function(data) {
      // when new user connects (after successfull login) to our server, we expect "userConnected" event.
      // Then we will emit an event userListChanged with list of all connected users. Event will be sent to all
      // connected clients (means browsers)
      console.log("SOCKET.IO NEW USER CONNECTED: socket.io.sessionid: ", data.sessionId, " (" + socket.id + "), userId: ", userId);
      auth.findByUserId(userId, function(error, user) {
        console.log("SOCKET.IO USER, error=", error, ", user=", user);
        if (error) {
          console.log("User (", userId, ") NOT FOUND: ", error);
          return;
        }
        var alreadyConnected = false;
        for (cu in connectedUsers) {
          if (cu.userId === userId) {
            alreadyConnected = true;
            break;
          }
        }
        if (!alreadyConnected) {
          connectedUsers.push({sessionId: socket.id, userId: userId, userName: user.username, userEmail: user.email});  
        }
        console.log("USER CONNECTED: ", connectedUsers);
        io.sockets.emit("newUserOnline", {connectedUsers: connectedUsers});
      });
    });
    socket.on("disconnect", function() {
      // when client disconnects the event is automatically captured by the server. 
      // Then new event is emitted to all clients with id of the client that is disconnected
      console.log("SOCKET.IO DISCONNECTED, userId: ", userId, " sessionId: ", socket.id, " connectedUsers: ", connectedUsers);
      var index = null;
      for (var i=0, count=connectedUsers.length; i<count; i++) {
        var item = connectedUsers[i];
        // if disconnected from the given socket
        if (item.sessionId === socket.id) {
          index = i;
          break;
        }
      }
      if (index !== null) {
        connectedUsers.splice(index, 1);
      }
      else {
        console.log("USER DISCONNECTED: session not found");
      }
      console.log("USER DISCONNECTED: ", connectedUsers);
      io.sockets.emit("userOffline", {sessionId: socket.id, userId: userId, sender: "server"});
    });
  });
  // setup reference to socket.io for all the other routes
  messages.setSocketIO(io);
}
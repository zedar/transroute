/**
 * Chat handlers
 */
 // Reference to socket.io
 var io = null;

 module.exports = {
  setSocketIO: function(socketIO) {
    io = socketIO;
  },
  message: function(req, res) {
    // Handler for post new message through the ajax call
    var msg = req.body.message;
    if (!msg || (msg.trim()) === "") {
      return res.json(400, {error: "Invalid message"});
    }
    if (io) {
      io.sockets.emit("newMessage", {from: req.user ? req.user.username : "unknown", message: msg});
    }
    else {
      console.log("MESSAGES: SOCKET.IO UNDEFINED");
    }
    return res.json(200, {message: "Got a message!"});
  }
 }

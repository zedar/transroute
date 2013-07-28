define([
  "dojo/query",
  "dojo/_base/url"
], function(query, url) {
  "use strict";
  // get base url
  var baseUrl = document.domain;
  console.log("BASE_URL: ", url.host, url.port);
  // connect to socket io
  //var socket = io.connect(baseUrl);
  // store session id from socket.io
  // var sessionId = null;
  // socket.on("connect", function() {
  //   sessionId = socket.socket.sessionId;
  //   console.log("CONNECTED: ", sessionId);
  //   socket.emit("userConnected", {id: sessionId, name: "Test"});
  // });
});
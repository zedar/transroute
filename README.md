# transroute
Portal for selling transportation routes.

# Installation
## Install Requirements
node.js is required.
npm (node.js package manager) is required too.

Install node.js packages:
npm install nodemon -g
npm install express -g
npm install less -gd

# Prepare environment
Checkout source code from git repository.
Initialize node.js project
> $ cd transroute
> $ npm install

# Running instructions
## Running locally
In order to run project in development mode
> $ nodemon app.js env=development

## Running in the cloud
We use appfog - it is free for small development.

### AppFog account
Goto appfog website, register, confirm registration. Then create new application with the name eurospedytor. AppFog generates new, empty application under the link:
  http://eurospedytor.aws.af.cm/

### Prepare env for AppFog and app deployment
Add port definition, specific to appfog to the app.js. The lates version of express.js add this port reference by default.
Install tool for appfog

> $ sudo gem install af

Login to appfog

> $ af login

Update application with current source code

> $ cd traceroute
  $ af update eurospedytor

Too see logs

> $ af logs eurospedytor


# Libraries
## i18n - many languages
We use i18next node.js plugin. It is installed as local plugin.
http://i18next.com/node/pages/doc_init.html
Short configuration instructions
http://rbeere.tumblr.com/post/41212250036/internationalization-with-express-jade-and

All localized strings are placed in 
  ./locales/{lang}/translation.json
It is possible to use language with country, but if it is not found i18next library looks for language file (locales/pl/translation.json)


## Compiling twitter bootstrap
Twitter bootstrap is placed in vendor/bootstrap directory (there is source code there).
vendor/bootstrap_custom.less is project's customization of twitter bootstrap.
After installation of less plugin for node.js, just install sublime-less2css sublime text editor plugin.
Add following settings to traceroute.sublime-project file:
  {
    "folders":
    [
      {
        "path": "/Users/zedar/dev/nodedev/transroute"
      }
    ],
    "settings":
    {
      "less2css":
      {
        "main_file": "bootstrap_custom.less",
        "outputDir": "public/stylesheets"
      }
    }
  }

## Dojo 
We use dojo for javascript functionality. Install dojo library.
> $ git submodule add git://github.com/dojo/dojo.git vendor/dojo/dojo
  $ cd vendor/dojo/dojo
  $ git checkout tags/1.9.1

## Dojo Bootstrap
Dojo bootstrap is dojo implementation of javascript helpers needed by Twitter bootstrap.
> $ git submodule add https://github.com/xsokev/Dojo-Bootstrap.git vendor/dojo/dojo-bootstrap

## Add more static and public directories
express.js use ./public folder as share with public files: javascript, csss, images.
it is possible to add more than one static folder by additional configuration in app.js file.

  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/dojo', express.static(path.join(__dirname, 'vendor/dojo')));

## Move routes definitions to separate file
Folder routes contains logic for difference get, post, etc. functions. Usually context for routes are defined in app.js file. But we can move context defs to separate file - routes.js

## passport - authentication
Passport is simple but powerfull library for managing routes authentication. It supports different strategies to authenticate users (LocalStorage, OAuth). We are going to use LocalStrategy.

> $ npm install passport
  $ npm install passport-local

All passport params are defined in ./auth.js file.

In app.js include passport library, set property cookieParser, session (with secret key). Then initialize passport and also passport session middleware

Example:
https://github.com/jaredhanson/passport-local/blob/master/examples/express3-no-connect-flash/app.js

## Use flash messages
Install additional library

> $ npm install connect-flash

## Add gzip for express.js requests
Express.js has built in support for gzip-ing of request. Just add
  app.use(express.compress());
just after app.use(express.logger("dev"));

## IPAD - correction for dropdowns
In order to make dropdowns working it is necessary to add piece of source code to require section.
  
  query('a.dropdown-toggle, .dropdown-menu a').on('touchstart', 
    function(e) {
      e.stopPropagation();
    });

## socket.io
Socket.io is async communication between clients in the browser.
> $ npm install socket.io
Example and nice article describing chat implementation:
http://www.williammora.com/2013/03/nodejs-tutorial-building-chatroom-with.html

In app.js introduce two changes:
1. just after var app = express(); load socket.io module
  var server = http.createServer(app);
  var io = require("socket.io").listen(server);
2. At the end of app.js file change http.createServer(app).listen to just
  server.listen(port)

Socket.io adds additional context to the public area of the application. In the browser it is possible to get socket.io javascript file
  http://localhost:3000/socket.io/socket.io.js
Client distribution with minified file is placed in *node_modules/socket.io/node_modules/socket.io-client/dist*

## session management and socket.io
Express.js is based on the connect framework. In app.js it is possible to provide custom configuration of session store. If it is not provided express.js uses connect's MemoryStore. This type of store is good for single instance configuration. For more advanced configuration redis should be used (look at connect-redis).
Session management is based on cookies. Connect framework contains utilities to manage (parse, decode) cookies.
Socket.io is separate communication than http. In order to authorize socket.io connection it is needed to:
1. add reference to libraries
  connect, cookie (npm install connect, npm install cookie) 
2. define session store in express configuration. In development MemoryStore could be used.
  var MemoryStore = require("connect").session.MemoryStore;
  app.sessionStore = new MemoryStore();
  app.use(express.session({store: app.sessionStore, key: "express.sid", secret: app.sessionSecret}));
3. configure authorization for socket.io (in ioroutes)

## request authenticated and ajax call (POST, PUT, DELETE)
If request is sent through the ajax call that requires authentication then in routes.js file in method ensureAuthenticated we have to add special logic:
  if (req.isAuthenticated()) {
    return next();
  }
  else if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
    res.send({redirect: "/login"});
    return;
  }
We call send method on response object. This call just sends successfull response to the browser.
Then on the browser side we have to check if *redirect* attribute is set. If yes we have to change location of our page.
  if (result.redirect) {
    window.location = result.redirect;
  }

## mongoose
All data are stored in mongoDB database. We are going to connect to mongo through mongoose. This library gives raw functionality of mongodb but allows definition of schema too.
> $ npm install mongoose

## bcrypt
Encryption of user password.
> $ npm install bcrypt
Description:
http://codetheory.in/using-the-node-js-bcrypt-module-to-hash-and-safely-store-passwords/


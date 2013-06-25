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
In order to run project in development mode
> $ nodemon app.js env=development

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



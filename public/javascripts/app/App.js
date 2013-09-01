/**
 * Main application controller on the client side
 */
define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/kernel",
  "dojo/_base/array",
  "dojo/query",
  "dojo/on",
  "dojo/router",
  "dojo/hash",
  "dojo/topic",
  "dojo/dom",
  "dojo/dom-attr",
  "dojo/dom-construct",
  "dijit/registry",
  "app/common/LayoutView",
  "app/home/HomePage",
  "app/register/RegisterPage",
  "app/login/LoginPage",
  "app/reset/ResetPasswordPage",
  "app/reset/ChangePasswordPage",
  "dojo/domReady!"
], function(declare, lang, kernel, array, query, on, router, hash, topic, dom, domAttr, domConstruct, registry, 
            LayoutView, HomePage, RegisterPage, LoginPage, ResetPasswordPage, ChangePasswordPage) {
  "use strict";
  return declare([], {
    // pageContainerNode: DomNode|null|undefined
    //  Reference to container DomNode where page should be placed
    pageContainerNode: null,

    // _stylesheetNodes: array if DOM nodes
    _stylesheetNodes: [],

    // _currentPage: _Widget
    //  Reference to currently loaded page
    _currentPage: null,

    startup: function(action, pageContainerNodeId) {
      // Summary:
      //  Create all the views. Depending on the action create additional pages.
      // Args:
      //  action: String|null|undefined - if given additional page should be rendered in contentDomNode 
      //  pageContainerNodeId: String|null|undefined - id of dom node where additional page (depending on the action) shoudl be placed

      topic.subscribe("app/stylesheets", lang.hitch(this, function(stylesheets) {
        // subscribe change of widget's specific stylesheets
        this._changeStylesheets(stylesheets);
      }));

      var layoutView = new LayoutView();
      layoutView.create();
      if (pageContainerNodeId) {
        this.pageContainerNode = dom.byId(pageContainerNodeId);
      }

      router.register("!home", lang.hitch(this, function(evt) {
        this._loadHomePage(evt);
      }));
      router.register("!features", lang.hitch(this, function(evt) {
        this._loadHomePage(evt, "features");
      }));
      router.register("!pricing", lang.hitch(this, function(evt) {
        this._loadHomePage(evt, "pricing");
      }));
      router.register("!footer", lang.hitch(this, function(evt) {
        this._loadHomePage(evt, "footer");
      }));
      router.register("!login", lang.hitch(this, function(evt) {
        this._loadLoginPage(evt);
      }));
      router.register("!register", lang.hitch(this, function(evt) {
        this._loadRegisterPage(evt);
      }));
      router.register("!resetPassword", lang.hitch(this, function(evt) {
        this._loadResetPasswordPage(evt);
      }));
      router.register("!changepassword", lang.hitch(this, function(evt) {
        this._loadChangePasswordPage(evt);
      }));

      router.startup(kernel.global.action || "!home");

      if (layoutView) {
        var nodeIds = layoutView.getNavigationNodeIds();
        array.forEach(nodeIds, lang.hitch(this, function(node, i) {
          on(dom.byId(node), "click", this._setHashOnNodeClick);    
        }));
      }
    },

    _loadHomePage: function(evt, section) {
      // Summary:
      //  Load home page. If section is given scroll to the given section.
      // section: string - id of dom element to scroll to
      if (evt) {
        evt.preventDefault();
      }
      var homePage = registry.byId("homePage");
      if (homePage) {
        if (this._currentPage && this._currentPage.id === homePage.id) {
          if (section) {
            dom.byId(section).scrollIntoView();  
          }
          return;
        }
        else {
          homePage.destroy();
        }
      }
      this._currentPage = homePage = new HomePage({id: "homePage"});
      homePage.placeAt(this.pageContainerNode, "only");
      homePage.startup();
      if (section) {
        dom.byId(section).scrollIntoView();  
      }
      var nodeIds = homePage.getNavigationNodeIds();
      array.forEach(nodeIds, lang.hitch(this, function(node, i) {
        console.log("NODE for id: ", node, " DOMNode: ", dom.byId(node));
        on(dom.byId(node), "click", this._setHashOnNodeClick);
      }));
    },

    _loadLoginPage: function(evt) {
      // Summary:
      //  Load login page
      if (evt) {
        evt.preventDefault();  
      }
      var loginPage = registry.byId("loginPage");
      if (loginPage) {
        loginPage.destroy();
      }
      this._currentPage = loginPage = new LoginPage({id: "loginPage"});
      loginPage.placeAt(this.pageContainerNode, "only");
      loginPage.startup();
      var nodeIds = loginPage.getNavigationNodeIds();
      array.forEach(nodeIds, lang.hitch(this, function(node, i) {
        on(dom.byId(node), "click", this._setHashOnNodeClick);
      }));
    },

    _loadRegisterPage: function(evt) {
      // Summary:
      //  Load register page
      if (evt) {
        evt.preventDefault();  
      }
      var registerPage = registry.byId("registerPage");
      if (registerPage) {
        registerPage.destroy();
      }
      this._currentPage = registerPage = new RegisterPage({id: "registerPage"});
      registerPage.placeAt(this.pageContainerNode, "only");
      registerPage.startup();
      var nodeIds = registerPage.getNavigationNodeIds();
      array.forEach(nodeIds, lang.hitch(this, function(node, i) {
        on(dom.byId(node), "click", this._setHashOnNodeClick);
      }));
    },

    _loadResetPasswordPage: function(evt) {
      // Summary:
      //  Load register page
      if (evt) {
        evt.preventDefault();  
      }
      var resetPage = registry.byId("resetPasswordPage");
      if (resetPage) {
        resetPage.destroy();
      }
      this._currentPage = resetPage = new ResetPasswordPage({id: "resetPasswordPage"});
      resetPage.placeAt(this.pageContainerNode, "only");
      resetPage.startup();
      var nodeIds = resetPage.getNavigationNodeIds();
      array.forEach(nodeIds, lang.hitch(this, function(node, i) {
        on(dom.byId(node), "click", this._setHashOnNodeClick);
      }));
    },

    _loadChangePasswordPage: function(evt) {
      // Summary:
      //  Load register page
      if (evt) {
        evt.preventDefault();  
      }
      var changePasswordPage = registry.byId("changePasswordPage");
      if (changePasswordPage) {
        changePasswordPage.destroy();
      }
      this._currentPage = changePasswordPage = new ChangePasswordPage({id: "changePasswordPage"});
      changePasswordPage.placeAt(this.pageContainerNode, "only");
      changePasswordPage.startup();
      var nodeIds = changePasswordPage.getNavigationNodeIds();
      array.forEach(nodeIds, lang.hitch(this, function(node, i) {
        on(dom.byId(node), "click", this._setHashOnNodeClick);
      }));
    },

    _changeStylesheets: function(stylesheets) {
      // Summary:
      //  Change stylesheets specific to widget
      // Args:
      //  stylesheets - array of stylesheets loaded by dojo/text plugin
      
      var addStylesheet = function(stylesheetNodes, stylesheet) {
        if (!stylesheet || !stylesheet.href) {
          return;
        }
        var headSN = query("head link[rel=stylesheet]"),
            refNode = null, position = null;
        if (headSN.length) {
          refNode = headSN[headSN.length-1];
          position = "after";
        }
        else {
          refNode = query("head script")[0];
          position = "before";
        }

        stylesheetNodes[stylesheetNodes.length] = domConstruct.create(
          "link",
          {
            rel: "stylesheet",
            media: stylesheet.media || "all",
            href: stylesheet.href
          },
          refNode, position);
      };

      array.forEach(this._stylesheetNodes, function(node) {
        domConstruct.destroy(node);
      });

      this._stylesheetNodes = [];

      if (stylesheets && stylesheets.length) {
        array.forEach(stylesheets, lang.hitch(this, function(stylesheet) {
          addStylesheet(this._stylesheetNodes, stylesheet);
        })); 
      }
    },

    _setHashOnNodeClick: function(evt) {
      // Summary:
      //  Call this function in the context of clickable element. Set window history hash
      // evt - DOM event
      evt.preventDefault();
      var href = domAttr.get(this, "href").replace("/", "!");
      hash(href); 
    }
  });
});

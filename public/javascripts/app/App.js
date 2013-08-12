/**
 * Main application controller on the client side
 */
define([
  "dojo/_base/declare",
  "dojo/dom",
  "app/common/LayoutView",
  "app/register/RegisterPage",
  "dojo/domReady!"
], function(declare, dom, LayoutView, RegisterPage) {
  "use strict";
  return declare([], {
    // pageContainerNode: DomNode|null|undefined
    //  Reference to container DomNode where page should be placed
    pageContainerNode: null,

    startup: function(action, pageContainerNodeId) {
      // Summary:
      //  Create all the views. Depending on the action create additional pages.
      // Args:
      //  action: String|null|undefined - if given additional page should be rendered in contentDomNode 
      //  pageContainerNodeId: String|null|undefined - id of dom node where additional page (depending on the action) shoudl be placed
      var layoutView = new LayoutView();
      layoutView.create();
      if (pageContainerNodeId) {
        this.pageContainerNode = dom.byId(pageContainerNodeId);
      }
      if (action === "REGISTER") {
        var registerPage = new RegisterPage({}, this.pageContainerNode);
        registerPage.startup();
      }
    }
  });
});

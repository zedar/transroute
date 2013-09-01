define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/query",
  "bootstrap/Support",
  "bootstrap/Dropdown",
  "bootstrap/Collapse",
  "bootstrap/Carousel",
  "bootstrap/Tooltip",
  "dojo/domReady!"
], function(declare, lang, query) {
  "use strict";
  return declare([], {
    // Summary:
    //  Add bootstrap javascript support to all dom items placed in the layout of each page
    
    getNavigationNodeIds: function() {
      // Summary:
      //  Return list of DOM Node Ids of action buttons/links. This list should be used to attach browser history hash 
      return ["navfeatures", "navpricing", "navfooter", "navlogin", "navregister"];
    },

    create: function(params, srcNodeRef) {
      // Summary:
      //  Find dom nodes and initialize all javascript functionality
      // Args:
      //  params: Object|null
      //    Hash of initialization parameters
      //  srcNodeRef: DOMNode|String
      //    if given then initialize javascript functionality for the children of this DOMNode
      this.srcNodeRef = srcNodeRef;
      if (params) {
        lang.mixin(this, params);
      }
      query(".dropdown-toggle", this.srcNodeRef).dropdown();
      query(".collapse", this.srcNodeRef).collapse({
        toggle: false
      });

      query("a.dropdown-toggle, .dropdown-menu a").on("touchstart", function(e) {
        e.stopPropagation();
      });

      query(".carousel").carousel({
        interval: 10000
      });
    }
  });
});
/**
 * Common methods for 
 */
define([
  "dojo/_base/declare",
  "dojo/dom-class",
], function(declare, domClass) {
  return declare("app.common._PageMixin", null, {
    getNavigationNodeIds: function() {
      // Summary:
      //  Return list of DOM Node Ids of action buttons/links. This list should be used to attach browser history hash 
      return [];
    },

    _onBlur: function(evt) {
      // Summary:
      //  Clear errors, if any
      if (this.node.value) {
        domClass.remove(this.controlGroupNode, "error");
        domClass.remove(this.errorNode, "help-inline");
        domClass.add(this.errorNode, "help-inline-hidden");
      }
    },

    _usernameValidator: function(value) {
      // minimum 6 characters
      var regExp = "^[0-9a-zA-Z.]{6,30}$";
      var re = new RegExp(regExp, "i");
      return re.test(value);
    },

    _passwordValidator: function(value) {
      // minimum 6 characters
      var regExp = "^[0-9a-zA-Z.]{6,30}$";
      var re = new RegExp(regExp, "i");
      return re.test(value);
    }
    
  });
});
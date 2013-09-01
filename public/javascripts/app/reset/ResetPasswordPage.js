/**
 * ResetPassword page
 */
define([
  "dojo/_base/declare",
  "dojo/_base/kernel",
  "dojo/_base/lang",
  "dojo/_base/event",
  "dojo/query",
  "dojo/request",
  "dojo/on",
  "dojo/topic",
  "dojo/html",
  "dojo/dom-class",
  "dojo/dom-form",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/ResetPasswordPage.html",
  "dojo/i18n!./nls/ResetPasswordPage",
  "app/common/_PageMixin",
  "dojox/validate/web"
], function(declare, kernel, lang, event, query, request, on, topic, html, domClass, domForm,  _WidgetBase, _TemplatedMixin, template, nls, _PageMixin) {
  //"use strict";

  var page = declare([_WidgetBase, _TemplatedMixin, _PageMixin], {
    // id: string
    //  Unique id for dijit.byId()
    id: null,

    // templateString: String
    //  Cached html template
    templateString: template,

    getNavigationNodeIds: function() {
      // Summary:
      //  Return list of DOM Node Ids of action buttons/links. This list should be used to attach browser history hash 
      return [this.loginNode.id];
    },

    buildRendering: function() {
      // Summary:
      //  Construct the UI for the widget. Setting this.domNode
      topic.publish("app/stylesheets", [{href: "/stylesheets/reset.css", media: "all"}]);      
      this.inherited(arguments);
    },

    postCreate: function() {
      // Summary:
      //  Processing after the DOM fragment is created but not added to the document.
      this.inherited(arguments);
      html.set(this.titleNode, nls.title);
      html.set(this.errorNode, nls.failureError);
      this.emailNode.placeholder = nls.email;
      this.submitNode.value = nls.submit;
      this.alreadyNode.innerHTML = nls.already;
      this.loginNode.innerHTML = nls.login;

      this.own(
        on(this.submitNode, "click", lang.hitch(this, this._onSubmit)),
        on(this.emailNode, "blur", lang.hitch({
          node: this.emailNode,
          controlGroupNode: this.emailControlGroupNode,
          errorNode: this.emailErrorNode}, this._onBlur))
      );
    },

    startup: function() {
      // Summary:
      //  Called after DOM fragments have beed actually added to the document.
      //  We use this method to set the focus of default element.
      this.inherited(arguments);
      this.emailNode.focus();
    },

    _onSubmit: function(evt) {
      // Summary:
      //  Check if all required parameters are given. Submit data to the server
      
      // stop event propagation (preventDefault and stopPropagation)
      event.stop(evt);

      var foundError = false;
      query(".control-group", "box_reset").forEach(function(node, index, array) {
        domClass.remove(node, "error");
      });
      query(".help-inline", "box_reset").forEach(function(node, index, array) {
        domClass.remove(node, "help-inline");
        domClass.add(node, "help-inline-hidden");
      });
      
      if (!this.emailNode.value) {
        domClass.add(this.emailControlGroupNode, "error");
        domClass.remove(this.emailErrorNode, "help-inline-hidden");
        domClass.add(this.emailErrorNode, "help-inline");
        html.set(this.emailErrorNode, nls.emailError);
        foundError = true;
      }
      else if (!dojox.validate.isEmailAddress(this.emailNode.value)) {
        domClass.add(this.emailControlGroupNode, "error");
        domClass.remove(this.emailErrorNode, "help-inline-hidden");
        domClass.add(this.emailErrorNode, "help-inline");
        html.set(this.emailErrorNode, nls.wrongEmailError);
        foundError = true; 
      }

      if (foundError) {
        return;
      }
      // hide global errors and the other messages
      domClass.remove(this.errorNode, "alert");
      domClass.add(this.errorNode, "alert-hidden");
      domClass.remove(this.successNode, "alert");
      domClass.add(this.successNode, "alert-hidden");
      // make ajax call with data submitted
      var self = this;
      var data = domForm.toObject(this.formNode);
      request.post(this.formNode.action, {
        // send data entered by user
        data: domForm.toObject(this.formNode),
        // wait 10 secs before timeout
        timeout: 10000,
        // handle response as json
        handleAs: "json"
      }).then(
        function(result) {
          if (result.error) {
            domClass.remove(self.errorNode, "alert-hidden");
            domClass.add(self.errorNode, "alert");
            html.set(self.errorNode, result.error);
            // clear previous username and password
            self.emailNode.value = null;
            return;
          }
          else if (result.message) {
            domClass.remove(self.successNode, "alert-hidden");
            domClass.add(self.successNode, "alert");
            html.set(self.successNode, result.message);
            return;
          }
          if (result.redirect) {
            kernel.global.window.location = result.redirect;
            return;
          }
        },
        function(error) {
          domClass.remove(self.errorNode, "alert-hidden");
          domClass.add(self.errorNode, "alert");
          if (error.response.data.error) {
            html.set(self.errorNode, error.response.data.error);  
          }
          else {
            html.set(self.errorNode, error.message); 
          }
          // clear previous username and password
          self.emailNode.value = null;
        }
      );
    }
  });

  return page;
});

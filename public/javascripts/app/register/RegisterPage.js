/**
 * Registration Page
 */
define([
  "dojo/_base/declare",
  "dojo/_base/kernel",
  "dojo/_base/lang",
  "dojo/_base/event",
  "dojo/query",
  "dojo/request",
  "dojo/on",
  "dojo/html",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-form",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/RegisterPage.html",
  "dojo/i18n!./nls/RegisterPage",
  "dojox/validate/web"
], function(declare, kernel, lang, event, query, request, on, html, domAttr, domClass, domForm, _WidgetBase, _TemplatedMixin, template, nls) {
  var page = declare([_WidgetBase, _TemplatedMixin], {
    // templateString: String
    //  Cached html template
    templateString: template,

    postCreate: function() {
      // Summary:
      //  Processing after the DOM fragment is created but not added to the document.
      this.inherited(arguments);
      html.set(this.titleNode, nls.title);
      html.set(this.errorNode, nls.failureError);
      this.usernameNode.placeholder = nls.username;
      html.set(this.usernameErrorNode, nls.usernameError);
      this.emailNode.placeholder = nls.email;
      html.set(this.emailErrorNode, nls.emailError);
      this.passwordNode.placeholder = nls.password;
      html.set(this.passwordErrorNode, nls.passwordError);
      this.confirmPasswordNode.placeholder = nls.confirmPassword;
      html.set(this.confirmPasswordErrorNode, nls.confirmPasswordError);
      this.submitNode.value = nls.submit;
      //html.set(this.alreadyNode, nls.already);
      this.alreadyNode.innerHTML = nls.already;
      this.loginNode.innerHTML = nls.login;

      this.usernameNode.focus();

      this.own(
        on(this.submitNode, "click", lang.hitch(this, this._onSubmit)),
        on(this.usernameNode, "blur", lang.hitch({
          node: this.usernameNode, 
          controlGroupNode: this.usernameControlGroupNode, 
          errorNode: this.usernameErrorNode}, this._onBlur)),
        on(this.emailNode, "blur", lang.hitch({
          node: this.emailNode, 
          controlGroupNode: this.emailControlGroupNode, 
          errorNode: this.emailErrorNode}, this._onBlur)),
        on(this.passwordNode, "blur", lang.hitch({
          node: this.passwordNode, 
          controlGroupNode: this.passwordControlGroupNode, 
          errorNode: this.passwordErrorNode}, this._onBlur)),
        on(this.confirmPasswordNode, "blur", lang.hitch({
          node: this.confirmPasswordNode, 
          controlGroupNode: this.confirmPasswordControlGroupNode, 
          errorNode: this.confirmPasswordErrorNode}, this._onBlur))
      );
    },

    _onSubmit: function(evt) {
      // Summary:
      //  Check if all required attributes are given. Submit data to the server.
      // Args:
      //  evt (DOMEvent) - dom event
      
      // stop event propagation (preventDefault and stopPropagation)
      event.stop(evt);

      var foundError = false;
      query(".control-group", "box_sign").forEach(function(node, index, array) {
        domClass.remove(node, "error");
      });
      query(".help-inline", "box_sign").forEach(function(node, index, array) {
        domClass.remove(node, "help-inline");
        domClass.add(node, "help-inline-hidden");
      });
      if (!this.usernameNode.value) {
        domClass.add(this.usernameControlGroupNode, "error");
        domClass.remove(this.usernameErrorNode, "help-inline-hidden");
        domClass.add(this.usernameErrorNode, "help-inline");
        html.set(this.usernameErrorNode, nls.usernameError);
        foundError = true;
      }
      else if (!this._usernameValidator(this.usernameNode.value)) {
        domClass.add(this.usernameControlGroupNode, "error");
        domClass.remove(this.usernameErrorNode, "help-inline-hidden");
        domClass.add(this.usernameErrorNode, "help-inline");
        html.set(this.usernameErrorNode, nls.wrongUsernameError);
        foundError = true; 
      }
      
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
      
      if (!this.passwordNode.value) {
        domClass.add(this.passwordControlGroupNode, "error");
        domClass.remove(this.passwordErrorNode, "help-inline-hidden");
        domClass.add(this.passwordErrorNode, "help-inline");
        html.set(this.passwordErrorNode, nls.passwordError);
        foundError = true;
      }
      else if (!this._passwordValidator(this.passwordNode.value)) {
        domClass.add(this.passwordControlGroupNode, "error");
        domClass.remove(this.passwordErrorNode, "help-inline-hidden");
        domClass.add(this.passwordErrorNode, "help-inline");
        html.set(this.passwordErrorNode, nls.wrongPasswordError);
        foundError = true; 
      }

      if (!this.confirmPasswordNode.value) {
        domClass.add(this.confirmPasswordControlGroupNode, "error");
        domClass.remove(this.confirmPasswordErrorNode, "help-inline-hidden");
        domClass.add(this.confirmPasswordErrorNode, "help-inline");
        html.set(this.confirmPasswordErrorNode, nls.confirmPasswordError);
        foundError = true;
      }
      else if (this.passwordNode.value && !(this.passwordNode.value === this.confirmPasswordNode.value)) {
        domClass.add(this.confirmPasswordControlGroupNode, "error");
        domClass.remove(this.confirmPasswordErrorNode, "help-inline-hidden");
        domClass.add(this.confirmPasswordErrorNode, "help-inline");
        html.set(this.confirmPasswordErrorNode, nls.wrongConfirmPasswordError);
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
            return;
          }
          else if (result.message) {
            domClass.remove(self.successNode, "alert-hidden");
            domClass.add(self.successNode, "alert");
            html.set(self.successNode, result.message);
            return;
          }
          if (result.redirect) {
            kernel.window.location = result.location;
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
        }
      );
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
  return page;
});
/**
 * HomePage - loaded on demand
 */
define([
  "dojo/_base/declare",
  "dojo/topic",
  "dojo/html",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./templates/HomePage.html",
  "dojo/i18n!./nls/HomePage",
  "app/common/_PageMixin"
], function(declare, topic, html, _WidgetBase, _TemplatedMixin, template, nls, _PageMixin) {
  //"use strict";

  var page = declare([_WidgetBase, _TemplatedMixin, _PageMixin], {
    // id: string
    //  Unique id for dijit.bytId()
    id: null,

    // templateString: string
    //  Cached templated with DOM definition
    templateString: template,

    getNavigationNodeIds: function() {
      // Summary:
      //  Return list of DOM Node Ids of action buttons/links. This list should be used to attach browser history hash 
      return [this.slideRegisterActionNode.id];
    },

    buildRendering: function() {
      // Summary:
      //  Construct the UI for the widget. Setting this.domNode
      topic.publish("app/stylesheets", [{href: "/stylesheets/animate.css", media: "all"}]);      
      this.inherited(arguments);
    },

    postCreate: function() {
      // Summary:
      //  Processing after the DOM fragment is created but not added to the document.
      this.inherited(arguments);

      html.set(this.slideRegisterTitleNode, nls.slideRegisterTitle);
      html.set(this.slideRegisterTextNode, nls.slideRegisterText);
      this.slideRegisterActionNode.innerHTML = nls.slideRegisterAction;
      html.set(this.slideWatchTitleNode, nls.slideWatchTitle);
      html.set(this.slideWatchTextNode, nls.slideWatchText);
      this.slideWatchActionNode.innerHTML = nls.slideWatchAction;

      html.set(this.slideRegisterTitlePhoneNode, nls.slideRegisterTitle);
      this.slideRegisterActionPhoneNode.innerHTML = nls.slideRegisterAction;
      this.slideWatchActionPhoneNode.innerHTML = nls.slideWatchAction;
      
      html.set(this.introNode, nls.intro);

      html.set(this.featuresTitleNode, nls.featuresTitle);
      html.set(this.featuresTitlePhoneNode, nls.featuresTitle);
      html.set(this.feature1TitleNode, nls.feature1Title);
      html.set(this.feature1DescrNode, nls.feature1Descr);
      html.set(this.feature2TitleNode, nls.feature2Title);
      html.set(this.feature2DescrNode, nls.feature2Descr);
      html.set(this.feature3TitleNode, nls.feature3Title);
      html.set(this.feature3DescrNode, nls.feature3Descr);

      html.set(this.pricingTitleNode, nls.pricingTitle);
      html.set(this.pricingCommingSoonNode, nls.pricingCommingSoon);

      html.set(this.pricingTitlePhoneNode, nls.pricingTitle);
      html.set(this.pricingCommingSoonPhoneNode, nls.pricingCommingSoon);

      html.set(this.footerContactUsNode, nls.footerContactUs);
      html.set(this.footerNameNode, nls.footerName);
      html.set(this.footerEmailNode, nls.footerEmail);
      html.set(this.footerCommentsNode, nls.footerComments);
      html.set(this.footerSubmitNode, nls.footerSubmit);
      html.set(this.footerSocialNode, nls.footerSocial);
      html.set(this.footerCopyrightNode, nls.footerCopyright);
    }
  });

  return page;
});


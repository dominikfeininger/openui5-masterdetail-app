/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library"],function(e){"use strict";var i={};i.render=function(e,i){var a=i._getState(),t="sapFDynamicPageTitle",n=i.getBackgroundDesign();e.write("<div");e.writeControlData(i);e.writeAccessibilityState({role:"heading",level:2});e.addClass(t);if(n){e.addClass(t+n)}e.writeClasses();e.write(">");e.renderControl(a.focusSpan);this._renderTopArea(e,a);this._renderMainArea(e,a);e.renderControl(a.expandButton);e.write("</div>")};i._renderTopArea=function(e,i){if(i.hasTopContent){e.write("<div id="+i.id+"-top");e.addClass("sapFDynamicPageTitleTop");if(i.hasOnlyBreadcrumbs){e.addClass("sapFDynamicPageTitleTopBreadCrumbsOnly")}if(i.hasOnlyNavigationActions){e.addClass("sapFDynamicPageTitleTopNavActionsOnly")}e.writeClasses();e.write(">");this._renderTopBreadcrumbsArea(e,i);this._renderTopNavigationArea(e,i);e.write("</div>")}};i._renderTopBreadcrumbsArea=function(e,i){if(i.breadcrumbs){e.write("<div");e.writeAttribute("id",i.id+"-breadcrumbs");e.addClass("sapFDynamicPageTitleTopLeft");e.writeClasses();e.write(">");e.renderControl(i.breadcrumbs);e.write("</div>")}};i._renderTopNavigationArea=function(e,i){if(i.hasNavigationActions){e.write("<div");e.writeAttribute("id",i.id+"-topNavigationArea");e.addClass("sapFDynamicPageTitleTopRight");e.writeClasses();e.write(">");e.write("</div>")}};i._renderMainArea=function(e,i){e.write("<div id="+i.id+"-main");e.addClass("sapFDynamicPageTitleMain");if(!i.hasContent){e.addClass("sapFDynamicPageTitleMainNoContent")}e.writeClasses();e.write(">");e.write("<div");e.addClass("sapFDynamicPageTitleMainInner");e.writeClasses();e.write(">");this._renderMainHeadingArea(e,i);this._renderMainContentArea(e,i);this._renderMainActionsArea(e,i);e.write("</div>");this._renderMainNavigationArea(e,i);e.write("</div>")};i._renderMainHeadingArea=function(e,a){e.write("<div");e.writeAttribute("id",a.id+"-left-inner");e.addClass("sapFDynamicPageTitleMainHeading");e.writeClasses();e.addStyle("flex-shrink",a.headingAreaShrinkFactor);e.writeStyles();e.write(">");e.write("<div");e.addClass("sapFDynamicPageTitleHeading-CTX");e.addClass("sapFDynamicPageTitleMainHeadingInner");e.writeClasses();e.write(">");if(a.heading){e.renderControl(a.heading)}else{if(a.snappedHeading){i._renderSnappedHeading(e,a)}if(a.expandedHeading){i._renderExpandHeading(e,a)}}e.write("</div>");if(a.hasAdditionalContent){e.write("<div");e.addClass("sapFDynamicPageTitleMainHeadingSnappedExpandContent");e.writeClasses();e.write(">");if(a.hasSnappedContent){i._renderSnappedContent(e,a)}if(a.hasExpandedContent){i._renderExpandContent(e,a)}e.write("</div>")}e.write("</div>")};i._renderMainContentArea=function(e,i){e.write("<div");e.writeAttributeEscaped("id",i.id+"-content");e.addClass("sapFDynamicPageTitleMainContent");e.addClass("sapFDynamicPageTitleContent-CTX");e.writeClasses();e.addStyle("flex-shrink",i.contentAreaShrinkFactor);if(i.contentAreaFlexBasis){e.addStyle("flex-basis",i.contentAreaFlexBasis)}e.writeStyles();e.write(">");i.content.forEach(e.renderControl,e);e.write("</div>")};i._renderMainActionsArea=function(e,i){e.write("<div");e.writeAttribute("id",i.id+"-mainActions");e.addClass("sapFDynamicPageTitleMainActions");e.writeClasses();e.addStyle("flex-shrink",i.actionsAreaShrinkFactor);if(i.actionsAreaFlexBasis){e.addStyle("flex-basis",i.actionsAreaFlexBasis)}e.writeStyles();e.write(">");if(i.hasActions){e.renderControl(i.actionBar)}e.write("</div>")};i._renderMainNavigationArea=function(e,i){if(i.hasNavigationActions){e.write("<div");e.writeAttribute("id",i.id+"-mainNavigationAreaWrapper");e.addClass("sapFDynamicPageTitleMainNavigationArea");e.writeClasses();e.write(">");e.renderControl(i.separator);e.write("<div");e.writeAttribute("id",i.id+"-mainNavigationArea");e.addClass("sapFDynamicPageTitleMainNavigationAreaInner");e.writeClasses();e.write(">");e.write("</div>");e.write("</div>")}};i._renderExpandHeading=function(e,i){e.write("<div");e.writeAttribute("id",i.id+"-expand-heading-wrapper");e.writeClasses();e.write(">");e.renderControl(i.expandedHeading);e.write("</div>")};i._renderSnappedHeading=function(e,i){e.write("<div");e.writeAttribute("id",i.id+"-snapped-heading-wrapper");if(!i.isSnapped){e.addClass("sapUiHidden")}e.writeClasses();e.write(">");e.renderControl(i.snappedHeading);e.write("</div>")};i._renderExpandContent=function(e,i){e.write("<div");e.writeAttributeEscaped("id",i.id+"-expand-wrapper");e.writeClasses();e.write(">");i.expandedContent.forEach(e.renderControl,e);e.write("</div>")};i._renderSnappedContent=function(e,i){e.write("<div");e.writeAttributeEscaped("id",i.id+"-snapped-wrapper");if(!i.isSnapped){e.addClass("sapUiHidden")}e.addClass("sapFDynamicPageTitleSnapped");e.writeClasses();e.write(">");i.snappedContent.forEach(e.renderControl,e);e.write("</div>")};return i},true);
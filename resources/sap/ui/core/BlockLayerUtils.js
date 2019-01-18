/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/events/jquery/EventTriggerHook","sap/base/Log","sap/ui/thirdparty/jquery"],function(e,t,i){"use strict";var a={},n=["focusin","focusout","keydown","keypress","keyup","mousedown","touchstart","touchmove","mouseup","touchend","click"],r=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|tr)$/i;a.block=function(e,a,n){var l,u,c,d;if(e){l=e.getDomRef(n);if(!l){l=e.getDomRef()}if(!l){t.warning("BlockLayer could not be rendered. The outer Control instance is not valid anymore or was not rendered yet.");return}u=l.tagName;if(r.test(u)){t.warning("BusyIndicator cannot be placed in elements with tag '"+u+"'.");return}d=s(l,a);c={$parent:i(l),$blockLayer:i(d)};if(c.$parent.css("position")=="static"){c.originalPosition="static";c.$parent.css("position","relative")}o.call(c,true)}else{t.warning("BlockLayer couldn't be created. No Control instance given.")}return c};a.unblock=function(e){if(e){if(e.originalPosition){e.$parent.css("position",e.originalPosition)}o.call(e,false);e.$blockLayer.remove()}};a.addAriaAttributes=function(e){e.setAttribute("role","progressbar");e.setAttribute("aria-valuemin","0");e.setAttribute("aria-valuemax","100");e.setAttribute("alt","");e.setAttribute("tabIndex","0")};a.toggleAnimationStyle=function(e,t){var a=i(e.$blockLayer.get(0));if(t){a.removeClass("sapUiHiddenBusyIndicatorAnimation");a.removeClass("sapUiBlockLayerOnly")}else{a.addClass("sapUiBlockLayerOnly");a.addClass("sapUiHiddenBusyIndicatorAnimation")}};function s(e,t){var i=document.createElement("div");i.id=t;i.className="sapUiBlockLayer ";a.addAriaAttributes(i);e.appendChild(i);return i}function o(i){if(i){var a=this.$parent.get(0);if(a){this.fnRedirectFocus=s.bind(this);this.oTabbableBefore=o(this.fnRedirectFocus);this.oTabbableAfter=o(this.fnRedirectFocus);a.parentNode.insertBefore(this.oTabbableBefore,a);a.parentNode.insertBefore(this.oTabbableAfter,a.nextSibling);this._fnSuppressDefaultAndStopPropagationHandler=r.bind(this);this._aSuppressHandler=u.call(this,this._fnSuppressDefaultAndStopPropagationHandler)}else{t.warning("fnHandleInteraction called with bEnabled true, but no DOMRef exists!")}}else{if(this.oTabbableBefore){l(this.oTabbableBefore,this.fnRedirectFocus);delete this.oTabbableBefore}if(this.oTabbableAfter){l(this.oTabbableAfter,this.fnRedirectFocus);delete this.oTabbableAfter}delete this.fnRedirectFocus;c.call(this,this._fnSuppressDefaultAndStopPropagationHandler)}function r(e){var i=e.target===this.$blockLayer.get(0),a;if(i&&e.type==="keydown"&&e.keyCode===9){t.debug("Local Busy Indicator Event keydown handled: "+e.type);a=e.shiftKey?this.oTabbableBefore:this.oTabbableAfter;a.setAttribute("tabindex",-1);this.bIgnoreFocus=true;a.focus();this.bIgnoreFocus=false;a.setAttribute("tabindex",0);e.stopImmediatePropagation()}else if(i&&(e.type==="mousedown"||e.type==="touchstart")){t.debug("Local Busy Indicator click handled on busy area: "+e.target.id);e.stopImmediatePropagation()}else{t.debug("Local Busy Indicator Event Suppressed: "+e.type);e.preventDefault();e.stopImmediatePropagation()}}function s(){if(!this.bIgnoreFocus){this.$blockLayer.get(0).focus()}}function o(e){var t=document.createElement("span");t.setAttribute("tabindex",0);t.addEventListener("focusin",e);return t}function l(e,t){if(e.parentNode){e.parentNode.removeChild(e)}e.removeEventListener("focusin",t)}function u(t){var i=[],a=this.$parent.get(0),r=this.$blockLayer.get(0);for(var s=0;s<n.length;s++){a.addEventListener(n[s],t,{capture:true,passive:false});i.push(e.suppress(n[s],a,r))}this.$blockLayer.bind("keydown",t);return i}function c(t){var i,a=this.$parent.get(0),r=this.$blockLayer.get(0);if(a){for(i=0;i<n.length;i++){a.removeEventListener(n[i],t,{capture:true,passive:false})}}if(this._aSuppressHandler){for(i=0;i<this._aSuppressHandler.length;i++){e.release(this._aSuppressHandler[i])}}if(r){this.$blockLayer.unbind("keydown",t)}}}return a});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/Log","./Control","./RenderManager","./HTMLRenderer","sap/base/security/sanitizeHTML"],function(e,t,n,i,r,s){"use strict";var o=i.RenderPrefixes;var a=n.extend("sap.ui.core.HTML",{metadata:{library:"sap.ui.core",properties:{content:{type:"string",group:"Misc",defaultValue:null},preferDOM:{type:"boolean",group:"Misc",defaultValue:true},sanitizeContent:{type:"boolean",group:"Misc",defaultValue:false},visible:{type:"boolean",group:"Appearance",defaultValue:true}},events:{afterRendering:{parameters:{isPreservedDOM:{type:"boolean"}}}}}});a.prototype.getDomRef=function(e){var t=e?this.getId()+"-"+e:this.getId();return(o.Dummy+t?window.document.getElementById(o.Dummy+t):null)||(t?window.document.getElementById(t):null)};a.prototype.setContent=function(n){function i(t){if(e.parseHTML){var n=e.parseHTML(t);if(n){var i=0,r=n.length;while(i<r&&n[i].nodeType!=1){i++}while(i<r&&n[r-1].nodeType!=1){r--}if(i>0||r<n.length){n=n.slice(i,r)}return e(n)}}return e(t)}if(this.getSanitizeContent()){t.trace("sanitizing HTML content for "+this);n=s(n)}this.setProperty("content",n,true);if(this.getDomRef()){var r=i(this.getContent());e(this.getDomRef()).replaceWith(r);this._postprocessNewContent(r)}else{this.invalidate()}return this};a.prototype.setSanitizeContent=function(e){this.setProperty("sanitizeContent",e,true);if(e){this.setContent(this.getContent())}return this};a.prototype.onBeforeRendering=function(){if(this.getPreferDOM()&&this.getDomRef()&&!i.isPreservedContent(this.getDomRef())){i.preserveContent(this.getDomRef(),true,false)}};a.prototype.onAfterRendering=function(){if(!this.getVisible()){return}var t=e(o.Dummy+this.getId()?window.document.getElementById(o.Dummy+this.getId()):null);var n=i.findPreservedContent(this.getId());var r;var s=false;if(!this.getPreferDOM()||n.size()==0){n.remove();r=new e(this.getContent());t.replaceWith(r)}else if(n.size()>0){t.replaceWith(n);r=n;s=true}else{t.remove()}this._postprocessNewContent(r);this.fireAfterRendering({isPreservedDOM:s})};a.prototype._postprocessNewContent=function(e){if(e&&e.size()>0){if(e.length>1){t.warning("[Unsupported Feature]: "+this+" has rendered "+e.length+" root nodes!")}else{var n=e.attr("id");if(n&&n!=this.getId()){t.warning("[Unsupported Feature]: Id of HTML Control '"+this.getId()+"' does not match with content id '"+n+"'!")}}i.markPreservableContent(e,this.getId());if(e.find("#"+this.getId().replace(/(:|\.)/g,"\\$1")).length===0){e.filter(":not([id])").first().attr("id",this.getId())}}else{t.debug(""+this+" is empty after rendering, setting bOutput to false");this.bOutput=false}};a.prototype.setDOMContent=function(t){var n=e(t);if(this.getDomRef()){e(this.getDomRef()).replaceWith(n);this._postprocessNewContent(n)}else{n.appendTo(i.getPreserveAreaRef());if(this.getUIArea()){this.getUIArea().invalidate()}this._postprocessNewContent(n)}return this};a.prototype.setTooltip=function(){t.warning("The sap.ui.core.HTML control doesn't support tooltips. Add the tooltip to the HTML content instead.");return n.prototype.setTooltip.apply(this,arguments)};"hasStyleClass addStyleClass removeStyleClass toggleStyleClass".split(" ").forEach(function(e){a.prototype[e]=function(){t.warning("The sap.ui.core.HTML control doesn't support custom style classes. Manage custom CSS classes in the HTML content instead.");return n.prototype[e].apply(this,arguments)}});return a});
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","./Core","sap/ui/thirdparty/URI","sap/base/Log","sap/base/util/extend","sap/base/strings/escapeRegExp","sap/ui/thirdparty/jquery"],function(e,r,t,o,a,n,i){"use strict";var s=sap.ui.getCore().getConfiguration();var p=s.getLanguage();var u=s.getAppCacheBusterMode()==="sync";var c=s.getAppCacheBusterMode()==="batch";var f={index:{},active:false};var l,d,g,v,y;var h=document.baseURI.replace(/\?.*|#.*/g,"");var b=t(sap.ui.require.toUrl("")+"/../");var L=b.toString();if(b.is("relative")){b=b.absoluteTo(h)}var m=b.normalize().toString();var x=t("resources").absoluteTo(m).toString();var C=new RegExp("^"+n(x));var A=function(e){if(e.length>0&&e.slice(-1)!=="/"){e+="/"}return e};var R=function(e,r){var t=f.index;var n;var s;var l;if(Array.isArray(e)&&!c){e.forEach(function(e){R(e,r)})}else if(Array.isArray(e)&&c){var d=A(e[0]);var g=[];o.debug('sap.ui.core.AppCacheBuster.register("'+d+'"); // BATCH MODE!');var v=T.normalizeURL(d);o.debug('  --\x3e normalized to: "'+v+'"');e.forEach(function(e){s=A(e);var r=T.normalizeURL(s);if(!t[l]){g.push(r)}});if(g.length>0){var s=v+"sap-ui-cachebuster-info.json?sap-ui-language="+p;n={url:s,type:"POST",async:!u&&!!r,dataType:"json",contentType:"text/plain",data:g.join("\n"),success:function(e){T.onIndexLoaded(s,e);a(t,e)},error:function(){o.error('Failed to batch load AppCacheBuster index file from: "'+s+'".')}}}}else{e=A(e);o.debug('sap.ui.core.AppCacheBuster.register("'+e+'");');l=T.normalizeURL(e);o.debug('  --\x3e normalized to: "'+l+'"');if(!t[l]){var s=l+"sap-ui-cachebuster-info.json?sap-ui-language="+p;n={url:s,async:!u&&!!r,dataType:"json",success:function(e){T.onIndexLoaded(s,e);t[l]=e},error:function(){o.error('Failed to load AppCacheBuster index file from: "'+s+'".')}}}}if(n){var y=T.onIndexLoad(n.url);if(y!=null){o.info('AppCacheBuster index file injected for: "'+s+'".');n.success(y)}else{if(n.async){var h=r.startTask("load "+s);var b=n.success,L=n.error;Object.assign(n,{success:function(e){b.apply(this,arguments);r.finishTask(h)},error:function(){L.apply(this,arguments);r.finishTask(h,false)}})}o.info('Loading AppCacheBuster index file from: "'+s+'".');i.ajax(n)}}};var T={boot:function(e){var r=s.getAppCacheBuster();if(r&&r.length>0){r=r.slice();var o=true;var a=String(r[0]).toLowerCase();if(r.length===1){if(a==="true"||a==="x"){var n=t(L);r=n.is("relative")?[n.toString()]:[]}else if(a==="false"){o=false}}if(o){T.init();R(r,e)}}},init:function(){f.active=true;l=e.prototype.validateProperty;d=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src");g=Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype,"href");var r=T.convertURL;var t=T.normalizeURL;var a=function(e){if(this.active===true&&e&&typeof e==="string"){e=t(e);return!e.match(C)}return false}.bind(f);v=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(e,t){if(t&&a(t)){arguments[1]=r(t)}v.apply(this,arguments)};y=XMLHttpRequest.prototype.open;e.prototype.validateProperty=function(e,t){var o=this.getMetadata(),n=o.getProperty(e),i;if(n&&n.type==="sap.ui.core.URI"){i=Array.prototype.slice.apply(arguments);try{if(a(i[1])){i[1]=r(i[1])}}catch(e){}}return l.apply(this,i||arguments)};var n=function(e){var t={get:e.get,set:function(t){if(a(t)){t=r(t)}e.set.call(this,t)},enumerable:e.enumerable,configurable:e.configurable};t.set._sapUiCoreACB=true;return t};var i=false;try{Object.defineProperty(HTMLScriptElement.prototype,"src",n(d))}catch(e){o.error("Your browser doesn't support redefining the src property of the script tag. Disabling AppCacheBuster as it is not supported on your browser!\nError: "+e);i=true}try{Object.defineProperty(HTMLLinkElement.prototype,"href",n(g))}catch(e){o.error("Your browser doesn't support redefining the href property of the link tag. Disabling AppCacheBuster as it is not supported on your browser!\nError: "+e);i=true}if(i){this.exit()}},exit:function(){e.prototype.validateProperty=l;if(XMLHttpRequest.prototype.open===y){XMLHttpRequest.prototype.open=v}var r;if((r=Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src"))&&r.set&&r.set._sapUiCoreACB===true){Object.defineProperty(HTMLScriptElement.prototype,"src",d)}if((r=Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype,"href"))&&r.set&&r.set._sapUiCoreACB===true){Object.defineProperty(HTMLLinkElement.prototype,"href",g)}f.index={};f.active=false;f={index:{},active:false}},register:function(e){R(e)},convertURL:function(e){o.debug('sap.ui.core.AppCacheBuster.convertURL("'+e+'");');var r=f.index;if(r&&e&&!/^#/.test(e)){var t=T.normalizeURL(e);o.debug('  --\x3e normalized to: "'+t+'"');if(t&&T.handleURL(t)){for(var a in r){var n=r[a],i,s;if(a&&t.length>=a.length&&t.slice(0,a.length)===a){i=t.slice(a.length);s=i.match(/([^?#]*)/)[1];if(n[s]){e=a+"~"+n[s]+"~/"+i;o.debug('  ==> rewritten to "'+e+'";');break}}}}}return e},normalizeURL:function(e){var r=t(e||"./");if(r.is("relative")){r=r.absoluteTo(h)}return r.normalizeProtocol().normalizeHostname().normalizePort().normalizePath().toString()},handleURL:function(e){return true},onIndexLoad:function(e){return null},onIndexLoaded:function(e,r){}};var U=s.getAppCacheBusterHooks();if(U){["handleURL","onIndexLoad","onIndexLoaded"].forEach(function(e){if(typeof U[e]==="function"){T[e]=U[e]}})}return T},true);
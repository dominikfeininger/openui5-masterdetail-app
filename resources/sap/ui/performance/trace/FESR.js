/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/URI","sap/ui/Device","sap/ui/performance/trace/Passport","sap/ui/performance/trace/Interaction","sap/ui/performance/XHRInterceptor","sap/base/util/Version"],function(e,t,n,r,i,s){"use strict";var o=false,a=n.getRootId(),u=n.createGUID().substr(-8,8)+a,c=window.location.host,f=t.os.name+"_"+t.os.version,p=t.browser.name+"_"+t.browser.version,d=A(),g="",l="",S,R,v=0,P,m;function A(){var e=0;if(t.system.combi){e=1}else if(t.system.desktop){e=2}else if(t.system.tablet){e=4}else if(t.system.phone){e=3}return e}function h(e){var t=new Date(e);return t.toISOString().replace(/[^\d]/g,"")}function I(t){var n=new e(t).host();return n&&n!==c}function b(){i.register("PASSPORT_HEADER","open",function(){if(!I(arguments[1])){var e=r.getPending();if(e){if(l!=e.appVersion){l=e.appVersion;g=l?_(l):""}}this.setRequestHeader("SAP-PASSPORT",n.header(S,a,n.getTransactionId(),e?e.component+g:undefined,e?e.trigger+"_"+e.event+"_"+v:undefined))}});i.register("FESR","open",function(){if(!I(arguments[1])){if(!R){R=n.getTransactionId()}if(P){this.setRequestHeader("SAP-Perf-FESRec",P);this.setRequestHeader("SAP-Perf-FESRec-opt",m);P=null;m=null;R=n.getTransactionId();v++}}})}function T(e){return[y(a,32),y(R,32),y(e.navigation,16),y(e.roundtrip,16),y(e.duration,16),y(e.completeRoundtrips,8),y(u,40),y(e.networkTime,16),y(e.requestTime,16),y(f,20),"SAP_UI5"].join(",")}function E(e){var t=e.stepComponent||e.component;return[y(t,20,true),y(e.trigger+"_"+e.event,20,true),"",y(p,20),y(e.bytesSent,16),y(e.bytesReceived,16),"","",y(e.processing,16),e.requestCompression?"X":"","","","","",y(e.busyDuration,16),"",y(d,1),"",y(h(e.start),20),y(t,70,true)].join(",")}function y(e,t,n){if(!e){e=e===0?"0":""}else if(typeof e==="number"){var r=e;e=Math.round(e).toString();if(e.length>t||r<0){e="-1"}}else{e=n?e.substr(-t,t):e.substr(0,t)}return e}function _(e){var t=new s(e);return"@"+t.getMajor()+"."+t.getMinor()+"."+t.getPatch()}function w(e){P=T(e);m=E(e)}var H={};H.setActive=function(e){if(e){o=true;n.setActive(true);r.setActive(true);S=n.traceFlags();b();r.onInteractionFinished=function(e){if(e.requests.length>0){w(e)}}}else if(!e&&o){o=false;r.setActive(false);i.unregister("FESR","open");if(i.isRegistered("PASSPORT_HEADER","open")){i.register("PASSPORT_HEADER","open",function(){this.setRequestHeader("SAP-PASSPORT",n.header(S,a,n.getTransactionId()))})}r.onInteractionFinished=null}};H.getActive=function(){return o};return H});
/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./isPlainObject"],function(e){"use strict";var r=function(e,r){if(!r){r=10}return n(e,0,r)};function n(e,r,n){if(r>n){throw new TypeError("The structure depth of the source exceeds the maximum depth ("+n+")")}if(e==null){return e}else if(e instanceof Date){return new Date(e)}else if(Array.isArray(e)){return t(e,r,n)}else if(typeof e==="object"){return i(e,r,n)}else{return e}}function t(e,r,t){var i=[];for(var u=0;u<e.length;u++){i.push(n(e[u],r+1,t))}return i}function i(r,t,i){if(!e(r)){throw new TypeError("Cloning is only supported for plain objects")}var u={};for(var o in r){u[o]=n(r[o],t+1,i)}return u}return r});
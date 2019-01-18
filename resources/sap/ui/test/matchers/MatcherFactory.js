/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/test/matchers/Interactable","sap/ui/test/matchers/Visible","sap/base/strings/capitalize","sap/ui/thirdparty/jquery","sap/ui/test/matchers/matchers"],function(t,e,r,a,n){"use strict";var i=t.extend("sap.ui.test.matchers.MatcherFactory",{getInteractabilityMatchers:function(t){return[t?new e:new r]},getFilteringMatchers:function(t){var e=s(t);if(t.matchers){if(n.isPlainObject(t.matchers)){e=e.concat(s(t.matchers))}else if(n.isArray(t.matchers)){t.matchers.forEach(function(t){if(n.isPlainObject(t)){e=e.concat(s(t))}else{e.push(t)}})}else{e=e.concat(t.matchers)}}return e}});function s(t){if(t["isMatching"]){return[t]}var e=["aggregationContainsPropertyEqual","aggregationEmpty","aggregationFilled","aggregationLengthEquals","ancestor","bindingPath","I18NText","labelFor","properties","propertyStrictEquals"];return Object.keys(t).filter(function(t){return e.indexOf(t)>-1}).map(function(e){var r=a(e);var i=sap.ui.test.matchers[r];var s=n.isArray(t[e])?t[e]:[t[e]];return s.map(function(t){if(n.isArray(t)){return new function(){return i.apply(this,t)}}else{return new i(t)}})}).reduce(function(t,e){return t.concat(e)},[])}return i});
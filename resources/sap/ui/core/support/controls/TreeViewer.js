/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/base/security/encodeXML"],function(e,t){"use strict";var r=e.extend("sap.ui.core.support.controls.TreeViewer",{constructor:function(){e.apply(this,arguments);this._oRenderParent=null;this._oRootObject=null}});var a={nodestart:'<div tabIndex="0" idx="{idx}" class="node start {cssclass}" haschildnodes="{haschildnodes}" visible="{visible}" collapsed="{collapsed}" style="padding-left:{pxlevel}" level="{level}" raise="_selectNode" args="{idx}"><span class="expand" raise="_toggleNode" args="{idx}"></span>&lt;<span class="nstag" reason="tagName"><span class="ns" reason="namespace">{namespaceURI}</span><span class="tag"  reason="localName">{localName}</span></span>',nodestartend:"&gt;</div>",nodenochildend:'&gt;&lt;/<span class="nstagend"><span class="nstag"><span class="ns">{namespaceURI}</span><span class="tag">{localName}</span></span></span>&gt;</div><div class="node end" style="display:none" visible="{visible}" haschildnodes="{haschildnodes}" collapsed="{collapsed}" style="padding-left:{pxlevel}" level="{level}">&lt;/<span class="nstag"><span class="ns">{namespaceURI}</span><span class="tag">{localName}</span></span>&gt;</div>',nodeend:'<div class="node end {cssclass}" visible="{visible}" haschildnodes="{haschildnodes}" collapsed="{collapsed}" style="padding-left:{pxlevel}" level="{level}">&lt;/<span class="nstag"><span class="ns">{namespaceURI}</span><span class="tag">{localName}</span></span>&gt;</div>',attribute:'&nbsp;<span class="attr" modified="{modified}" oldValue="{oldValue}" title="{oldValue}" reason="attributeName"><span class="attrname">{attributeName}</span>=&quot;<span class="attrvalue" reason="attributeValue">{attributeValue}</span>&quot;</span>',idattribute:'&nbsp;<span class="attr" modified="{modified}" oldValue="{oldValue}" title="originalValue: {oldValue}" reason="attributeName"><span class="attrname">{attributeName}</span>=&quot;<span class="attrvalue attrvalue1" reason="attributeValue">{attributeValue1}</span><span class="attrvalue attrvalue2" reason="attributeValue">{attributeValue2}</span>&quot;</span>',nodeinfo:'<span class="info {color}" selected="{selected}"title="{tooltip}" raise="_onInfoClick" args="{idx},{infoidx}"></span>'};var i=1;var n=-1;function o(e){var t=parseInt(e.getAttribute("level"));e=e.nextSibling;while(e){if(parseInt(e.getAttribute("level"))==t){return e}e=e.nextSibling}return null}function s(e){var t=e.childNodes;for(var r=0;r<t.length;r++){if(t[r].nodeType===1){return true}}return false}function l(e,r){var i=e._modified||[];var n=e._oldValues;var o=e.attributes;var s=i.concat([])||[];for(var l=0;l<o.length;l++){var d=s.indexOf(o[l].name);if(d===-1){s.push(o[l])}else{s[d]=o[l]}}for(var l=0;l<s.length;l++){var c=s[l];var p=r.fnAttributeInfos(e,c);if(p){if(p.visible===false){continue}}if(c.name==="__id"){continue}if(c.name==="__inactive"){continue}if(c.namespaceURI==="http://schemas.sap.com/sapui5/extension/sap.ui.core.support.Support.info/1"){continue}if(c.name.indexOf("__changed")>-1){continue}if(c.name==="xmlns:support"){continue}var u=false,f="";if(i.indexOf(c.name)>-1){u=true;f="originalValue: "+n[i.indexOf(c.name)]}if(c.name==="id"){if(!r.bIgnoreIds){r.addWithParam(a.idattribute,{attributeName:c.name,attributeValue1:t(String(c.value||"")),attributeValue2:e.getAttribute("__id"),modified:u,oldValue:t(f)})}}else{r.addWithParam(a.attribute,{attributeName:c.name,attributeValue:t(String(c.value||"")),modified:u,oldValue:t(f)})}}}function d(e,t){var r=e.childNodes;for(var a=0;a<r.length;a++){if(r[a].nodeType===1){if(e.getAttribute("__inactive")==="true"){r[a].setAttribute("__inactive","true")}i++;c(r[a],t);i--}}}function c(e,r){n++;var o=s(e);var c="";if(e.getAttribute("__inactive")==="true"){c="inactive"}else if(e.getAttribute("__replace")==="true"){c="replace"}r.addWithParam(a.nodestart,{idx:n,haschildnodes:o,visible:i<r.initialExpandedLevel,cssclass:c,level:i,pxlevel:i*16+"px",collapsed:i>=r.initialExpandedLevel-1,localName:e.localName,namespaceURI:e.namespaceURI?t(String(e.namespaceURI))+":":""});var p=r.fnNodeInfos(e);if(p){for(var u=0;u<p.length;u++){var f=p[u];r.addWithParam(a.nodeinfo,{idx:n+"",infoidx:u+"",selected:f.selected||false,color:t(f.color)||"orange",tooltip:t(f.tooltip)||""})}}l(e,r);if(o){r.addWithParam(a.nodestartend,{});d(e,r);r.addWithParam(a.nodeend,{idx:n,haschildnodes:o,visible:i<r.initialExpandedLevel,level:i,cssclass:c,pxlevel:i*16+"px",collapsed:i>=r.initialExpandedLevel-1,localName:e.localName,namespaceURI:e.namespaceURI?t(String(e.namespaceURI))+":":""})}else{r.addWithParam(a.nodenochildend,{idx:n,haschildnodes:o,visible:i<r.initialExpandedLevel,level:i,pxlevel:i*16+"px",collapsed:i>=r.initialExpandedLevel-1,localName:e.localName,namespaceURI:e.namespaceURI?t(String(e.namespaceURI))+":":""})}}function p(){this._aBuffer=[];var e=this;this.add=function(){e._aBuffer.push.apply(e._aBuffer,arguments)};this.addWithParam=function(t,r){for(var a in r){var i=new RegExp("{"+a+"}","g");t=t.replace(i,r[a])}e.add(t)};this.toString=function(){return e._aBuffer.join("")}}r.prototype.initialExpandedLevel=4;r.prototype.fnSelectionChange=function(){};r.prototype.fnInfoPress=function(){};r.prototype.ignoreIds=function(){this.bIgnoreIds=true};r.prototype.setRootObject=function(e){if(e.nodeType&&e.nodeType===9){e=e.firstChild}this._oRootObject=e};r.prototype.attachSelectionChange=function(e){this.fnSelectionChange=e};r.prototype.attachInfoPress=function(e){this.fnInfoPress=e};r.prototype.attachNodeInfos=function(e){this.fnNodeInfos=e};r.prototype.attachAttributeInfos=function(e){this.fnAttributeInfos=e};r.prototype._getDataObjectByIndex=function(e){if(e===0){return this._oRootObject}else{e--;var t=this._oRootObject.querySelectorAll("*");return t[e]}return null};r.prototype._getIndexOfNode=function(e){if(e===this._oRootObject){return 0}else{var t=this._oRootObject.querySelectorAll("*");for(var r=0;r<t.length;r++){if(t[r]===e){return r+1}}}return-1};r.prototype._getStartNodeByIndex=function(e){return this._oRenderParent.firstChild.querySelector("[idx='"+e+"']")};r.prototype.toggleIds=function(){var e=this._oRenderParent.firstChild.className;if(e.indexOf(" id1")>-1){this._oRenderParent.firstChild.className=e.replace(" id1"," id2");return true}else{this._oRenderParent.firstChild.className=e.replace(" id2"," id1");return false}};r.prototype.toggleNS=function(){var e=this._oRenderParent.firstChild.className;if(e.indexOf(" hideNS")>-1){this._oRenderParent.firstChild.className=e.replace(" hideNS","");return true}else{this._oRenderParent.firstChild.className=e+" hideNS";return false}};r.prototype.toggleInactive=function(){var e=this._oRenderParent.firstChild.className;if(e.indexOf(" hideInactive")>-1){this._oRenderParent.firstChild.className=e.replace(" hideInactive","");return true}else{this._oRenderParent.firstChild.className=e+" hideInactive";return false}};r.prototype._iSelectedIndex=-1;r.prototype._selectNode=function(e,t){e=parseInt(e);var r=this._getStartNodeByIndex(e);if(this._oSelectedNode===r){return}if(this._oSelectedNode){this._oSelectedNode.className=this._oSelectedNode.className.replace(" select","")}this._iSelectedIndex=e;this._oSelectedNode=r;this._oSelectedNode.className+=" select";this.fnSelectionChange(this._getDataObjectByIndex(e),t);return true};r.prototype._onInfoClick=function(e,t){e=parseInt(e);this._selectNode(e,["template"]);this.fnInfoPress(this._getDataObjectByIndex(e),parseInt(t));return true};r.prototype.expandNode=function(e){var t=this._getIndexOfNode(e);this.expandNodesToIndex(t)};r.prototype.expandNodesToIndex=function(e){var t=this._oRenderParent.firstChild.querySelector("div[idx='"+e+"']");if(!t||t.getAttribute("visible")==="true"){return}var r=parseInt(t.getAttribute("level"));t=t.previousSibling;while(t){var a=parseInt(t.getAttribute("level"));if(a<r&&t.getAttribute("collapsed")==="true"){this._toggleNode(parseInt(t.getAttribute("idx")))}t=t.previousSibling}};r.prototype.expandNodesWithSelectedInfo=function(e){var t=this._oRenderParent.firstChild.querySelectorAll("div[idx]");for(var r=0;r<t.length;r++){var a=t[r].querySelector("[args='"+r+","+e+"'][selected='true']");if(a){this.expandNodesToIndex(r)}}return this._iSelectedIndex};r.prototype.getSelectedIndex=function(){return this._iSelectedIndex};r.prototype.setInfoSelected=function(e,t,r,a){var i=this._oRenderParent.firstChild.querySelector("[args='"+e+","+t+"']");if(i){i.setAttribute("selected",r+"");if(a){i.setAttribute("title",a)}}};r.prototype._toggleNode=function(e){e=parseInt(e);var t=this._getStartNodeByIndex(e);if(t){var r=parseInt(t.getAttribute("level"));var a=t.nextSibling;while(a){if(parseInt(a.getAttribute("level"))>r){if(t.getAttribute("collapsed")==="true"){if(a.getAttribute("collapsed")==="true"){a.setAttribute("visible","true");var i=o(a);if(i){a=i}}else{a.setAttribute("visible","true")}}else{a.setAttribute("visible","false")}}if(parseInt(a.getAttribute("level"))===r){if(t.getAttribute("collapsed")==="true"){a.setAttribute("visible","true")}else{a.setAttribute("visible","false")}break}a=a.nextSibling}if(t.getAttribute("collapsed")==="true"){t.setAttribute("collapsed","false")}else{t.setAttribute("collapsed","true")}}this._oSelectedNode&&this._oSelectedNode.focus();return true};r.prototype.highlightedDomNodes=[];r.prototype.clearHighlights=function(){for(var e=0;e<this.highlightedDomNodes.length;e++){this.highlightedDomNodes[e].className=this.highlightedDomNodes[e].className.replace(" highlight","")}this.highlightedDomNodes=[]};r.prototype.highlightNodeById=function(e){var t=this._oRootObject.querySelector("[id='"+e+"']");if(t){this.highlightNode(t)}};r.prototype.highlightNode=function(e){var t=this._getIndexOfNode(e);if(t>-1){var r=this._getStartNodeByIndex(t);r.className+=" highlight";this.highlightedDomNodes.push(r)}};r.prototype.update=function(e){if(!e&&!this._oRenderParent){return}if(this._oRenderParent&&e){this._oRenderParent.innerHTML=""}this._oRenderParent=e||this._oRenderParent;if(this._oRootObject){var t=new p;t.initialExpandedLevel=this.initialExpandedLevel;t.fnNodeInfos=this.fnNodeInfos||function(){};t.fnAttributeInfos=this.fnAttributeInfos||function(){};t.bIgnoreIds=this.bIgnoreIds;n=-1;t.add('<div class="treeviewer id2" id="'+this.getId()+'">');if(this._oRootObject&&this._oRootObject.nodeType&&this._oRootObject.nodeType===1){c(this._oRootObject,t)}t.add("</div>");this._oRenderParent.innerHTML=t.toString();var r=this;this._oRenderParent.firstChild.addEventListener("click",function(e){var t=e.target,a=false,i=[];while(!a){if(t.getAttribute("raise")){if(t.getAttribute("args")){var n=t.getAttribute("args").split(",");n=n.concat(i);a=r[t.getAttribute("raise")].apply(r,n)}else{var n=[t];n=n.concat(i);a=r[t.getAttribute("raise")].apply(r,n)}}else if(t.getAttribute("reason")){i.push(t.getAttribute("reason"))}t=t.parentNode;if(t===r._oRenderParent){break}}});this._oRenderParent.firstChild.addEventListener("mouseover",function(e){var t=e.target;while(t&&t.getAttribute&&!t.getAttribute("collapsed")){t=t.parentNode;if(t.className==="nstagend"){return}if(t.getElementsByClassName("nstagend").length>0){t.getElementsByClassName("nstagend")[0].firstChild.style.border="1px dotted green";return}}if(!t||e.target.tagName==="DIV"){return}if(t.getAttribute&&t.getAttribute("collapsed")==="false"){t=o(t);if(t){var r=t.getElementsByClassName("nstag")[0];r.style.border="1px dotted green"}}});this._oRenderParent.firstChild.addEventListener("mouseout",function(e){var t=e.target;while(t&&t.getAttribute&&!t.getAttribute("collapsed")){t=t.parentNode;if(t.className==="nstagend"){return}if(t.getElementsByClassName("nstagend").length>0){t.getElementsByClassName("nstagend")[0].firstChild.style.border="";return}}if(!t||e.target.tagName==="DIV"){return}if(t.getAttribute&&t.getAttribute("collapsed")==="false"){t=o(t);if(t){var r=t.getElementsByClassName("nstag")[0];r.style.border=""}}})}};r.getCss=function(){return[".treeviewer { padding-top:10px;margin-left:15px;font-family: consolas, monospace; width: 100%; overflow: auto; height: 100%; position: relative; cursor:default}",".treeviewer .node {border: 1px solid transparent}",".treeviewer .node.start {white-space: nowrap;}",".treeviewer .node.inactive {color: gray!important; opacity:0.6}",".treeviewer .node.inactive SPAN {color: gray!important; background-color:transparent!important;}",".treeviewer .node.replace .nstag {text-decoration: line-through}",".treeviewer .node.start.select {background-color: #fff8ad;}",".treeviewer .node.start.highlight {background-color:#fff;}",".treeviewer .node.end {white-space: nowrap;}",".treeviewer .node .info {margin: 0px 2px}",".treeviewer .node .info.orange {border: 1px solid orange;}",".treeviewer .node .info.orange[selected='true'] {background-color:orange;}",".treeviewer .node .info.blue {border: 1px solid #007dc0;}",".treeviewer .node .info.blue[selected='true'] {background-color:#007dc0;}",".treeviewer .node .info.green {border: 1px solid green}",".treeviewer .node .info.green[selected='true'] {background-color:green;}",".treeviewer .node .info.red {border: 1px solid #b93232}",".treeviewer .node .info.red[selected='true'] {background-color:#b93232;}",".treeviewer .node .info {opacity: 0.6;display: inline-block;border-radius: 10px;height: 6px;width: 6px;}",".treeviewer .node .info[selected='true'] {opacity: 1;display: inline-block;border-radius: 10px;height: 6px;width: 6px;}",".treeviewer .node .info:hover {opacity: 1}",".treeviewer .node .attrname {color:#b93232; border: 1px solid transparent; display:inline-block;}",".treeviewer .node .attrname:hover {border: 1px solid #b93232;background-color:#fde3d5}",".treeviewer .node .attrvalue {color:#007dc0; border: 1px solid transparent; display:inline-block;}",".treeviewer .node .attr[modified='true'] .attrvalue {color:#d210f3; border: 1px solid transparent; display:inline-block;}",".treeviewer .node .attr[modified='true'] {background-color:#ffe7fc;}",".treeviewer .node .attr[oldvalue='null'] .attrname {color:#d210f3; border: 1px solid transparent; display:inline-block;}",".treeviewer.id1 .node .attrvalue2 {display:none;}",".treeviewer.id2 .node .attrvalue1 {display:none;}",".treeviewer .node .attrvalue:hover {border: 1px solid #007dc0;background-color:#e1e1ff}",".treeviewer .node .ns {color:green}",".treeviewer.hideNS .node .ns {display:none}",".treeviewer.hideInactive .node.inactive {display:none!important}",".treeviewer .node .tag {color:green}",".treeviewer .node .nstag {color:green; border: 1px solid transparent; display:inline-block;}",".treeviewer .node.start .nstag:hover {border: 1px solid green;background-color:#d5e6d5}",".treeviewer .node.start .nstagend .nstag:hover {border: 1px solid transparent;background-color:transparent}",".treeviewer .node.end[visible='true'] {display: inline-block;}",".treeviewer .node:focus {border: 1px dotted #e1e1ff;outline:none}",".treeviewer .node.end[visible='true'][haschildnodes='true'] {display: block;}",".treeviewer .node[visible='false'] {display: none;}",".treeviewer .node[collapsed='true'][haschildnodes='true'] .expand {border-color: transparent transparent transparent #cecece;border-radius: 0;border-style: solid;border-width: 4px 3px 4px 8px;height: 0;width: 0;position: relative;margin-top: 0px;margin-left: -10px;display: inline-block;}",".treeviewer .node[collapsed='false'][haschildnodes='true'] .expand {border-color: #cecece transparent transparent transparent;border-radius: 0;border-style: solid;border-width: 8px 4px 0px 4px;height: 0;width: 0;position: relative;margin-top: 0px;margin-left: -12px;margin-right: 5px;display: inline-block;}",".treeviewer .node[collapsed='true'][haschildnodes='true']:hover .expand {border-color: transparent transparent transparent #aaa;}",".treeviewer .node[collapsed='false'][haschildnodes='true']:hover .expand {border-color: #aaa transparent transparent transparent;}",".treeviewer .node[collapsed='true'][haschildnodes='true'] .expand:hover {border-color: transparent transparent transparent #999;}",".treeviewer .node[collapsed='false'][haschildnodes='true'] .expand:hover {border-color: #999 transparent transparent transparent;}"].join("")};return r});
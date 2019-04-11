/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Context","./ODataParentBinding","./lib/_AggregationCache","./lib/_AggregationHelper","./lib/_Cache","./lib/_GroupLock","./lib/_Helper","sap/base/Log","sap/base/util/uid","sap/ui/base/SyncPromise","sap/ui/model/Binding","sap/ui/model/ChangeReason","sap/ui/model/FilterOperator","sap/ui/model/FilterProcessor","sap/ui/model/FilterType","sap/ui/model/ListBinding","sap/ui/model/Sorter","sap/ui/model/odata/OperationMode","sap/ui/thirdparty/jquery"],function(e,t,i,n,o,r,s,a,h,u,d,f,l,c,p,g,C,x,y){"use strict";var v="sap.ui.model.odata.v4.ODataListBinding",m={AggregatedDataStateChange:true,change:true,dataReceived:true,dataRequested:true,DataStateChange:true,patchCompleted:true,patchSent:true,refresh:true};var P=g.extend("sap.ui.model.odata.v4.ODataListBinding",{constructor:function(i,n,o,r,a,h){g.call(this,i,n);t.call(this);if(n.slice(-1)==="/"){throw new Error("Invalid path: "+n)}this.oAggregation=null;this.aApplicationFilters=s.toArray(a);P.checkCaseSensitiveFilters(this.aApplicationFilters);this.oCachePromise=u.resolve();this.sChangeReason=i.bAutoExpandSelect?"AddVirtualContext":undefined;this.oDiff=undefined;this.aFilters=[];this.bHasAnalyticalInfo=false;this.mPreviousContextsByPath={};this.aPreviousData=[];this.oReadGroupLock=undefined;this.aSorters=s.toArray(r);this.applyParameters(y.extend(true,{},h));this.oHeaderContext=this.bRelative?null:e.create(this.oModel,this,n);if(!this.bRelative||o&&!o.fetchValue){this.createReadGroupLock(this.getGroupId(),true)}this.setContext(o);i.bindingCreated(this)}});t(P.prototype);P.checkCaseSensitiveFilters=function(e){function t(e){if(e.bCaseSensitive===false){throw new Error("Filter for path '"+e.sPath+"' has unsupported value for 'caseSensitive' : false")}if(e.aFilters){P.checkCaseSensitiveFilters(e.aFilters)}if(e.oCondition){t(e.oCondition)}}e.forEach(t)};P.prototype._delete=function(t,i,n){var o=this;if(!n.isTransient()&&this.hasPendingChanges()){throw new Error("Cannot delete due to pending changes")}return this.deleteFromCache(t,i,String(n.iIndex),function(t,i){var r,a,h,u,d;if(n.created()){o.iCreatedContexts-=1;o.aContexts.shift();n.destroy()}else{for(a=t;a<o.aContexts.length;a+=1){n=o.aContexts[a];if(n){o.mPreviousContextsByPath[n.getPath()]=n}}u=o.oModel.resolve(o.sPath,o.oContext);o.aContexts.splice(t,1);for(a=t;a<o.aContexts.length;a+=1){if(o.aContexts[a]){d=a-o.iCreatedContexts;h=s.getPrivateAnnotation(i[a],"predicate");r=u+(h||"/"+d);n=o.mPreviousContextsByPath[r];if(n){delete o.mPreviousContextsByPath[r];if(n.iIndex===d){n.checkUpdate()}else{n.iIndex=d}}else{n=e.create(o.oModel,o,r,d)}o.aContexts[a]=n}}}o.iMaxLength-=1;o._fireChange({reason:f.Remove})})};P.prototype.applyParameters=function(e,t){var i,o;this.checkBindingParameters(e,["$$aggregation","$$canonicalPath","$$groupId","$$operationMode","$$ownRequest","$$patchWithoutSideEffects","$$updateGroupId"]);o=e.$$operationMode||this.oModel.sOperationMode;if(!o&&(this.aSorters.length||this.aApplicationFilters.length)){throw new Error("Unsupported operation mode: "+o)}this.sOperationMode=o;this.sGroupId=e.$$groupId;this.sUpdateGroupId=e.$$updateGroupId;this.mQueryOptions=this.oModel.buildQueryOptions(e,true);this.mParameters=e;if("$$aggregation"in e){if("$apply"in this.mQueryOptions){throw new Error("Cannot combine $$aggregation and $apply")}i=s.clone(e.$$aggregation);this.mQueryOptions.$apply=n.buildApply(i).$apply;this.oAggregation=i}if(this.isRootBindingSuspended()){this.setResumeChangeReason(t);return}this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(t)};P.prototype.attachEvent=function(e){if(!(e in m)){throw new Error("Unsupported event '"+e+"': v4.ODataListBinding#attachEvent")}return g.prototype.attachEvent.apply(this,arguments)};P.prototype.create=function(t,i){var n,o,r,a=this.oModel.resolve(this.sPath,this.oContext),u,d=this;if(!a){throw new Error("Binding is not yet resolved: "+this)}if(this.aContexts[0]&&this.aContexts[0].created()){throw new Error("Must not create twice")}this.checkSuspended();u="($uid="+h()+")";r=this.lockGroup(this.getUpdateGroupId(),true);o=this.createInCache(r,this.fetchResourcePath(),"",u,t,function(){d.iCreatedContexts-=1;d.aContexts.shift();n.destroy();d._fireChange({reason:f.Remove})}).then(function(e){var o,r;d.iMaxLength+=1;if(!(t&&t["@$ui5.keepTransientPath"])){r=s.getPrivateAnnotation(e,"predicate");if(r){n.sPath=a+r}}if(!i&&d.isRoot()){o=d.getGroupId();if(!d.oModel.isDirectGroup(o)&&!d.oModel.isAutoGroup(o)){o="$auto"}return d.refreshSingle(n,d.lockGroup(o))}},function(e){r.unlock(true);throw e});n=e.create(this.oModel,this,a+u,-1,o);this.aContexts.unshift(n);this.iCreatedContexts+=1;this._fireChange({reason:f.Add});return n};P.prototype.createContexts=function(t,i,n){var o=false,r,a,h=n.$count,u,d=this.bLengthFinal,f=this.oModel,l=f.resolve(this.sPath,this.oContext),c,p=t>this.aContexts.length,g=this;function C(){var e,t=g.iMaxLength+g.iCreatedContexts;if(t>=g.aContexts.length){return}for(e=t;e<g.aContexts.length;e+=1){if(g.aContexts[e]){g.aContexts[e].destroy()}}while(t>0&&!g.aContexts[t-1]){t-=1}g.aContexts.length=t;o=true}for(a=t;a<t+n.length;a+=1){if(this.aContexts[a]===undefined){o=true;u=a-this.iCreatedContexts;c=s.getPrivateAnnotation(n[a-t],"predicate");r=l+(c||"/"+u);if(r in this.mPreviousContextsByPath){this.aContexts[a]=this.mPreviousContextsByPath[r];delete this.mPreviousContextsByPath[r];this.aContexts[a].iIndex=u;this.aContexts[a].checkUpdate()}else{this.aContexts[a]=e.create(f,this,r,u)}}}if(Object.keys(this.mPreviousContextsByPath).length){sap.ui.getCore().addPrerenderingTask(function(){Object.keys(g.mPreviousContextsByPath).forEach(function(e){g.mPreviousContextsByPath[e].destroy();delete g.mPreviousContextsByPath[e]})})}if(h!==undefined){this.bLengthFinal=true;this.iMaxLength=h;C()}else{if(n.length<i){this.iMaxLength=t-this.iCreatedContexts+n.length;C()}else if(this.aContexts.length>this.iMaxLength+this.iCreatedContexts){this.iMaxLength=Infinity}if(!(p&&n.length===0)){this.bLengthFinal=this.aContexts.length===this.iMaxLength+this.iCreatedContexts}}if(this.bLengthFinal!==d){o=true}return o};P.prototype.destroy=function(){if(this.bHasAnalyticalInfo&&this.aContexts===undefined){return}this.aContexts.forEach(function(e){e.destroy()});if(this.oHeaderContext){this.oHeaderContext.destroy()}this.oModel.bindingDestroyed(this);this.removeReadGroupLock();this.oAggregation=undefined;this.aApplicationFilters=undefined;this.oCachePromise=u.resolve();this.oContext=undefined;this.aContexts=undefined;this.oDiff=undefined;this.aFilters=undefined;this.oHeaderContext=undefined;this.mPreviousContextsByPath=undefined;this.aPreviousData=undefined;this.mQueryOptions=undefined;this.aSorters=undefined;t.prototype.destroy.apply(this);g.prototype.destroy.apply(this)};P.prototype.doCreateCache=function(e,t,r){var s=this.oAggregation&&(this.oAggregation.groupLevels.length||n.hasMinOrMax(this.oAggregation.aggregate)||n.hasGrandTotal(this.oAggregation.aggregate));t=this.inheritQueryOptions(t,r);return s?i.create(this.oModel.oRequestor,e,this.oAggregation,t):o.create(this.oModel.oRequestor,e,t,this.oModel.bAutoExpandSelect)};P.prototype.doFetchQueryOptions=function(e){var t=this.getOrderby(this.mQueryOptions.$orderby),i=this;return this.fetchFilter(e,this.mQueryOptions.$filter).then(function(e){return s.mergeQueryOptions(i.mQueryOptions,t,e)})};P.prototype.enableExtendedChangeDetection=function(e,t){if(t!==undefined){throw new Error("Unsupported property 'key' with value '"+t+"' in binding info for "+this)}return g.prototype.enableExtendedChangeDetection.apply(this,arguments)};P.prototype.fetchFilter=function(e,t){var i,n,o;function r(e,t,i){var n,o=s.formatLiteral(e.oValue1,t),r=decodeURIComponent(e.sPath);switch(e.sOperator){case l.BT:n=r+" ge "+o+" and "+r+" le "+s.formatLiteral(e.oValue2,t);break;case l.NB:n=d(r+" lt "+o+" or "+r+" gt "+s.formatLiteral(e.oValue2,t),i);break;case l.EQ:case l.GE:case l.GT:case l.LE:case l.LT:case l.NE:n=r+" "+e.sOperator.toLowerCase()+" "+o;break;case l.Contains:case l.EndsWith:case l.NotContains:case l.NotEndsWith:case l.NotStartsWith:case l.StartsWith:n=e.sOperator.toLowerCase().replace("not","not ")+"("+r+","+o+")";break;default:throw new Error("Unsupported operator: "+e.sOperator)}return n}function a(e,t,i){if(e.aFilters){return u.all(e.aFilters.map(function(i){return a(i,t,e.bAnd)})).then(function(t){return d(t.join(e.bAnd?" and ":" or "),i&&!e.bAnd)})}return n.fetchObject(h(e.sPath,t),o).then(function(n){var s,u,d;if(!n){throw new Error("Type cannot be determined, no metadata for path: "+o.getPath())}d=e.sOperator;if(d===l.All||d===l.Any){s=e.oCondition;u=e.sVariable;if(d===l.Any&&!s){return e.sPath+"/any()"}t=Object.create(t);t[u]=h(e.sPath,t);return a(s,t).then(function(t){return e.sPath+"/"+e.sOperator.toLowerCase()+"("+u+":"+t+")"})}return r(e,n.$Type,i)})}function h(e,t){var i=e.split("/");i[0]=t[i[0]];return i[0]?i.join("/"):e}function d(e,t){return t?"("+e+")":e}i=c.combineFilters(this.aFilters,this.aApplicationFilters);if(!i){return u.resolve(t)}n=this.oModel.getMetaModel();o=n.getMetaContext(this.oModel.resolve(this.sPath,e));return a(i,{},t).then(function(e){if(t){e+=" and ("+t+")"}return e})};P.prototype.fetchValue=function(e,t,i){var n=this;return this.oCachePromise.then(function(o){var s;if(o){s=n.getRelativePath(e);if(s!==undefined){return o.fetchValue(r.$cached,s,undefined,t)}}if(n.oContext){return n.oContext.fetchValue(e,t,i)}})};P.prototype.filter=function(e,t){var i=s.toArray(e);P.checkCaseSensitiveFilters(i);if(this.sOperationMode!==x.Server){throw new Error("Operation mode has to be sap.ui.model.odata.OperationMode.Server")}if(this.hasPendingChanges()){throw new Error("Cannot filter due to pending changes")}if(t===p.Control){this.aFilters=i}else{this.aApplicationFilters=i}if(this.isRootBindingSuspended()){this.setResumeChangeReason(f.Filter);return this}this.createReadGroupLock(this.getGroupId(),true);this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(f.Filter);return this};P.prototype.getContexts=function(t,i,n){var o,r=this.oContext,s,h=false,u=false,d,l,c=!!this.sChangeReason,p,g=this;a.debug(this+"#getContexts("+t+", "+i+", "+n+")",undefined,v);this.checkSuspended();if(t!==0&&this.bUseExtendedChangeDetection){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" first parameter must be 0 if extended change detection is enabled, but is "+t)}if(n!==undefined&&this.bUseExtendedChangeDetection){throw new Error("Unsupported operation: v4.ODataListBinding#getContexts,"+" third parameter must not be set if extended change detection is enabled")}if(this.bRelative&&!r){this.aPreviousData=[];return[]}o=this.sChangeReason||f.Change;this.sChangeReason=undefined;if(o==="AddVirtualContext"){sap.ui.getCore().addPrerenderingTask(function(){g.sChangeReason="RemoveVirtualContext";g._fireChange({reason:f.Change});g.reset(f.Refresh)},true);p=e.create(this.oModel,this,this.oModel.resolve(this.sPath,this.oContext)+"/"+e.VIRTUAL,e.VIRTUAL);return[p]}if(o==="RemoveVirtualContext"){return[]}t=t||0;i=i||this.oModel.iSizeLimit;if(!n||n<0){n=0}d=this.oReadGroupLock;this.oReadGroupLock=undefined;if(!this.bUseExtendedChangeDetection||!this.oDiff){l=this.oCachePromise.then(function(e){if(e){d=g.lockGroup(g.getGroupId(),d);return e.read(t,i,n,d,function(){h=true;g.fireDataRequested()})}else{if(d){d.unlock()}return r.fetchValue(g.sPath).then(function(e){var n;e=e||[];n=e.$count;e=e.slice(t,t+i);e.$count=n;return{value:e}})}});if(l.isFulfilled()&&c){l=Promise.resolve(l)}l.then(function(e){var n;if(!g.bRelative||g.oContext===r){n=g.createContexts(t,i,e.value);if(g.bUseExtendedChangeDetection){g.oDiff={aDiff:g.getDiff(e.value,t),iLength:i}}if(u){if(n){g._fireChange({reason:o})}else{g.oDiff=undefined}}}if(h){g.fireDataReceived({data:{}})}},function(e){if(h){g.fireDataReceived(e.canceled?{data:{}}:{error:e})}throw e}).catch(function(e){if(d){d.unlock(true)}g.oModel.reportError("Failed to get contexts for "+g.oModel.sServiceUrl+g.oModel.resolve(g.sPath,g.oContext).slice(1)+" with start index "+t+" and length "+i,v,e)});u=true}this.iCurrentBegin=t;this.iCurrentEnd=t+i;s=this.aContexts.slice(t,t+i);if(this.bUseExtendedChangeDetection){if(this.oDiff&&i!==this.oDiff.iLength){throw new Error("Extended change detection protocol violation: Expected "+"getContexts(0,"+this.oDiff.iLength+"), but got getContexts(0,"+i+")")}s.dataRequested=!this.oDiff;s.diff=this.oDiff?this.oDiff.aDiff:[]}this.oDiff=undefined;return s};P.prototype.getCurrentContexts=function(){var e=Math.min(this.iCurrentEnd,this.iMaxLength+this.iCreatedContexts)-this.iCurrentBegin,t=this.aContexts.slice(this.iCurrentBegin,this.iCurrentBegin+e);while(t.length<e){t.push(undefined)}return t};P.prototype.getDependentBindings=function(){var e=this;return this.oModel.getDependentBindings(this).filter(function(t){return!(t.oContext.getPath()in e.mPreviousContextsByPath)})};P.prototype.getDiff=function(e,t){var i,n,o=this;n=e.map(function(e,i){return o.bDetectUpdates?JSON.stringify(e):o.aContexts[t+i].getPath()});i=y.sap.arraySymbolDiff(this.aPreviousData,n);this.aPreviousData=n;return i};P.prototype.getDistinctValues=function(){throw new Error("Unsupported operation: v4.ODataListBinding#getDistinctValues")};P.prototype.getFilterInfo=function(e){var t=c.combineFilters(this.aFilters,this.aApplicationFilters),i=null,n;if(t){i=t.getAST(e)}if(this.mQueryOptions.$filter){n={expression:this.mQueryOptions.$filter,syntax:"OData "+this.oModel.getODataVersion(),type:"Custom"};if(i){i={left:i,op:"&&",right:n,type:"Logical"}}else{i=n}}return i};P.prototype.getHeaderContext=function(){return this.bRelative&&!this.oContext?null:this.oHeaderContext};P.prototype.getLength=function(){if(this.bLengthFinal){return this.iMaxLength+this.iCreatedContexts}return this.aContexts.length?this.aContexts.length+10:0};P.prototype.getOrderby=function(e){var t=[],i=this;this.aSorters.forEach(function(e){if(e instanceof C){t.push(e.sPath+(e.bDescending?" desc":""))}else{throw new Error("Unsupported sorter: "+e+" - "+i)}});if(e){t.push(e)}return t.join(",")};P.prototype.inheritQueryOptions=function(e,t){var i;if(!Object.keys(this.mParameters).length){i=this.getQueryOptionsForPath("",t);if(e.$orderby&&i.$orderby){e.$orderby+=","+i.$orderby}if(e.$filter&&i.$filter){e.$filter="("+e.$filter+") and ("+i.$filter+")"}e=y.extend({},i,e)}return e};P.prototype.isLengthFinal=function(){return this.bLengthFinal};P.prototype.refreshInternal=function(e,t,i){var n=this;function o(){n.oModel.getDependentBindings(n).forEach(function(i){i.refreshInternal(e,t,false)})}if(this.isRootBindingSuspended()){this.refreshSuspended(t);o();return u.resolve()}this.createReadGroupLock(t,this.isRoot());return this.oCachePromise.then(function(t){if(t){n.removeCachesAndMessages(e);n.fetchCache(n.oContext)}n.reset(f.Refresh);o()})};P.prototype.refreshSingle=function(e,t,i){var n=e.getPath().slice(1),o=this;return this.oCachePromise.then(function(r){var s=false,a=[];function h(e){if(s){o.fireDataReceived(e)}}function d(){s=true;o.fireDataRequested()}function l(e){var t=o.aContexts[e],i;o.aContexts.splice(e,1);if(t.created()){o.iCreatedContexts-=1}else{for(i=e;i<o.aContexts.length;i+=1){if(o.aContexts[i]){o.aContexts[i].iIndex-=1}}}t.destroy();o.iMaxLength-=1;o._fireChange({reason:f.Remove})}t.setGroupId(o.getGroupId());a.push((i?r.refreshSingleWithRemove(t,e.getIndex(),d,l):r.refreshSingle(t,e.getIndex(),d)).then(function(r){var s=[];h({data:{}});if(e.oBinding){s.push(e.checkUpdate());if(i){s.push(o.refreshDependentBindings(n,t.getGroupId()))}}return u.all(s).then(function(){return r})},function(e){h({error:e});throw e}).catch(function(i){t.unlock(true);o.oModel.reportError("Failed to refresh entity: "+e,v,i)}));if(!i){a.push(o.refreshDependentBindings(n,t.getGroupId()))}return u.all(a).then(function(e){return e[0]})})};P.prototype.requestSideEffects=function(e,t,i){var n=this.oModel,o={},r,s,a=this;function h(e){return e.catch(function(e){n.reportError("Failed to request side effects",v,e);throw e})}return this.oCachePromise.then(function(d){if(t.indexOf("")<0){r=d.requestSideEffects(n.lockGroup(e),t,o,a.iCurrentBegin,a.iCurrentEnd-a.iCurrentBegin);if(r){s=[r];a.visitSideEffects(e,t,i,o,s);return u.all(s.map(h))}}return a.refreshInternal("",e)})};P.prototype.reset=function(e){var t=this.iCurrentEnd===0,i=this;if(this.aContexts){this.aContexts.forEach(function(e){if(e.created()){e.destroy()}else{i.mPreviousContextsByPath[e.getPath()]=e}})}this.aContexts=[];this.iCreatedContexts=0;this.iCurrentBegin=this.iCurrentEnd=0;this.iMaxLength=Infinity;this.bLengthFinal=false;if(e&&!(t&&e===f.Change)){this.sChangeReason=e;this._fireRefresh({reason:e})}if(this.getHeaderContext()){this.oModel.getDependentBindings(this.oHeaderContext).forEach(function(e){e.checkUpdate()})}};P.prototype.resumeInternal=function(){var e=this.getDependentBindings(),t=this.sResumeChangeReason;this.sResumeChangeReason=f.Change;this.removeCachesAndMessages("");this.reset();this.fetchCache(this.oContext);e.forEach(function(e){e.resumeInternal(false)});if(this.sChangeReason==="AddVirtualContext"){this._fireChange({reason:t})}else{this._fireRefresh({reason:t})}this.oModel.getDependentBindings(this.oHeaderContext).forEach(function(e){e.checkUpdate()})};P.prototype.setAggregation=function(e){if(this.hasPendingChanges()){throw new Error("Cannot set $$aggregation due to pending changes")}if(!this.oAggregation&&"$apply"in this.mQueryOptions){throw new Error("Cannot override existing $apply : '"+this.mQueryOptions.$apply+"'")}e=s.clone(e);this.mQueryOptions.$apply=n.buildApply(e).$apply;this.oAggregation=e;if(this.isRootBindingSuspended()){this.setResumeChangeReason(f.Change);return}this.removeCachesAndMessages("");this.fetchCache(this.oContext);this.reset(f.Change)};P.prototype.setContext=function(t){var i;if(this.oContext!==t){if(this.bRelative){if(this.aContexts[0]&&this.aContexts[0].isTransient()){throw new Error("setContext on relative binding is forbidden if a transient "+"entity exists: "+this)}this.reset();this.fetchCache(t);if(t){i=this.oModel.resolve(this.sPath,t);if(this.oHeaderContext&&this.oHeaderContext.getPath()!==i){this.oHeaderContext.destroy();this.oHeaderContext=null}if(!this.oHeaderContext){this.oHeaderContext=e.create(this.oModel,this,i)}}d.prototype.setContext.call(this,t)}else{this.oContext=t}}};P.prototype.sort=function(e){if(this.sOperationMode!==x.Server){throw new Error("Operation mode has to be sap.ui.model.odata.OperationMode.Server")}if(this.hasPendingChanges()){throw new Error("Cannot sort due to pending changes")}this.aSorters=s.toArray(e);if(this.isRootBindingSuspended()){this.setResumeChangeReason(f.Sort);return this}this.removeCachesAndMessages("");this.createReadGroupLock(this.getGroupId(),true);this.fetchCache(this.oContext);this.reset(f.Sort);return this};P.prototype.updateAnalyticalInfo=function(e){var t={aggregate:{},group:{}},i=false,o=this;e.forEach(function(e){var n={};if("total"in e){if("grouped"in e){throw new Error("Both dimension and measure: "+e.name)}if(e.as){n.name=e.name;t.aggregate[e.as]=n}else{t.aggregate[e.name]=n}if(e.min){n.min=true;i=true}if(e.max){n.max=true;i=true}if(e.with){n.with=e.with}}else if(!("grouped"in e)||e.inResult||e.visible){t.group[e.name]=n}});this.oAggregation=t;this.changeParameters(n.buildApply(t));this.bHasAnalyticalInfo=true;if(i){return{measureRangePromise:Promise.resolve(this.getRootBindingResumePromise().then(function(){return o.oCachePromise}).then(function(e){return e.getMeasureRangePromise()}))}}};return P});
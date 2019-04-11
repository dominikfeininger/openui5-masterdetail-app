/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ValueListType","./lib/_Helper","sap/base/assert","sap/base/Log","sap/base/util/ObjectPath","sap/ui/base/SyncPromise","sap/ui/model/BindingMode","sap/ui/model/ChangeReason","sap/ui/model/ClientListBinding","sap/ui/model/Context","sap/ui/model/ContextBinding","sap/ui/model/MetaModel","sap/ui/model/PropertyBinding","sap/ui/model/odata/OperationMode","sap/ui/model/odata/type/Int64","sap/ui/model/odata/type/Raw","sap/ui/thirdparty/jquery","sap/ui/thirdparty/URI"],function(e,t,n,i,r,o,a,s,u,f,c,l,d,p,h,m,y,g){"use strict";var v,$=new Map,C=i.Level.DEBUG,M=/^-?\d+$/,O,w,b="sap.ui.model.odata.v4.ODataMetaModel",x,U=new m,P=new Map,E={messageChange:true},S={"Edm.Boolean":{type:"sap.ui.model.odata.type.Boolean"},"Edm.Byte":{type:"sap.ui.model.odata.type.Byte"},"Edm.Date":{type:"sap.ui.model.odata.type.Date"},"Edm.DateTimeOffset":{constraints:{$Precision:"precision"},type:"sap.ui.model.odata.type.DateTimeOffset"},"Edm.Decimal":{constraints:{"@Org.OData.Validation.V1.Minimum/$Decimal":"minimum","@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive":"minimumExclusive","@Org.OData.Validation.V1.Maximum/$Decimal":"maximum","@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive":"maximumExclusive",$Precision:"precision",$Scale:"scale"},type:"sap.ui.model.odata.type.Decimal"},"Edm.Double":{type:"sap.ui.model.odata.type.Double"},"Edm.Guid":{type:"sap.ui.model.odata.type.Guid"},"Edm.Int16":{type:"sap.ui.model.odata.type.Int16"},"Edm.Int32":{type:"sap.ui.model.odata.type.Int32"},"Edm.Int64":{type:"sap.ui.model.odata.type.Int64"},"Edm.SByte":{type:"sap.ui.model.odata.type.SByte"},"Edm.Single":{type:"sap.ui.model.odata.type.Single"},"Edm.Stream":{type:"sap.ui.model.odata.type.Stream"},"Edm.String":{constraints:{"@com.sap.vocabularies.Common.v1.IsDigitSequence":"isDigitSequence",$MaxLength:"maxLength"},type:"sap.ui.model.odata.type.String"},"Edm.TimeOfDay":{constraints:{$Precision:"precision"},type:"sap.ui.model.odata.type.TimeOfDay"}},L={},D="@com.sap.vocabularies.Common.v1.ValueList",A="@com.sap.vocabularies.Common.v1.ValueListMapping",T="@com.sap.vocabularies.Common.v1.ValueListReferences",I="@com.sap.vocabularies.Common.v1.ValueListWithFixedValues",j=i.Level.WARNING;function R(e,t,n,i){var r,o=e.mSchema2MetadataUrl[t];if(!o){o=e.mSchema2MetadataUrl[t]={};o[n]=false}else if(!(n in o)){r=Object.keys(o)[0];if(o[r]){F(e,"A schema cannot span more than one document: "+t+" - expected reference URI "+r+" but instead saw "+n,i)}o[n]=false}}function q(e,t,n,i){var r,a,s,u;function f(e){var r,o;if(!(n in e)){i(j,a," does not contain ",n);return}i(C,"Including ",n," from ",a);for(o in e){if(o[0]!=="$"&&_(o)===n){r=e[o];t[o]=r;B(r,t.$Annotations)}}}if(n in t){return t[n]}u=e.mSchema2MetadataUrl[n];if(u){s=Object.keys(u);if(s.length>1){F(e,"A schema cannot span more than one document: "+"schema is referenced by following URLs: "+s.join(", "),n)}a=s[0];u[a]=true;i(C,"Namespace ",n," found in $Include of ",a);r=e.mMetadataUrl2Promise[a];if(!r){i(C,"Reading ",a);r=e.mMetadataUrl2Promise[a]=o.resolve(e.oRequestor.read(a)).then(e.validate.bind(e,a))}r=r.then(f);if(n in t){return t[n]}t[n]=r;return r}}function V(e,t){if(e===t){return""}if(e.indexOf(t)===0&&e[t.length]==="#"&&e.indexOf("@",t.length)<0){return e.slice(t.length+1)}}function N(e){var t=V(e,A);return t!==undefined?t:V(e,D)}function k(e,t){return t.some(function(t){return t.$Parameter&&t.$Parameter.some(function(t){return t.$Name===e})})}function B(e,t,n){var i;function r(e,t){var i;for(i in t){if(n||!(i in e)){e[i]=t[i]}}}for(i in e.$Annotations){if(!(i in t)){t[i]={}}r(t[i],e.$Annotations[i])}delete e.$Annotations}function F(e,t,n){var i=new Error(n+": "+t);e.oModel.reportError(t,b,i);throw i}function _(e){return e.slice(0,e.lastIndexOf(".")+1)}O=c.extend("sap.ui.model.odata.v4.ODataMetaContextBinding",{constructor:function(e,t,i){n(!i||i.getModel()===e,"oContext must belong to this model");c.call(this,e,t,i)},initialize:function(){var e=this.oModel.createBindingContext(this.sPath,this.oContext);this.bInitial=false;if(e!==this.oElementContext){this.oElementContext=e;this._fireChange()}},setContext:function(e){n(!e||e.getModel()===this.oModel,"oContext must belong to this model");if(e!==this.oContext){this.oContext=e;if(!this.bInitial){this.initialize()}}}});w=u.extend("sap.ui.model.odata.v4.ODataMetaListBinding",{constructor:function(){u.apply(this,arguments)},_fireFilter:function(){},_fireSort:function(){},checkUpdate:function(e){var t=this.oList.length;this.update();if(e||this.oList.length!==t){this._fireChange({reason:s.Change})}},fetchContexts:function(){var e,t=this.oModel.resolve(this.sPath,this.oContext),n=this;if(!t){return o.resolve([])}e=t.slice(-1)==="@";if(!e&&!t.endsWith("/")){t+="/"}return this.oModel.fetchObject(t).then(function(i){if(!i){return[]}if(e){t=t.slice(0,-1)}return Object.keys(i).filter(function(t){return t[0]!=="$"&&e!==(t[0]!=="@")}).map(function(e){return new f(n.oModel,t+e)})})},getContexts:function(e,t){this.iCurrentStart=e||0;this.iCurrentLength=Math.min(t||Infinity,this.iLength-this.iCurrentStart,this.oModel.iSizeLimit);return this.getCurrentContexts()},getCurrentContexts:function(){var e=[],t,n=this.iCurrentStart+this.iCurrentLength;for(t=this.iCurrentStart;t<n;t++){e.push(this.oList[this.aIndices[t]])}if(this.oList.dataRequested){e.dataRequested=true}return e},setContexts:function(e){this.oList=e;this.updateIndices();this.applyFilter();this.applySort();this.iLength=this._getLength()},update:function(){var e=[],t=this.fetchContexts(),n=this;if(t.isFulfilled()){e=t.getResult()}else{t.then(function(e){n.setContexts(e);n._fireChange({reason:s.Change})});e.dataRequested=true}this.setContexts(e)}});x=d.extend("sap.ui.model.odata.v4.ODataMetaPropertyBinding",{constructor:function(){d.apply(this,arguments);this.vValue=undefined},checkUpdate:function(e,t){var n,i=this;function r(n){if(e||n!==i.vValue){i.vValue=n;i._fireChange({reason:t||s.Change})}return n}n=this.oModel.fetchObject(this.sPath,this.oContext,this.mParameters).then(r);if(this.mParameters&&this.mParameters.$$valueAsPromise&&n.isPending()){r(n.unwrap())}},getValue:function(){return this.vValue},setContext:function(e){if(this.oContext!=e){this.oContext=e;if(this.bRelative){this.checkUpdate(false,s.Context)}}},setValue:function(){throw new Error("Unsupported operation: ODataMetaPropertyBinding#setValue")}});var G=l.extend("sap.ui.model.odata.v4.ODataMetaModel",{constructor:function(e,t,n,i,r){l.call(this);this.aAnnotationUris=n&&!Array.isArray(n)?[n]:n;this.sDefaultBindingMode=a.OneTime;this.mETags={};this.dLastModified=new Date(0);this.oMetadataPromise=null;this.oModel=i;this.mMetadataUrl2Promise={};this.oRequestor=e;this.mSchema2MetadataUrl={};this.mSupportedBindingModes={OneTime:true,OneWay:true};this.bSupportReferences=r!==false;this.sUrl=t}});G.prototype.$$valueAsPromise=true;G.prototype._mergeAnnotations=function(e,t){var n=this;this.validate(this.sUrl,e);e.$Annotations={};Object.keys(e).forEach(function(t){if(e[t].$kind==="Schema"){R(n,t,n.sUrl);B(e[t],e.$Annotations)}});t.forEach(function(t,i){var r,o;n.validate(n.aAnnotationUris[i],t);for(o in t){if(o[0]!=="$"){if(o in e){F(n,"A schema cannot span more than one document: "+o,n.aAnnotationUris[i])}r=t[o];e[o]=r;if(r.$kind==="Schema"){R(n,o,n.aAnnotationUris[i]);B(r,e.$Annotations,true)}}}})};G.prototype.attachEvent=function(e){if(!(e in E)){throw new Error("Unsupported event '"+e+"': v4.ODataMetaModel#attachEvent")}return l.prototype.attachEvent.apply(this,arguments)};G.prototype.bindContext=function(e,t){return new O(this,e,t)};G.prototype.bindList=function(e,t,n,i){return new w(this,e,t,n,i)};G.prototype.bindProperty=function(e,t,n){return new x(this,e,t,n)};G.prototype.bindTree=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#bindTree")};G.prototype.fetchCanonicalPath=function(e){return this.fetchUpdateData("",e).then(function(t){if(!t.editUrl){throw new Error(e.getPath()+": No canonical path for transient entity")}if(t.propertyPath){throw new Error("Context "+e.getPath()+" does not point to an entity. It should be "+t.entityPath)}return"/"+t.editUrl})};G.prototype.fetchData=function(){return this.fetchEntityContainer().then(function(e){return JSON.parse(JSON.stringify(e))})};G.prototype.fetchEntityContainer=function(e){var t,n=this;if(!this.oMetadataPromise){t=[o.resolve(this.oRequestor.read(this.sUrl,false,e))];if(this.aAnnotationUris){this.aAnnotationUris.forEach(function(i){t.push(o.resolve(n.oRequestor.read(i,true,e)))})}if(!e){this.oMetadataPromise=o.all(t).then(function(e){var t=e[0];n._mergeAnnotations(t,e.slice(1));return t})}}return this.oMetadataPromise};G.prototype.fetchModule=function(e){var t;e=e.replace(/\./g,"/");t=sap.ui.require(e);if(t){return o.resolve(t)}return o.resolve(new Promise(function(t,n){sap.ui.require([e],t)}))};G.prototype.fetchObject=function(e,t,n){var a=this.resolve(e,t),s=this;if(!a){i.error("Invalid relative path w/o context",e,b);return o.resolve(null)}return this.fetchEntityContainer().then(function(o){var u,c=false,l,d,p=true,h,m,y,g=o;function v(e,t){var i,o=e.indexOf("@",2);if(o>-1){return x(j,"Unsupported path after ",e.slice(0,o))}e=e.slice(2);i=e[0]==="."?r.get(e.slice(1),n.scope):n&&r.get(e,n.scope)||(e==="requestCurrencyCodes"||e==="requestUnitsOfMeasure"?s[e].bind(s):r.get(e));if(typeof i!=="function"){return x(j,e," is not a function but: "+i)}try{g=i(g,{$$valueAsPromise:n&&n.$$valueAsPromise,context:new f(s,t),schemaChildName:m})}catch(t){x(j,"Error calling ",e,": ",t)}return true}function $(e,t){var n;if(e&&t.$Parameter){n=t.$Parameter.filter(function(t){return t.$Name===e});if(n.length){g=n[0];return true}}return false}function O(e){return e.$kind!=="Action"||(!e.$IsBound&&u===L||e.$IsBound&&u===e.$Parameter[0].$Type)}function w(e){return e&&typeof e.then==="function"}function x(e){var t;if(i.isLoggable(e,b)){t=Array.isArray(l)?l.join("/"):l;i[e===C?"debug":"warning"](Array.prototype.slice.call(arguments,1).join("")+(t?" at /"+t:""),a,b)}if(e===j){g=undefined}return false}function U(e,t){var n;function i(){l=l||y&&t&&y+"/"+t;return x.apply(this,arguments)}u=g&&g.$Type;if(s.bSupportReferences&&!(e in o)){n=_(e);g=q(s,o,n,i)}if(e in o){y=d=m=e;g=h=o[m];if(!w(g)){return true}}if(w(g)&&g.isPending()){return i(C,"Waiting for ",n)}return i(j,"Unknown qualified name ",e)}function P(e,t,n){var i,r;if(e==="$Annotations"){return x(j,"Invalid segment: $Annotations")}if(g!==o&&typeof g==="object"&&e in g){if(e[0]==="$"||M.test(e)){p=false}}else{i=e.indexOf("@@");if(i<0){if(e.length>11&&e.slice(-11)==="@sapui.name"){i=e.length-11}else{i=e.indexOf("@")}}if(i>0){if(!P(e.slice(0,i),t,n)){return false}e=e.slice(i);r=true}if(typeof g==="string"&&!(r&&(e==="@sapui.name"||e[1]==="@"))&&!E(g,n.slice(0,t))){return false}if(p){if(e[0]==="$"||M.test(e)){p=false}else if(!r){if(e[0]!=="@"&&e.indexOf(".")>0){return U(e)}else if(g&&"$Type"in g){if(!U(g.$Type,"$Type")){return false}}else if(g&&"$Action"in g){if(!U(g.$Action,"$Action")){return false}u=L}else if(g&&"$Function"in g){if(!U(g.$Function,"$Function")){return false}}else if(t===0){y=d=m=m||o.$EntityContainer;g=h=h||o[m];if(e&&e[0]!=="@"&&!(e in h)){return x(j,"Unknown child ",e," of ",m)}}if(Array.isArray(g)){if(e!==n[t]&&k(e,g)){d=e;y=y+"/"+e;return true}g=g.filter(O);if(e==="@$ui5.overload"){return true}if(g.length!==1){return x(j,"Unsupported overloads")}if($(e,g[0])){return true}g=g[0].$ReturnType;y=y+"/0/$ReturnType";if(g){if(e==="value"&&!(o[g.$Type]&&o[g.$Type].value)){d=undefined;return true}if(!U(g.$Type,"$Type")){return false}}if(!e){return true}}}}if(!e){return t+1>=n.length||x(j,"Invalid empty segment")}if(e[0]==="@"){if(e==="@sapui.name"){g=d;if(g===undefined){x(j,"Unsupported path before @sapui.name")}else if(t+1<n.length){x(j,"Unsupported path after @sapui.name")}return false}if(e[1]==="@"){if(t+1<n.length){return x(j,"Unsupported path after ",e)}return v(e,[""].concat(n.slice(0,t),n[t].slice(0,i)).join("/"))}}if(!g||typeof g!=="object"){g=undefined;return!c&&x(C,"Invalid segment: ",e)}if(p&&e[0]==="@"){g=(o.$Annotations||{})[y]||{};c=true;p=false}else if(e==="$"&&t+1<n.length){return x(j,"Unsupported path after $")}}if(e!=="@"&&e!=="$"){if(e[0]==="@"){c=true}d=p||e[0]==="@"?e:undefined;y=p?y+"/"+e:undefined;g=g[e]}return true}function E(e,t){var n;if(l){return x(j,"Invalid recursion")}l=t;c=false;p=true;g=o;n=e.split("/").every(P);l=undefined;return n}if(!E(a.slice(1))&&w(g)){g=g.then(function(){return s.fetchObject(e,t,n)})}return g})};G.prototype.fetchUI5Type=function(e){var t=this.getMetaContext(e),n=this;if(e.endsWith("/$count")){v=v||new h;return o.resolve(v)}return this.fetchObject(undefined,t).catch(function(){}).then(function(r){var o,a,s,u=U.getName();if(!r){i.warning("No metadata for path '"+e+"', using "+u,undefined,b);return U}a=r["$ui5.type"];if(a){return a}if(r.$isCollection){i.warning("Unsupported collection type, using "+u,e,b)}else{s=S[r.$Type];if(s){u=s.type;o=n.getConstraints(r,t.getPath())}else{i.warning("Unsupported type '"+r.$Type+"', using "+u,e,b)}}if(u===U.getName()){r["$ui5.type"]=U}else{r["$ui5.type"]=n.fetchModule(u).then(function(e){a=new e(undefined,o);r["$ui5.type"]=a;return a})}return r["$ui5.type"]})};G.prototype.fetchUpdateData=function(e,n){var i=n.getModel(),r=i.resolve(e,n),a=this;function s(e){var t=new Error(r+": "+e);i.reportError(e,b,t);throw t}return this.fetchObject(this.getMetaPath(r)).then(function(){return a.fetchEntityContainer()}).then(function(i){var a,u=i[i.$EntityContainer],f,c,l,d,p,h,m,y=false,g;function v(e){var t=e.indexOf("(");return t>=0?e.slice(t):""}function $(e){a.push({path:p,prefix:e,type:g})}function C(e){var t=e.indexOf("(");return t>=0?e.slice(0,t):e}function O(e){if(e.includes("($uid=")){$(C(e))}else{a.push(e)}}m=r.slice(1).split("/");d=m.shift();p="/"+d;f=p;l=decodeURIComponent(C(d));c=u[l];if(!c){s("Not an entity set: "+l)}g=i[c.$Type];e="";h="";a=[];O(d);m.forEach(function(n){var r,o;p+="/"+n;if(M.test(n)){$(a.pop());f+="/"+n}else{o=decodeURIComponent(C(n));h=t.buildPath(h,o);r=g[o];if(!r){s("Not a (navigation) property: "+o)}g=i[r.$Type];if(r.$kind==="NavigationProperty"){if(c.$NavigationPropertyBinding&&h in c.$NavigationPropertyBinding){l=c.$NavigationPropertyBinding[h];c=u[l];h="";a=[encodeURIComponent(l)+v(n)];if(!r.$isCollection){$(a.pop())}}else{O(n)}f=p;e=""}else{e=t.buildPath(e,n)}}});return o.all(a.map(function(e){if(typeof e==="string"){return e}return n.fetchValue(e.path).then(function(n){var i;if(!n){s("No instance to calculate key predicate at "+e.path)}if(t.hasPrivateAnnotation(n,"transient")){y=true;return undefined}i=t.getPrivateAnnotation(n,"predicate");if(!i){s("No key predicate known at "+e.path)}return e.prefix+i},function(t){s(t.message+" at "+e.path)})})).then(function(t){return{editUrl:y?undefined:t.join("/"),entityPath:f,propertyPath:e}})})};G.prototype.fetchValueListMappings=function(e,n,i){var r=this,o=e.getMetaModel();return o.fetchEntityContainer().then(function(a){var s,u=a.$Annotations,f={},c=r===o,l;l=Object.keys(u).filter(function(o){if(t.namespace(o)===n){if(typeof i==="string"?o===i:r.getObject("/"+o)===i){return true}if(!c){throw new Error("Unexpected annotation target '"+o+"' with namespace of data service in "+e.sServiceUrl)}}return false});if(!l.length){throw new Error("No annotation '"+D.slice(1)+"' in "+e.sServiceUrl)}s=u[l[0]];Object.keys(s).forEach(function(t){var n=N(t);if(n!==undefined){f[n]=s[t];["CollectionRoot","SearchSupported"].forEach(function(n){if(n in s[t]){throw new Error("Property '"+n+"' is not allowed in annotation '"+t.slice(1)+"' for target '"+l[0]+"' in "+e.sServiceUrl)}})}else if(!c){throw new Error("Unexpected annotation '"+t.slice(1)+"' for target '"+l[0]+"' with namespace of data service in "+e.sServiceUrl)}});return f})};G.prototype.fetchValueListType=function(t){var n=this.getMetaContext(t),i=this;return this.fetchObject(undefined,n).then(function(r){var o,a;if(!r){throw new Error("No metadata for "+t)}o=i.getObject("@",n);if(o[I]){return e.Fixed}for(a in o){if(V(a,T)!==undefined||V(a,A)!==undefined){return e.Standard}if(V(a,D)!==undefined){return o[a].SearchSupported===false?e.Fixed:e.Standard}}return e.None})};G.prototype.getAbsoluteServiceUrl=function(e){var t=new g(this.sUrl).absoluteTo(document.baseURI).pathname().toString();return new g(e).absoluteTo(t).filename("").toString()};G.prototype.getAdapterFactoryModulePath=function(){return"sap/ui/mdc/experimental/adapter/odata/v4/ODataAdapterFactory"};G.prototype.getConstraints=function(e,t){var n,i,r,o=S[e.$Type];function a(e,t){if(t!==undefined){i=i||{};i[e]=t}}if(o){r=o.constraints;for(n in r){a(r[n],n[0]==="@"?this.getObject(t+n):e[n])}if(e.$Nullable===false){a("nullable",false)}}return i};G.prototype.getData=t.createGetMethod("fetchData");G.prototype.getETags=function(){return this.mETags};G.prototype.getLastModified=function(){return this.dLastModified};G.prototype.getMetaContext=function(e){return new f(this,this.getMetaPath(e))};G.prototype.getMetaPath=function(e){return t.getMetaPath(e)};G.prototype.getObject=t.createGetMethod("fetchObject");G.prototype.getOrCreateSharedModel=function(e,t){var n;e=this.getAbsoluteServiceUrl(e);n=P.get(e);if(!n){n=new this.oModel.constructor({groupId:t,operationMode:p.Server,serviceUrl:e,synchronizationMode:"None"});n.setDefaultBindingMode(a.OneWay);P.set(e,n);n.oRequestor.mHeaders["X-CSRF-Token"]=this.oModel.oRequestor.mHeaders["X-CSRF-Token"]}return n};G.prototype.getOriginalProperty=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#getOriginalProperty")};G.prototype.getProperty=G.prototype.getObject;G.prototype.getUI5Type=t.createGetMethod("fetchUI5Type",true);G.prototype.getValueListType=t.createGetMethod("fetchValueListType",true);G.prototype.isList=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#isList")};G.prototype.refresh=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#refresh")};G.prototype.requestCodeList=function(e,t,n){var r=this.fetchEntityContainer().getResult(),o=r[r.$EntityContainer],a=this;if(n&&n.context){if(n.context.getModel()!==this||n.context.getPath()!=="/"){throw new Error("Unsupported context: "+n.context)}}if(t!==undefined&&t!==o){throw new Error("Unsupported raw value: "+t)}return this.requestObject("/@com.sap.vocabularies.CodeList.v1."+e).then(function(e){var t,n,r,o,s;if(!e){return null}t=a.getAbsoluteServiceUrl(e.Url)+"#"+e.CollectionPath;o=$.get(t);if(o){return o}r=a.getOrCreateSharedModel(e.Url,"$direct");n=r.getMetaModel();s="/"+e.CollectionPath+"/";o=n.requestObject(s).then(function(t){return new Promise(function(o,a){var u=s+"@Org.OData.Core.V1.AlternateKeys",f=n.getObject(u),c,l=$(t.$Key),d=s+l+"@com.sap.vocabularies.Common.v1.",p,h,m=s+l+"@com.sap.vocabularies.CodeList.v1.StandardCode/$Path",y,g;function v(t,n){var r=n.getProperty(l),o={Text:n.getProperty(g),UnitSpecificScale:n.getProperty(h)};if(y){o.StandardCode=n.getProperty(y)}if(o.UnitSpecificScale===null){i.error("Ignoring customizing w/o unit-specific scale for code "+r+" from "+e.CollectionPath,e.Url,b)}else{t[r]=o}return t}function $(e){var t;if(e&&e.length===1){t=e[0]}else{throw new Error("Single key expected: "+s)}return typeof t==="string"?t:t[Object.keys(t)[0]]}if(f){if(f.length!==1){throw new Error("Single alternative expected: "+u)}else if(f[0].Key.length!==1){throw new Error("Single key expected: "+u+"/0/Key")}l=f[0].Key[0].Name.$PropertyPath}h=n.getObject(d+"UnitSpecificScale/$Path");g=n.getObject(d+"Text/$Path");p=[l,h,g];y=n.getObject(m);if(y){p.push(y)}c=r.bindList("/"+e.CollectionPath,null,null,null,{$select:p});c.attachChange(function(){var t;try{t=c.getContexts(0,Infinity);if(!t.length){i.error("Customizing empty for ",r.sServiceUrl+e.CollectionPath,b)}o(t.reduce(v,{}))}catch(e){a(e)}});c.attachDataReceived(function(e){var t=e.getParameter("error");if(t){a(t)}});c.getContexts(0,Infinity)})});$.set(t,o);return o})};G.prototype.requestCurrencyCodes=function(e,t){return this.requestCodeList("CurrencyCodes",e,t)};G.prototype.requestData=t.createRequestMethod("fetchData");G.prototype.requestObject=t.createRequestMethod("fetchObject");G.prototype.requestUI5Type=t.createRequestMethod("fetchUI5Type");G.prototype.requestUnitsOfMeasure=function(e,t){return this.requestCodeList("UnitsOfMeasure",e,t)};G.prototype.requestValueListInfo=function(e){var n=this.getMetaPath(e),i=n.slice(0,n.lastIndexOf("/")),r=i.slice(i.lastIndexOf("/")+1),o=this;if(!r.includes(".")){r=undefined}return Promise.all([r||this.requestObject(i+"/@sapui.name"),this.requestObject(n),this.requestObject(n+"@"),this.requestObject(n+I)]).then(function(n){var i=n[2],a=n[3],s={},u=t.namespace(n[0]),f=n[1],c={};function l(t,n,i,r){if(a!==undefined&&"SearchSupported"in t){throw new Error("Must not set 'SearchSupported' in annotation "+"'com.sap.vocabularies.Common.v1.ValueList' and annotation "+"'com.sap.vocabularies.Common.v1.ValueListWithFixedValues'")}if("CollectionRoot"in t){r=o.getOrCreateSharedModel(t.CollectionRoot);if(c[n]&&c[n].$model===r){s[n]=undefined}}if(s[n]){throw new Error("Annotations '"+D.slice(1)+"' with identical qualifier '"+n+"' for property "+e+" in "+s[n]+" and "+i)}s[n]=i;t=y.extend(true,{$model:r},t);delete t.CollectionRoot;delete t.SearchSupported;c[n]=t}if(!f){throw new Error("No metadata for "+e)}return Promise.all(Object.keys(i).filter(function(e){return V(e,T)!==undefined}).map(function(e){var t=i[e];return Promise.all(t.map(function(e){var t=o.getOrCreateSharedModel(e);return o.fetchValueListMappings(t,u,f.$Name?r+"/"+f.$Name:f).then(function(n){Object.keys(n).forEach(function(i){l(n[i],i,e,t)})})}))})).then(function(){var t;Object.keys(i).filter(function(e){return N(e)!==undefined}).forEach(function(e){l(i[e],N(e),o.sUrl,o.oModel)});t=Object.keys(c);if(!t.length){throw new Error("No annotation '"+T.slice(1)+"' for "+e)}if(a){if(t.length>1){throw new Error("Annotation '"+I.slice(1)+"' but multiple '"+D.slice(1)+"' for property "+e)}return{"":c[t[0]]}}return c})})};G.prototype.requestValueListType=t.createRequestMethod("fetchValueListType");G.prototype.resolve=function(e,t){var n,i;if(!e){return t?t.getPath():undefined}i=e[0];if(i==="/"){return e}if(!t){return undefined}if(i==="."){if(e[1]!=="/"){throw new Error("Unsupported relative path: "+e)}e=e.slice(2)}n=t.getPath();return i==="@"||n.slice(-1)==="/"?n+e:n+"/"+e};G.prototype.setLegacySyntax=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#setLegacySyntax")};G.prototype.toString=function(){return b+": "+this.sUrl};G.prototype.validate=function(e,t){var n,i,r,o,a,s;if(!this.bSupportReferences){return t}for(s in t.$Reference){a=t.$Reference[s];s=new g(s).absoluteTo(this.sUrl).toString();if("$IncludeAnnotations"in a){F(this,"Unsupported IncludeAnnotations",e)}for(n in a.$Include){o=a.$Include[n];if(o in t){F(this,"A schema cannot span more than one document: "+o+" - is both included and defined",e)}R(this,o,s,e)}}r=t.$LastModified?new Date(t.$LastModified):null;this.mETags[e]=t.$ETag?t.$ETag:r;i=t.$Date?new Date(t.$Date):new Date;r=r||i;if(this.dLastModified<r){this.dLastModified=r}delete t.$Date;delete t.$ETag;delete t.$LastModified;return t};return G});
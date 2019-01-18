/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","./library","sap/ui/Device","./CalendarLegendRenderer","sap/base/Log","sap/ui/thirdparty/jquery"],function(e,t,r,n,a,i){"use strict";var d=t.CalendarDayType;var s=t.StandardCalendarLegendItem;var o=e.extend("sap.ui.unified.CalendarLegend",{metadata:{library:"sap.ui.unified",properties:{standardItems:{type:"string[]",group:"Misc",defaultValue:["Today","Selected","WorkingDay","NonWorkingDay"]},columnWidth:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"120px"}},aggregations:{items:{type:"sap.ui.unified.CalendarLegendItem",multiple:true,singularName:"item"},_standardItems:{type:"sap.ui.unified.CalendarLegendItem",multiple:true,visibility:"hidden"}},designtime:"sap/ui/unified/designtime/CalendarLegend.designtime"},constructor:function(t,r){e.prototype.constructor.apply(this,arguments);if(typeof t!=="string"){r=t}if(!r||r&&!r.standardItems){this._addStandardItems(this.getStandardItems())}}});o.prototype.setStandardItems=function(e){var t;if(e&&e.length===1&&e[0]===""){e=[]}if(e&&e.length){e=this.validateProperty("standardItems",e);for(t=0;t<e.length;t++){if(!s[e[t]]){throw new Error("Invalid value '"+e[t]+"'. Property standardItems must contain values from sap.ui.unified.StandardCalendarLegendItem.")}}}this.setProperty("standardItems",e);this._addStandardItems(this.getStandardItems(),true);return this};o.prototype._addStandardItems=function(e,t){var r,n=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified"),a=this.getId();if(t){this.destroyAggregation("_standardItems")}for(r=0;r<e.length;r++){var i=new sap.ui.unified.CalendarLegendItem(a+"-"+e[r],{text:n.getText(o._Standard_Items_TextKeys[e[r]])});this.addAggregation("_standardItems",i)}};o._Standard_Items_TextKeys={Today:"LEGEND_TODAY",Selected:"LEGEND_SELECTED",WorkingDay:"LEGEND_NORMAL_DAY",NonWorkingDay:"LEGEND_NON_WORKING_DAY"};o.prototype._getItemType=function(e,t){var r=e.getType(),n,i;if(r&&r!==d.None){return r}i=this._getUnusedItemTypes(t);n=t.filter(function(e){return!e.getType()||e.getType()===d.None}).indexOf(e);if(n<0){a.error("Legend item is not in the legend",this);return r}if(i[n]){r=i[n]}else{r="Type"+(Object.keys(d).length+n-i.length-1)}return r};o.prototype._getItemByType=function(e){var t,r=this.getItems(),n;for(n=0;n<r.length;n++){if(this._getItemType(r[n],r)===e){t=r[n];break}}return t};o.prototype._getUnusedItemTypes=function(e){var t=i.extend({},d),r,n;delete t[d.None];delete t[d.NonWorking];for(n=0;n<e.length;n++){r=e[n].getType();if(t[r]){delete t[r]}}return Object.keys(t)};return o});
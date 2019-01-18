/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./PlanningCalendarHeader","./SegmentedButtonItem","./SinglePlanningCalendarWeekView","./SinglePlanningCalendarGrid","./SinglePlanningCalendarRenderer","sap/base/Log","sap/ui/core/Control","sap/ui/core/Locale","sap/ui/core/LocaleData","sap/ui/core/InvisibleText","sap/ui/core/date/UniversalDate","sap/ui/core/format/DateFormat","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/calendar/CalendarUtils","sap/ui/unified/DateRange"],function(e,t,i,a,r,n,s,o,g,l,h,d,c,p,u){"use strict";var _=s.extend("sap.m.SinglePlanningCalendar",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Appearance",defaultValue:""},startDate:{type:"object",group:"Data"}},aggregations:{actions:{type:"sap.ui.core.Control",multiple:true,singularName:"action",forwarding:{getter:"_getHeader",aggregation:"actions"}},appointments:{type:"sap.m.CalendarAppointment",multiple:true,singularName:"appointment",forwarding:{getter:"_getGrid",aggregation:"appointments"}},views:{type:"sap.m.SinglePlanningCalendarView",multiple:true,singularName:"view"},_header:{type:"sap.m.PlanningCalendarHeader",multiple:false,visibility:"hidden"},_grid:{type:"sap.m.SinglePlanningCalendarGrid",multiple:false,visibility:"hidden"}},associations:{selectedView:{type:"sap.m.SinglePlanningCalendarView",multiple:false}},events:{appointmentSelect:{parameters:{appointment:{type:"sap.m.CalendarAppointment"}}},headerDateSelect:{parameters:{date:{type:"object"}}},startDateChange:{parameters:{date:{type:"object"}}}}}});_.prototype.init=function(){var e=this.getId();this._oRB=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._oDefaultView=new i({key:"DEFAULT_INNER_WEEK_VIEW_CREATED_FROM_CONTROL",title:""});this.setAssociation("selectedView",this._oDefaultView);this.setAggregation("_header",this._createHeader());this.setAggregation("_grid",new a(e+"-Grid"));this._attachHeaderEvents();this._attachGridEvents();this.setStartDate(new Date)};_.prototype.exit=function(){if(this._oDefaultView){this._oDefaultView.destroy();this._oDefaultView=null}};_.prototype.setTitle=function(e){this._getHeader().setTitle(e);return this.setProperty("title",e,true)};_.prototype.setStartDate=function(e){this.setProperty("startDate",e,true);this._alignColumns();return this};_.prototype.addView=function(e){var i;if(!e){return this}if(this._isViewKeyExisting(e.getKey())){n.error("There is an existing view with the same key.",this);return}this.addAggregation("views",e);i=this._getHeader()._getOrCreateViewSwitch();i.addItem(new t({key:e.getKey(),text:e.getTitle()}));if(this._getSelectedView().getKey()===this._oDefaultView.getKey()){this.setAssociation("selectedView",e)}this._alignView();return this};_.prototype.insertView=function(e,i){var a;if(!e){return this}if(this._isViewKeyExisting(e.getKey())){n.error("There is an existing view with the same key.",this);return}this.insertAggregation("views",e,i);a=this._getHeader()._getOrCreateViewSwitch();a.insertItem(new t({key:e.getKey(),text:e.getTitle()}),i);if(this._getSelectedView().getKey()===this._oDefaultView.getKey()){this.setAssociation("selectedView",e)}this._alignView();return this};_.prototype.removeView=function(e){if(!e){return this}var t=this._getHeader()._getOrCreateViewSwitch(),i=t.getItems(),a=this._getSelectedView(),r=e.getKey(),n,s;for(s=0;s<i.length;s++){n=i[s];if(n.getKey()===r){t.removeItem(n);break}}this.removeAggregation("views",e);if(r===a.getKey()){this.setAssociation("selectedView",this.getViews()[0]||this._oDefaultView)}this._alignView();return this};_.prototype.removeAllViews=function(){var e=this._getHeader()._getOrCreateViewSwitch();e.removeAllItems();this.setAssociation("selectedView",this._oDefaultView);this._alignView();return this.removeAllAggregation("views")};_.prototype.destroyViews=function(){var e=this._getHeader()._getOrCreateViewSwitch();e.destroyItems();this.setAssociation("selectedView",this._oDefaultView);this._alignView();return this.destroyAggregation("views")};_.prototype._alignView=function(){this._switchViewButtonVisibility();this._alignColumns();return this};_.prototype._createHeader=function(){var t=new e(this.getId()+"-Header");t.getAggregation("_actionsToolbar").addAriaLabelledBy(l.getStaticId("sap.m","SPC_ACTIONS_TOOLBAR"));t.getAggregation("_navigationToolbar").addAriaLabelledBy(l.getStaticId("sap.m","SPC_NAVIGATION_TOOLBAR"));return t};_.prototype._isViewKeyExisting=function(e){return this.getViews().some(function(t){return t.getKey()===e})};_.prototype._getSelectedView=function(){var e,t=this.getViews(),i=sap.ui.getCore().byId(this.getAssociation("selectedView")).getKey();for(var a=0;a<t.length;a++){if(i===t[a].getKey()){e=t[a];break}}return e||this._oDefaultView};_.prototype._switchViewButtonVisibility=function(){var e=this._getHeader()._getOrCreateViewSwitch(),t=e.getItems().length>1;e.setProperty("visible",t);return this};_.prototype._attachHeaderEvents=function(){var e=this._getHeader();e.attachEvent("pressPrevious",this._handlePressArrow,this);e.attachEvent("pressToday",this._handlePressToday,this);e.attachEvent("pressNext",this._handlePressArrow,this);e.attachEvent("dateSelect",this._handleCalendarPickerDateSelect,this);e._getOrCreateViewSwitch().attachEvent("selectionChange",this._handleViewSwitchChange,this);return this};_.prototype._attachGridEvents=function(){var e=this._getGrid();e._getColumnHeaders().attachEvent("select",function(e){this.fireHeaderDateSelect({date:e.getSource().getDate()})},this);e.attachEvent("appointmentSelect",function(e){this.fireAppointmentSelect({appointment:e.getParameter("appointment")})},this);return this};_.prototype._handlePressArrow=function(e){this._applyArrowsLogic(e.getId()==="pressPrevious")};_.prototype._handlePressToday=function(){var e=this._getSelectedView().calculateStartDate(new Date);this.setStartDate(e);this.fireStartDateChange({date:e})};_.prototype._handleViewSwitchChange=function(e){this.setAssociation("selectedView",e.getParameter("item"));this._alignColumns()};_.prototype._handleCalendarPickerDateSelect=function(){var e=this._getHeader().getStartDate();e=this._getSelectedView().calculateStartDate(new Date(e.getTime()));this.setStartDate(e);this.fireStartDateChange({date:e})};_.prototype._updateCalendarPickerSelection=function(){var e=this._getFirstAndLastRangeDate(),t;t=new u({startDate:e.oStartDate.toLocalJSDate(),endDate:e.oEndDate.toLocalJSDate()});this._getHeader().getAggregation("_calendarPicker").removeAllSelectedDates();this._getHeader().getAggregation("_calendarPicker").addSelectedDate(t)};_.prototype._formatPickerText=function(){var e=this._getFirstAndLastRangeDate(),t=e.oStartDate.toLocalJSDate(),i=e.oEndDate.toLocalJSDate(),a=d.getDateInstance({style:"long"}),r=a.format(t);if(t.getTime()!==i.getTime()){r+=" - "+a.format(i)}return r};_.prototype._applyArrowsLogic=function(e){var t=c.fromLocalJSDate(this.getStartDate()||new Date),i=this._getSelectedView().getScrollEntityCount(),a;if(e){i*=-1}t.setDate(t.getDate()+i);a=t.toLocalJSDate();this.setStartDate(a);this.fireStartDateChange({date:a})};_.prototype._getFirstAndLastRangeDate=function(){var e=this._getSelectedView(),t=this._getHeader().getStartDate()||new Date,i=e.getEntityCount()-1,a,r;a=c.fromLocalJSDate(e.calculateStartDate(new Date(t.getTime())));r=new c(a);r.setDate(a.getDate()+i);return{oStartDate:a,oEndDate:r}};_.prototype._alignColumns=function(){var e=this._getHeader(),t=this._getGrid(),i=this._getSelectedView(),a=this.getStartDate()||new Date,r=i.calculateStartDate(new Date(a.getTime())),n=c.fromLocalJSDate(r);e.setStartDate(r);e.setPickerText(this._formatPickerText(n));this._updateCalendarPickerSelection();t.setStartDate(r);t._setColumns(i.getEntityCount());this._setColumnHeaderVisibility()};_.prototype._setColumnHeaderVisibility=function(){var e=!this._getSelectedView().isA("sap.m.SinglePlanningCalendarDayView");this._getGrid()._getColumnHeaders().setVisible(e)};_.prototype._getHeader=function(){return this.getAggregation("_header")};_.prototype._getGrid=function(){return this.getAggregation("_grid")};return _});
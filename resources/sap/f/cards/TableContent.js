/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Table","sap/f/cards/BaseContent","sap/m/Column","sap/m/ColumnListItem","sap/m/Text","sap/m/Link","sap/m/ProgressIndicator","sap/m/ObjectIdentifier","sap/m/ObjectStatus","sap/f/Avatar","sap/f/cards/ActionEnablement"],function(t,e,n,r,s,a,i,o,l,p,u){"use strict";var c=e.extend("sap.f.cards.TableContent",{renderer:{}});c.prototype.exit=function(){if(this._oItemTemplate){this._oItemTemplate.destroy();this._oItemTemplate=null}};c.prototype._getTable=function(){if(this._bIsBeingDestroyed){return null}var e=this.getAggregation("_content");if(!e){e=new t({id:this.getId()+"-Table"});this.setAggregation("_content",e)}return e};c.prototype.setConfiguration=function(t){e.prototype.setConfiguration.apply(this,arguments);if(!t){return}if(t.row&&t.row.columns){this._setColumns(t.row)}};c.prototype._setColumns=function(t){var e=[],a=this._getTable(),i=t.columns;i.forEach(function(t){this._getTable().addColumn(new n({header:new s({text:t.label})}));e.push(this._createCell(t))}.bind(this));this._oItemTemplate=new r({cells:e});this._attachActions(t,this._oItemTemplate);a.bindItems({path:this.getBindingContext().getPath(),template:this._oItemTemplate})};c.prototype._createCell=function(t){if(t.url){return new a({text:t.value,href:t.url})}if(t.identifier){return new o({title:t.value})}if(t.state){return new l({text:t.value,state:t.state})}if(t.value){return new s({text:t.value})}if(t.icon){return new p({src:t.icon.src,displayShape:t.icon.shape})}if(t.progressIndicator){return new i({percentValue:t.progressIndicator.percent,displayValue:t.progressIndicator.text,state:t.progressIndicator.state})}};u.enrich(c);return c});
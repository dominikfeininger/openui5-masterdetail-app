sap.ui.define(["sap/ui/test/Opa5","sap/ui/demo/masterdetail/localService/mockserver","sap/ui/model/odata/v2/ODataModel"],function(a,t,e){"use strict";return a.extend("sap.ui.demo.masterdetail.test.integration.arrangements.Startup",{iStartMyApp:function(a){var e=a||{};this._clearSharedData();e.delay=e.delay||1;var i=t.init(e);this.iWaitForPromise(i);this.iStartMyUIComponent({componentConfig:{name:"sap.ui.demo.masterdetail",async:true},hash:e.hash,autoWait:e.autoWait})},_clearSharedData:function(){e.mSharedData={server:{},service:{},meta:{}}}})});
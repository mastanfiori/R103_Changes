sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/MessageItem",
    "sap/m/MessagePopover",
    "sap/ui/core/Core",
    "sap/ui/core/MessageType"
], function (BaseController, JSONModel, formatter, MessageToast, MessageBox, MessageItem, MessagePopover, Core, MessageType) {
    "use strict";
    var sObjectId, sPrdId, sInspection, arr = [],
        arr1 = [],
        i18n, flag, olength3;
    return BaseController.extend("com.sugarcreek.R103_Quality_Notif.controller.Object", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page is busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            /*	var iOriginalBusyDelay,
                    oViewModel = new JSONModel({
                        busy: true,
                        delay: 0
                    });*/
            var itemTabJSON = new sap.ui.model.json.JSONModel();
            this.getView().setModel(itemTabJSON, "TableModel");
            i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

            // Store original busy indicator delay, so it can be restored later on
            /*iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
            this.setModel(oViewModel, "objectView");*/
            /*	this.getOwnerComponent().getModel().metadataLoaded().then(function () {
                    // Restore original busy indicator delay for the object view
                    oViewModel.setProperty("/delay", iOriginalBusyDelay);
                });*/
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Event handler when the share in JAM button has been clicked
         * @public
	

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Binds the view to the object path.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched: function (oEvent) {
            //this.getView().byId("iItBatchesSet").setVisible(false);
            this.getView().byId("iItDefectsSet").removeSelections(true);
            sObjectId = oEvent.getParameter("arguments").objectId;
            sPrdId = oEvent.getParameter("arguments").PRDId;
            /**** Changes by Mastan*/
            sInspection = oEvent.getParameter("arguments").INSlot;
            // debugger;
            var splitted = sInspection.split("", 2);
            var val1 = splitted[0];
            var val2 = splitted[1];
            var val3 = val1 + val2;

            if (val3 === "89") {
                this.getView().byId("_IDEGen_objectattribute7").setVisible(true);
            }
            else {
                this.getView().byId("_IDEGen_objectattribute6").setVisible(true);
            }

            /*****Mastan */
            var aFilters = [];
            var filter1 = new sap.ui.model.Filter({
                path: "Qmnum",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sObjectId
            });
            aFilters.push(filter1);

            var filter2 = new sap.ui.model.Filter({
                path: "Aufnr",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sPrdId
            });
            aFilters.push(filter2);

            //	sap.ui.core.BusyIndicator.show();
            this.getOwnerComponent().getModel().read("/ItQnotifSelSet", {
                filters: aFilters,
                success: function (oData, response) {
                    //	sap.ui.core.BusyIndicator.hide();
                    var attModel = new sap.ui.model.json.JSONModel();
                    attModel.setData(oData.results);
                    this.getView().setModel(attModel, "headerData");
                }.bind(this),
                error: function (oError) {
                    //	sap.ui.core.BusyIndicator.hide();
                }
            });
            //	sap.ui.core.BusyIndicator.show();
            this.getOwnerComponent().getModel().read("/ItDefectsSet", {
                filters: [filter1],
                success: function (oData, response) {
                    //	sap.ui.core.BusyIndicator.hide();
                    var attModel1 = new sap.ui.model.json.JSONModel();
                    attModel1.setData(oData.results);
                    this.getView().setModel(attModel1, "defectData");
                    this.getView().byId("iItDefectsSet").setModel(attModel1);
                }.bind(this),
                error: function (oError) {
                    //	sap.ui.core.BusyIndicator.hide();
                }
            });
            this.onPressDefects();

            //App State

            /*	var sHash = sap.ui.core.routing.HashChanger.getInstance().getHash();
                if (sHash !== "undefined" && sHash !== "") {
                    var sAppStateKeys = /(?:sap-iapp-state=)([^&=]+)/.exec(sHash);
                    if (sAppStateKeys !== null) {
                        var sAppStateKey = sAppStateKeys[1];
                        sap.ushell.Container
                            .getService("CrossApplicationNavigation")
                            .getAppState(this.getOwnerComponent(), sAppStateKey)
                            .done(function (oSavedAppState) {
                                this.getView().getModel("TableModel").setData(oSavedAppState.getData());
                            }.bind(this));
                    }
                }*/
            /*	this.getModel().metadataLoaded().then(function () {
                    var sObjectPath = this.getModel().createKey("ItQnotifSelSet", {
                        Qmnum: sObjectId
                    });
                    	
                    this._bindView("/" + sObjectPath);
                }.bind(this));*/
            //
        },

        // Notification Navigation to Change Quality Notification

        handleQNLinkPress: function (oEvt) {
            this.QN = oEvt.getSource().getText();
            if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sap.ushell.Container.getService(
                "CrossApplicationNavigation")) {
                var crossAppNav = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sap.ushell.Container.getService(
                    "CrossApplicationNavigation");
                var oAppState = crossAppNav.createEmptyAppState(this.getOwnerComponent());
                oAppState.setData(this.getView().getModel("TableModel").getData());
                oAppState.save();

                var oHashChanger = sap.ui.core.routing.HashChanger.getInstance();
                var sOldHash = oHashChanger.getHash().split("?sap-iapp-state")[0];
                //var snewHash = sOldHash + "?" + "sap-iapp-state=" + oAppState.getKey();
                //oHashChanger.replaceHash(snewHash);

                var href = (crossAppNav && crossAppNav.hrefForExternal({
                    target: {
                        semanticObject: "QualityNotification",
                        action: "change"
                    },
                    params: {

                        QualityNotification: this.QN

                    },
                    //appStateKey: oAppState.getKey()

                })) || "";

                crossAppNav.toExternal({
                    target: {
                        shellHash: href
                    }
                });

            } else {
                MessageBox.error(i18n.getText("CANT_NAVIGATE"), "ERROR");
            }

        },
        onPressDefects: function (oEvent) {
            //	this.getView().byId("iItBatchesSet").setVisible(true);
            var filter1 = new sap.ui.model.Filter({
                path: "Aufnr",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sPrdId //2108000092 sPrdId 
            });
            var filter3 = new sap.ui.model.Filter({
                path: "Qmnum",
                operator: sap.ui.model.FilterOperator.EQ,
                value1: sObjectId //sObjectId
            });

            this.getOwnerComponent().getModel().read("/ItBatchesSet", {
                filters: [filter1, filter3],
                success: function (oData, response) {
                    //	sap.ui.core.BusyIndicator.hide();
                    var attModel2 = new sap.ui.model.json.JSONModel();
                    attModel2.setData(oData.results);
                    this.getView().setModel(attModel2, "batchData");
                    this.getView().byId("iItBatchesSet").setModel(attModel2);
                }.bind(this),
                error: function (oError) {
                    //	sap.ui.core.BusyIndicator.hide();
                }
            });
        },
        onSelectChangeDef: function (oEvent) {
            this.getView().byId("applydefId").setVisible(true);
            this.getView().byId("_IDEGen_button1").setVisible(true);
            // var path = this.getView().byId("iItDefectsSet").getSelectedContextPaths().length - 1;
            // if (path >= 2) {
            // 	//this.getView().byId("iItDefectsSet").removeSelections(true);
            // 	MessageToast.show("Please select Max 2 rows only");
            // 	return;
            // }
        },
        onBatchPost: function (oEvent) {
            flag = false;
            this.getView().byId("oExeidbtn").setVisible(true);
            var olength = this.getView().byId("iItDefectsSet").getSelectedItems();
            arr = [];
            if (olength.length === 0) {
                MessageToast.show("Please select the Any one row");
            } else {
                for (var i = 0; i < olength.length; i++) {
                    var obj = {};
                    //var oPath = olength.length - 1;
                    var otabPath = this.getView().byId("iItDefectsSet").getSelectedContextPaths()[i].replace("/", "");
                    obj.Posnr = this.byId("iItDefectsSet").getModel("defectData").getData()[otabPath].Posnr;

                    obj.Fegrp = this.byId("iItDefectsSet").getModel("defectData").getData()[otabPath].Fegrp;
                    obj.Fecod = this.byId("iItDefectsSet").getModel("defectData").getData()[otabPath].Fecod;
                    obj.Txtcdfe = this.byId("iItDefectsSet").getModel("defectData").getData()[otabPath].Txtcdfe;
                    arr.push(obj);
                }

                /*var olength2 = this.getView().byId("iItBatchesSet").getSelectedItems();*/
                var olength2 = this.getView().getModel("batchData").getData().length;
                arr1 = [];
                /*	if (olength2 <= 2) {*/
                for (var j = 0; j < olength2; j++) {
                    var obj1 = {};
                    var a = this.getView().byId("iItBatchesSet").getItems();
                    var b = a[j].getCells()[0].getSelected();
                    if (b === true) {
                        obj1.Sel = "X";
                    } else {
                        obj1.Sel = "";
                    }
                    //var oPath = olength.length - 1;
                    //var otab1Path = this.getView().byId("iItBatchesSet").getSelectedContextPaths()[j].replace("/","");
                    obj1.Aufnr = sPrdId;
                    obj1.RowSel = this.byId("iItBatchesSet").getModel("batchData").getData()[j].RowSel;
                    obj1.Ceinm = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Ceinm;
                    obj1.Charg = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Charg;
                    obj1.Cpudt = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Cpudt;
                    obj1.Cputm = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Cputm;
                    obj1.Clabs = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Clabs;
                    obj1.Qmart = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Qmart;
                    /********** Start Changes by Mastan */
                    obj1.Fegrp1 = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Fegrp1;
                    obj1.Fecod1 = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Fecod1;
                    obj1.Fegrp2 = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Fegrp2;
                    obj1.Fecod2 = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Fecod2;
                    /*********Mastan End */
                    //Material
                    obj1.Matnr = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Matnr;
                    //Mutiple notification exist
                    obj1.MulInd = this.byId("iItBatchesSet").getModel("batchData").getData()[j].MulInd;
                    obj1.Mode = "A";
                    //Original Notification Number
                    obj1.QmnumO = sObjectId;
                    //commented as per the new requirement to add the notification in batch set
                    //	obj1.Qmnum = sObjectId;
                    //qm number
                    obj1.Qmnum = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Qmnum;
                    obj1.Werks = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Werks;
                    arr1.push(obj1);
                }

                /*	}*/
                var userRequestBody = {
                    Qmnum: sObjectId,
                    ItBatchesSet: arr1,
                    ItDefectsSet: arr
                }; //ItQnotifSelSet
                this.BatchOdata(userRequestBody);
            }
        },
        onExecute: function () {
            sap.ui.core.BusyIndicator.show();
            this.getView().byId("oExeidbtn").setVisible(false);
            flag = true;
            olength3 = this.getView().getModel("batchData").getData().length;
            arr1 = [];
            if (olength3 === 0) {
                MessageToast.show("Please select the Any one row");
            } else {
                for (var j = 0; j < olength3; j++) {
                    var obj1 = {};
                    var a = this.getView().byId("iItBatchesSet").getItems();
                    var b = a[j].getCells()[0].getSelected();
                    if (b === true) {
                        obj1.Sel = "X";
                    } else {
                        obj1.Sel = "";
                    }
                    //var oPath = olength.length - 1;
                    obj1.Aufnr = sPrdId;
                    obj1.Charg = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Charg;
                    obj1.Cpudt = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Cpudt;
                    obj1.Cputm = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Cputm;
                    obj1.Clabs = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Clabs;
                    obj1.Ceinm = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Ceinm;
                     var input= this.byId("iItBatchesSet").getModel("batchData").getData()[j].Qmart;
                     obj1.Qmart = input.toUpperCase();
                    obj1.Fegrp1 = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Fegrp1;
                    obj1.Fecod1 = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Fecod1;
                    obj1.Fegrp2 = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Fegrp2;
                    obj1.Fecod2 = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Fecod2;
                    //Material
                    obj1.Matnr = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Matnr;
                    //Mutiple notification exist
                    obj1.MulInd = this.byId("iItBatchesSet").getModel("batchData").getData()[j].MulInd;
                    obj1.Mode = "E";
                    ///Original Notification Number
                    obj1.QmnumO = sObjectId;
                    //commented as per the new requirement to add the notification in batch set
                    //	obj1.Qmnum = sObjectId;
                    //qm number
                    obj1.Qmnum = this.byId("iItBatchesSet").getModel("batchData").getData()[j].Qmnum;
                    arr1.push(obj1);
                }

                var userRequestBody = {
                    Qmnum: sObjectId,
                    ItBatchesSet: arr1,
                    ItDefectsSet: arr
                };
                this.BatchOdata(userRequestBody);
            }
        },
        BatchOdata: function (userRequestBody) {
            sap.ui.core.BusyIndicator.show();
            var that = this;
            this.getOwnerComponent().getModel().create("/ItQnotifSelSet", userRequestBody, {
                success: function (result, Response) {
                    sap.ui.core.BusyIndicator.hide();
                    that.getView().byId("oExeidbtn").setVisible(true);
                    var JsonModel = new sap.ui.model.json.JSONModel();
                    JsonModel.setData(result.ItBatchesSet.results);
                    this.getView().setModel(JsonModel, "batchData");
                    this.getView().byId("iItBatchesSet").setModel(JsonModel);
                    if (flag === true) {
                        this.oSuccess(Response, that);
                    }
                }.bind(this),
                //         error: function(){
                //             MessageBox.error("Batch has inventory issue and cannot be processed");
                //         }.bind(this),
                //         async: true, // execute async request to not stuck the main thread
                //         urlParameters: {} // send URL parameters if required
                //     });
                // },
                /*******************Comented by Mastan */
                error: function (error) {
                    // debugger;
                    // var msg = error.message.value;
                    sap.ui.core.BusyIndicator.hide();
                    that.getView().byId("oExeidbtn").setVisible(true);

                    // // operationResult = "0";
                    // var message = $(error.response.data).find('message').first().text();
                    // // var errorObj1 = JSON.parse(error.response.body);
                    // sap.m.MessageBox.show(
                    //     errorObj1.error.message.value,
                    //     sap.m.MessageBox.Icon.ERROR,
                    //     "Error In Change Operation"
                    // );


                    // this.oError(error);

                    //this.oError("Batch has inventory issue and cannot be processed")
                    //    sap.m.MessageBox.error("Batch has inventory issue and cannot be processed");
                }
                // async: true, // execute async request to not stuck the main thread
                // urlParameters: {} // send URL parameters if required 
            });
        },
        /*******************Comented by Mastan */
        // oSuccess: function (Response) {
        //     var oMsg = Response.statusText;
        //     this.getView().byId("oExeidbtn").setVisible(false);
        //     MessageBox.success("Notification " + oMsg);
        // },
        /********************Start changes By Mastan */
        oSuccess: function (Response , that) {
            var oMsg = Response.statusText;
            this.getView().byId("idCheck").setEditable(false);
            this.getView().byId("oExeidbtn").setVisible(false);
            MessageBox.success("Notification " + oMsg + "   Do you want to send Email.", {
                actions: [sap.m.MessageBox.Action.YES],
                onClose: function (oAction) {
                    if (oAction === sap.m.MessageBox.Action.YES) {
                       
                        // debugger;
                        var yes ="YES";
                        // this.oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZQM_O103_QUALITY_NOTIF_SRV", true);
                        that.getOwnerComponent().getModel().read("/ItEmailSet(Email='" + yes + "')", {

                            success: function (oData, response) {
                                //	sap.ui.core.BusyIndicator.hide();
                                MessageBox.success("Email Sent Succesfully",{
                                    actions: [sap.m.MessageBox.Action.OK],
                                    onClose: function (oAction) {
                                        if (oAction === sap.m.MessageBox.Action.OK) {
                                            location.reload();
                                        }
                                        }
                                });
                            }.bind(that),
                            error: function (error, response) {
                                // debugger;
                                // this.getOwnerComponent().getModel().attachRequestFailed(
                                //     this.component._oErrorHandler._requestFailedHandler,
                                //     this.component._oErrorHandler);
                                sap.ui.core.BusyIndicator.hide();
                                // var message = jQuery.parseJSON(response.responseText).error.message.value;
                                // sap.m.MessageBox.information("Notification type is not maintained in the Table",{
                                //     // sap.m.MessageBox.alert(message,{
                                // actions: [sap.m.MessageBox.Action.OK],
                                //     onClose: function (oAction) {
                                //         if (oAction === sap.m.MessageBox.Action.OK) {
                                //             location.reload();
                                //         }
                                //         }
                                // });
                                	
                            }

                        });
                        // location.reload();
                    }
                    else {
                        location.reload();
                    }
                }
            });
        },

        // getErrorMessage: function(response) {

        //     var message = jQuery.parseJSON(response.responseText).error.message.value;
            
        //     return message;
            
        //     },
        /***************End by Mastan */
        oError: function (error) {
            var that = this;
            sap.ui.core.BusyIndicator.hide();
            that.getView().byId("popover").setVisible(true);
            if (error.statusCode === 500) {
                MessageBox.error(i18n.getText("Batch has inventory issue and cannot be processed"));
            } else {
                if (error.statusCode === 504) {
                    MessageBox.error(i18n.getText("TIMEERROR"));
                }
            }
            var t = JSON.parse(error.responseText).error.innererror.errordetails;
            $.each(t, function (e, r) {
                if (r.code === "/IWBEP/CX_MGW_BUSI_EXCEPTION") {
                    t.splice(e, 1);
                } else {
                    if (r.severity === "error") {
                        r.severity = MessageType.Error;
                        that.getView().byId("popover").setType("Reject");
                    }
                    if (r.severity === "success") {
                        r.severity = MessageType.Success;
                        that.getView().byId("popover").setType("Accept");
                    }
                }
            });
            var o = new sap.ui.model.json.JSONModel();
            o.setData(t);
            that.getView().setModel(o, "oXMLModel");

        },
        handleMessagePopoverPress: function (e) {
            if (!this.oMP) {
                this.createMessagePopover();
            }
            this.oMP.toggle(e.getSource());
        },
        createMessagePopover: function () {
            var e = this;
            this.oMP = new MessagePopover({
                activeTitlePress: function (t) {
                    var r = t.getParameter("item"),
                        o = e.oView.byId("dynamicPage"),
                        a = r.getBindingContext("oXMLModel").getObject(),
                        i = Element.registry.get(a.getControlId());
                    if (i) {
                        o.scrollToElement(i.getDomRef(), 200, [0, -100]);
                        setTimeout(function () {
                            i.focus();
                        }, 300);
                    }
                },
                items: {
                    path: "oXMLModel>/",
                    template: new MessageItem({
                        title: "{oXMLModel>message}",
                        subtitle: "{oXMLModel>statusText}",
                        groupName: {
                            parts: [{
                                path: "oXMLModel>controlIds"
                            }],
                            formatter: this.getGroupName
                        },
                        activeTitle: {
                            parts: [{
                                path: "oXMLModel>controlIds"
                            }],
                            formatter: this.isPositionable
                        },
                        type: "{oXMLModel>severity}",
                        description: "{oXMLModel>message}"
                    })
                },
                groupItems: true
            });
            this.getView().byId("popover").addDependent(this.oMP);
        },
        onBackDefects: function () {
            this.onPressDefects();
            //this.getView().byId("iItBatchesSet").setVisible(false);
        },

        /**
         * Binds the view to the object path.
         * @function
         * @param {string} sObjectPath path to the object to be bound
         * @private
         */
        /*	_bindView: function (sObjectPath) {
                var oViewModel = this.getModel("objectView"),
                    oDataModel = this.getModel();

                this.getView().bindElement({
                    path: sObjectPath,
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function () {
                            oDataModel.metadataLoaded().then(function () {
                                // Busy indicator on view should only be set if metadata is loaded,
                                // otherwise there may be two busy indications next to each other on the
                                // screen. This happens because route matched handler already calls '_bindView'
                                // while metadata is loaded.
                                oViewModel.setProperty("/busy", true);
                            });
                        },
                        dataReceived: function () {
                            oViewModel.setProperty("/busy", false);
                        }
                    }
                });
            },*/

        _onBindingChange: function () {
            /*var oView = this.getView(),
                oViewModel = this.getModel("objectView"),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }

            var oResourceBundle = this.getResourceBundle(),
                oObject = oView.getBindingContext().getObject(),
                sObjectId = oObject.Qmnum,
                sObjectName = oObject.Qmnum;

            oViewModel.setProperty("/busy", false);
            // Add the object page to the flp routing history
            this.addHistoryEntry({
                title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
                icon: "sap-icon://enter-more",
                intent: "#QualityNotificationWithReference-display&/ItQnotifSelSet/" + sObjectId
            });

            oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
            oViewModel.setProperty("/shareOnJamTitle", sObjectName);
            oViewModel.setProperty("/shareSendEmailSubject",
                oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
            oViewModel.setProperty("/shareSendEmailMessage",
                oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));*/
        }

    });

});

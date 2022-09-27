sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, Filter, FilterOperator, oMsgBox) {
	"use strict";

	return BaseController.extend("com.sugarcreek.R103_Quality_Notif.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			/*	oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
					shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});*/
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			/*	oTable.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for worklist's table
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});*/
			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#QualityNotificationWithReference-display"
			}, true);

			//JSON Model to load Data into the table
			//var NotifListModel = new JSONModel([]);
			//	this.getView().setModel(NotifListModel, "NotifListModel");
			// this.loadNotif(this);
		},

		loadNotif: function () {

		},

		handleSelect: function (oEvent) {
			var chkbox = oEvent.getParameter("selected");
			if (chkbox) {
				this.getView().byId("inpsectionlot").setRequired(true);
				this.getView().byId("inpsectionlot").setEnabled(true);
				//	this.getView().byId("inpsectionlot").setValueState("Error");
				// if (this.getView().byId("inpsectionlot").getValue()) {
				// 	this.getView().byId("inpsectionlot").setValue("");
				// }
				//	return;
			} else {
				this.getView().byId("inpsectionlot").setRequired(false);
				this.getView().byId("inpsectionlot").setEnabled(false);
				if (this.getView().byId("inpsectionlot").getValue()) {
					this.getView().byId("inpsectionlot").setValue("");
				}

			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */

		onSearch: function (oEvent) {
			if (this.getView().byId("inspcheckbox").getSelected() === true) {
				if (this.getView().byId("inpsectionlot").getValue() === "") {
					//this.getView().byId("inpsectionlot").setValueState("Error");
					oMsgBox.error("Please Select the Inspection Lot");
					//this.onRebindTable();

				} else {
					//this.getView().byId("inpsectionlot").setValueState("None");
					//this.onRebindTable();
				}
			}

			// bif (oEvent.getSource().getFilterData().Werks) {
			// 	var plant = oEvent.getSource().getFilterData().Werks.ranges[0].value1;
			// 	var oFilter = new sap.ui.model.Filter('Werks', sap.ui.model.FilterOperator.EQ, plant);
			// 	var allFilter = new sap.ui.model.Filter([oFilter], false);
			// 	var oBinding = this.getView().byId("table").getBinding("items");
			// 	oBinding.filter(allFilter);
			// }
		},
		onRebindTable: function (oEvent) {
			var mBindingParams = oEvent.getParameter("bindingParams");
			var oInput = this.getView().byId("inpsectionlot");
			var oIntData = oInput.getValue();
			var newFilter;
			//if (oIntData.length > 0) {

			if (this.getView().byId("inspcheckbox").getSelected() === true) {
				newFilter = new Filter("Prueflos", FilterOperator.EQ, oIntData);
				mBindingParams.filters.push(newFilter);
			}
			//}
			// if (this.getView().byId("inpsectionlot").getValueState() === "Error") {
			// 	newFilter = new Filter("Prueflos", FilterOperator.EQ, oIntData);
			// 	mBindingParams.filters.push(newFilter);
			// }else{
			// 	//mBindingParams.filters.push(newFilter);
			// }

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("Qmnum"),
				PRDId: oItem.getBindingContext().getProperty("Aufnr"),
                /******Mastan */
                INSlot: oItem.getBindingContext().getProperty("Prueflos")
                /******Mastan */                            

			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},

		/**
		 * Icon Tab Bar to show items based on Status
		 *
		 */
		onFilterSelect: function (oEvent) {
			var oBinding = this.byId("table").getBinding("items"),
				sKey = oEvent.getParameter("key"),
				// Array to combine filters
				aFilters = [];

			if (sKey === "Outstanding") {
				aFilters.push(
					new Filter([
						new Filter([new Filter("Status", "EQ", "OSNO")], true)
					], false)
				);
			} else if (sKey === "Completed") {
				aFilters.push(
					new Filter([
						new Filter([new Filter("Status", "EQ", "NOCO")], true)
					], false)
				);
			} else if (sKey === "InProcess") {
				aFilters.push(
					new Filter([
						new Filter([new Filter("Status", "EQ", "NOPR")], true)
					], false)
				);
			} else if (sKey === "Postponed") {
				aFilters.push(
					new Filter([
						new Filter([new Filter("Status", "EQ", "NOPO")], true)
					], false)
				);
			}

			oBinding.filter(aFilters);
		}

	});
});
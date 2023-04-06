sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (UI5Object, MessageBox, Filter, FilterOperator) {
    "use strict";

    return UI5Object.extend("com.sugarcreek.R103_Quality_Notif.controller.ErrorHandler", {

        /**
         * Handles application errors by automatically attaching to the model events and displaying errors when needed.
         * @class
         * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
         * @public
         * @alias com.sugarcreek.R103_Quality_Notif.controller.ErrorHandler
         */
        constructor : function (oComponent) {
            var oMessageManager = sap.ui.getCore().getMessageManager(),
                oMessageModel = oMessageManager.getMessageModel(),
                oResourceBundle = oComponent.getModel("i18n").getResourceBundle(),
                sErrorText = oResourceBundle.getText("errorText"),
                sMultipleErrors = oResourceBundle.getText("multipleErrorsText"),
                msgArr = [],
                msgString = "";

            this._oComponent = oComponent;
            this._bMessageOpen = false

            this.oMessageModelBinding = oMessageModel.bindList("/", undefined,
                [], new Filter("technical", FilterOperator.EQ, true));

            this.oMessageModelBinding.attachChange(function (oEvent) {
                var aContexts = oEvent.getSource().getContexts(),
                    aMessages = [],
                    sErrorTitle;

                if (this._bMessageOpen || !aContexts.length) {
                    return;
                }

                // Extract and remove the technical messages
                aContexts.forEach(function (oContext) {
                    aMessages.push(oContext.getObject());
                });
                // oMessageManager.removeMessages(aMessages);

                // Due to batching there can be more than one technical message. However the UX
                // guidelines say "display a single message in a message box" assuming that there
                // will be only one at a time.
                sErrorTitle = aMessages.length === 1 ? sErrorText : sMultipleErrors;
                msgString = "";
                debugger;
                msgArr = [];
// Added by Mastan   //start
//                 if (aMessages.length > 1){
//                     for (var i = 1; i < aMessages.length; i++){
//                         if (aMessages[0].getCode() == aMessages[i].getCode() && aMessages[0].getMessage() == aMessages[i].getMessage())
//  {
//                     aMessages.shift();
//                     break;
//                 }
//                     }
//                 }
//Added by Mastan // end

debugger;
                $.each(aMessages, function (e, r) {
                    // debugger;
                    if (r === undefined || r.code === "/IWBEP/CX_MGW_BUSI_EXCEPTION" || r.code === "/IWBEP/CX_MGW_TECH_EXCEPTION") {
                        aMessages.splice(e, 1);
                    } else {
                        msgArr.push(r.message);
                        // if(r.message === msgArr[0]){
                        //     r.message.shift();
                        
                        // }
                        
                        // msgString = msgString + r.message + '\r\n';

                    }
                });
                let uniqueMsgs = [...new Set(msgArr)];
              
                // var msggg = msgArr[0];
                // var msgggg = msgArr[1];
                // if(msggg === msgggg){
                //     this._showServiceError(sErrorTitle, msggg);
                // }
                // msgString = msgArr.join('\r\n');
                // else{
                    this._showServiceError(sErrorTitle, uniqueMsgs);
                // }
                // this._showServiceError(sErrorTitle, msgArr);
            }, this);

            // this.getView().setModel(oMessageManager.getMessageModel(), "message");
        },

        /**
         * Shows a {@link sap.m.MessageBox} when a service call has failed.
         * Only the first error message will be displayed.
         * @param {string} sErrorTitle A title for the error message
         * @param {string} sDetails A technical error to be displayed on request
         * @private
         */
        _showServiceError : function (sErrorTitle, sDetails) {
            this._bMessageOpen = true;
            if(sDetails[0] === "Please maintain notification type F3 using ZQM_EMAIL_QM01" ||
            sDetails[0] === "Please maintain notification type F2 using ZQM_EMAIL_QM01" ||
            sDetails[0] === "Please maintain notification type F1 using ZQM_EMAIL_QM01" ||
            sDetails[0] === "Please maintain notification type Q1 using ZQM_EMAIL_QM01" ||
            sDetails[0] === "Please maintain notification type Q2 using ZQM_EMAIL_QM01" ||
            sDetails[0] === "Please maintain notification type Q3 using ZQM_EMAIL_QM01" ||
            sDetails[0] === "Please maintain notification type Z3 using ZQM_EMAIL_QM01" ||
            sDetails[0] === "Please maintain notification type ZA using ZQM_EMAIL_QM01" ||
            sDetails[0] === "Please maintain notification type ZP using ZQM_EMAIL_QM01" ){
                // MessageBox.information(sDetails[0],{
                //     actions: [sap.m.MessageBox.Action.OK],
                //     onClose: function (oAction) {
                //         if (oAction === sap.m.MessageBox.Action.OK) {
                //             location.reload();
                //         }
                //         }             
                //        });

                MessageBox.information(
                    sErrorTitle,
                    {
                        id : "serviceErrorMessageBox1",
                        details: sDetails,
                        styleClass: sResponsivePaddingClasses, //this._oComponent.getContentDensityClass(),
                        actions: [MessageBox.Action.CLOSE],
                        onClose: function (oAction) {
                            this._bMessageOpen = false;
                            if (oAction === sap.m.MessageBox.Action.CLOSE){
                                location.reload();
    
                            }
                        }.bind(this)
                    }        
                );

            }

            else{
                var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";            
            MessageBox.error(
                sErrorTitle,
                {
                    id : "serviceErrorMessageBox",
                    details: sDetails,
                    styleClass: sResponsivePaddingClasses, //this._oComponent.getContentDensityClass(),
                    actions: [MessageBox.Action.CLOSE],
                    onClose: function (oAction) {
                        this._bMessageOpen = false;
                        if (oAction === sap.m.MessageBox.Action.CLOSE){
                            location.reload();

                        }
                    }.bind(this)
                }        
            );
            }
            
        }
    });
});


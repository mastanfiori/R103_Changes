sap.ui.define([], function () {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		value: function (valu) {
			if (valu === "") {
				return false;
			} else if (valu === "E") {
				return true;
			}

		},
		check: function (v,valuess,batch) {
			if (v === true || valuess !== "" || batch === "0.000") {
				return false;
			} else if (v === false && valuess === "" && batch !== "0.000") {
				return true;
			} else if (v === null && valuess !== "" && batch !== "0.000") {
				return false;
			}
			else if(v === false && valuess === "" && batch === "0.000"){
				return false;
			}
		},
		select: function(v){
			if (v === true) {
				return false;
			} else if (v === null) {
				return false;
			}
		}
		

	};

});

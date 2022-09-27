/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sugarcreek/R103_Quality_Notif/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});

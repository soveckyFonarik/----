sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"simple-app/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("simple-app.Component", {

		metadata: {
			manifest: "json",
			properties: {
				"currentRouteName": {}
			}
		},
		addModelForDebug: function (name) {
			if (!window.models) {
				window.models = {};
			}
			window.models[name] = this.getModel(name).getData();
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().attachBeforeRouteMatched(this.onBeforeRouteMatched, this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createStateModel(), "state");
			this.addModelForDebug('state');
			this.setModel(models.createTableSourceModel(), "tableSourceModel");
			this.addModelForDebug('tableSourceModel');
			this.setModel(models.createFilterModel(), "filterModel");
			this.addModelForDebug('filterModel');
			this.setModel(models.createTypeTaskModel(), "typeTaskModel");
			this.setModel(models.createResponsibleListModel(), "responsibleListModel");
			this.getRouter().initialize();
		},

		onBeforeRouteMatched: function (event) { // beforeRouteMatched available since 1.46.1
			this.setCurrentRouteName(event.getParameter("name"));
		},

		getCurrentRoute: function () {
			return this.getRouter().getRoute(this.getCurrentRouteName());
		},
	});
});
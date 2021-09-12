sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createStateModel: function () {
			var oModel = new JSONModel({
				typeRendering: "",
				personalData: {}
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createTableSourceModel: function () {
			var oModel = new JSONModel(
				[{
					nameTask: "name1",
					typeTask: "срочно и важно",
					typeTaskKey: "0",
					responsible: "Петров",
					responsibleKey: "0",
					startDate: "2020-01-01",
					expirationDate: "2021-01-01"
				}]);
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		},

		createTypeTaskModel: function () {
			var oModel = new JSONModel(
				[{
					key: "0",
					value: "срочно и важно",
				}, {
					key: "1",
					value: "срочно",
				}, {
					key: "2",
					value: "важно (завтра)",
				}, {
					key: "3",
					value: "важно (сегодня)",
				}, {
					key: "4",
					value: "важно (вчера)",
				}]);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createResponsibleListModel: function () {
			var oModel = new JSONModel(
				[
					{ "key": "0", "name": "Петров" },
					{ "key": "1", "name": "Перонов" },
					{ "key": "2", "name": "Иванов" },
					{ "key": "3", "name": "Сидоров" },
					{ "key": "4", "name": "Кощеев" }
				]);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		createFilterModel: function () {
			var oModel = new JSONModel({
				typeTask: "",
				responsible: "",
				startDate: "",
				expirationDate: ""
			});
			oModel.setDefaultBindingMode("TwoWay");
			return oModel;
		}

	};
});
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/TablePersoController',
    'sap/m/library',
    './DemoPersoService',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    '../utils/formatter',
    "sap/ui/core/Fragment",
    'sap/ui/export/Spreadsheet',
    'sap/ui/export/library',
], function (Controller, TablePersoController, mlibrary, DemoPersoService, Filter, FilterOperator, formatter, Fragment, Spreadsheet, exportLibrary) {
    "use strict";
    const ResetAllMode = mlibrary.ResetAllMode;
    var EdmType = exportLibrary.EdmType;
    return Controller.extend("simple-app.controller.SimpleTable", {
        formatter: formatter,
        onInit: function () {
            this._oTPC = new TablePersoController({
                table: this.byId("SimpleTableTask"),
                //specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                componentName: "AppView",
                persoService: DemoPersoService
            }).activate();
            let currentRoute = this.getOwnerComponent().getCurrentRoute();
            currentRoute = currentRoute.getURL();
            currentRoute = currentRoute == 'edit' ? 'edit' : 'read';
            this.getOwnerComponent().getModel('state').setProperty("/typeRendering", currentRoute);

        },

        onPersoButtonPressed: function (oEvent) {
            this._oTPC.openDialog();
        },

        onAddButtonPressed: function (oEvent) {
            let aDataSource = this.getView().getModel('tableSourceModel').getProperty("/");
            aDataSource.unshift({
                nameTask: "",
                typeTask: "",
                responsible: "",
                startDate: new Date().toISOString().substring(0, 10),
                expirationDate: ""
            });
            this.getView().getModel('tableSourceModel').setProperty("/", aDataSource);
        },

        handleSuggest: function (oEvent) {
            var sTerm = oEvent.getParameter("suggestValue");
            var aFilters = [];
            if (sTerm) {
                aFilters.push(new Filter("name", sap.ui.model.FilterOperator.StartsWith, sTerm));
            }
            oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
        },

        reverseView() {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            let currentRoute = this.getOwnerComponent().getCurrentRoute();
            let nameCurrentRoute = currentRoute.getURL();
            let nameToRoute = nameCurrentRoute == 'edit' ? 'read' : 'edit';
            oRouter.navTo(nameToRoute);

            this.getOwnerComponent().getModel('state').setProperty("/typeRendering", nameToRoute);
        },

        onEditTable: function (oEvent) {
            var self = this;
            let persData = DemoPersoService.getPersData();
            persData.then(rez => {

                self.getView().getModel('state').setProperty("/personalData", rez);
                self._oTPC.refresh();
                self.reverseView();
            })
            DemoPersoService.resetPersData()




            // this._oTPC.setShowSelectAll()
        },

        validateTable: function () {
            let oTable = this.byId('SimpleTableTask');
            let aTableItems = oTable.getItems();
            let isErrors = false;
            aTableItems.forEach(oTableItem => {
                let aRows = oTableItem.getAggregation('cells');
                aRows.forEach(oCurrentRow => {
                    let aItemCells = oCurrentRow.getItems();
                    aItemCells.forEach(oItemCell => {
                        if (!oItemCell.getVisible()) { return }

                        oItemCell.setValueState(sap.ui.core.ValueState.None)
                        if (oItemCell.getValue().length == 0) {
                            oItemCell.setValueState(sap.ui.core.ValueState.Error);
                            isErrors = true;
                        }

                        if (oItemCell.data().type == 'expirationDate') {
                            let oDataRow = oItemCell.getBindingContext('tableSourceModel').getObject()
                            if (oDataRow.expirationDate < oDataRow.startDate) {
                                oItemCell.setValueState(sap.ui.core.ValueState.Error)
                                isErrors = true;
                            }
                        }
                    });
                });
            });
            return isErrors;
        },

        onSave: function (oEvent) {
            let ErrorsValidate = this.validateTable();
            if (!ErrorsValidate) {
                var self = this;
                let oPersDataPromise = DemoPersoService.setPersData(this.getView().getModel('state').getProperty("/personalData"));
                oPersDataPromise.then(rez => {
                    self._oTPC.refresh();
                    this.reverseView();
                })
            };
        },

        onValueHelpRequest: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue();
            if (!this._valueHelpDialog) {
                this._valueHelpDialog = sap.ui.xmlfragment(
                    "simple-app.view.ValueHelpDialog",
                    this
                );
                this.getView().addDependent(this._valueHelpDialog);
            }

            this._valueHelpDialog.open(sInputValue);
        },

        onSelectionChange: function (oEvent) {
            let sSelectedTitle = oEvent.getSource().getSelectedItem().getTitle();
            this.getView().getModel('filterModel').setProperty("/responsible", sSelectedTitle);
            this._valueHelpDialog.close()
        },

        onCloseDialog: function (oEvent) {
            this._valueHelpDialog.close()
        },

        submitFilter: function () {
            let oAllFilter = this.getView().getModel('filterModel').getProperty('/');
            let aFilters = [];
            Object.keys(oAllFilter).forEach(keyFiter => {
                if (oAllFilter[keyFiter]) {
                    aFilters.push(new Filter(keyFiter, FilterOperator.Contains, oAllFilter[keyFiter]));
                }
            })
            let oTable = this.byId('SimpleTableTask');
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },


        onSubmitFilter: function (oEvent) {
            this.submitFilter();
        },

        clearFilterModel: function () {
            this.getView().getModel('filterModel').setProperty('/', {
                typeTask: "",
                responsible: "",
                startDate: "",
                expirationDate: ""
            })
        },

        onResetFilterData: function (oEvent) {
            this.clearFilterModel();
            this.submitFilter();
        },

        onResetFilter: function (oEvent) {
            this.clearFilterModel();
        },

        onDocumentExcelExport: function (oEvent) {
            const binding = this.byId("SimpleTableTask").getBinding("items");
            new Spreadsheet({
                workbook: {
                    columns: this.createColumnConfig()
                },
                dataSource: binding.getModel().getProperty(binding.getPath()),
                fileName: "myExportedDataFromPlainJSON.xlsx",
            }).build();
        },

        createColumnConfig: function () {
            let aCols = [];

            aCols.push({
                label: 'Название задачи',
                property: 'nameTask',
                type: EdmType.String
            });

            aCols.push({
                label: 'Тип задачи',
                type: EdmType.String,
                property: 'typeTask'
            });

            aCols.push({
                label: 'Ответственный',
                property: 'responsible',
                type: EdmType.String
            });

            aCols.push({
                label: 'Дата начала',
                property: 'startDate',
                type: EdmType.String
            });

            aCols.push({
                label: 'Дата окончания',
                property: 'expirationDate',
                type: EdmType.String
            });

            return aCols;
        }



    });
});
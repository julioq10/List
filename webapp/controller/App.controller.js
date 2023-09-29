sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("lists.controller.App", {
            onInit: function () {
                let oModel = new JSONModel();
                oModel.loadData("../model/ListData.json");
                this.getView().setModel(oModel);
            },

            getGroupHeader: function (oGroup) {
                console.log(oGroup);
                let oGroupHeaderListItem = new sap.m.GroupHeaderListItem({
                    title: oGroup.key,
                    upperCase: true
                });
                return oGroupHeaderListItem;
            },

            onShowSelectItems: function () {
                let oStandardList = this.getView().byId("standardList");
                let aSelectedItems = oStandardList.getSelectedItems();
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                console.log(oStandardList);

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show(oResourceBundle.getText("noSelection"));
                } else {
                    var sMessage = oResourceBundle.getText("Selection");

                    aSelectedItems.forEach((oItem) => {
                        let oBidingContext = oItem.getBindingContext();

                        sMessage = sMessage + " - " + oBidingContext.getProperty("Material")
                    });
                    sap.m.MessageToast.show(sMessage);
                }
            },

            onDeletedSelectedItems: function () {
                let oStandardList = this.getView().byId("standardList");
                let aSelectedItems = oStandardList.getSelectedItems();
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                if (aSelectedItems === 0) {
                    sap.m.MessageToast.show(oResourceBundle.getText("noSelection"));
                } else {
                    var sMessage = oResourceBundle.getText("Selection");
                    var oModel = this.getView().getModel();
                    var oProducts = oModel.getProperty("/Products");
                    let aId = [];

                    aSelectedItems.forEach((oItem) => {
                        let oBidingContext = oItem.getBindingContext();
                        aId.push(oBidingContext.getProperty("Id"));
                        sMessage = sMessage + " - " + oBidingContext.getProperty("Material");
                    });
                    // hace otro loop y quita los que no esten en el arreglo aId
                    oProducts = oProducts.filter(function (p) {
                        return !aId.includes(p.Id);
                    });

                    oModel.setProperty("/Products", oProducts);
                    oStandardList.removeSelections();
                    sap.m.MessageToast.show(sMessage);
                }
            },

            onDeleteItem: function (oEvent) {
                let oItem = oEvent.getParameter("listItem"),
                    oBidingContext = oItem.getBindingContext(),
                    sPatch = oBidingContext.getPath(),
                    iIndex = sPatch.split("/").splice(-1).pop();
                // oModel = this.getView().getModel(),
                // oProducts = oModel.getProperty("/Products");
                let oModel = this.getView().getModel();
                let oProducts = oModel.getProperty("/Products");

                oProducts.splice(iIndex, 1);
                oModel.refresh();

            }
        });
    });

sap.ui.define([], function () {
    "use strict";

    return {
        inputFormatter:function(text){
            if (text.length > 0) return sap.ui.core.ValueState.None
            return sap.ui.core.ValueState.Error
        }
    };
});
/*
** (C) Copyright 2009 by Richard Doll, All Rights Reserved.
**
** License:
** You are free to use, copy, or modify this software provided it remains free
** of charge for all users, the source remains open and unobfuscated, and the
** author, copyright, license, and warranty information remains intact and
** clearly visible.
**
** Warranty:
** All content is provided as-is. The user assumes all liability for any
** direct or indirect damages from usage.
*/

/*
** ocp-util.js
**
** Support for planner utilities print and load/save.
*/

/*
** Common utility manager.
*/

ocp.util = {

    // Public: Initialize ourselves
    initialize: function() {
        // Nothing to do
    },


    // Public: Open the given util child object's dialog after the planner has been loaded
    openUtil: function (utilObj) {
        ocp.loader.runAfterPlannerLoaded(dojo.hitch(utilObj, 'showDialog'));
    }
};


/*
** Support for loading and saving character configurations.
*/

ocp.util.loadsave = {

    // Private: Whether this utility has been initialized or not
    _initialized: false,

    // Private: The dialog for this utility
    _dialog: null,


    // Public: Initialize ourselves
    initialize: function() {
        // Since this can be called multiple times, only do the initialization once
        if (!this._initialized) {
            this._dialog = dijit.byId('loadsaveDialog');
            this._initialized = true;
        }
    },


    // Public: Initialize and show this util's dialog
    showDialog: function () {
        this.initialize();
        this._dialog.show();
    },


    // Public: Hide this util's dialog
    hideDialog: function () {
        this._dialog.hide();
    }
};


/*
** Support for printing planner selections and results.
*/

ocp.util.print = {

    // Private: Whether this utility has been initialized or not
    _initialized: false,

    // Private: The dialog for this utility
    _dialog: null,


    // Public: Initialize ourselves
    initialize: function() {
        // Since this can be called multiple times, only do the initialization once
        if (!this._initialized) {
            this._dialog = dijit.byId('printDialog');
            this._initialized = true;
        }
    },


    // Public: Initialize and show this util's dialog
    showDialog: function () {
        this.initialize();
        this._dialog.show();
    },


    // Public: Hide this util's dialog
    hideDialog: function () {
        this._dialog.hide();
    }
};

/*
** (C) Copyright 2009-2010 by Richard Doll, All Rights Reserved.
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

    // Private: The window with the contents to be printed
    _printWin: null,


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


    // Public: Hide this util's dialog (and any left over print window)
    hideDialog: function () {
        this._closePrintWin();
        this._dialog.hide();
    },


    // Private: Open the print window, fill it with the given content, and print it
    // TODO: Need to confirm new window appears and note an error in the print dialog if not?
    _openPrintWin: function (content) {

        // Create the window
        this._printWin = window.open('javascript:""', 'OCP_Print_Window',
            'status=no,menubar=no,location=no,toolbar=no,' +
                'width=50,height=40,resizable=yes,scrollbars=yes');

        // Fill in the contents
        this._printWin.document.open();
        this._printWin.document.write(content);
        this._printWin.document.close();

        // Print the window
        this._printWin.print();

        // Close the window
// ***  this._closePrintWin();
    },


    // Private: Close and destroy the print window
    _closePrintWin: function () {
        if (this._printWin) {
            this._printWin.close();
            delete this._printWin;
            this._printWin = null;
        }
    },


    // Public: Print sections selected in the dialog
    print: function () {

        // Just in case, close a stray open window
        this._closePrintWin();

        // Generate the print content from the dialog's selected sections
        // HTML header first
        var content = '<html>' +
            '<head>' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
                '<title>OCP Print Character Details and Results</title>' +
            '</head>' +
            '<body>';

        content += '<p>Some really long test content.</p>';
        content += '<p>Some really long test content.</p>';
        content += '<p>Some really long test content.</p>';
        content += '<p>Some really long test content.</p>';
        content += '<p>Some really long test content.</p>';
        content += '<p>Some really long test content.</p>';
        content += '<p>Some really long test content.</p>';

        // HTML trailer last
        content += '</body></html>';

        // Open the new print window with the content
        this._openPrintWin(content);
    }
};

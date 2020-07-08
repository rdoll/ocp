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


    // Private: Opens the print contents window
    // Returns: True if window was opened, else false
    _openPrintWin: function() {

        // Just in case, close a stray open window
        this._closePrintWin();

        // TODO: Shrink this window and turn off resize and scrollbars?
        this._printWin = window.open('javascript:""', 'OCP_Print_Window',
            'status=no,menubar=yes,location=no,toolbar=no,alwaysRaised=yes,' +
                'width=50,height=40,resizable=yes,scrollbars=yes');
        return !!this._printWin;
    },


    // Private: Close and destroy the print window
    _closePrintWin: function () {
        if (this._printWin) {
            this._printWin.close();
            delete this._printWin;
            this._printWin = null;
        }
    },


    // Private: Open the print window, fill it with the given content, print it, and close it
    _print: function (content) {
        if (this._openPrintWin()) {

            // The print window was opened, so fill it, print it, and close it
            this._printWin.document.open();
            this._printWin.document.write(content);
            this._printWin.document.close();
            this._printWin.print();
// ***            this._closePrintWin();
        } else {

            // Whoops -- tell the user we failed to open the print window
            alert('Unable to create the print window.\n' +
                'Ensure your browser allows popup windows from this server.');
        }
    },


    // Public: Print sections selected in the dialog
    print: function () {

        // Build the content from the selected options
        var content = this._getContentHeader();

        content +=
            '<div id="previewButtons">' +
                '<button dojoType="dojo.form.Button">' +
                    'Some preview buttons would go here.' +
                '</button>' +
            '</div>';

        content += '<p>' +
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer elit nisl, ' +
            'pretium bibendum egestas ac, pretium vel sapien. Donec tincidunt eros eu diam ' +
            'euismod commodo. Quisque in leo quis metus interdum eleifend. Morbi libero neque, ' +
            'gravida nec porta non, condimentum porttitor nisl. Proin vitae arcu dui, eu congue ' +
            'elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per ' +
            'inceptos himenaeos. Maecenas at metus iaculis arcu suscipit faucibus non vitae ' +
            'enim. Maecenas feugiat iaculis gravida. Vestibulum mollis odio non ipsum tincidunt ' +
            'ut pretium erat suscipit. Fusce vehicula elementum magna quis hendrerit. Lorem ' +
            'ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi ' +
            'tristique senectus et netus et malesuada fames ac turpis egestas.' +
            '</p>';
        content += '<p>' +
            'Integer est elit, sollicitudin lobortis mattis at, fermentum in quam. Aenean id ' +
            'nisl feugiat urna tempus elementum. Phasellus volutpat diam et mi faucibus ' +
            'placerat. Aenean velit nunc, tempus faucibus ultricies sit amet, sodales in ' +
            'mauris. Donec egestas mollis tempor. Nunc placerat suscipit aliquet. Curabitur ' +
            'faucibus turpis turpis, sed volutpat neque. Phasellus malesuada sagittis felis, ' +
            'eget tincidunt augue molestie commodo. Curabitur tincidunt consectetur semper. In ' +
            'nec faucibus massa. Aenean a velit dolor. Morbi ornare, lorem quis rutrum ornare, ' +
            'turpis lacus gravida lorem, sit amet egestas ipsum eros at turpis. In hac ' +
            'habitasse platea dictumst.' +
            '</p>';

        // Close out the HTML and print the content
        content += '</body></html>';
        this._print(content);

        // It'd be nice if we could detect that the print was successful and close the print
        // dialog window. However, the window.print function returns while the print spooler
        // can still have dialogs up. Thus if the user cancels the print to change which
        // sections they are printing, closing the print dialog would be inconvenient.
    },


    // Private: Returns the print document's header content, including all styles
    _getContentHeader: function () {
        // The document must be HTML 4.01 since XHTML documents cannot use document.write
        var content =
            '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" ' +
                '"http://www.w3.org/TR/html4/strict.dtd">' +
            '<html lang="en" dir="ltr">' +
            '<head>' +
                '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
                '<meta http-equiv="Content-Style-Type" content="text/css" />' +
                '<meta http-equiv="Content-Language" content="en" />' +
                '<title>OCP Print Character Details and Results</title>' +
                '<meta name="author" content="Richard Doll" />' +
                '<meta name="copyright" ' +
                    'content="Copyright &copy; 2009-2010 Richard Doll, All Rights Reserved." />' +
                '<meta name="description" ' +
                    'content="OCP printer formatted character details and results." />' +
                '<link rel="stylesheet" type="text/css" ' +
                    'href="dojotoolkit/dijit/themes/soria/soria.css" />' +
                '<script type="text/javascript">//<![CDATA[' +
                    'djConfig = {' +
                         // Debugging settings
                        'isDebug: false,' +
                        'debugAtAllCosts: false,' +
                        'popup: false,' +

                         // Automatically parse Dojo markups
                        'parseOnLoad: true,' +

                         // Pull in these Dojo modules automatically'
                        'require: [' +
                            '"dijit.form.Button"' +
                        ']' +

                    '}' +
                '</script>';

        // Styles are inlined to prevent any possible cross-site loading issues
        content +=
             '<style type="text/css">/*<![CDATA[*/' +
                '@charset "utf-8";' +

                // Styles for both the preview window and the print out
                '@media screen, print {' +
                    'body, html {' +
                        'width: 600px;' +
                        'font-family: Verdana, Arial, Helvetica, Times;' +
                        'font-size: 12px;' +
                    '}' +
                    'p { text-decoration: underline; }' +
                '}' +

                // Styles for only the preview window
                '@media screen {' +
                '}' +

                // Styles for only the print out
                '@media print {' +
                    // Don't show the preview buttons
                    '#previewButtons {' +
                        'display: none;' +
                    '}' +
                '}' +
             '/*]]>*/</style>';

        // Close out the header and return the results
        content += '</head><body class="soria">';
        return content;
    }
};

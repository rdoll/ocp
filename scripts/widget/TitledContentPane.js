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
** TitledContentPane.js
**
** Define a content pane with a fixed title that allows preprocessing of downloaded content.
** The look is identical to a dijit.TitlePane without the button to show/hide the contents.
**
** Note that this is placed under the top-level namespace of ocp.* which
** means this can only be loaded *after* ocp.* has been defined.
*/

// Note what we provide
dojo.provide('ocp.widget.TitledContentPane');

// We must have access to our parents and mixins
dojo.require('dijit.layout.ContentPane');
dojo.require("dijit._Templated");

// Define the widget
dojo.declare('ocp.widget.TitledContentPane',

    // We are basically a content pane,
    // but we're templatized so we can insert the title info
    [dijit.layout.ContentPane, dijit._Templated],

    // Our class properties
    {
        // Inline the template here
        templateString:
            '<div class="ocpTitledContentPane">' +
                // The title bar section gets the title and some fancy styles
                '<div class="ocpTitledPaneTitleBar">' +
                    '<span class="ocpTitledPaneTitle">${title}</span>' +
                '</div>' +
                // The content is just as in a regular content pane
                '<div class="ocpTitledContentPaneContent" dojoAttachPoint="containerNode">' +
                '</div>' +
            '</div>',


        // If the content is real and a pre-processing method exists, invoke it
        // Regardless, set the new content via the inherited method
        _setContent: function (content, isFake) {
            if ((!isFake) && (this.preprocessContent)) {
                content = this.preprocessContent(content);
            }
            this.inherited(arguments);
        }
    }
);

/*
** ocp-widget.js
**
** Everything related to OCP custom Dijit widgets.
*/

/*
** Define a content pane with a fixed title.
** It's identical to a dijit.TitlePane without the button to show/hide the contents.
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
            '</div>'
    }
);



/*
** Define a horizontal slider that automatically updates a label when the value changes.
*/

// Note what we provide
dojo.provide('ocp.widget.LabeledHorizontalSlider');

// We must have access to our parents and mixins
dojo.require('dijit.form.HorizontalSlider');

// Define the widget
dojo.declare('ocp.widget.LabeledHorizontalSlider',

    // We are basically a horizontal slider
    dijit.form.HorizontalSlider,

    // Our class properties
    {

        // The DOM ID of the label who's value we will set
        labelId: '',

        // Do we force the value in the label to be integral
        forceIntLabel: true,

        // Set the label to our current value
        _setLabel: function () {
            if (this.labelId.length > 0) {
                var v = (this.forceIntLabel ? Math.floor(this.value) : this.value);
                dojo.place('<span>' + v + '</span>', this.labelId, 'only');
            }
        },

        // Whenever the value of this slider changes, update the corresponding label
        _setValueAttr: function (/*Number*/ value, /*Boolean, optional*/ priorityChange) {

            // Let the parent do it's work first (which includes setting the new value)
            this.inherited(arguments);

            // Now update the label with the new value
            this._setLabel();
        }
    }
);

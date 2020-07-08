/*
** ocp-widget.js
**
** Everything related to OCP custom Dijit widgets.
**
** Note that this cannot be placed under the ocp global namespace.
** In some cases that works (e.g. 100% local Dojo), but in other cases it
** fails (e.g. XD CDN with these local custom widgets).
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

        // Do we force the values to be integral?
        // For OCP, always yes since all player visible values are whole numbers
        forceIntegral: true,

        // If a label ID is defined, set the label to our current value
        _setLabel: function () {
            if (this.labelId.length > 0) {
                // Use _getValueAttr so value can be made integral if required
                dojo.place('<span>' + this._getValueAttr() + '</span>', this.labelId, 'only');
            }
        },

        // Allow the returned value to be forced integral
        _getValueAttr: function (/*String*/ value) {
            var val = this.inherited(arguments);
            return (this.forceIntegral ? Math.floor(val) : val);
        },

        // Whenever the value of this slider changes, update the corresponding label
        _setValueAttr: function (/*Number*/ value, /*Boolean, optional*/ priorityChange) {
            // Let the parent set the new value first, then update the label
            // *** Should force value integral here?
            this.inherited(arguments);
            this._setLabel();
        }
    }
);

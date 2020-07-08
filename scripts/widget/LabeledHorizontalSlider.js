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
** LabeledHorizontalSlider.js
**
** Define a horizontal slider that automatically updates a label when the value changes.
**
** Note that this is placed under the top-level namespace of ocp.* which
** means this can only be loaded *after* ocp.* has been defined.
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
            // TODO: Should force value integral here?
            this.inherited(arguments);
            this._setLabel();
        }
    }
);

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



/*
** Define a form that also validates major skill checkboxes
** It's identical to a dijit.form.Form plus counting the number of major skill checkboxes checked.
*/

// Note what we provide
dojo.provide('ocp.widget.SkillForm');

// We must have access to our parents and mixins
dojo.require('dijit.form.Form');

// Define the widget
dojo.declare('ocp.widget.SkillForm',

    // We are basically a Form
    dijit.form.Form,

    // Our class properties
    {

        // Invalid reason
        invalidReason: '',


        // Returns the list of descendants that are checkboxes
        getDescendantsCheckboxes: function() {
            // A checkbox is something toggle-able (i.e. has a boolean "checked" property)
            return dojo.filter(this.getDescendants(), function (widget) {
                return (typeof widget.checked == 'boolean');
            });
        },


        // Returns the number of checked checkboxes we contain
        _numChecked: function() {
            var checkedCount = 0;

            // Examine all child checkboxes
            dojo.forEach(this.getDescendantsCheckboxes(), function (widget) {
                // From closure: checkedCount
                if (widget.checked) {
                    checkedCount++;
                }
            });

            console.log('leaving ocp.widget.SkillForm:', checkedCount);
            return checkedCount;
        },


        // Based on the form's validation, validate the checkboxes
        validateCheckboxes: function (isFormValid) {

            // Start with the form's validity
            var isValid = isFormValid;

            if (isFormValid) {
                // Form is valid, so examine checkboxes
                var numChecked = this._numChecked();
                isValid = (numChecked == ocp.MAJORS_NUM);
                if (isValid) {
                    // Checkboxes are valid too
                    // Clear the invalid reason and pass thru success
                    this.invalidReason = '';
                } else {
                    // Checkboxes are invalid
                    // Set the reason for being invalid and let the failure pass thru
                    this.invalidReason = 'Exactly ' + ocp.MAJORS_NUM +
                        ' major skills must be selected (you have ' + numChecked + ').';
                }
            } else {
                // Form is invalid, so don't bother looking at checkboxes
                // Set the reason for being invalid and let the failure pass thru
                this.invalidReason = 'One or more skills have invalid values.';
            }

            // Return results
            return isValid;
        },


        // Also check the major count when asked if valid
        isValid: function() {
            // Let the form validate inputs that support validation
            var isFormValid = this.inherited(arguments);

            // Based on the form's validity, also validate the checkboxes
            return this.validateCheckboxes(isFormValid);
        },


        // Also check the major count when asked to validate
        validate: function() {
            // Validate the form (changing focus to first invalid input)
            var isFormValid = this.inherited(arguments);

            // Based on the form's validity, also validate the checkboxes
            return this.validateCheckboxes(isFormValid);
        },


        // Connect events to our children
        // In addition to validity methods, capture changes to all checkboxes
        // This way, when a checkbox changes, we'll revalidate
        connectChildren: function() {

            // First, let the form do the normal connections
            this.inherited(arguments);

            // Now connect onChange to all checkboxes
            var _this = this;
            var conns = this._changeConnections;
            dojo.forEach(this.getDescendantsCheckboxes(), function (widget) {
                // From closure: _this, conns
                conns.push(_this.connect(widget, 'onChange',
                    // Cheat and pass null as the widget
                    // This causes the form to revalidate via isValid which
                    // will detect any problems with the checkbox count
                    // *** Better way to do this?
                    dojo.hitch(_this, '_widgetChange', null)));
            });
        }
    }
);

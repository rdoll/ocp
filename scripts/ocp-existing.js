/*
** ocp-existing.js
**
** Everything related to an existing character.
*/

ocp.existing = {

    // Private: Level for this character
    _level: 1,

    // Private: Level totals for all core attrs, derived attrs, and skills
    _totals: {},

    // Private: The list of major skills
    _majors: [],

    // Public: These child helper objects encapsulate everything for each dialog
    attrDialog: null,
    skillDialog: null,


    // Public: Accessor for the list of major skills
    get majors () { return this._majors; },

    // Public: Returns if a given skill is a major skill
    isMajor: function (skill) {
        return (this._majors.indexOf(skill) == -1 ? false : true);
    },


    // Public: Initialize ourselves
    initialize: function() {
        // Initialize our contents in order
        this._initializeLevel();
        this._initializeMajors();
        this._initializeTotals();

        // Initialize our children
        this.attrDialog.initialize();
        this.skillDialog.initialize();
    },


    // Private: Initialize our level and level slider
    _initializeLevel: function() {

        // Container for all parts for the slider
        var containerNode = dojo.create('div', null, 'levelSliderContainer', 'only');

        // Create the rule markings for the slider putting it last in the container
        var rules = new dijit.form.HorizontalRule({
            class: 'sliderHorRules',
            container: 'bottomDecoration',
            count: 9
        }, dojo.create('div', null, containerNode, 'last'));

        // Create the rule marking labels for the slider putting it last in the container
        var labels = new dijit.form.HorizontalRuleLabels({
            class: 'sliderHorLabels',
            container: 'bottomDecoration',
            labels: [
                1,
                ocp.sliderPercentValue(1, ocp.LEVEL_MAX, 0.25),
                ocp.sliderPercentValue(1, ocp.LEVEL_MAX, 0.50),
                ocp.sliderPercentValue(1, ocp.LEVEL_MAX, 0.75),
                ocp.LEVEL_MAX
            ]
        }, dojo.create('div', null, containerNode, 'last'));

        // Create the level slider
        var slider = new ocp.widget.LabeledHorizontalSlider({
            id: 'levelSlider',
            value: 1,
            minimum: 1,
            maximum: ocp.LEVEL_MAX,
            discreteValues: ocp.LEVEL_MAX,
            pageIncrement: 5,
            intermediateChanges: false,
            labelId: 'levelValue',
            onChange: function (newValue) {
                ocp.existing._levelChanged(newValue);
            }
        }, containerNode);
    },


    // Private: Initialize majors skills
    _initializeMajors: function() {
        // There's no real method to pick initial major skills, so just go through the skills
        // per spec until we reach the number we need (which should be all for the first spec).
        for each (var spec in ocp.specs) {
            for each (var skill in spec.skills) {
                this._majors.push(skill);
                if (this._majors.length >= ocp.MAJORS_NUM) {
                    return;
                }
            }
        }
    },


    // Private: Initialize totals to their minimum values
    _initializeTotals: function() {

        // Core attributes first
        for (var attr in ocp.coreAttrs) {
            this._totals[attr] = ocp.coreAttrs[attr].min;
        }

        // Derived attributes next
        for (var attr in ocp.derivedAttrs) {
            this._totals[attr] = ocp.derivedAttrs[attr].min;
        }

        // Skills last
        for (var skill in ocp.skills) {
            this._totals[skill] = (this.isMajor(skill) ? ocp.SKILL_MAJOR_MIN : ocp.SKILL_MIN);
        }
    },


    // Private: Called when the level slider changes value
    //          Note: intermediateChanges=false helps reduce unnecessary notifies
    _levelChanged: function (newValue) {
        console.log('entered ocp.existing._levelChanged:', newValue);

        // Whenever the slider has changed, update our value and notify of a change
        this._level = Math.floor(newValue);  // Should be integral, but be safe
        ocp.notifyChanged();
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        this._update();
    },


    // Private: Update our generated content
    _update: function() {

        // List of derived attributes
        var att = '<ul class="attrList">';
        for (var attr in ocp.derivedAttrs) {
            // Capitalized attr full name
            var name = ocp.derivedAttrs[attr].name;
            var cap = name.replace(/^./, name.charAt(0).toUpperCase());
            att += '<li>' + cap + ': ' + this._totals[attr] + '</li>';
        }
        att += '</ul>';

        // List of core attributes
        att += '<ul class="attrList">';
        for (var attr in ocp.coreAttrs) {
            // Capitalized attr full name
            var name = ocp.coreAttrs[attr].name;
            var cap = name.replace(/^./, name.charAt(0).toUpperCase());
            att += '<li>' + cap + ': ' + this._totals[attr] + '</li>';
        }
        att += '</ul>';

        // Set the attribute values
        dojo.place(att, 'attrValues', 'only');

        // List skills by specialization
        var ski = '';
        for (var spec in ocp.specs) {
            ski += '<ul class="attrList">';
            for each (var skill in ocp.specs[spec].skills) {
                // Capitalized skill full name
                var name = ocp.skills[skill].name;
                var cap = name.replace(/^./, name.charAt(0).toUpperCase());
                ski +=
                    '<li' + (this.isMajor(skill) ? ' class="majorSkill"' : '') + '>' +
                        cap + ': ' + this._totals[skill] +
                    '</li>';
            }
            ski += '</ul>';
        }

        // Set the skill values
        dojo.place(ski, 'skillValues', 'only');
    }
};



/*
** The attribute dialog's helper object.
** As a helper, this may access private data/methods in ocp.existing.
*/
ocp.existing.attrDialog = {

    // Private: The dialog we manage
    _dialog: null,


    // Public: Initialize ourselves
    initialize: function() {

        // Find the dialog we manage
        this._dialog = dijit.byId('attrDialog');

        // Hook the dialog to initialize itself the first time it's shown
        var handle = dojo.connect(this._dialog, 'onShow',
            function (/* event */) {
                // Using handle from closure, disconnect so we only do this once
                dojo.disconnect(handle);
                handle = null;
                ocp.existing.attrDialog._initializeDialog();
        });
    },


    // Private: Initialize the dialog
    _initializeDialog: function() {
        console.log('entered ocp.existing.attrDialog._initializeDialog');

        // Hook into the methods this dialog can be closed
        dojo.connect(this._dialog, 'onExecute', this, 'submit');
        dojo.connect(this._dialog, 'onCancel', this, 'cancel');

        // First build a table of name/value/slider for core attributes
        var att =
            '<table>' +
            '<thead><tr><th colspan="3">Core Attributes</th></tr></thead>' +
            '<tbody>';
        for (var attr in ocp.coreAttrs) {
            var min = ocp.coreAttrs[attr].min;
            var max = ocp.coreAttrs[attr].max;
            att +=
                '<tr>' +
                    '<td class="selectedName">' + ocp.coreAttrs[attr].name + ':</td>' +
                    '<td id="attrValue_' + attr + '" class="selectedValue">-none-</td>' +
                    '<td>' +
                        '<div dojoType="ocp.widget.LabeledHorizontalSlider" ' +
                            'id="attrSlider_' + attr + '" class="attrSlider" ' +
                            'value="' + min + '" ' + 'minimum="' + min + '" ' +
                            'maximum="' + max + '" ' + 'discreteValues="' + (max - min + 1) + '" ' +
                            'pageIncrement="10" ' +
                            'intermediateChanges="false" labelId="attrValue_' + attr + '">' +
                            '<div dojoType="dijit.form.HorizontalRule" class="sliderHorRules"' +
                                'container="bottomDecoration" count="5">' +
                            '</div>' +
                            '<ol dojoType="dijit.form.HorizontalRuleLabels" ' +
                                'class="sliderHorLabels" container="bottomDecoration">' +
                                '<li>' + min + '</li>' +
                                '<li> </li>' +
                                '<li>' + ocp.sliderPercentValue(min, max, 0.50) + '</li>' +
                                '<li> </li>' +
                                '<li>' + max + '</li>' +
                            '</ol>' +
                        '</div>' +
                    '</td>' +
                '</tr>';
        }

        // Close the table and insert the results (parsing the code for Dojo markups)
        att += '</tbody></table>';
        dojo.html.set(dojo.byId('coreAttrContainer'), att, { parseContent: true });


        // Now build a table of name/value/slider for derived attributes
        var att =
            '<table>' +
            '<thead><tr><th colspan="3">Derived Attributes</th></tr></thead>' +
            '<tbody>';
        for (var attr in ocp.derivedAttrs) {
            var min = ocp.derivedAttrs[attr].min;
            var max = ocp.derivedAttrs[attr].max;
            att +=
                '<tr>' +
                    '<td class="selectedName">' + ocp.derivedAttrs[attr].name + ':</td>' +
                    '<td id="attrValue_' + attr + '" class="selectedValue">-none-</td>' +
                    '<td>' +
                        '<div dojoType="ocp.widget.LabeledHorizontalSlider" ' +
                            'id="attrSlider_' + attr + '" class="attrSlider" ' +
                            'value="' + min + '" ' + 'minimum="' + min + '" ' +
                            'maximum="' + max + '" ' + 'discreteValues="' + (max - min + 1) + '" ' +
                            'pageIncrement="20" ' +
                            'intermediateChanges="false" labelId="attrValue_' + attr + '">' +
                            '<div dojoType="dijit.form.HorizontalRule" class="sliderHorRules"' +
                                'container="bottomDecoration" count="5">' +
                            '</div>' +
                            '<ol dojoType="dijit.form.HorizontalRuleLabels" ' +
                                'class="sliderHorLabels" container="bottomDecoration">' +
                                '<li>' + min + '</li>' +
                                '<li> </li>' +
                                '<li>' + ocp.sliderPercentValue(min, max, 0.50) + '</li>' +
                                '<li> </li>' +
                                '<li>' + max + '</li>' +
                            '</ol>' +
                        '</div>' +
                    '</td>' +
                '</tr>';
        }

        // Close the table insert the results (parsing the code for Dojo markups)
        att += '</tbody></table>';
        dojo.html.set(dojo.byId('derivedAttrContainer'), att, { parseContent: true });
    },


    // Public: Submit and use the dialog's values
    submit: function() {
        console.log('entered ocp.existing.attrDialog.submit');

        // Update our totals based on the values of each attribute
        // Slider values should be integral, but be safe
        for (var attr in ocp.coreAttrs) {
            ocp.existing._totals[attr] = Math.floor(dijit.byId('attrSlider_' + attr).attr('value'));
        }
        for (var attr in ocp.derivedAttrs) {
            ocp.existing._totals[attr] = Math.floor(dijit.byId('attrSlider_' + attr).attr('value'));
        }

        // Notify that changes were made
        ocp.notifyChanged();
    },


    // Public: Revert all dialog values to our current values
    undo: function() {
        console.log('entered ocp.existing.attrDialog.undo');

        // Assign our values to each slider
        // The slider will update it's value and it's linked label
        for (var attr in ocp.coreAttrs) {
            dijit.byId('attrSlider_' + attr).attr('value', ocp.existing._totals[attr]);
        }
        for (var attr in ocp.derivedAttrs) {
            dijit.byId('attrSlider_' + attr).attr('value', ocp.existing._totals[attr]);
        }
    },


    // Public: Cancel all changes and close the dialog
    cancel: function() {
        this.undo();
        this._dialog.hide();
    },


    // Public: Reset everything to initial values
    reset: function() {
        console.log('entered ocp.existing.attrDialog.reset');

        // Resetting the slider will cause it to reset it's linked label too
        for (var attr in ocp.coreAttrs) {
            dijit.byId('attrSlider_' + attr).reset();
        }
        for (var attr in ocp.derivedAttrs) {
            dijit.byId('attrSlider_' + attr).reset();
        }
    }
};



/*
** The skill dialog's helper object.
** As a helper, this may access private data/methods in ocp.existing.
*/
ocp.existing.skillDialog = {

    // Private: The dialog and form we manage
    _dialog: null,
    _form: null,


    // Public: Initialize ourselves
    initialize: function() {

        // Find the entities we manage
        this._dialog = dijit.byId('skillDialog');
        this._form = dijit.byId('skillForm');

        // Hook the dialog to initialize itself the first time it's shown
        var handle = dojo.connect(this._dialog, 'onShow',
            function (/* event */) {
                // Using handle from closure, disconnect so we only do this once
                dojo.disconnect(handle);
                handle = null;
                ocp.existing.skillDialog._initializeDialog();
        });
    },


    // Private: Initialize the dialog
    _initializeDialog: function() {
        console.log('entered ocp.existing.skillDialog._initializeDialog');

        // Hook into the methods that can close the dialog
        dojo.connect(this._form, 'onSubmit', function (event) {
            ocp.existing.skillDialog.submit(event);
        });
        dojo.connect(this._form, 'onCancel', this, 'cancel');

        // For lack of a better mechanism to divide up the skills,
        // do one section per arts specialization.
        var ski = '';
        for (var spec in ocp.specs) {

            // Put each spec into its own div
            // Build a table for the skills in this spec
            ski += '<div class="skillSpecContainer">' +
                '<table>' +
                '<thead>' +
                    '<tr>' +
                        '<th colspan="2" class="specHeader">' + spec + ' Skills</th>' +
                        '<th class="majorHeader">Major?</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>';

            // Build a row for every skill in this spec
            for each (var skill in ocp.specs[spec].skills) {
                var isMajor = ocp.existing.isMajor(skill);
                var min = (isMajor ? ocp.SKILL_MAJOR_MIN : ocp.SKILL_MIN);
                var max = ocp.SKILL_MAX;
                ski +=
                    '<tr>' +
                        '<td>' +
                            '<label for="skillSpinner_' + skill + '" class="selectedName">' +
                                ocp.skills[skill].name + ':' +
                            '</label>' +
                        '</td>' +
                        '<td>' +
                            '<input dojoType="dijit.form.NumberSpinner" ' +
                                'id="skillSpinner_' + skill + '" class="skillSpinner" ' +
                                'name="' + skill + '" ' +
                                'value="' + min + '" smallDelta="10" ' +
                                'intermediateChanges="false" ' +
                                'constraints="{min:' + min + ', max:' + max + ', places:0}" />' +
                        '</td>' +
                        '<td class="majorCheckContainer">' +
                            '<input dojoType="ocp.widget.ValidatedCheckBox" type="checkbox" ' +
                                'id="majorCheck_' + skill + '" ' +
                                'name="majors" value="' + skill + '" ' +
                                (isMajor ? 'checked="checked" ' : '') +
                                'onChange="ocp.existing.skillDialog.checkboxChanged(\'' + skill + '\')" ' +
                                '/>' +
                        '</td>' +
                    '</tr>';
            }

            // Close out this spec
            ski += '</tbody></table></div>';
        }

        // Insert the results (parsing the code for Dojo markups)
        dojo.html.set(dojo.byId('skillInputsContainer'), ski, { parseContent: true });
    },


    // Public: A major skill checkbox changed
    checkboxChanged: function (skill) {
        console.log('checkboxChanged', skill);
    },


    // Public: Submit and use the dialog's values
    //         Returns true/false for success/failure
    submit: function (event) {
        console.log('entered ocp.existing.skillDialog.submit');

        // Inhibit all default event processing (we never want the form to truly "submit")
        event.preventDefault();

        // We should never be allowed to submit with invalid data,
        // but if we somehow did, stop it here
        if (this._form.validate()) {

            // Get a complex object with all of our form's values
            var values = this._form.attr('value');

            // Update totals based on the values of each skill
            // Spinner values should be integral, but be safe
            for (var skill in ocp.skills) {
                ocp.existing._totals[skill] = Math.floor(values[skill]);
            }

            // Update the list of major skills
            ocp.existing._majors = values.majors;

            // Submit complete -- hide the dialog, notify of changes, and return success
            this._dialog.hide();
            ocp.notifyChanged();
            return true;
        } else {

            // Erm... This should never happen...
            // Gracefully tell the user something is invalid and inhibit the submission.
            console.warn('Cannot submit with invalid data!');
            alert('Cannot submit changes until all skill values are valid\n' +
                'and exactly seven major skills are selected.');
            return false;
        }
    },


    // Public: Revert all dialog values to our current values
    undo: function() {
        console.log('entered ocp.existing.skillDialog.undo');

        // Assign our values to each spinner and checkbox
        for (var skill in ocp.skills) {
            dijit.byId('skillSpinner_' + skill).attr('value', ocp.existing._totals[skill]);
            dijit.byId('majorCheck_' + skill).attr('value', ocp.existing.isMajor(skill));
        }

        // Then just to be careful, validate the contents
        this._form.validate();
    },


    // Public: Cancel all changes and close the dialog
    cancel: function() {
        this.undo();
        this._dialog.hide();
    }
};

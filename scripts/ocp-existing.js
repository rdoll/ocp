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
** ocp-existing.js
**
** Everything related to an existing character.
*/

ocp.existing = {

    // Private: Level for this character
    _level: 1,

    // Private: Level totals for all core attrs, derived attrs, and skills
    _totals: {},

    // Private: Major skills are properties with true values
    _majors: {},

    // Private: The Dijit widget for the level slider
    _levelSlider: null,

    // Public: These child helper objects encapsulate everything for each dialog
    attrDialog: null,
    skillDialog: null,


    // Public: Accessors for our data
    get level ()  { return this._level; },
    get totals () { return this._totals; },
    get majors () { return this._majors; },

    // Public: Returns if a given skill is a major skill
    isMajor: function (skill) {
        return (this._majors[skill] ? true : false);
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
                ocp.input.sliderPercentValue(1, ocp.LEVEL_MAX, 0.25),
                ocp.input.sliderPercentValue(1, ocp.LEVEL_MAX, 0.50),
                ocp.input.sliderPercentValue(1, ocp.LEVEL_MAX, 0.75),
                ocp.LEVEL_MAX
            ]
        }, dojo.create('div', null, containerNode, 'last'));

        // Create the level slider
        this._levelSlider = new ocp.widget.LabeledHorizontalSlider({
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
        var majorsCount = 0;
        for (var specIndex in ocp.specs) {
            var skills = ocp.specs[specIndex].skills;
            for (var skillIndex in skills) {
                this._majors[skills[skillIndex]] = true;
                if (++majorsCount >= ocp.MAJOR_NUM) {
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


    // Private: Sets all existing details to the given values with no notifications
    _selectCustom: function (level, totals, majors) {

        // Ensure the level is within the range of the level slider
        if (level > ocp.LEVEL_MAX) {
            level = ocp.LEVEL_MAX;
        }

        // Set the new values
        this._level = level;
        delete this._totals;
        this._totals = totals;
        delete this._majors;
        this._majors = majors;

        // Set the level slider to the new value
        this._levelSlider.attr('value', level);

        // Notify our dialogs that our values changed
        this.attrDialog.existingChanged();
        this.skillDialog.existingChanged();
    },


    // Private: Called when the level slider changes value
    // Note:    intermediateChanges=false helps reduce unnecessary notifies
    _levelChanged: function (newValue) {
        console.debug('entered _levelChanged:', newValue);

        // Whenever the slider has changed, update our value and notify of a change
        // Note: The newValue is not subject to ocp.widget.LabeledHorizontalSlider's
        //       forceIntegral feature, so be safe and force integral here.
        // TODO: Should update ocp.widget.LabeledHorizontalSlider to fix this?
        this._level = Math.floor(newValue);
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
            att += '<li>' + ocp.derivedAttrs[attr].name + ': ' + this._totals[attr] + '</li>';
        }
        att += '</ul>';

        // List of core attributes
        att += '<ul class="attrList">';
        for (var attr in ocp.coreAttrs) {
            att += '<li>' + ocp.coreAttrs[attr].name + ': ' + this._totals[attr] + '</li>';
        }
        att += '</ul>';

        // Set the attribute values
        dojo.place(att, 'attrValues', 'only');

        // List skills by specialization
        var ski = '';
        for (var spec in ocp.specs) {
            ski += '<ul class="attrList">';
            var skills = ocp.specs[spec].skills;
            for (var skillIndex in skills) {
                var skill = skills[skillIndex];
                ski +=
                    '<li' + (this.isMajor(skill) ? ' class="majorSkill"' : '') + '>' +
                        ocp.skills[skill].name + ': ' + this._totals[skill] +
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

    // Private: For speed, store references to the Dijit elements for every skill
    _slider: {},


    // Public: Initialize ourselves
    initialize: function() {

        // Find the dialog we manage
        this._dialog = dijit.byId('attrDialog');

        // Hook the dialog to initialize itself the first time it's shown
        var _this = this;
        var handle = dojo.connect(this._dialog, 'onShow',
            function (/* event */) {
                // From closure: _this, handle
                // Disconnect so we only do this once
                dojo.disconnect(handle);
                handle = null;
                _this._initializeDialog();
        });
    },


    // Private: Initialize the dialog
    _initializeDialog: function() {
        console.debug('entered attrDialog._initializeDialog');

        // Hook into the methods this dialog can be closed
        dojo.connect(this._dialog, 'onExecute', this, 'submit');
        dojo.connect(this._dialog, 'onSubmit', this, 'submit');
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
                            'id="attrSlider_' + attr + '" ' +
                            'class="attrSlider" ' +
                            'value="' + min + '" ' +
                            'minimum="' + min + '" ' +
                            'maximum="' + max + '" ' +
                            'discreteValues="' + (max - min + 1) + '" ' +
                            'pageIncrement="10" ' +
                            'intermediateChanges="false" ' +
                            'labelId="attrValue_' + attr + '"' +
                        '>' +
                            '<div dojoType="dijit.form.HorizontalRule" class="sliderHorRules"' +
                                'container="bottomDecoration" count="5">' +
                            '</div>' +
                            '<ol dojoType="dijit.form.HorizontalRuleLabels" ' +
                                'class="sliderHorLabels" container="bottomDecoration">' +
                                '<li>' + min + '</li>' +
                                '<li> </li>' +
                                '<li>' + ocp.input.sliderPercentValue(min, max, 0.50) + '</li>' +
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
                            'id="attrSlider_' + attr + '" ' +
                            'class="attrSlider" ' +
                            'value="' + min + '" ' +
                            'minimum="' + min + '" ' +
                            'maximum="' + max + '" ' +
                            'discreteValues="' + (max - min + 1) + '" ' +
                            'pageIncrement="20" ' +
                            'intermediateChanges="false" ' +
                            'labelId="attrValue_' + attr + '"' +
                        '>' +
                            '<div dojoType="dijit.form.HorizontalRule" class="sliderHorRules"' +
                                'container="bottomDecoration" count="5">' +
                            '</div>' +
                            '<ol dojoType="dijit.form.HorizontalRuleLabels" ' +
                                'class="sliderHorLabels" container="bottomDecoration">' +
                                '<li>' + min + '</li>' +
                                '<li> </li>' +
                                '<li>' + ocp.input.sliderPercentValue(min, max, 0.50) + '</li>' +
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

        // Now that they are all created, store references to all sliders
        for (var attr in ocp.coreAttrs) {
            this._slider[attr] = dijit.byId('attrSlider_' + attr);
        }
        for (var attr in ocp.derivedAttrs) {
            this._slider[attr] = dijit.byId('attrSlider_' + attr);
        }

        // For reset to work, we need the current value to be the min value.
        // However, it's possible that our current value is not the min,
        // so do an undo (which, by definition, sets dialog's values to ours).
        this.undo();
    },


    // Public: The existing data changed -- update our vaules if we've been initialized
    existingChanged: function () {
        if (this._dialog._alreadyInitialized) {
            this.undo();
        }
    },


    // Public: Submit and use the dialog's values
    submit: function() {
        console.debug('entered attrDialog.submit');

        // Update our totals based on the values of each attribute
        // Slider values already forced to be integral
        for (var attr in ocp.coreAttrs) {
            ocp.existing._totals[attr] = this._slider[attr].attr('value');
        }
        for (var attr in ocp.derivedAttrs) {
            ocp.existing._totals[attr] = this._slider[attr].attr('value');
        }

        // Notify that changes were made
        ocp.notifyChanged();
    },


    // Public: Revert all dialog values to our current values
    undo: function() {
        console.debug('entered attrDialog.undo');

        // Assign our values to each slider
        // The slider will update it's value and it's linked label
        for (var attr in ocp.coreAttrs) {
            this._slider[attr].attr('value', ocp.existing._totals[attr]);
        }
        for (var attr in ocp.derivedAttrs) {
            this._slider[attr].attr('value', ocp.existing._totals[attr]);
        }
    },


    // Public: Cancel all changes and close the dialog
    cancel: function() {
        // Hide actually just starts the fade out animation which means the
        // undo's effect must be rendered. However, changing the sliders and
        // labels is pretty quick so let it go.
        this._dialog.hide();
        this.undo();
    },


    // Public: Reset everything to initial values
    reset: function() {
        console.debug('entered attrDialog.reset');

        // Resetting the slider will cause it to reset it's linked label too
        for (var attr in ocp.coreAttrs) {
            this._slider[attr].reset();
        }
        for (var attr in ocp.derivedAttrs) {
            this._slider[attr].reset();
        }
    }
};



/*
** The skill dialog's helper object.
** As a helper, this may access private data/methods in ocp.existing.
**
** Note: It seems like it'd be useful to have a form here for validation.
**       Unfortanately, this doesn't work well for two reasons:
**
**       1) The form doesn't know how to validate "that 8 majors are checked".
**          We could override the behavior to do this checking, but it gets
**          messy when you do undos and resets.
**
**       2) The form's validation is "valid" or "invalid". The form relies on
**          its input contents to provide feedback when they are invalid.
**          It doesn't make much sense to mark all major checkboxes invalid
**          when you don't have exactly 8, so a message is used instead.
*/
ocp.existing.skillDialog = {

    // Private: To prevent duplicate lookups, store references to the entities we manage
    _dialog: null,
    _submitButton: null,
    _validityMsgNode: null,
    _spinner: {},
    _checkbox: {},

    // Private: Whether the dialog has been initialized
    _dialogInitialized: false,

    // Private: The function currently connected to the fade out animation
    _fadeOutHook: undefined,

    // Private: Denotes if doing multiple input changes (a-la an undo or reset)
    _doingManyChanges: false,

    // Private: Denotes if our inputs are all valid
    _isValid: false,


    // Public: Initialize ourselves
    initialize: function() {

        // Find the entities we manage
        this._dialog = dijit.byId('skillDialog');
        this._submitButton = dijit.byId('skillDialogSubmit');
        this._validityMsgNode = dojo.byId('skillDialogValidity');

        // Trap when the dialog is shown. It does more, but the first
        // time it is shown, it will initialize itself.
        dojo.connect(this._dialog, 'onShow', this, 'onShow');
    },


    // Private: Initialize the dialog
    _initializeDialog: function() {
        console.debug('entered skillDialog._initializeDialog');

        // Hook into events that manipulate this dialog
        dojo.connect(this._dialog, 'onExecute', this, 'submit');
        dojo.connect(this._dialog, 'onSubmit', this, 'submit');
        dojo.connect(this._dialog, 'onCancel', this, 'cancel');

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
            var skills = ocp.specs[spec].skills;
            for (var skillIndex in skills) {
                var skill = skills[skillIndex];

                // Using our current value for majors means that reset will also
                // use these values. For normal usage, this is no problem.
                // However, if we cheat (a-la ocp.setNullisNow before this dialog
                // is initialized), then the default majors are Nullis' majors.
                // Since it's only an issue when cheating, we'll leave it.
                var isMajor = ocp.existing.isMajor(skill);
                var min = (isMajor ? ocp.SKILL_MAJOR_MIN : ocp.SKILL_MIN);
                var max = ocp.SKILL_MAX;
                ski +=
                    '<tr>' +
                        '<td>' +
                            // TODO: Setting for="existingMajorCheck_..." allows clicking
                            // TODO: on this label to toggle the major checkbox.
                            '<label for="skillSpinner_' + skill + '" class="selectedName">' +
                                ocp.skills[skill].name + ':' +
                            '</label>' +
                        '</td>' +
                        '<td>' +
                            '<input dojoType="dijit.form.NumberSpinner" ' +
                                'id="skillSpinner_' + skill + '" class="skillSpinner" ' +
                                'name="' + skill + '" ' +
                                'value="' + min + '" intermediateChanges="false" ' +
                                'timeoutChangeRate="0.6" smallDelta="1" largeDelta="10" ' +
                                'constraints="{min:' + min + ', max:' + max + ', places:0}" ' +
                                'onChange="ocp.existing.skillDialog.spinnerChanged(\'' +
                                    skill + '\')" ' +
                            '/>' +
                        '</td>' +
                        '<td class="majorCheckContainer">' +
                            '<input dojoType="dijit.form.CheckBox" type="checkbox" ' +
                                'id="existingMajorCheck_' + skill + '" ' +
                                'name="majors" value="' + skill + '" ' +
                                (isMajor ? 'checked="checked" ' : '') +
                                'onChange="ocp.existing.skillDialog.checkboxChanged(\'' +
                                    skill + '\')" ' +
                            '/>' +
                        '</td>' +
                    '</tr>';
            }

            // Close out this spec
            ski += '</tbody></table></div>';
        }

        // Insert the results (parsing the code for Dojo markups)
        dojo.html.set(dojo.byId('skillInputsContainer'), ski, { parseContent: true });

        // Now that they are all created, store references to all spinners and checkboxes
        for (var skill in ocp.skills) {
            this._spinner[skill] = dijit.byId('skillSpinner_' + skill);
            this._checkbox[skill] = dijit.byId('existingMajorCheck_' + skill);
        }

        // For reset to work, the spinners' current values need to be the min values.
        // However, it's possible that our current value is not the min,
        // so do an undo (which, by definition, sets the dialog's values to ours).
        // We also need everything to be validated, and undo nicely does that too.
        this.undo();
    },


    // Public: The existing data changed -- update our vaules if we've been initialized
    existingChanged: function () {
        if (this._dialogInitialized) {
            this.undo();
        }
    },


    // Private: Update the dialog to reflect our current validity
    _updateValidity: function() {

        // If we're doing many changes, updating the validity over and over again gets expensive.
        // Instead, do nothing and wait until the big operation is done.
        if (!this._doingManyChanges) {

            // First gather validity info from all inputs
            var invalidSpinners = 0;
            var majorsChecked = 0;
            for (var skill in ocp.skills) {
                // If a spinner is invalid, count it
                if (!this._spinner[skill].isValid()) {
                    invalidSpinners++;
                }
                // If a checkbox is checked, count it
                if (this._checkbox[skill].checked) {
                    majorsChecked++;
                }
            }

            // Assume we are valid and start building the validity message
            var isValid = true;
            var msg = '';

            // If there are any invalid spinners, tell the user and mark invalid
            if (invalidSpinners > 0) {
                msg +=
                    '<div class="dialogStatusInvalid">' +
                        'All skills must have a valid value (' +
                        invalidSpinners + (invalidSpinners == 1 ? ' is' : ' are') + ' invalid).' +
                    '</div>';
                isValid = false;
            }

            // If we don't have exactly the required number of major skills,
            // tell the user and mark invalid
            if (majorsChecked != ocp.MAJOR_NUM) {
                msg +=
                    '<div class="dialogStatusInvalid">' +
                        'You must have exactly ' + ocp.MAJOR_NUM + ' major skills (' +
                        majorsChecked + (majorsChecked == 1 ? ' is' : ' are') + ' checked).' +
                    '</div>';
                isValid = false;
            }

            // If we are still valid, tell the user all is well
            if (isValid) {
                msg = '<div class="dialogStatusValid">All skill settings are valid.</div>';
            }

            // Enable/disable the submit button based on our validity
            this._submitButton.attr('disabled', !isValid);

            // Display the validity message
            dojo.place(msg, this._validityMsgNode, 'only');

            // Lastly, store the validity status
            this._isValid = isValid;
            //console.debug('exiting skillDialog._updateValidity', this._isValid);
        }
    },


    // Public: A skill number spinner changed
    spinnerChanged: function (skill) {
        console.debug('entered skillDialog.spinnerChanged', skill);

        // Nothing special to do, just update our validity
        this._updateValidity();
    },


    // Public: A major skill checkbox changed
    checkboxChanged: function (skill) {
        console.debug('entered skillDialog.checkboxChanged', skill);

        // The spinner and checkbox for this skill
        var spinner = this._spinner[skill];
        var checkbox = this._checkbox[skill];

        // Set the spinners new min constraint
        var wasValid = spinner.isValid();  // Need to store since we're changing constraints
        var newMin = (checkbox.checked ? ocp.SKILL_MAJOR_MIN : ocp.SKILL_MIN);
        var constrain = spinner.attr('constraints');
        var oldMin = constrain.min;
        constrain.min = newMin;
        spinner.attr('constraints', constrain);

        // If the spinner was valid, adjust it by the delta between the new and old mins
        if (wasValid) {
            var value = spinner.attr('value');
            value += newMin - oldMin;
            if (value < newMin) {
                value = newMin;
            }
            if (value > constrain.max) {
                value = constrain.max;
            }
            spinner.attr('value', value);
        }

        // Since a checkbox changed, update our validity
        this._updateValidity();
    },


    // Public: Submit and use the dialog's values
    //         Returns true/false for success/failure
    submit: function (event) {
        console.debug('entered skillDialog.submit');

        // It should be impossible to get here while invalid (because the
        // button should be disabled), but just in case, check validity again
        this._updateValidity();
        if (this._isValid) {

            // Grab info from all skills
            var majors = {};
            for (var skill in ocp.skills) {

                // Store the major if it's checked
                if (this._checkbox[skill].checked) {
                    majors[skill] = true;
                }

                // Store the value of this skill
                ocp.existing._totals[skill] = this._spinner[skill].attr('value');
            }

            // Store the new list of majors
            delete ocp.existing._majors;
            ocp.existing._majors = majors;

            // Notify of changes and return success to let the dialog be closed
            ocp.notifyChanged();
            return true;
        } else {

            // Erm... This should never happen...
            // Gracefully tell the user something is invalid and inhibit the submission.
            console.warn('Cannot submit skill dialog with invalid data!');
            alert('Cannot submit changes until all skill values are valid and exactly ' +
                ocp.MAJOR_NUM + ' major skills are selected.');
            return false;
        }
    },


    // Public: Revert all dialog values to our current values
    undo: function() {
        console.debug('entered skillDialog.undo');

        // Note that we are doing multiple changes
        this._doingManyChanges = true;

        // Assign our values to each spinner and checkbox
        // To prevent the spinner from possibly having an invalid value,
        // set the checkbox first so checkboxChanged can alter the spinner's
        // constraints as appropriate.
        for (var skill in ocp.skills) {
            this._checkbox[skill].attr('value', ocp.existing.isMajor(skill));
            this._spinner[skill].attr('value', ocp.existing._totals[skill]);
        }

        // Done with the many changes, so update validity
        this._doingManyChanges = false;
        this._updateValidity();
    },


    // Public: Reset everything to initial values
    reset: function() {
        console.debug('entered skillDialog.reset');

        // Note that we are doing multiple changes
        this._doingManyChanges = true;

        // Reset both inputs for each skill, but do the checkbox first.
        // When the checkbox's value changes, checkedChanged gets called and
        // alters the constraints and (possibly) value of the spinner.
        // Since the spinner's constraints don't get reset, this
        // prevents the spinner from having an invalid value.
        for (var skill in ocp.skills) {
            this._checkbox[skill].reset();
            this._spinner[skill].reset();
        }

        // Done with the many changes, so update validity
        this._doingManyChanges = false;
        this._updateValidity();
    },


    // Public: Called whenever our dialog is shown
    onShow: function() {
        //console.debug('entered skillDialog.onShow');

        // If this is the first time the dialog is shown, initialize it
        if (!this._dialogInitialized) {
            this._dialogInitialized = true;
            this._initializeDialog();
        }

        // If a fade out hook never fired (because the dialog was shown before
        // the fade out animation ended), fire it now
        // The hook disconnects itself and resets the value of _fadeOutHook
        if (this._fadeOutHook) {
            this._fadeOutHook();
        }
    },


    // Public: Cancel all changes and close the dialog
    //         To prevent the browser from rendering the "undo" changes,
    //         do the "undo" when the dialog is not visible
    cancel: function() {
        console.debug('entered skillDialog.cancel');

        // Hiding the dialog really means starting its fade out animation
        this._dialog.hide();

        // Define locals for use inside closures
        var _this = this;
        var handle = null;

        // When the fade out animation ends, safely disconnect and then undo all changes
        // Setting this as our fade out hook enables it to be called by onShow in the
        // unlikely event that the user was able to call the dialog's show (which does a
        // fade out stop -- which doesn't call onEnd) before the fade out animation ended.
        this._fadeOutHook = function() {
            //console.debug('in fadeOutHook');
            // From closure: _this, handle
            dojo.disconnect(handle);
            handle = null;
            _this._fadeOutHook = undefined;
            dojo.hitch(_this, 'undo')();
        }

        // When the fade out animation ends, run the hook
        handle = dojo.connect(this._dialog._fadeOut, 'onEnd', this._fadeOutHook);

        // Since I couldn't make this happen via the standard UI (which probably
        // indicates this should never happen -- but be safe and do it anyway),
        // I used this to force a show before the fade out animation could end.
        //this._dialog.show();
    }
};

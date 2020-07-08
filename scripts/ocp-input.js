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
** ocp-input.js
**
** Generic character input abstractor.
*/

ocp.input = {

    // Private: To prevent duplicate lookups, store references to the entities we manage
    _stackContainer: null,
    _stackController: null,
    _existingPane: null,


    // Public: Return whether using a new (true) or existing (false) character
    get isNewChar () {
        // We're using a new character unless the Existing Char input pane is selected
        // This way if something goes wrong, we'll return "using a new char"
        // which is the more important use case for OCP.
        return !this._existingPane.selected;
    },

    // Public: Set the input data to either a new (true) or existing (false) character
    //         If the child is new, a notification event is generated
    set isNewChar (newChar) {
        this._stackContainer.selectChild(
            newChar ? 'inputNewCharacter' : 'inputExistingCharacter');
        return this.isNewChar;
    },


    // Public: The starting level for this character
    get levelMin () {
        // New characters are always level one, but existing ones can set any starting level
        return (this.isNewChar ? 1 : ocp.existing.level);
    },


    // Public: Return an array of major skills based on char type
    get majors () {
        return (this.isNewChar ? ocp.clazz.majors : ocp.existing.majors);
    },


    // Public: Return if a skill is major or not based on char type
    isMajor: function (skill) {
        return (this.isNewChar ? ocp.clazz.isMajor(skill) : ocp.existing.isMajor(skill));
    },


    // Public: Given the min and max values of a slider, return the integral value
    //         that will correspond to the given percentage
    //         This needs to match the implementation in Dijit sliders so the value
    //         used in a rule label matches the value of the slider at that position.
    sliderPercentValue: function (min, max, pct) {
        return Math.round((max - min) * pct) + min;
    },


    // Public: Initialize
    initialize: function() {
        // Find the entities we manage
        this._stackContainer = dijit.byId('inputStackContainer');
        this._stackController = dijit.byId('inputStackController');
        this._existingPane = dijit.byId('inputExistingCharacter');

        // Capture whenever the stack changes the currently displayed child
        dojo.connect(this._stackController, 'onSelectChild', this, 'onSelectChild');
    },


    // Public: When the user toggles between new and existing characters, notify of changes
    onSelectChild: function(/* Widget */ page) {
        ocp.notifyChanged();
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        // Nothing to do
    }
};

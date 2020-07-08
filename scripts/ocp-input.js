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

    // Public: Whether we are doing a new character or an existing one
    isNewChar: true,


    // Private: Sets our new character data attribute
    _setNewChar: function() {
        // We're using a new character unless the Existing Char input pane is selected
        // This way if something goes wrong, we'll return "using a new char"
        // which is the more important use case for OCP.
        this.isNewChar = !this._existingPane.selected;
    },


    // Public: The starting level for this character
    levelMin: function () {
        // New characters are always level one, but existing ones can set any starting level
        return (this.isNewChar ? 1 : ocp.existing.level);
    },


    // Public: Return an array of major skills based on char type
    majors: function () {
        return (this.isNewChar ? ocp.cclass.majors : ocp.existing.majors);
    },


    // Public: Return if a skill is major or not based on char type
    isMajor: function (skill) {
        return (this.isNewChar ? ocp.cclass.isMajor(skill) : ocp.existing.isMajor(skill));
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

        // Initialize new/existing character
        this._setNewChar();

        // Capture whenever the stack changes the currently displayed child
        dojo.connect(this._stackController, 'onSelectChild', this, 'onSelectChild');
    },


    // Public: When the user toggles between new and existing characters,
    //         update our new/existing char status and notify of changes
    onSelectChild: function(/* Widget */ page) {
        this._setNewChar();
        ocp.notifyChanged();
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        // Nothing to do
    }
};

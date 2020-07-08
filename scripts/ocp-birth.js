/*
** ocp-birth.js
**
** Everything related to birth signs.
*/

ocp.birth = {

    // Private: Data for all birthsigns
    _data: {
        "The Mage": {
            attributes: { mag:50 },
            specials: []
        },

        "The Apprentice": {
            attributes: { mag:100 },
            specials: [ "Weakness to Magicka 100%" ]
        },

        "The Warrior": {
            attributes: { str:10, end:10 },
            specials: []
        },

        "The Thief": {
            attributes: { agi:10, spe:10, luc:10 },
            specials: []
        },

        "The Shadow": {
            attributes: {},
            specials: [ "Inivisibility (duration 60) once a day" ]
        },

        "The Lover": {
            attributes: {},
            specials: [ "Paralyze (touch, duration 10) and lose 120 points of Fatigue once a day" ]
        },

        "The Ritual": {
            attributes: {},
            specials: [
                "Restore Health (magnitude 200, instant) once a day",
                "Turn Undead (magnitude 100, duration 30)"
            ]
        },

        "The Tower": {
            attributes: {},
            specials: [
                "Open Average lock once a day",
                "Reflect Damage (magnitude 5, duration 120)"
            ]
        },

        "The Serpent": {
            attributes: {},
            specials: [
                "Four effects, all at once, once a day -- " +
                    "Damage Health (touch, magnitude 3, duration 20), " +
                    "Dispel (magnitude 90), " +
                    "Cure Poison, " +
                    "Damage Fatigue (self, magnitude 100)"
            ]
        },

        "The Atronach": {
            attributes: { mag:150 },
            specials: [
                "Spell Absorption 50%",
                "No Magicka regeneration"
            ]
        },

        "The Lady": {
            attributes: { wil:10, end:10 },
            specials: []
        },

        "The Steed": {
            attributes: { spe:20 },
            specials: []
        },

        "The Lord": {
            attributes: {},
            specials: [
                "Restore Health (duration 15, magnitude 6)",
                "Weakness to Fire 25% all the time"
            ]
        }
    },


    // Private: Currently selected birthsign
    _birth: "<none>",


    // Private: Gets an attribute value for a birth or returns 0 if none
    _getAttr: function (birth, attr) {
        return (attr in this._data[birth].attributes
            ? this._data[birth].attributes[attr]
            : 0);
    },


    // Public: getters for all data of the currently selected race and gender
    get str () { return this._getAttr(this._birth, "str"); },
    get int () { return this._getAttr(this._birth, "int"); },
    get wil () { return this._getAttr(this._birth, "wil"); },
    get agi () { return this._getAttr(this._birth, "agi"); },
    get spe () { return this._getAttr(this._birth, "spe"); },
    get end () { return this._getAttr(this._birth, "end"); },
    get per () { return this._getAttr(this._birth, "per"); },
    get luc () { return this._getAttr(this._birth, "luc"); },

    get hea () { return this._getAttr(this._birth, "hea"); },
    get mag () { return this._getAttr(this._birth, "mag"); },
    get fat () { return this._getAttr(this._birth, "fat"); },

    get specials () { return this._data[this._birth].specials; },


    // Public: Initialize
    initialize: function() {
        // Create any one-time contents
        this._initializeDropdown();

        // Select an initial birthsign
        this._select("The Mage");
    },


    // Private: Populate the dropdown used to select Birthsign
    _initializeDropdown: function() {

        // Use a hidden menu for the dropdown
        var menu = new dijit.Menu({ style: "display: none;"});

        // Create a menu entry for each birthsign
        for (var birth in this._data) {
            menu.addChild(new dijit.MenuItem({
                label: birth,
                onClick: new Function("ocp.birth.select('" + birth + "')")
            }));
        }

        // Now create the actual button and insert it into the container
        var button = new dijit.form.DropDownButton({
            label: "Birthsign",
            name: "dropdown", // *** What does this do?
            dropDown: menu,
            id: "birthDropdown"
        });
        dojo.byId("birthDropdownContainer").appendChild(button.domNode);
     },


    // Private: Select birthsign without error checking or notification
    _select: function(birth) {
        console.log("entered ocp.birth._select:", birth);

        // Set the current birthsign
        this._birth = birth;
    },


    // Public: Validate args, select birthsign, and notify of a change
    //         Should only be called from the selection dropdown
    select: function(birth) {
        console.log("entered ocp.birth.select:", birth);

        // Validate the selection
        if (birth in this._data) {
            // Assign the new value
            this._select(birth);

            // Notify that something has changed
            ocp.notifyChanged();
        } else {
            alert("Unknown Birthsign '" + birth + "' selected.");
        }
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        this._update();
    },


    // Private: Update our generated content
    _update: function() {

        // Update selected label
        dojo.byId("selectedBirthName").innerHTML = this._birth;

        // Fill in the selected specials
        var specNode = dojo.byId("selectedBirthSpecials");
        var specs = this.specials;
        if (specs.length == 0) {
            specNode.innerHTML = '<span class="specialDescItem">No special abilities.</span>';
        } else {
            var list = '';
            for each (var spec in specs) {
                list += '<span class="specialDescItem">' + spec + '</span>';
            }
            specNode.innerHTML = list;
        }
    }
};

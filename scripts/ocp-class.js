/*
** ocp-class.js
**
** Everything related to classes.
*/

ocp.class = {

    // Private: Predefined classes
    _data: {
        "Acrobat": {
            specialization: "Stealth",
            favoredAttrs:   [ "agi", "end" ],
            majorSkills:    [ "acr", "bla", "blo", "mar", "sec", "sne", "spc" ]
        },

        "Agent": {
            specialization: "Stealth",
            favoredAttrs:   [ "per", "agi" ],
            majorSkills:    [ "acr", "ill", "mar", "mer", "sec", "sne", "spc" ]
        },

        "Archer": {
            specialization: "Combat",
            favoredAttrs:   [ "agi", "str" ],
            majorSkills:    [ "arm", "bla", "blu", "han", "lig", "mar", "sne" ]
        },

        "Assassin": {
            specialization: "Stealth",
            favoredAttrs:   [ "spe", "int" ],
            majorSkills:    [ "acr", "alc", "bla", "lig", "mar", "sec", "sne" ]
        },

        "Barbarian": {
            specialization: "Combat",
            favoredAttrs:   [ "str", "spe" ],
            majorSkills:    [ "arm", "ath", "bla", "blo", "blu", "han", "lig" ]
        },

        "Bard": {
            specialization: "Stealth",
            favoredAttrs:   [ "per", "int" ],
            majorSkills:    [ "alc", "bla", "blo", "ill", "lig", "mer", "spc" ]
        },

        "Battlemage": {
            specialization: "Magic",
            favoredAttrs:   [ "str", "int" ],
            majorSkills:    [ "alc", "alt", "bla", "blu", "con", "des", "mys" ]
        },

        "Crusader": {
            specialization: "Combat",
            favoredAttrs:   [ "str", "wil" ],
            majorSkills:    [ "ath", "bla", "blu", "des", "han", "hvy", "res" ]
        },

        "Healer": {
            specialization: "Magic",
            favoredAttrs:   [ "per", "wil" ],
            majorSkills:    [ "alc", "alt", "des", "ill", "mer", "res", "spc" ]
        },

        "Knight": {
            specialization: "Combat",
            favoredAttrs:   [ "str", "per" ],
            majorSkills:    [ "bla", "blo", "blu", "han", "hvy", "ill", "spc" ]
        },

        "Mage": {
            specialization: "Magic",
            favoredAttrs:   [ "int", "wil" ],
            majorSkills:    [ "alc", "alt", "con", "des", "ill", "mys", "res" ]
        },

        "Monk": {
            specialization: "Stealth",
            favoredAttrs:   [ "agi", "wil" ],
            majorSkills:    [ "acr", "alt", "ath", "han", "mar", "sec", "sne" ]
        },

        "Nightblade": {
            specialization: "Magic",
            favoredAttrs:   [ "wil", "spe" ],
            majorSkills:    [ "acr", "alt", "ath", "bla", "des", "lig", "res" ]
        },

        "Pilgrim": {
            specialization: "Stealth",
            favoredAttrs:   [ "per", "end" ],
            majorSkills:    [ "arm", "blo", "blu", "lig", "mer", "sec", "spc" ]
        },

        "Rogue": {
            specialization: "Combat",
            favoredAttrs:   [ "spe", "per" ],
            majorSkills:    [ "alc", "ath", "bla", "blo", "ill", "lig", "mer" ]
        },

        "Scout": {
            specialization: "Combat",
            favoredAttrs:   [ "spe", "end" ],
            majorSkills:    [ "acr", "alc", "arm", "ath", "bla", "blo", "lig" ]
        },

        "Sorcerer": {
            specialization: "Magic",
            favoredAttrs:   [ "int", "end" ],
            majorSkills:    [ "alc", "alt", "con", "des", "hvy", "mys", "res" ]
        },

        "Spellsword": {
            specialization: "Magic",
            favoredAttrs:   [ "wil", "end" ],
            majorSkills:    [ "alt", "bla", "blo", "des", "hvy", "ill", "res" ]
        },

        "Thief": {
            specialization: "Stealth",
            favoredAttrs:   [ "spe", "agi" ],
            majorSkills:    [ "acr", "lig", "mar", "mer", "sec", "sne", "spc" ]
        },

        "Warrior": {
            specialization: "Combat",
            favoredAttrs:   [ "str", "end" ],
            majorSkills:    [ "arm", "ath", "bla", "blo", "blu", "han", "hvy" ]
        },

        "Witchhunter": {
            specialization: "Magic",
            favoredAttrs:   [ "int", "agi" ],
            majorSkills:    [ "alc", "ath", "con", "des", "mar", "mys", "sec" ]
        }
    },


    // Private: Currently selected predefined class
    _predefined: "",

    // Private: Currently selected custom class info
    //          When _custom is true, this data supercedes _predefined
    _custom: false,
    _customData: {
        name: "",
        specialization: "",
        favoredAttrs: [],
        majorSkills: []
    },


    // Private: Returns a reference to the data for the current class
    _getCurrent: function () {
        return (this._custom ? this._customData : this._data[this._predefined]);
    },

    // Private: Return the value of a favored attr
    //          Favorites get a 5 point bonus, others get 0
    _getAttr: function (attr) {
        return (this._getCurrent().favoredAttrs.indexOf(attr) == -1 ? 0 : 5);
    },

    // Private: Get the major/minor base value for a skill
    //          Major skills start at 25 and minor skills at 5
    _getSkillBase: function (skill) {
        return (this._getCurrent().majorSkills.indexOf(skill) == -1 ? 5 : 25);
    },

    // Private: Get the skill specialization value for a skill
    //          Specialized skills get 5 bonus points, others get 0
    //          Note: The game says it's a +10 bonus, but it's actually +5
    // *** validate this ***
    _getSkillSpec: function (skill) {
        return (ocp.skills[skill].spec == this.spec ? 5 : 0);
    },

    // Private: Return the total skill value for this skill
    _getSkill: function (skill) {
        return this._getSkillBase(skill) + this._getSkillSpec(skill);
    },


    // Public: getters for all data of the currently selected class
    get name ()   { return (this._custom ? this._customData.name : this._predefined); },
    get spec ()   { return this._getCurrent().specialization; },
    get favs ()   { return this._getCurrent().favoredAttrs; },
    get majors () { return this._getCurrent().majorSkills; },

    get str () { return this._getAttr("str"); },
    get int () { return this._getAttr("int"); },
    get wil () { return this._getAttr("wil"); },
    get agi () { return this._getAttr("agi"); },
    get spe () { return this._getAttr("spe"); },
    get end () { return this._getAttr("end"); },
    get per () { return this._getAttr("per"); },
    get luc () { return this._getAttr("luc"); },

    get bla () { return this._getSkill("bla"); },
    get blu () { return this._getSkill("blu"); },
    get han () { return this._getSkill("han"); },
    get alc () { return this._getSkill("alc"); },
    get con () { return this._getSkill("con"); },
    get mys () { return this._getSkill("mys"); },
    get alt () { return this._getSkill("alt"); },
    get des () { return this._getSkill("des"); },
    get res () { return this._getSkill("res"); },
    get mar () { return this._getSkill("mar"); },
    get sec () { return this._getSkill("sec"); },
    get sne () { return this._getSkill("sne"); },
    get acr () { return this._getSkill("acr"); },
    get ath () { return this._getSkill("ath"); },
    get lig () { return this._getSkill("lig"); },
    get arm () { return this._getSkill("arm"); },
    get blo () { return this._getSkill("blo"); },
    get hvy () { return this._getSkill("hvy"); },
    get ill () { return this._getSkill("ill"); },
    get mer () { return this._getSkill("mer"); },
    get spc () { return this._getSkill("spc"); },


    // Public: Returns if a given skill is a major skill for the current class
    isMajor: function (skill) {
        return (this.majors.indexOf(skill) == -1 ? false : true);
    },

    // Public: Return the base and specialization values of each skill
    skillBase: function (skill) { return this._getSkillBase(skill); },
    skillSpec: function (skill) { return this._getSkillSpec(skill); },


    // Public: Initialize
    initialize: function() {
        // Create any one-time contents
        this._initializeDropdown();

        // Select an initial predefined class
        this._selectPredefined("Acrobat");
    },


    // Private: Populate the dropdown used to select class
    _initializeDropdown: function() {

        // Use a hidden menu for the dropdown
        var menu = new dijit.Menu({ style: "display: none;"});

        // Create a menu entry for a custom class
        menu.addChild(new dijit.MenuItem({
            label: "Custom",
            onClick: function() { alert('Sorry, custom classes not supported yet.'); }
        }));

        // Create a menu entry for each predefined class
        for (var class in this._data) {
            menu.addChild(new dijit.MenuItem({
                label: class,
                onClick: new Function("ocp.class.selectPredefined('" + class + "')")
            }));
        }

        // Now create the actual button and insert it into the container
        var button = new dijit.form.DropDownButton({
            label: "Class",
            name: "dropdown", // *** What does this do?
            dropDown: menu,
            id: "classDropdown"
        });
        dojo.byId("classDropdownContainer").appendChild(button.domNode);
    },


    // Private: Select predefined class without error checking or notification
    _selectPredefined: function(predefined) {
        console.log("entered ocp.class._selectPredefined:", predefined);

        // Set the current class
        this._custom = false;
        this._predefined = predefined;
    },


    // Public: Validate args, select predefined class, and notify of a change
    //         Should only be called from the selection dropdown
    selectPredefined: function(predefined) {
        console.log("entered ocp.class.selectPredefined:", predefined);

        // Validate the selection
        if (predefined in this._data) {
            // Assign the new value
            this._selectPredefined(predefined);

            // Notify that something has changed
            ocp.notifyChanged();
        } else {
            alert("Unknown predefined class '" + predefined + "' selected.");
        }
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        this._update();
    },


    // Private: Update our generated content
    _update: function() {

        // Update selected label
        dojo.byId("selectedClassName").innerHTML =
            (this._custom ? 'Custom: ' + this._customData.name : this._predefined);;

        // Fill in the selected details
        var det = '<span class="specialDescItem">Specialization: ' +
            this.spec + '</span>' +
            '<span class="specialDescItem">Favored Attributes: ' +
            ocp.coreAttrs[this.favs[0]].name + ' and ' +
            ocp.coreAttrs[this.favs[1]].name + '</span>' +
            '<span class="specialDescItem">Major Skills: ';
        var firstSkill = true;
        for each (var skill in this.majors) {
            det += (firstSkill ? '' : ', ') + ocp.skills[skill].name;
            firstSkill = false;
        }
        dojo.byId("selectedClassDetails").innerHTML = det;
    }
};

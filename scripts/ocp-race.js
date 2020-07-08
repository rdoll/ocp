/*
** ocp-race.js
**
** Everything related to race.
** Note: Race actually means Gender and Race since the gender affects starting attributes.
**
** Todo: I'd love to define everything (overview image, overview description, starting
**       attributes, etc) once for each race and then generate everything else based on it.
**       To be done cleanly, tho, that'd require Iterators/Generators in JavaScript 1.7.
*/

ocp.race = {

    // Private: Data for all races and genders
    _data: {
        "Orc": {
            attributes: {
                "Male":   { str:45, int:30, wil:50, agi:35, spe:30, end:50, per:30, luc:50 },
                "Female": { str:45, int:40, wil:45, agi:35, spe:30, end:50, per:25, luc:50 }
            },
            skills: { arm:10, blo:10, blu:10, han:5, hvy:10 },
            specials: [
                "Beserk (Fortify Health 20, Fortify Fatigue 200, Fortify Strength 50, Drain Agility 100, " +
                    "duration 60, once a day)",
                "Resist Magicka (magnitude 25)"
            ]
        },

        "Breton": {
            attributes: {
                "Male":   { str:40, int:50, wil:50, agi:30, spe:30, end:30, per:40, luc:50, mag:50 },
                "Female": { str:30, int:50, wil:50, agi:30, spe:40, end:30, per:40, luc:50, mag:50 },
            },
            skills: { alc:5, alt:5, con:10, ill:5, mys:10, res:10 },
            specials: [
                "Fortify Maximum Magicka (magnitude 50, constant)",
                "Resist Magicka (magnitude 50, constant)",
                "Shield (magnitude 50, duration 60, once a day)"
            ]
        },

        "Imperial": {
            attributes: {
                "Male":   { str:40, int:40, wil:30, agi:30, spe:40, end:40, per:50, luc:50 },
                "Female": { str:40, int:40, wil:40, agi:30, spe:30, end:40, per:50, luc:50 },
            },
            skills: { bla:5, blu:5, han:5, hvy:5, mer:10, spc:10 },
            specials: [
                "Absorb Fatigure (magnitude 100, once a day)",
                "Charm (magnitude 30, once a day)"
            ]
        },

        "Redguard": {
            attributes: {
                "Male":   { str:50, int:30, wil:30, agi:40, spe:40, end:50, per:30, luc:50 },
                "Female": { str:40, int:30, wil:30, agi:40, spe:40, end:50, per:40, luc:50 },
            },
            skills: { ath:10, bla:10, blu:10, lig:5, hvy:5, mer:5 },
            specials: [
                "Adrenaline Rush (Fortify Agility 50, Fortify Speed 50, Fortify Strength 50, " +
                    "Fortify Endurance 50, Fortify Health 25, duration 60)",
                "Resist Poison (magnitude 75)",
                "Resist Disease (magnitude 75)"
            ]
        },

        "Nord": {
            attributes: {
                "Male":   { str:50, int:30, wil:30, agi:40, spe:40, end:50, per:30, luc:50 },
                "Female": { str:50, int:30, wil:40, agi:40, spe:40, end:40, per:30, luc:50 },
            },
            skills: { arm:5, bla:10, blo:5, blu:10, hvy:10, res:5 },
            specials: [
                "Frost Damage (touch, magnitude 50, once a day)",
                "Shield (magnitude 30, duration 60, once a day)",
                "Resist Frost (magnitude 50, constant)"
            ]
        },

        "High Elf": {
            attributes: {
                "Male":   { str:30, int:50, wil:40, agi:40, spe:30, end:40, per:40, luc:50, mag:100 },
                "Female": { str:30, int:50, wil:40, agi:40, spe:40, end:30, per:40, luc:50, mag:100 },
            },
            skills: { alc:5, alt:10, con:5, des:10, ill:5, mys:10 },
            specials: [
                "Fortified Maximum Magicka (magnitude 100, constant)",
                "Weakness to Fire, Frost, and Shock (magnitude 25, constant)",
                "Resist Desease (magnitude 75, constant)"
            ]
        },

        "Dark Elf": {
            attributes: {
                "Male":   { str:40, int:40, wil:30, agi:40, spe:50, end:40, per:30, luc:50 },
                "Female": { str:40, int:40, wil:30, agi:40, spe:50, end:30, per:40, luc:50 },
            },
            skills: { ath:5, bla:10, blu:5, des:10, lig:5, mar:5, mys:5 },
            specials: [
                "Summon Ghost (duration 60, once a day)",
                "Resist Fire (magnitude 75, constant)"
            ]
        },

        "Wood Elf": {
            attributes: {
                "Male":   { str:30, int:40, wil:30, agi:50, spe:50, end:40, per:30, luc:50 },
                "Female": { str:30, int:40, wil:30, agi:50, spe:50, end:30, per:40, luc:50 },
            },
            skills: { acr:5, alc:10, alt:5, lig:5, mar:10, sne:10 },
            specials: [
                "Command Creature (magnitude 20, duration 60, once a day)",
                "Resist Disease (magnitude 75)"
            ]
        },

        "Argonian": {
            attributes: {
                "Male":   { str:40, int:40, wil:30, agi:50, spe:50, end:30, per:30, luc:50 },
                "Female": { str:40, int:50, wil:40, agi:40, spe:40, end:30, per:30, luc:50 },
            },
            skills: { alc:5, ath:10, bla:5, han:5, ill:5, mys:5, sec:10 },
            specials: [
                "Resist Disease (magnitude 75, constant)",
                "Resist Poison (magnitude 100, constant)",
                "Water Breathing (constant)"
            ]
        },

        "Khajiit": {
            attributes: {
                "Male":   { str:40, int:40, wil:30, agi:50, spe:40, end:30, per:40, luc:50 },
                "Female": { str:30, int:40, wil:30, agi:50, spe:40, end:40, per:40, luc:50 }
            },
            skills: { acr:10, ath:5, bla:5, han:10, lig:5, sec:5, sne:5 },
            specials: [
                "Demoralize (magnitude 100, once a day)",
                "Night-Eye (duration 30, unlimited uses)"
            ]
        }
    },


    // Private: Currently selected race and gender
    _race: "<none>",
    _gender: "<none>",


    // Private: Gets a skill value for a race or returns 0 if none
    _getSkill: function (race, skill) {
        return (skill in this._data[race].skills
            ? this._data[race].skills[skill]
            : 0);
    },


    // Public: getters for all data of the currently selected race and gender
    get str () { return this._data[this._race].attributes[this._gender].str; },
    get int () { return this._data[this._race].attributes[this._gender].int; },
    get wil () { return this._data[this._race].attributes[this._gender].wil; },
    get agi () { return this._data[this._race].attributes[this._gender].agi; },
    get spe () { return this._data[this._race].attributes[this._gender].spe; },
    get end () { return this._data[this._race].attributes[this._gender].end; },
    get per () { return this._data[this._race].attributes[this._gender].per; },
    get luc () { return this._data[this._race].attributes[this._gender].luc; },

    get hea () { return 0; },
    get mag () { var attrs = this._data[this._race].attributes[this._gender];
                 return ("mag" in attrs ? attrs.mag : 0); },
    get fat () { return 0; },

    get bla () { return this._getSkill(this._race, "bla"); },
    get blu () { return this._getSkill(this._race, "blu"); },
    get han () { return this._getSkill(this._race, "han"); },
    get alc () { return this._getSkill(this._race, "alc"); },
    get con () { return this._getSkill(this._race, "con"); },
    get mys () { return this._getSkill(this._race, "mys"); },
    get alt () { return this._getSkill(this._race, "alt"); },
    get des () { return this._getSkill(this._race, "des"); },
    get res () { return this._getSkill(this._race, "res"); },
    get mar () { return this._getSkill(this._race, "mar"); },
    get sec () { return this._getSkill(this._race, "sec"); },
    get sne () { return this._getSkill(this._race, "sne"); },
    get acr () { return this._getSkill(this._race, "acr"); },
    get ath () { return this._getSkill(this._race, "ath"); },
    get lig () { return this._getSkill(this._race, "lig"); },
    get arm () { return this._getSkill(this._race, "arm"); },
    get blo () { return this._getSkill(this._race, "blo"); },
    get hvy () { return this._getSkill(this._race, "hvy"); },
    get ill () { return this._getSkill(this._race, "ill"); },
    get mer () { return this._getSkill(this._race, "mer"); },
    get spc () { return this._getSkill(this._race, "spc"); },

    get specials () { return this._data[this._race].specials; },


    // Public: Initialize
    initialize: function() {
        // Hook the race dialog to let us populate the details grid after it's loaded
        dojo.connect(dijit.byId('raceDialog'), "onDownloadEnd", this, "_initializeDetails");

        // Select an initial race
        this._select("Orc", "Male");
    },


    // Private: Populate the race details with the values from _data
    //          Must be called after the race dialog is downloaded
    _initializeDetails: function() {
        console.log("entered ocp.race._initializeDetails");

        // Build a large table for all race info
        var det = '<table id="raceDetailsTable">';

        // Use column groups to apply styles dividing each column
        det += '<colgroup span="2" />';
        var firstRace = true;
        for (var race in this._data) {
//          *** raceData's width doesn't work here -- using th.raceName instead
//          det += '<colgroup span="2" class="raceData' +
//              (firstRace ? '' : ' first') + '" />';
            det += '<colgroup span="2"' +
                (firstRace ? '' : ' class="first"') + ' />';
            firstRace = false;
        }

        // Now the headers
        det += '<thead>';

        // Build the first header row for the races, but span all genders
        det += '<tr><th colspan="2"></th>';
        for (var race in this._data) {
            det += '<th class="raceName" colspan="2">' + race + '</th>';
        }
        det += '</tr>';

        // Now the genders with the selection buttons
        det += '<tr class="last"><th colspan="2">Attributes</th>';
        for (var race in this._data) {
            for (var gender in this._data[race].attributes) {
                det += '<th>' +
                    '<button dojoType="dijit.form.Button" ' +
                        'type="submit"' +
                        'title="Select ' + gender + ' ' + race + '" ' +
                        'onClick="ocp.race.select(\'' +
                            race + '\', \'' + gender + '\')">' +
                        gender.charAt(0) +
                    '</button></th>';
            }
        }

        // Complete the header and start the body
        det += '</tr></thead><tbody>';

        // First do a row for each core attribute
        for (var attr in ocp.coreAttrs) {
            det += '<tr><td colspan="2">' + ocp.coreAttrs[attr].name + '</td>';
            for each (var race in this._data) {
                for each (var gender in race.attributes) {
                    var extra = '';
                    if (attr != "luc") {  // Luck is the same for everyone, not better/worse
                        extra = (gender[attr] > 40 ? 'better' : (gender[attr] < 40 ? 'worse' : ''));
                    }
                    det += '<td class="numeric ' + extra + '">' + gender[attr] + '</td>';
                }
            }
            det += '</tr>';
        }

        // Since two races have Magicka bonuses, show a Magicka row too
        det += '<tr class="first"><td colspan="2">Magicka</td>';
        for each (var race in this._data) {
            for each (var gender in race.attributes) {
                if ("mag" in gender) {
                    det += '<td class="numeric better">' + gender.mag + '</td>';
                } else {
                    det += '<td class="numeric"></td>';
                }
            }
        }


        // Now a "divider" row indicating we are going to skills
        // For easier reading, repeat the race names
        det += '<tr class="divider"><td colspan="2">Skills</td>';
        for (var race in this._data) {
            var extra = (race == "Imperial"
                ? 'class="worse" title="Only 40 (instead of 45) skill bonus points" '
                : '');
            det += '<td ' + extra + 'colspan="2">' + race + '</td>';
        }
        det += '</tr>';

        // A row for every skill.
        // Span all gender columns since skills are not gender specific
        var rowEven = true;
        for (var attr in ocp.coreAttrs) {
            var firstSkill = true;
            for each (var skill in ocp.coreAttrs[attr].skills) {
                det += '<tr class="skill ' + (rowEven ? "even" : "odd") + '">';

                // The first skill means we need to create a vertical skill "header"
                if (firstSkill) {
                    det += '<td rowspan="' + ocp.coreAttrs[attr].skills.length +
                        '" class="vertical" title="Skills that affect ' +
                            ocp.coreAttrs[attr].name + '.">' +
                        ocp.verticalize(attr) + '</td>';
                }

                det += '<td>' + ocp.skills[skill].name + '</td>';
                for (var race in this._data) {
                    var skillVal = this._getSkill(race, skill);
                    det += '<td class="numeric" colspan="2">' +
                        ( skillVal > 0 ? skillVal : "" ) + '</td>';
                }
                det += '</tr>';
                firstSkill = false;
            }
            rowEven = !rowEven;
        }

        // Terminate the table and insert it into the details
        det += '</tbody></table>';
        dojo.byId("raceDetailsDiv").innerHTML = det;

        // Finally, instantiate the constructs we created inside the details table
        dojo.parser.parse(dojo.byId("raceDetailsTable"));
    },


    // Private: Select race/gender without error checking or notification
    _select: function(race, gender) {
        console.log("entered ocp.race._select:", gender, race);

        // Set the current race/gender
        this._race = race;
        this._gender = gender;
    },


    // Public: Validate args, select race/gender, and notify of a change
    //         Should only be called from the selection dialog
    select: function(race, gender) {
        console.log("entered ocp.race.select:", gender, race);

        // Validate the selection
        if (race in this._data) {
            if (gender in this._data[race].attributes) {
                // Assign the new values
                this._select(race, gender);

                // Notify that something has changed
                ocp.notifyChanged();
            } else {
                alert("Unknown gender '" + gender + "' selected for race '" + race + "'.");
            }
        } else {
            alert("Unknown race '" + race + "' selected.");
        }
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        this._update();
    },


    // Private: Update our generated content
    _update: function() {

        // Update selected label
        dojo.byId("selectedRaceName").innerHTML = this._gender + ' ' + this._race;

        // Fill in the selected specials
        var specNode = dojo.byId("selectedRaceSpecials");
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

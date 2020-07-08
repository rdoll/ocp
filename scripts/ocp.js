/*
** ocp.js
**
** Main controller and overall namespace for everything.
*/

var ocp = {

    // Public: Attribute and skill maximum values
    AMAX: 100,
    SMAX: 100,

    // Public: Define the abbr and full names of all core attributes
    //         Leveling the skills listed increases the level bonus for this stat
    coreAttrs: {
        str: { name:"Strength",     skills:[ "bla", "blu", "han" ] },
        int: { name:"Intelligence", skills:[ "alc", "con", "mys" ] },
        wil: { name:"Willpower",    skills:[ "alt", "des", "res" ] },
        agi: { name:"Agility",      skills:[ "mar", "sec", "sne" ] },
        spe: { name:"Speed",        skills:[ "acr", "ath", "lig" ] },
        end: { name:"Endurance",    skills:[ "arm", "blo", "hvy" ] },
        per: { name:"Personality",  skills:[ "ill", "mer", "spc" ] },
        luc: { name:"Luck",         skills:[ ] }
    },

    // Public: Define the abbr and full names of all derived attributes
    derivedAttrs: {
        hea: "Health",
        mag: "Magicka",
        fat: "Fatigue"
    },

    // Public: Arts specializations and the skills they affect
    specs: {
        "Combat":  { skills: [ "arm", "ath", "bla", "blo", "blu", "han", "hvy" ] },
        "Magic":   { skills: [ "alc", "alt", "con", "des", "ill", "mys", "res" ] },
        "Stealth": { skills: [ "acr", "lig", "mar", "mer", "sec", "sne", "spc" ] }
    },

    // Public: Define the abbr, full name, specialization and attribute affected
    //         for all skills
    skills: {
        bla: { name:"Blade",        spec:"Combat",  attr:"str" },
        blu: { name:"Blunt",        spec:"Combat",  attr:"str" },
        han: { name:"Hand-to-Hand", spec:"Combat",  attr:"str" },
        alc: { name:"Alchemy",      spec:"Magic",   attr:"int" },
        con: { name:"Conjuration",  spec:"Magic",   attr:"int" },
        mys: { name:"Mysticism",    spec:"Magic",   attr:"int" },
        alt: { name:"Alteration",   spec:"Magic",   attr:"wil" },
        des: { name:"Destruction",  spec:"Magic",   attr:"wil" },
        res: { name:"Restoration",  spec:"Magic",   attr:"wil" },
        mar: { name:"Marksmanship", spec:"Stealth", attr:"agi" },
        sec: { name:"Security",     spec:"Stealth", attr:"agi" },
        sne: { name:"Sneak",        spec:"Stealth", attr:"agi" },
        acr: { name:"Acrobatics",   spec:"Stealth", attr:"spe" },
        ath: { name:"Athletics",    spec:"Combat",  attr:"spe" },
        lig: { name:"Light Armor",  spec:"Stealth", attr:"spe" },
        arm: { name:"Armorer",      spec:"Combat",  attr:"end" },
        blo: { name:"Block",        spec:"Combat",  attr:"end" },
        hvy: { name:"Heavy Armor",  spec:"Combat",  attr:"end" },
        ill: { name:"Illusion",     spec:"Magic",   attr:"per" },
        mer: { name:"Mercantile",   spec:"Stealth", attr:"per" },
        spc: { name:"Speechcraft",  spec:"Stealth", attr:"per" }
    },


    // Public: Make the given string suitable as a vertical table header
    //         You still must apply the ".vertical" style to a th or td for this to work
    //         Yes, I made up the word "verticalize". :)
    verticalize: function (str) {

        // Uppercase the first character
        str = str.replace(/^./, str.charAt(0).toUpperCase());

        // Insert a newline between all characters
        str = str.replace(/(.)/g, "$1\n");

        // Trim the final newline we added (and any other extra whitespace)
        str = dojo.trim(str);

        // Return the contents in a span ready for HTML usage
        return '<span>' + str + '</span>';
    },


    // Public: Initialize ourselves
    initialize: function() {

        // Create any one-time contents
        this._initiliazeContents();

        // Initialize our children
        // During this initialization, no notifications are allowed
        this.race.initialize();
        this.birth.initialize();
        this.class.initialize();
        this.level.initialize();
        this.results.initialize();

        // Now that all initialization is complete,
        // notify of the changes made during initialization
        this.notifyChanged();
    },


    // Private: Initialize all contents for this object
    _initiliazeContents: function() {
        // We don't control any content -- we just coordinate it for our children
    },


    // Public: Some character data has changed, so update all results
    notifyChanged: function() {
        console.log("entered ocp.notifyChanged");

        // Update ourselves
        this._update();

        // Now update our children (in the correct order)
        this.race.notifyChanged();
        this.birth.notifyChanged();
        this.class.notifyChanged();
        this.level.notifyChanged();
        this.results.notifyChanged();
    },


    // Private: Update any generated content
    _update: function() {
        // Nothing to do
    }
};


// After everything (including our children) is loaded
// and Dojo has processed markups, initialize ourselves
dojo.addOnLoad(ocp, "initialize");

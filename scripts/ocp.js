/*
** ocp.js
**
** Main controller, overall namespace for everything, and cool Robocop reference :P.
*/

var ocp = {

    // Public: The max level you can obtain via normal means
    //         (e.g. if you go to prison and major attributes decay, you could level higher)
    //         With a min of 25 in all major skills, you can only level up a max of 52.5 times
    LEVEL_MAX: 53,

    // Public: The number of major skills every character must have
    MAJORS_NUM: 7,

    // Public: Skill minimum/maximum values
    SKILL_MIN: 5,
    SKILL_MAJOR_MIN: 25,
    SKILL_MAX: 100,

    // Public: Define the abbr and full names of all core attributes
    //         Leveling the skills listed increases the level bonus for this stat
    //         Min is set during initialization
    coreAttrs: {
        str: { name:'Strength',     skills:[ 'bla', 'blu', 'han' ], min:0, max:100 },
        int: { name:'Intelligence', skills:[ 'alc', 'con', 'mys' ], min:0, max:100 },
        wil: { name:'Willpower',    skills:[ 'alt', 'des', 'res' ], min:0, max:100 },
        agi: { name:'Agility',      skills:[ 'mar', 'sec', 'sne' ], min:0, max:100 },
        spe: { name:'Speed',        skills:[ 'acr', 'ath', 'lig' ], min:0, max:100 },
        end: { name:'Endurance',    skills:[ 'arm', 'blo', 'hvy' ], min:0, max:100 },
        per: { name:'Personality',  skills:[ 'ill', 'mer', 'spc' ], min:0, max:100 },
        luc: { name:'Luck',         skills:[                     ], min:0, max:100 }
    },

    // Public: Define the abbr and full names of all derived attributes
    //         Min/max is derived during our initialization
    derivedAttrs: {
        hea: { name:'Health',      min:0, max:0 },
        mag: { name:'Magicka',     min:0, max:0 },
        fat: { name:'Fatigue',     min:0, max:0 },
        enc: { name:'Encumbrance', min:0, max:0 }
    },

    // Public: Arts specializations and the skills they affect
    specs: {
        'Combat':  { skills: [ 'arm', 'ath', 'bla', 'blo', 'blu', 'han', 'hvy' ] },
        'Magic':   { skills: [ 'alc', 'alt', 'con', 'des', 'ill', 'mys', 'res' ] },
        'Stealth': { skills: [ 'acr', 'lig', 'mar', 'mer', 'sec', 'sne', 'spc' ] }
    },

    // Public: Define the abbr, full name, specialization and attribute affected
    //         for all skills
    skills: {
        bla: { name:'Blade',        spec:'Combat',  attr:'str' },
        blu: { name:'Blunt',        spec:'Combat',  attr:'str' },
        han: { name:'Hand-to-Hand', spec:'Combat',  attr:'str' },
        alc: { name:'Alchemy',      spec:'Magic',   attr:'int' },
        con: { name:'Conjuration',  spec:'Magic',   attr:'int' },
        mys: { name:'Mysticism',    spec:'Magic',   attr:'int' },
        alt: { name:'Alteration',   spec:'Magic',   attr:'wil' },
        des: { name:'Destruction',  spec:'Magic',   attr:'wil' },
        res: { name:'Restoration',  spec:'Magic',   attr:'wil' },
        mar: { name:'Marksmanship', spec:'Stealth', attr:'agi' },
        sec: { name:'Security',     spec:'Stealth', attr:'agi' },
        sne: { name:'Sneak',        spec:'Stealth', attr:'agi' },
        acr: { name:'Acrobatics',   spec:'Stealth', attr:'spe' },
        ath: { name:'Athletics',    spec:'Combat',  attr:'spe' },
        lig: { name:'Light Armor',  spec:'Stealth', attr:'spe' },
        arm: { name:'Armorer',      spec:'Combat',  attr:'end' },
        blo: { name:'Block',        spec:'Combat',  attr:'end' },
        hvy: { name:'Heavy Armor',  spec:'Combat',  attr:'end' },  // Hea collides with Health
        ill: { name:'Illusion',     spec:'Magic',   attr:'per' },
        mer: { name:'Mercantile',   spec:'Stealth', attr:'per' },
        spc: { name:'Speechcraft',  spec:'Stealth', attr:'per' }   // Spe collides with Speed
    },


    // Public: Return whether using a new (true) or existing character (false)
    isNewChar: function () {
        // We're using a new character unless the Existing Char input pane is selected
        return (dijit.byId('inputStackContainer').selectedChildWidget.title == 'Existing Character'
            ? false : true);
    },


    // Public: Make the given string suitable as a vertical table header
    //         You still must apply the '.vertical' style to a th or td for this to work
    //         Yes, I made up the word 'verticalize'. :)
    verticalize: function (str) {

        // Uppercase the first character
        str = str.replace(/^./, str.charAt(0).toUpperCase());

        // Insert a newline between all characters
        str = str.replace(/(.)/g, '$1\n');

        // Trim the final newline we added (and any other extra whitespace)
        str = dojo.trim(str);

        // Return the contents in a span ready for HTML usage
        return '<span>' + str + '</span>';
    },


    // Public: Given the min and max values of a slider, return the integral value
    //         that will correspond to the given percentage
    //         This needs to match the implementation in Dijit sliders so the value
    //         used in a rule label matches the value of the slider at that position.
    sliderPercentValue: function (min, max, pct) {
        return Math.round((max - min) * pct) + min;
    },


    // Public: Given *all* core attributes, calculate the derived attributes
    //         Derived values are returned in totals and added to any existing values
    deriveAttrs: function (totals) {

        // If any derived attrs don't exist in the totals, seed them with zeros
        for (var attr in this.derivedAttrs) {
            if (!(attr in totals)) {
                totals[attr] = 0;
            }
        }

        // Health is 2 x Endurance
        // Note: You also gain 10% of your endurance per level, but that's not captured here
        totals.hea += 2 * totals.end;

        // Magicka is 2 x Intelligence
        totals.mag += 2 * totals.int;

        // Fatigue is Strength + Willpower + Agility + Endurance
        totals.fat += totals.str + totals.wil + totals.agi + totals.end;

        // Encumbrance is 5 x Strength
        totals.enc += 5 * totals.str;
    },


    // Public: Initialize ourselves
    initialize: function() {

        // Initialize the min/max stats for attributes
        this._initializeAttrs();

        // Initialize our children
        // During this initialization, no notifications are allowed
        this.race.initialize();
        this.birth.initialize();
        this.cclass.initialize();
        this.existing.initialize();
        this.order.initialize();
        this.level.initialize();
        this.results.initialize();

        // Now that all initialization is complete,
        // notify of the changes made during initialization
        this.notifyChanged();
    },


    // Private: Initialize the min/max values for attributes
    _initializeAttrs: function () {

        // First do the core attributes
        // All bonuses can be selected (or not), so the min is the min for all races
        for (var attr in this.coreAttrs) {
            this.coreAttrs[attr].min = ocp.race.attrMin(attr);
        }

        // Now do the derived attributes
        // Using the min values for every core attribute, calculate the derived values
        var totals = {};
        for (var attr in this.coreAttrs) {
            totals[attr] = this.coreAttrs[attr].min;
        }
        this.deriveAttrs(totals);
        for (var attr in this.derivedAttrs) {
            this.derivedAttrs[attr].min = totals[attr];
        }

        // Do the same using the max values
        var totals = {};
        for (var attr in this.coreAttrs) {
            totals[attr] = this.coreAttrs[attr].max;
        }
        this.deriveAttrs(totals);
        for (var attr in this.derivedAttrs) {
            this.derivedAttrs[attr].max = totals[attr];
        }

        // Health is an exception since you get an additional 10% of end per level.
        // Starting with 65 end at level 1, you can reach 100 end by level 8 with 258 health.
        // You then get 10 points per level up from 9 - LEVEL_MAX.
        this.derivedAttrs.hea.max = 258 + (((this.LEVEL_MAX - 9) + 1) * 10);

        // Magicka is an exception since races and birthsigns can give bonuses.
        // Add these bonuses to the max derived from the core attributes.
        this.derivedAttrs.mag.max += ocp.race.attrMax('mag') + ocp.birth.attrMax('mag');
    },


    // Public: Some character data has changed, so update all results
    notifyChanged: function() {
        console.log('entered ocp.notifyChanged');

        // Update our children in the correct order
        this.race.notifyChanged();
        this.birth.notifyChanged();
        this.cclass.notifyChanged();
        this.existing.notifyChanged();
        this.order.notifyChanged();
        this.level.notifyChanged();
        this.results.notifyChanged();
    },


    // *** Temp for my toon
    // Public: Set starting details for my toon Nullis
    setNullisStart: function() {
        console.log('Setting starting data for Nullis...');

        ocp.race._select('Khajiit', 'Male');

        ocp.birth._select('The Thief');

        with (ocp.cclass) {
            _customData.name = 'Nullis';
            _customData.specialization = 'Stealth';
            _customData.favoredAttrs = ['end', 'luc'];
            _customData.majorSkills = ['blu', 'con', 'des', 'mar', 'ath', 'hvy', 'ill'];
            _custom = true;
        }

        with (ocp.order) {
            _attrDndSource.destroy();
            dojo.empty('attrOrderDndSource');
            _attrs = ['agi', 'spe', 'end', 'luc', 'str', 'int', 'wil', 'per'];
            //_attrs = ['agi', 'spe', 'end', 'str', 'int', 'wil', 'per', 'luc'];
            _initializeAttrDnd();
        }

        ocp.level._startingLevel = 1;

        ocp.notifyChanged();
    },

    // *** Temp for my toon
    // Public: Set leveling details for my toon Nullis
    setNullisNow: function() {
        this.setNullisStart();

        console.log('Setting already leveled data for Nullis...');

        function nextLevel(current, leveled) {
            var next = {};
            for (var x in current) {
                next[x] = current[x] + (x in leveled ? leveled[x] : 0);
            }
            return next;
        }

        var totals = [];
        var wasted = [];
        totals[1] = ocp.level._totals[1];
        wasted[1] = {};

        totals[2] = nextLevel(totals[totals.length - 1], {
            agi:5, spe:5, end:5, hea:14, mag:0, fat:10, enc:0,
            bla:1, han:1, res:1, mar:6, sec:1, sne:5, ath:3, lig:9, arm:7, blo:3, mer:4
        });
        wasted[2] = { bla:'', han:'', res:'', mer:'' };

        totals[3] = nextLevel(totals[totals.length - 1], {
            agi:5, spe:5, end:5, hea:14, mag:0, fat:10, enc:0,
            bla:1, alc:1, mar:6, sec:2, sne:5, acr:2, ath:4, lig:4, arm:6, blo:5, mer:4
        });
        wasted[3] = { bla:'', alc:'', mer:'' };

        totals[4] = nextLevel(totals[totals.length - 1], {
            int:5, spe:5, end:5, hea:15, mag:10, fat:5, enc:0,
            bla:6, alc:7, con:5, sec:2, sne:3, acr:3, ath:5, lig:5, arm:4, blo:6, mer:2
        });
        wasted[4] = { bla:'', sec:'', sne:'', mer:'' };

        totals[5] = nextLevel(totals[totals.length - 1], {
            agi:5, end:5, per:5, hea:15, mag:0, fat:10, enc:0,
            alc:1, res:1, mar:7, sec:4, sne:2, acr:1, ath:3, lig:2, arm:4, blo:6, mer:8, spc:2
        });
        wasted[5] = { alc:'', res:'', acr:'', lig:'' };

        totals[6] = nextLevel(totals[totals.length - 1], {
            agi:5, spe:5, end:5, hea:16, mag:0, fat:10, enc:0,
            bla:5, mar:4, sec:5, sne:12, acr:2, ath:6, lig:3, arm:8, blo:2, mer:2, spc:5
        });
        wasted[6] = { bla:'', mer:'', spc:'' };

        // Tested with end at level 7, hp at level 10=212, 15=298, 20=348, etc.
        // Tested with no end at level 7, hp at level 10=200, 15=294, 20=344, etc.
        totals[7] = nextLevel(totals[totals.length - 1], {
            agi:5, spe:5, end:5, hea:16, mag:0, fat:10, enc:0,
            mar:7, sec:1, sne:2, acr:2, ath:3, lig:5, arm:10, mer:2, spc:1
        });
        wasted[7] = { mer:'', spc:'' };

        var maxLevel = totals.length - 1;

        ocp.level._totals = totals;
        ocp.level._wasted = wasted;

        // Update future leveling
        ocp.level._startingLevel = maxLevel;
        ocp.level._updateLeveling();

        // Show all results starting from level 1, even tho these will be lost after any recalc
        ocp.level._startingLevel = 1;
        ocp.results.notifyChanged();

        // But do analysis starting from the current level
        ocp.level._startingLevel = maxLevel;
        ocp.results._updateAnalysis();
    }
};

// After everything (including our children) is loaded
// and Dojo has processed markups, initialize ourselves
dojo.addOnLoad(ocp, 'initialize');

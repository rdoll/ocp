/*
** ocp.js
**
** Main controller, overall namespace for everything, and cool Robocop reference :P.
**
** *** Nice set of images (and nice credit page) at http://www.elderstats.com/about/?p=credits
*/

var ocp = {

    // Public: The version of the entire OCP package
    VERSION: '0.40',

    // Public: The max level you can obtain via normal means
    //         (e.g. if you go to prison and major attributes decay, you could level higher)
    //         With a min of 25 in all major skills, you can only level up a max of 52.5 times
    LEVEL_MAX: 53,

    // Public: The number of major skills every character must have
    MAJOR_NUM: 7,

    // Public: Skill bonuses for a skill being major or specialized
    //         Note: The game says spec bonus is +10, but it's actually +5
    SKILL_BONUS_MAJOR: 20,
    SKILL_BONUS_SPEC: 5,

    // Public: Skill minimum/maximum values
    SKILL_MIN: 5,
    SKILL_MAJOR_MIN: 5 + 20,  // SKILL_MIN + SKILL_BONUS_MAJOR
    SKILL_MAX: 100,

    // Public: Number of favored attributes a class can have
    CLASS_FAV_ATTR_NUM: 2,

    // Public: Attribute bonus for being a favored attribute
    ATTR_BONUS_FAV: 5,

    // Public: The number of skill points required to trigger a level up
    LEVELUP_MAJOR_POINTS: 10,

    // Public: The max number of skill points (that count toward an attr bonus)
    //         and the max attribute bonus points per level up
    LEVELUP_BONUS_SKILL_MAX: 10,
    LEVELUP_BONUS_ATTR_MAX: 5,

    // Public: The max number of attributes that can be leveled each levelup
    LEVELUP_ATTRS_MAX: 3,

    // Public: The root dir of all images
    IMAGE_ROOT_DIR: 'images/',

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
    //         Min/max is derived during initialization
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


    // Public: Returns a grammatically correct list of the array elements.
    //         The given preposition (e.g. 'and' or 'or') is correctly used.
    prettyList: function (arr, prep) {

        // Assume nothing to return (used for empty arrays)
        var pretty = '';

        // Different item counts are handled differently
        var totalItems = arr.length;
        if (totalItems == 1) {

            // For one item, just return it
            pretty = arr[0];
        } else if (totalItems == 2) {

            // For two items, return them joined by the preposition
            pretty = arr[0] + ' ' + prep + ' ' + arr[1];
        } else {

            // For more than two items, create a comma separated list
            // Pull off the last item and insert it at then end with the preposition
            var lastItem = arr.pop();
            pretty = arr.join( ', ' ) + ', ' + prep + ' ' + lastItem;
        }

        // Return the results
        return pretty;
    },


    // Public: Returns a pretty list of full core attribute names from an
    //         input array with abbreviations
    prettyAttrList: function (arr, prep) {

        // Create a new array with each abbreviation converted to it's name
        var newArr = dojo.map(arr, function (attr) { return ocp.coreAttrs[attr].name; });

        // Return the results of pretty-ing the new array
        return this.prettyList(newArr, prep);
    },


    // Public: Returns a pretty list of full skill names from an
    //         input array with abbreviations
    prettySkillList: function (arr, prep) {

        // Create a new array with each abbreviation converted to it's name
        var newArr = dojo.map(arr, function (skill) { return ocp.skills[skill].name; });

        // Return the results of pretty-ing the new array
        return this.prettyList(newArr, prep);
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
        // Initialize the version numbers in the about info
        this._initializeVersions();

        // Initialize the min/max stats for attributes
        this._initializeAttrs();

        // Initialize our children
        // During this initialization, no notifications are allowed
        this.input.initialize();
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


    // Private: Initialize the version numbers in the main page's about section
    _initializeVersions: function () {
        dojo.place('<span>' + this.VERSION + '</span>', 'ocpVersion', 'only');
        dojo.place('<span>' + dojo.version.toString() + '</span>', 'dojoVersion', 'only');
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
        console.debug('entered notifyChanged');

        // Update our children in the correct order
        this.input.notifyChanged();
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

        ocp.cclass._selectCustom('Stealth', ['end', 'luc'],
            ['blu', 'con', 'des', 'mar', 'ath', 'hvy', 'ill']);
        if (ocp.cclass.classDialog._dialogInitialized) {
            ocp.cclass.classDialog.undo();
        }

        ocp.order._attrDndSource.destroy();
        delete ocp.order._attrDndSource;
        dojo.empty('attrOrderDndSource');
        delete ocp.order._attrs;
        ocp.order._attrs = ['agi', 'spe', 'end', 'luc', 'str', 'int', 'wil', 'per'];
        //ocp.order._attrs = ['agi', 'spe', 'end', 'str', 'int', 'wil', 'per', 'luc'];
        ocp.order._initializeAttrDnd();

        ocp.input._stackContainer.selectChild('inputNewCharacter');

        ocp.notifyChanged();
    },


    // *** Temp for my toon
    // Public: Set existing details for my toon Nullis
    setNullisNow: function() {
        // Set starting values to seed totals
        this.setNullisStart();

        console.log('Setting existing data for Nullis...');

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
            bla:1, han:1, res:1, mar:6, sec:1, sne:5, ath:4, lig:9, arm:7, blo:3, mer:4
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

        totals[8] = nextLevel(totals[totals.length - 1], {
            agi:5, spe:5, end:5, hea:17, mag:0, fat:10, enc:0,
            mar:6, sne:6, acr:2, ath:4, lig:6, arm:10, mer:2, spc:3
        });
        wasted[8] = { mer:'', spc:'' };

        totals[9] = nextLevel(totals[totals.length - 1], {
            agi:5, spe:5, end:5, hea:17, mag:0, fat:10, enc:0,
            bla:1, mar:6, sec:8, sne:7, acr:3, ath:4, lig:3, arm:10, mer:4, spc:4
        });
        wasted[9] = { bla:'', mer:'', spc:'' };

        var maxLevel = totals.length - 1;
        dijit.byId('levelSlider').attr('value', maxLevel);
        delete ocp.existing._totals;
        ocp.existing._totals = totals[maxLevel];
        delete ocp.existing._majors;
        ocp.existing._majors = [];
        for each (var skill in ocp.cclass.majors) {
            ocp.existing.majors.push(skill);
        }
        if (ocp.existing.attrDialog._dialog._alreadyInitialized) {
            ocp.existing.attrDialog.undo();
        }
        if (ocp.existing.skillDialog._dialogInitialized) {
            ocp.existing.skillDialog.undo();
        }

        ocp.input._stackContainer.selectChild('inputExistingCharacter');
        ocp.notifyChanged();

        // Hack the leveling results to show the "historic" info for past levels
        // This info will be completely lost upon any recalc
        var saveTotals = ocp.level._totals;
        var saveWasted = ocp.level._wasted;
        ocp.level._totals = totals;
        ocp.level._wasted = wasted;
        ocp.level._updateLeveling();
        ocp.existing._level = 1;
        ocp.results._updateLeveling();
        ocp.existing._level = maxLevel;
        ocp.level._totals = saveTotals;
        ocp.level._wasted = saveWasted;
    }
};

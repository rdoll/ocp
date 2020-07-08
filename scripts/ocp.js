/*
** (C) Copyright 2009-2010 by Richard Doll, All Rights Reserved.
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
** ocp.js
**
** Main controller, overall namespace for everything, and cool Robocop reference :P.
*/

// Note what we provide and then define the module
var ocp = {

    // Public: The version of the entire OCP package
    VERSION: '0.8.3',

    // Public: The max level you can obtain via normal means
    //         (e.g. if you go to prison and major attributes decay, you could level higher)
    //         With a min of 25 in all major skills, you can only level up a max of 52.5 times
    LEVEL_MAX: 53,

    // Public: The number of major skills every character must have
    MAJOR_NUM: 7,

    // Public: Skill bonuses for a skill being major or specialized
    // Note:   The game says spec bonus is +10, but it's actually +5
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

    // Public: The normal starting value for all attributes (except Luck) for all races
    RACE_ATTR_NORM: 40,

    // Public: The root dir of all images
    IMAGE_ROOT_DIR: 'images/',

    // Public: Define the abbr and full names of all core attributes
    //         Leveling the skills listed increases the level bonus for this stat
    //         Min is set during initialization
    // Note:   Use itl for Intelligence since int is a potential future keyword
    coreAttrs: {
        str: { name: 'Strength',     skills: [ 'bla', 'blu', 'han' ], min: 0, max: 100 },
        itl: { name: 'Intelligence', skills: [ 'alc', 'con', 'mys' ], min: 0, max: 100 },
        wil: { name: 'Willpower',    skills: [ 'alt', 'des', 'res' ], min: 0, max: 100 },
        agi: { name: 'Agility',      skills: [ 'mar', 'sec', 'sne' ], min: 0, max: 100 },
        spe: { name: 'Speed',        skills: [ 'acr', 'ath', 'lig' ], min: 0, max: 100 },
        end: { name: 'Endurance',    skills: [ 'arm', 'blo', 'hvy' ], min: 0, max: 100 },
        per: { name: 'Personality',  skills: [ 'ill', 'mer', 'spc' ], min: 0, max: 100 },
        luc: { name: 'Luck',         skills: [                     ], min: 0, max: 100 }
    },

    // Public: Define the abbr and full names of all derived attributes
    //         Min/max is derived during initialization
    derivedAttrs: {
        hea: { name: 'Health',      min: 0, max: 0 },
        mag: { name: 'Magicka',     min: 0, max: 0 },
        fat: { name: 'Fatigue',     min: 0, max: 0 },
        enc: { name: 'Encumbrance', min: 0, max: 0 }
    },

    // Public: Arts specializations and the skills they affect
    specs: {
        'Combat':  { skills: [ 'arm', 'ath', 'bla', 'blo', 'blu', 'han', 'hvy' ] },
        'Magic':   { skills: [ 'alc', 'alt', 'con', 'des', 'ill', 'mys', 'res' ] },
        'Stealth': { skills: [ 'acr', 'lig', 'mar', 'mer', 'sec', 'sne', 'spc' ] }
    },

    // Public: Define the abbr, full name, specialization and attribute affected for all skills
    skills: {
        bla: { name: 'Blade',        spec: 'Combat',  attr: 'str' },
        blu: { name: 'Blunt',        spec: 'Combat',  attr: 'str' },
        han: { name: 'Hand-to-Hand', spec: 'Combat',  attr: 'str' },
        alc: { name: 'Alchemy',      spec: 'Magic',   attr: 'itl' },
        con: { name: 'Conjuration',  spec: 'Magic',   attr: 'itl' },
        mys: { name: 'Mysticism',    spec: 'Magic',   attr: 'itl' },
        alt: { name: 'Alteration',   spec: 'Magic',   attr: 'wil' },
        des: { name: 'Destruction',  spec: 'Magic',   attr: 'wil' },
        res: { name: 'Restoration',  spec: 'Magic',   attr: 'wil' },
        mar: { name: 'Marksmanship', spec: 'Stealth', attr: 'agi' },
        sec: { name: 'Security',     spec: 'Stealth', attr: 'agi' },
        sne: { name: 'Sneak',        spec: 'Stealth', attr: 'agi' },
        acr: { name: 'Acrobatics',   spec: 'Stealth', attr: 'spe' },
        ath: { name: 'Athletics',    spec: 'Combat',  attr: 'spe' },
        lig: { name: 'Light Armor',  spec: 'Stealth', attr: 'spe' },
        arm: { name: 'Armorer',      spec: 'Combat',  attr: 'end' },
        blo: { name: 'Block',        spec: 'Combat',  attr: 'end' },
        hvy: { name: 'Heavy Armor',  spec: 'Combat',  attr: 'end' },  // Hea collides with Health
        ill: { name: 'Illusion',     spec: 'Magic',   attr: 'per' },
        mer: { name: 'Mercantile',   spec: 'Stealth', attr: 'per' },
        spc: { name: 'Speechcraft',  spec: 'Stealth', attr: 'per' }   // Spe collides with Speed
    },


    // Private: The main stack container for OCP contents
    _mainContainer: null,

    // Public: Set the main container to the given module
    setMainModule: function (moduleId) {

        // Allow the module ID to be abbreviated
        if (!moduleId.match(/ContentPane$/)) {
            moduleId += 'ContentPane';
        }

        this._mainContainer.selectChild(moduleId);
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
    //         input object whose properties are attribute abbreviations
    prettyAttrList: function (obj, prep) {

        // Create an array with each abbreviation converted to it's name
        var arr = [];
        for (var attr in obj) {
            arr.push(ocp.coreAttrs[attr].name);
        }

        // Return the results of pretty-ing the new array
        return this.prettyList(arr, prep);
    },


    // Public: Returns a pretty list of full skill names from an
    //         input object whose properties are skill abbreviations
    prettySkillList: function (obj, prep) {

        // Create an array with each abbreviation converted to it's name
        var arr = [];
        for (var skill in obj) {
            arr.push(ocp.skills[skill].name);
        }

        // Return the results of pretty-ing the new array
        return this.prettyList(arr, prep);
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
        totals.mag += 2 * totals.itl;

        // Fatigue is Strength + Willpower + Agility + Endurance
        totals.fat += totals.str + totals.wil + totals.agi + totals.end;

        // Encumbrance is 5 x Strength
        totals.enc += 5 * totals.str;
    },


    // Public: Retrieve the wanted attributes from the given DOM Node
    //         Attributes can be required (true in wantedAttrs) or optional (false)
    // Throws: An error when a required attribute is missing from the node
    getDomNodeAttrs: function (domNode, wantedAttrs) {
        var attrs = {};

        for (var attrName in wantedAttrs) {
            if (dojo.hasAttr(domNode, attrName)) {

                // The node has this attr, so add it to the return results
                attrs[attrName] = dojo.attr(domNode, attrName);
            } else {

                // This attr doesn't exist -- throw an error if it is required
                if (wantedAttrs[attrName]) {
                    throw 'Error: ' + domNode.nodeName + ' element missing required ' +
                        attrName + ' attribute in ' + domNode.baseURI;
                }
            }
        }

        return attrs;
    },


    // Public: Returns a random integer inclusively between the min and max
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },


    // Private: Returns an object with the tooltip arguments specified in the given tooltip's
    //          message or undefined if there was an error with the tooltip options.
    _parseTooltip: function (tooltipText) {
        var args = {
            cursor: '',    // Default to no cursor style
            position: [],  // Default to using dijit.Tooltip.defaultPosition
            message: ''    // Default to no message
        };

        // Find any options at the start of the tooltip text (and return the options list)
        var optsRe = /^\[([^\[\]]*)\]/;
        var optsList = tooltipText.match(optsRe);
        if (optsList == null) {
            // No options, so the message is the entire text
            args.message = tooltipText;
        } else {
            // The message is the text without the options
            args.message = tooltipText.replace(optsRe,'');

            // Process the options list from the match
            var optsArray = optsList[1].split(',');
            for (var optIndex in optsArray) {
                var opt = optsArray[optIndex];
                if (opt == 'help') {
                    // Note that we need to use the help cursor
                    args.cursor = 'help';
                } else if (opt.match('(above|below|before|after)')) {
                    // Push the positioning options in the order they are found
                    args.position.push(opt);
                } else {
                    console.error('Unknown OCP Tooltip option "' + opt + '"');
                    return undefined;
                }
            }
        }

        return args;
    },


    // Public:  Converts all ocpTooltip attributes on nodes under searchRoot to Dojo tooltips
    // Format:  <tag ... ocpTooltip="Message with some &lt;b&gt;bold text&lt;/b&gt;" ...>
    // or       <tag ... ocpTooltip="[option,option,...]Configure the tooltip with options ...">
    // Options: help = apply the 'cursor: help' style to the node to indicate it has a tooltip
    //          above, below, before, after = try to place the tooltip in these positions
    //              (in the order specified) as per dijit.Tooltip.defaultPosition.
    replaceTooltips: function (searchRoot){
        const ttAttrName = 'ocpTooltip';

        // Find all nodes under the searchRoot that have the tooltip attribute
        var _this = this;
        dojo.query('[' + ttAttrName + ']', dojo.byId(searchRoot)).forEach(function (ttNode) {
            // From closure: _this, ttAttrName

            // Delete the attr to prevent the possibility of attaching multiple tooltips
            var msg = dojo.attr(ttNode, ttAttrName);
            dojo.removeAttr(ttNode, ttAttrName);

            // Get the options from the tooltip's message
            var ttArgs = _this._parseTooltip(msg);
            if (ttArgs) {

                // No errors processing options, so process the tooltip
                if (ttArgs.message.length == 0) {
                    console.warn('Ignoring empty tooltip message on', ttNode,
                        'with ttArgs=', ttArgs);
                } else {

                    // Create and attach the tooltip
                    console.log('Attaching tooltip to', ttNode, 'with ttArgs=', ttArgs);
                    var tt = new dijit.Tooltip({
                        label: ttArgs.message,
                        position: ttArgs.position
                    });
                    if (ttArgs.cursor) {
                        dojo.style(ttNode, 'cursor', ttArgs.cursor);
                    }
                    tt.addTarget(ttNode);
                }
            }
        });
    },


    // Initialize ourselves and the main content (but not the planner)
    initialize: function() {
        console.debug('entered initialize');

        // Default to placing tooltips above the node they are attached to, otherwise below them
        dijit.Tooltip.defaultPosition = ['above', 'below'];

        // Initialize the tooltips on the main page
        this.replaceTooltips('aboutFooter');

        // Grab a handle to the main container
        this._mainContainer = dijit.byId('ocpStackContainer');

        // Initialize the version numbers in the about info
        this._initializeVersions();

        // Initialize the min/max stats for attributes
        this._initializeAttrs();

        // Initialize our main page children
        ocp.loader.initialize();
        ocp.util.initialize();
        ocp.contact.initialize();
    },


    // Private: Initialize the version numbers in the main page's about section
    _initializeVersions: function () {
        dojo.place('<span>' + this.VERSION + ' beta</span>', 'ocpVersion', 'only');
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


    // Public: Initializes the planner module after it has been successfully loaded
    initializePlanner: function () {
        console.debug('entered initializePlanner');

        // Intialize the planner's children
        // During this initialization, no notifications are allowed
        ocp.input.initialize();
        ocp.race.initialize();
        ocp.birth.initialize();
        ocp.clazz.initialize();
        ocp.existing.initialize();
        ocp.order.initialize();
        ocp.level.initialize();
        ocp.results.initialize();

        // Now that all planner initialization is complete,
        // notify of the changes made during initialization
        ocp.notifyChanged();
    },


    // Public: Some planner character data has changed, so update all results
    notifyChanged: function() {
        console.debug('entered notifyChanged');

        // Update the planner's children in the correct order
        this.input.notifyChanged();
        this.race.notifyChanged();
        this.birth.notifyChanged();
        this.clazz.notifyChanged();
        this.existing.notifyChanged();
        this.order.notifyChanged();
        this.level.notifyChanged();
        this.results.notifyChanged();
    },


    // Public: Expand or collapse all title panes that match the given query
    expCollTitlePanes: function (query, expanded) {
        dojo.query(query).forEach(function (titlePane) {
            // From closure: expanded
            dijit.byId(titlePane.id).attr('open', expanded);
        });
    }
};

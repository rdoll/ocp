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
** ocp-birth.js
**
** Everything related to birth signs.
**
** All of these images were converted to JPG from the PNGs at
** http://www.elderscrolls.com/codex/codex_birthsigns.htm
**
** Descriptions also taken from http://www.elderscrolls.com/codex/codex_birthsigns.htm
*/

ocp.birth = {

    // Private: Location of our images
    IMAGE_DIR: ocp.IMAGE_ROOT_DIR + 'birth/',

    // Private: Data for all birthsigns
    _data: {
        'The Apprentice': {
            attributes: { mag:100 },
            specials: [ 'Weakness to Magic 100%' ],
            image: 'apprentice.jpg',
            description: 'The Apprentice ability confers a 100-point bonus to your Magicka ' +
                'attribute, but gives you a 100% Weakness to Magic.'
        },

        'The Atronach': {
            attributes: { mag:150 },
            specials: [
                'Spell Absorption 50%',
                'No Magicka regeneration'
            ],
            image: 'atronach.jpg',
            description: 'With the Atronach ability you don&apos;t regain Magicka over time. ' +
                'Instead you have a permanent 50% Spell Absorption to recharge your Magicka. ' +
                'Your base Magicka is also increased by 150 points.'
        },

        'The Lady': {
            attributes: { wil:10, end:10 },
            specials: [],
            image: 'lady.jpg',
            description: 'The Lady&apos;s Blessing confers bonuses of 10 points to your ' +
                'Willpower and Endurance attributes.'
        },

        'The Lord': {
            attributes: {},
            specials: [
                'Restore Health (self, magnitude 6, duration 15, once a day)',
                'Weakness to Fire 25%'
            ],
            image: 'lord.jpg',
            description: 'Being born under the Lord gives you the Blood of the North ' +
                'lesser power to regenerate up to 90 points of Health. However, you also ' +
                'gain the Trollkin curse, a permanent 25% Weakness to Fire.'
        },

        'The Lover': {
            attributes: {},
            specials: [
                'Paralyze (touch, duration 10) and lose 120 points of Fatigue once a day'
            ],
            image: 'lover.jpg',
            description: 'Use the Lover&apos;s Kiss power once a day to paralyze an opponent ' +
                'for 10 seconds at the cost of 120 points of Fatigue.'
        },

        'The Mage': {
            attributes: { mag:50 },
            specials: [],
            image: 'mage.jpg',
            description: 'The Mage ability confers a permanent bonus of 50 points to your ' +
                'Magicka.'
        },

        'The Ritual': {
            attributes: {},
            specials: [
                'Restore Health (self, magnitude 200, once a day)',
                'Turn Undead (target, magnitude 100, duration 30, once a day)'
            ],
            image: 'ritual.jpg',
            description: 'Those born under the Ritual use the Mara&apos;s Gift power once a ' +
                'day as a powerful Restore Health spell. The Blessed Word can turn the undead.'
        },

        'The Serpent': {
            attributes: {},
            specials: [
                'Four effects, all at once, once a day -- ' +
                    'Damage Health (touch, magnitude 3, duration 20), ' +
                    'Dispel (self, magnitude 90), ' +
                    'Cure Poison (self), ' +
                    'Damage Fatigue (self, magnitude 100)'
            ],
            image: 'serpent.jpg',
            description: 'Gain the Serpent spell to cause a slow but potent poison on touch, ' +
                'while simultaneously curing yourself and dispelling magic on yourself. ' +
                'Casting this spell costs 100 points of Fatigue.'
        },

        'The Shadow': {
            attributes: {},
            specials: [ 'Inivisibility (self, duration 60, once a day)' ],
            image: 'shadow.jpg',
            description: 'Use the Moonshadow power once a day to become Invisible for 60 seconds.'
        },

        'The Steed': {
            attributes: { spe:20 },
            specials: [],
            image: 'steed.jpg',
            description: 'The Steed ability grants a bonus of 20 to your Speed attribute.'
        },

        'The Thief': {
            attributes: { agi:10, spe:10, luc:10 },
            specials: [],
            image: 'thief.jpg',
            description: 'The Thief ability grants a 10-point bonus to your Agility, Speed, ' +
                'and Luck attributes.'
        },

        'The Tower': {
            attributes: {},
            specials: [
                'Open Average lock (touch, once a day)',
                'Reflect Damage (self, magnitude 5, duration 120, once a day)'
            ],
            image: 'tower.jpg',
            description: 'With the Tower Key power, once a day open a door or container of ' +
                'Average lock level or less. The Tower Warden reflects five points of damage ' +
                'for 120 seconds once a day.'
        },

        'The Warrior': {
            attributes: { str:10, end:10 },
            specials: [],
            image: 'warrior.jpg',
            description: 'The Warrior ability grants a bonus of 10 points to your ' +
                'Strength and Endurance attributes.'
        }
    },


    // Private: Currently selected birthsign
    _birth: '-none-',


    // Private: Gets an attribute value for a birthsign or returns 0 if none
    _getAttr: function (birth, attr) {
        var attrs = this._data[birth].attributes;
        return (attr in attrs ? attrs[attr] : 0);
    },


    // Public: getters for all data of the currently selected birthsign
    get str () { return this._getAttr(this._birth, 'str'); },
    get itl () { return this._getAttr(this._birth, 'itl'); },
    get wil () { return this._getAttr(this._birth, 'wil'); },
    get agi () { return this._getAttr(this._birth, 'agi'); },
    get spe () { return this._getAttr(this._birth, 'spe'); },
    get end () { return this._getAttr(this._birth, 'end'); },
    get per () { return this._getAttr(this._birth, 'per'); },
    get luc () { return this._getAttr(this._birth, 'luc'); },

    get hea () { return this._getAttr(this._birth, 'hea'); },
    get mag () { return this._getAttr(this._birth, 'mag'); },
    get fat () { return this._getAttr(this._birth, 'fat'); },
    get enc () { return this._getAttr(this._birth, 'enc'); },

    get specials () { return this._data[this._birth].specials; },


    // Public: Returns the max possible value for an attribute
    attrMax: function (attr) {
        var max = 0;
        for (var birthIndex in this._data) {
            var birth = this._data[birthIndex];
            if ((attr in birth.attributes) && (birth.attributes[attr] > max)) {
                max = birth.attributes[attr];
            }
        }
        return max;
    },


    // Public: Initialize
    initialize: function() {
        // Hook the birthsign dialog to initialize it the first time it's shown
        var _this = this;
        var handle = dojo.connect(dijit.byId('birthDialog'), 'onShow',
            function (/* event */) {
                // From closure: _this, handle
                // Disconnect so we only do this once
                dojo.disconnect(handle);
                handle = null;
                _this._initializeDialog();
        });

        // Select an initial birthsign
        this._select('The Apprentice');
    },


    // Private: Initialize the birthsign dialog
    _initializeDialog: function() {
        console.debug('entered _initializeDialog');

        // Build a div for each birthsign
        // Track the count so we can put two per row (one left, other right)
        var det = '';
        var count = 0;
        for (var birth in this._data) {
            det +=
                '<div class="birthDetails birthDetails' + (++count % 2 > 0 ? 'Left' : 'Right') +
                '">' +
                    '<img src="' + this.IMAGE_DIR + this._data[birth].image + '" ' +
                        'class="birthImage" alt="[' + birth + ' Image]" ' +
                        'title="Select ' + birth + '" ' +
                        'onClick="ocp.birth.select(\'' + birth + '\')" ' +
                    '/>' +
                    '<div class="birthName">' + birth + '</div>' +
                    '<div class="birthDescription">' + this._data[birth].description + '</div>' +
                '</div>';
        }

        // Insert the results
        dojo.place(det, 'birthContainer', 'last');
    },


    // Private: Select birthsign without error checking or notification
    _select: function(birth) {
        console.debug('entered _select:', birth);

        // Set the current birthsign
        this._birth = birth;
    },


    // Public: Validate args, select birthsign, and notify of a change
    //         Should only be called from the selection dialog
    select: function(birth) {
        console.debug('entered select:', birth);

        // Validate the selection
        if (birth in this._data) {
            // Assign the new value
            this._select(birth);

            // Notify that something has changed
            ocp.notifyChanged();

            // Close the dialog
            dijit.byId('birthDialog').hide();
        } else {
            var msg = 'Unknown Birthsign "' + birth + '" selected.';
            console.error(msg);
            alert(msg);
        }
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        this._update();
    },


    // Private: Update our generated content
    // TODO: Should add attributes to list of specials?
    _update: function() {

        // Update selected label
        dojo.place('<span>' + this._birth + '</span>', 'birthValue', 'only');

        // Fill in the selected specials
        var list = '';
        var specs = this.specials;
        if (specs.length == 0) {
            list = '<span class="specialDescItem">No special abilities.</span>';
        } else {
            for (var specIndex in specs) {
                list += '<span class="specialDescItem">' + specs[specIndex] + '</span>';
            }
        }
        dojo.place(list, 'birthSpecials', 'only');
    }
};

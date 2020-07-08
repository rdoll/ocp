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
** ocp-race.js
**
** Everything related to race.
** Note: Race usually means Gender and Race since the gender affects starting attributes.
**
** All of these images were converted to JPG from the individual race details pages under
** http://www.elderscrolls.com/codex/races_map.htm
** Note: The JPG conversion eliminated the transparency present in the source GIFs.
** TODO: The background used to replace transparency is not the same for all race images.
**
** Descriptions also taken from the individual race details pages under
** http://www.elderscrolls.com/codex/races_map.htm
**
** TODO: Add height/weight info (esp height since it affects movement speed)
** TODO: Show resists, water breathing, and night-eye in details table?
*/

ocp.race = {

    // Private: Location of our images
    IMAGE_DIR: ocp.IMAGE_ROOT_DIR + 'race/',

    // Private: Data for all races and genders
    _data: {
        'Argonian': {
            attributes: {
                'Male':   { str:40, itl:40, wil:30, agi:50, spe:50, end:30, per:30, luc:50 },
                'Female': { str:40, itl:50, wil:40, agi:40, spe:40, end:30, per:30, luc:50 }
            },
            skills: { alc:5, ath:10, bla:5, han:5, ill:5, mys:5, sec:10 },
            specials: [
                'Resist Disease (self, magnitude 75, constant)',
                'Resist Poison (self, magnitude 100, constant)',
                'Water Breathing (self, constant)'
            ],
            image: 'argonian.jpg',
            description: 'Little is known and less is understood about the reptilian denizens ' +
                'of Black Marsh. Years of defending their borders have made the Argonians ' +
                'experts in guerilla warfare, and their natural abilities make them equally at ' +
                'home in water and on land. They are well-suited for the treacherous swamps of ' +
                'their homeland, and have developed natural immunities to the diseases and ' +
                'poisons that have doomed many would-be explorers into the region. Their ' +
                'seemingly expressionless faces belie a calm intelligence, and many Argonians ' +
                'are well-versed in the magical arts. Others rely on stealth or steel to ' +
                'survive, and their natural agility makes them adept at either. They are, in ' +
                'general, a reserved people, slow to trust and hard to know. Yet, they are ' +
                'fiercely loyal, and will fight to the death for those they have named as friends.'
        },

        'Breton': {
            attributes: {
                'Male':   { str:40, itl:50, wil:50, agi:30, spe:30, end:30, per:40, luc:50, mag:50 },
                'Female': { str:30, itl:50, wil:50, agi:30, spe:40, end:30, per:40, luc:50, mag:50 }
            },
            skills: { alc:5, alt:5, con:10, ill:5, mys:10, res:10 },
            specials: [
                'Fortify Maximum Magicka (self, magnitude 50, constant)',
                'Resist Magicka (self, magnitude 50, constant)',
                'Shield (self, magnitude 50, duration 60, once a day)'
            ],
            image: 'breton.jpg',
            description: 'Passionate and eccentric, poetic and flamboyant, intelligent and ' +
                'willful, the Bretons feel an inborn, instinctive bond with the mercurial ' +
                'forces of magic and the supernatural. Many great sorcerers have come out of ' +
                'their home province of High Rock, and in addition to their quick and ' +
                'perceptive grasp of spellcraft, enchantment, and alchemy, even the humblest ' +
                'of Bretons can boast a high resistance to destructive and dominating magical ' +
                'energies.'
        },

        'Dark Elf': {
            attributes: {
                'Male':   { str:40, itl:40, wil:30, agi:40, spe:50, end:40, per:30, luc:50 },
                'Female': { str:40, itl:40, wil:30, agi:40, spe:50, end:30, per:40, luc:50 }
            },
            skills: { ath:5, bla:10, blu:5, des:10, lig:5, mar:5, mys:5 },
            specials: [
                'Summon Ghost (duration 60, once a day)',
                'Resist Fire (self, magnitude 75, constant)'
            ],
            image: 'darkelf.jpg',
            description: 'Dark Elves are the dark-skinned Elven peoples of the Eastern Empire. ' +
                '&quot;Dark&quot; is variously understood to mean &quot;dark-skinned&quot;, ' +
                '&quot;gloomy&quot;, and &quot;ill-favored by fate&quot;. The Dunmer and their ' +
                'national character embrace these various connotations with enthusiasm. In the ' +
                'Empire, &quot;Dark Elves&quot; is the common usage, but in their Morrowind ' +
                'homeland, and among their Aldmeri brethren, they call themselves the ' +
                '&quot;Dunmer&quot;. The dark-skinned, red-eyed Dark Elves combine powerful ' +
                'intellect with strong and agile physiques, producing superior warriors and ' +
                'sorcerers. On the battlefield, Dark Elves are noted for their skilled and ' +
                'balanced integration of swordsmen, marksmen, and war wizards. In character, ' +
                'they are grim, aloof, and reserved, distrusting and disdainful of other races.'
        },

        'High Elf': {
            attributes: {
                'Male':   { str:30, itl:50, wil:40, agi:40, spe:30, end:40, per:40, luc:50, mag:100 },
                'Female': { str:30, itl:50, wil:40, agi:40, spe:40, end:30, per:40, luc:50, mag:100 }
            },
            skills: { alc:5, alt:10, con:5, des:10, ill:5, mys:10 },
            specials: [
                'Fortified Maximum Magicka (self, magnitude 100, constant)',
                'Weakness to Fire, Frost, and Shock (self, magnitude 25, constant)',
                'Resist Desease (self, magnitude 75, constant)'
            ],
            image: 'highelf.jpg',
            description: 'In Imperial speech, the haughty, tall, golden-skinned peoples of ' +
                'Summerset Isle are called &quot;High Elves&quot;, but they call themselves the ' +
                '&quot;Altmer&quot;, or the &quot;Cultured People&quot;. In the Empire, ' +
                '&quot;High&quot; is often understood to mean &quot;tall&quot;, ' +
                '&quot;proud&quot;, or &quot;snobbish&quot;. The High Elves confidently ' +
                'consider themselves, with some justice, as the most civilized culture of ' +
                'Tamriel; the common tongue of the Empire, Tamrielic, is based on Altmer ' +
                'speech and writing, and most of the Empire&apos;s arts, crafts, and ' +
                'sciences are derived from High Elven traditions. However, the High Elf&apos;s ' +
                'smug self-assurance of his superiority can be hard to bear for those of other ' +
                'races. Deft, intelligent, and strong-willed, High Elves are often gifted in ' +
                'the arcane arts, and High Elves boast that their sublime physical natures ' +
                'make them far more resistant to disease than the &quot;lesser races&quot;.'
        },

        'Imperial': {
            attributes: {
                'Male':   { str:40, itl:40, wil:30, agi:30, spe:40, end:40, per:50, luc:50 },
                'Female': { str:40, itl:40, wil:40, agi:30, spe:30, end:40, per:50, luc:50 }
            },
            // Note: Official Game Guide by Prima has 5 for hvy
            skills: { bla:5, blu:5, han:5, hvy:10, mer:10, spc:10 },
            specials: [
                'Absorb Fatigure (touch, magnitude 100, once a day)',
                'Charm (target, magnitude 30, once a day)'
            ],
            image: 'imperial.jpg',
            description: 'Natives of the civilized, cosmopolitan province of Cyrodiil, the ' +
                'Imperials are well-educated and well-spoken. Imperials are also known for ' +
                'the discipline and training of their citizen armies. Though physically less ' +
                'imposing than the other races, the Imperials have proved to be shrewd ' +
                'diplomats and traders, and these traits, along with their remarkable skill ' +
                'and training as light infantry, have enabled them to subdue all the other ' +
                'nations and races, and to have erected the monument to peace and prosperity ' +
                'that comprises the Glorious Empire.'
        },

        'Khajiit': {
            attributes: {
                'Male':   { str:40, itl:40, wil:30, agi:50, spe:40, end:30, per:40, luc:50 },
                'Female': { str:30, itl:40, wil:30, agi:50, spe:40, end:40, per:40, luc:50 }
            },
            skills: { acr:10, ath:5, bla:5, han:10, lig:5, sec:5, sne:5 },
            specials: [
                'Demoralize (target, magnitude 100, duration 30, once a day)',
                'Night-Eye (self, duration 30, unlimited uses)'
            ],
            image: 'khajiit.jpg',
            description: 'Khajiit hail from the province of Elsweyr and can vary in appearance ' +
                'from nearly Elven to the cathay-raht &quot;jaguar men&quot; to the great ' +
                'Senche-Tiger. The most common breed found in Morrowind, the suthay-raht, is ' +
                'intelligent, quick, and agile. Khajiit of all breeds have a weakness for ' +
                'sweets, especially the drug known as skooma. Many Khajiit disdain weapons in ' +
                'favor of their natural claws. They make excellent thieves due to their natural ' +
                'agility and unmatched acrobatics ability. Many Khajiit are also warriors, ' +
                'although this is less common among the suthay-raht.'
        },

        'Nord': {
            attributes: {
                'Male':   { str:50, itl:30, wil:30, agi:40, spe:40, end:50, per:30, luc:50 },
                'Female': { str:50, itl:30, wil:40, agi:40, spe:40, end:40, per:30, luc:50 }
            },
            skills: { arm:5, bla:10, blo:5, blu:10, hvy:10, res:5 },
            specials: [
                'Frost Damage (touch, magnitude 50, once a day)',
                'Shield (self, magnitude 30, duration 60, once a day)',
                'Resist Frost (self, magnitude 50, constant)'
            ],
            image: 'nord.jpg',
            description: 'The citizens of Skyrim are a tall and fair-haired people, aggressive ' +
                'and fearless in war, industrious and enterprising in trade and exploration. ' +
                'Skilled sailors, Nords can be found in seaports and settlements along all the ' +
                'coasts and rivers of Tamriel. Strong, stubborn, and hardy, Nords are famous ' +
                'for their resistance to cold, even magical frost. Violence is an accepted and ' +
                'comfortable aspect of Nord culture; Nords of all classes are skilled with a ' +
                'variety of weapon and armor styles, and they cheerfully face battle with an ' +
                'ecstatic ferocity that shocks and appalls their enemies.'
        },

        'Orc': {
            attributes: {
                'Male':   { str:45, itl:30, wil:50, agi:35, spe:30, end:50, per:30, luc:50 },
                'Female': { str:45, itl:40, wil:45, agi:35, spe:30, end:50, per:25, luc:50 }
            },
            skills: { arm:10, blo:10, blu:10, han:5, hvy:10 },
            specials: [
                'Beserk (Fortify Health 20, Fortify Fatigue 200, Fortify Strength 50, ' +
                    'Drain Agility 100, self, duration 60, once a day)',
                'Resist Magicka (self, magnitude 25, constant)'
            ],
            image: 'orc.jpg',
            description: 'These sophisticated barbarian beast peoples of the Wrothgarian ' +
                'and Dragontail Mountains are noted for their unshakeable courage in war and ' +
                'their unflinching endurance of hardships. In the past, Orcs have been widely ' +
                'feared and hated by the other nations and races of Tamriel, but they have ' +
                'slowly won acceptance in the Empire, in particular for their distinguished ' +
                'service in the Emperor&apos;s Legions. Orcish armorers are prized for their ' +
                'craftsmanship, and Orc warriors in heavy armor are among the finest front-line ' +
                'troops in the Empire. Most Imperial citizens regard Orc society as rough and ' +
                'cruel, but there is much to admire in their fierce tribal loyalties and ' +
                'generous equality of rank and respect among the sexes.'
        },

        'Redguard': {
            attributes: {
                'Male':   { str:50, itl:30, wil:30, agi:40, spe:40, end:50, per:30, luc:50 },
                'Female': { str:40, itl:30, wil:30, agi:40, spe:40, end:50, per:40, luc:50 }
            },
            skills: { ath:10, bla:10, blu:10, lig:5, hvy:5, mer:5 },
            specials: [
                'Adrenaline Rush (Fortify Agility 50, Fortify Speed 50, Fortify Strength 50, ' +
                    'Fortify Endurance 50, Fortify Health 25, self, duration 60, once a day)',
                'Resist Poison (self, magnitude 75, constant)',
                'Resist Disease (self, magnitude 75, constant)'
            ],
            image: 'redguard.jpg',
            description: 'The most naturally talented warriors in Tamriel, the dark-skinned, ' +
                'wiry-haired Redguards of Hammerfell seem born to battle, though their pride ' +
                'and fierce independence of spirit makes them more suitable as scouts or ' +
                'skirmishers, or as free-ranging heroes and adventurers, than as rank-and-file ' +
                'soldiers. In addition to their cultural affinities for many weapon and armor ' +
                'styles, Redguards are also physically blessed with hardy constitutions and ' +
                'quickness of foot.'
        },

        'Wood Elf': {
            attributes: {
                'Male':   { str:30, itl:40, wil:30, agi:50, spe:50, end:40, per:30, luc:50 },
                'Female': { str:30, itl:40, wil:30, agi:50, spe:50, end:30, per:40, luc:50 }
            },
            skills: { acr:5, alc:10, alt:5, lig:5, mar:10, sne:10 },
            specials: [
                'Command Creature (target, magnitude 20, duration 60, once a day)',
                'Resist Disease (self, magnitude 75, constant)'
            ],
            image: 'woodelf.jpg',
            description: 'The Wood Elves are the various barbarian Elven clanfolk of the ' +
                'Western Valenwood forests. In the Empire, they are collectively referred to ' +
                'as &quot;Wood Elves&quot;, but &quot;Bosmer&quot;, or &quot;the Tree-Sap ' +
                'People&quot;, is what they call themselves. &quot;Tree-Sap&quot; suggests the ' +
                'wild vitality and youthful energy of Wood Elves, in contrast with their more ' +
                'dour cousins, the Altmer and Dunmer. Bosmer reject the stiff, formal ' +
                'traditions of Aldmeri high culture, preferring a romantic, simple existence ' +
                'in harmony with the land, its wild beauty and wild creatures. These country ' +
                'cousins of the High Elves and Dark Elves are nimble and quick in body and wit, ' +
                'and because of their curious natures and natural agility, Wood Elves are ' +
                'especially suitable as scouts, agents, and thieves. But most of all, the Wood ' +
                'Elves are known for their skills with bows; there are no finer archers in all ' +
                'of Tamriel.'
        }
    },


    // Private: Currently selected race and gender
    _race: '-none-',
    _gender: '-none-',

    // Private: Min/max limits of attributes for all races combined
    _limits: null,

    // Private: The race dialog
    _raceDialog: null,

    // Private: The current gender selection dialog opened
    _genderDialog: null,


    // Private: Gets an attribute value for a race or returns 0 if none
    _getAttr: function (race, gender, attr) {
        var attrs = this._data[race].attributes[gender];
        return (attr in attrs ? attrs[attr] : 0);
    },

    // Private: Gets a skill value for a race or returns 0 if none
    _getSkill: function (race, skill) {
        var skills = this._data[race].skills;
        return (skill in skills ? skills[skill] : 0);
    },


    // Public: getters for all data of the currently selected race and gender
    get str () { return this._getAttr(this._race, this._gender, 'str'); },
    get itl () { return this._getAttr(this._race, this._gender, 'itl'); },
    get wil () { return this._getAttr(this._race, this._gender, 'wil'); },
    get agi () { return this._getAttr(this._race, this._gender, 'agi'); },
    get spe () { return this._getAttr(this._race, this._gender, 'spe'); },
    get end () { return this._getAttr(this._race, this._gender, 'end'); },
    get per () { return this._getAttr(this._race, this._gender, 'per'); },
    get luc () { return this._getAttr(this._race, this._gender, 'luc'); },

    get hea () { return this._getAttr(this._race, this._gender, 'hea'); },
    get mag () { return this._getAttr(this._race, this._gender, 'mag'); },
    get fat () { return this._getAttr(this._race, this._gender, 'fat'); },
    get enc () { return this._getAttr(this._race, this._gender, 'enc'); },

    get bla () { return this._getSkill(this._race, 'bla'); },
    get blu () { return this._getSkill(this._race, 'blu'); },
    get han () { return this._getSkill(this._race, 'han'); },
    get alc () { return this._getSkill(this._race, 'alc'); },
    get con () { return this._getSkill(this._race, 'con'); },
    get mys () { return this._getSkill(this._race, 'mys'); },
    get alt () { return this._getSkill(this._race, 'alt'); },
    get des () { return this._getSkill(this._race, 'des'); },
    get res () { return this._getSkill(this._race, 'res'); },
    get mar () { return this._getSkill(this._race, 'mar'); },
    get sec () { return this._getSkill(this._race, 'sec'); },
    get sne () { return this._getSkill(this._race, 'sne'); },
    get acr () { return this._getSkill(this._race, 'acr'); },
    get ath () { return this._getSkill(this._race, 'ath'); },
    get lig () { return this._getSkill(this._race, 'lig'); },
    get arm () { return this._getSkill(this._race, 'arm'); },
    get blo () { return this._getSkill(this._race, 'blo'); },
    get hvy () { return this._getSkill(this._race, 'hvy'); },
    get ill () { return this._getSkill(this._race, 'ill'); },
    get mer () { return this._getSkill(this._race, 'mer'); },
    get spc () { return this._getSkill(this._race, 'spc'); },

    get specials () { return this._data[this._race].specials; },


    // Public: Returns the min/max possible value for an attribute
    // Note:   Initialize is called so ocp.initialize can call these
    attrMin: function (attr) {
        this._initializeLimits();
        return this._limits[attr].min;
    },
    attrMax: function (attr) {
        this._initializeLimits();
        return this._limits[attr].max;
    },


    // Public: Initialize
    initialize: function() {

        // Initialize our data
        this._raceDialog = dijit.byId('raceDialog');

        // Initialize the min/max limits
        this._initializeLimits();

        // Hook the race dialog to initialize it the first time it's shown
        var _this = this;
        var handle = dojo.connect(this._raceDialog, 'onShow',
            function (/* event */) {
                // From closure: _this, handle
                // Disconnect so we only do this once
                dojo.disconnect(handle);
                handle = null;
                _this._initializeDialog();
        });

        // When the race dialog is closed, hide any gender dialog
        dojo.connect(this._raceDialog, 'onCancel', function () {
            ocp.race.closeGenderDialog();
        });

        // When the current tab changes, hide any gender dialog
        dojo.subscribe('raceTabContainer-selectChild', function () {
            ocp.race.closeGenderDialog();
        });

        // Select an initial race
        this._select('Argonian', 'Male');
    },


    // Private: Initialize the min/max limits for all attributes of all races
    // Note:    This can be called multiple times, so make sure we only init once.
    _initializeLimits: function() {

        // Only init if we haven't yet
        if (!this._limits) {

            // Search through all attributes for all races and genders
            this._limits = {};
            for (var raceIndex in this._data) {
                var attributes = this._data[raceIndex].attributes;
                for (var genderIndex in attributes) {
                    var gender = attributes[genderIndex];
                    for (var attr in gender) {

                        // If this attr doesn't have limits yet, set initial ones
                        if (!(attr in this._limits)) {
                            this._limits[attr] = { min:9999, max:0 };
                        }

                        // Update the min/max as necessary
                        if (gender[attr] < this._limits[attr].min) {
                            this._limits[attr].min = gender[attr];
                        }
                        if (gender[attr] > this._limits[attr].max) {
                            this._limits[attr].max = gender[attr];
                        }
                    }
                }
            }
        }
    },


    // Private: Initialize the race dialog
    _initializeDialog: function() {
        console.debug('entered _initializeDialog');
        this._initializeOverview();
        this._initializeDetails();
    },


    // Private: Populate the overview pane with _data info
    _initializeOverview: function() {

        // Build a div for each race
        var over = '';
        for (var race in this._data) {
            over +=
                '<div class="raceOverview">' +
                    '<img src="' + this.IMAGE_DIR + this._data[race].image + '" ' +
                        'class="raceImage" alt="[' + race + ' Image]" ' +
                        'title="Select ' + race + '" ' +
                        'onClick="ocp.race.openGenderDialog(\'' + race + '\', event)" ' +
                    '/>' +
                    '<div class="raceDetails">' +
                        '<div class="raceName">' + race + '</div>' +
                        '<div class="raceDescription">' +
                            this._data[race].description +
                        '</div>' +
                        '<div class="raceListHeader">Special Abilities and Weaknesses:</div>' +
                        '<ul class="raceSpecialList">';

            var specs = this._data[race].specials;
            specs = (specs.length > 0 ? specs : [ 'No special abilities or weaknesses.' ]);
            for (var specIndex in specs) {
                over += '<li class="raceSpecialItem">' + specs[specIndex] + '</li>';
            }

            over += '</ul></div></div>';
        }

        // Insert the results
        dojo.place(over, 'raceOverviewPane', 'only');
    },


    // Private: Populate the race details with the values from _data
    _initializeDetails: function() {

        // Build a large table for all race info
        var det = '<table id="raceDetailsTable">';

        // Use column groups to apply styles dividing each column
        det += '<colgroup span="2" />';
        var firstRace = true;
        for (var race in this._data) {
//          TODO: raceData's width doesn't work here -- using th.raceName instead
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
                        'onClick="ocp.race.select(\'' + race + '\', \'' + gender + '\')" ' +
                    '>' +
                        gender.charAt(0) +
                    '</button></th>';
            }
        }

        // Complete the header and start the body
        det += '</tr></thead>';

        // First do a row for each core attribute
        det += '<tbody>';
        for (var attr in ocp.coreAttrs) {
            det += '<tr><td colspan="2">' + ocp.coreAttrs[attr].name + '</td>';
            for (var raceIndex in this._data) {
                var attributes = this._data[raceIndex].attributes;
                for (var genderIndex in attributes) {
                    var gender = attributes[genderIndex];
                    var extra = '';
                    if (attr != 'luc') {  // Luck is the same for everyone, not better/worse
                        extra = (gender[attr] > ocp.RACE_ATTR_NORM
                            ? 'better'
                            : (gender[attr] < ocp.RACE_ATTR_NORM ? 'worse' : ''));
                    }
                    det += '<td class="numeric ' + extra + '">' + gender[attr] + '</td>';
                }
            }
            det += '</tr>';
        }
        det += '</tbody>';

        // Since two races have Magicka bonuses, show a Magicka row too
        det += '<tbody><tr><td colspan="2">' + ocp.derivedAttrs.mag.name + '</td>';
        for (var raceIndex in this._data) {
            var attributes = this._data[raceIndex].attributes;
            for (var genderIndex in attributes) {
                var gender = attributes[genderIndex];
                if ('mag' in gender) {
                    det += '<td class="numeric better">' + gender.mag + '</td>';
                } else {
                    det += '<td class="numeric" />';
                }
            }
        }
        det += '</tr></tbody>';


        // Now a "divider" row indicating we are going to skills
        // For easier reading, repeat the race names
        det += '<tbody><tr class="divider"><td colspan="2">Skills</td>';
        for (var race in this._data) {
            det += '<td colspan="2">' + race + '</td>';
        }
        det += '</tr></tbody>';

        // A row for every skill.
        // Span all gender columns since skills are not gender specific
        det += '<tbody>';
        var rowEven = true;
        for (var attr in ocp.coreAttrs) {
            var firstSkill = true;
            var skills = ocp.coreAttrs[attr].skills;
            for (var skillIndex in skills) {
                var skill = skills[skillIndex];
                det += '<tr class="skill ' + (rowEven ? 'even' : 'odd') + '">';

                // The first skill means we need to create a vertical skill "header"
                if (firstSkill) {
                    det +=
                        '<td rowspan="' + skills.length + '" class="vertical" ' +
                            'title="Skills that affect ' + ocp.coreAttrs[attr].name + '"' +
                        '>' +
                            ocp.verticalize(attr) +
                        '</td>';
                }

                det += '<td>' + ocp.skills[skill].name + '</td>';
                for (var race in this._data) {
                    var skillVal = this._getSkill(race, skill);
                    det += '<td class="numeric" colspan="2">' +
                        ( skillVal > 0 ? skillVal : '' ) + '</td>';
                }
                det += '</tr>';
                firstSkill = false;
            }
            rowEven = !rowEven;
        }
        det += '</tbody>';

        // Terminate the table
        det += '</table>';

        // Insert the details and parse the inserted code for Dojo markups
        dojo.html.set(dojo.byId('raceDetailsPane'), det, { parseContent: true });
    },


    // Public: Open a gender selection dialog for the selected overview image
    openGenderDialog: function(race, event) {
        console.debug('entered openGenderDialog:', race, event);

        // Store the currently open dialog's race (if any)
        var currentRace = this._genderDialog ? this._genderDialog.race : undefined;

        // Close any currently open dialog
        this.closeGenderDialog();

        // If the new race is different from the current race, open the new dialog
        if (currentRace != race) {

            // Note that TooltipDialog's are supposed to be controlled by another widget
            // (typically a dijit.form.DropDownButton). Rather than mess with creating a
            // fake/invisible button, just work with the TooltipDialog directly.

            // Create a tooltip dialog storing our race
            var dialog = new dijit.TooltipDialog({
                race: race,
                content:
                    '<div class="raceGenderDialog">' +
                        '<div>' +
                            'Gender of your <span class="raceName">' + race + '</span> ' +
                            'character?' +
                        '</div>' +
                        '<button dojoType="dijit.form.Button" ' +
                            'type="submit" ' +
                            'title="Select Male ' + race + '" ' +
                            'onclick="ocp.race.selectGenderDialog(\'' + race +
                                '\', \'Male\')" ' +
                        '>' +
                            'Male' +
                        '</button>' +
                        '<button dojoType="dijit.form.Button" ' +
                            'type="submit" ' +
                            'title="Select Female ' + race + '" ' +
                            'onclick="ocp.race.selectGenderDialog(\'' + race +
                                '\', \'Female\')" ' +
                        '>' +
                            'Female' +
                        '</button>' +
                    '</div>'
            });

            // Initialize and prep the dialog for display
            dialog.startup();
            dijit.popup.prepare(dialog.domNode);

            // Save the current focus in the race dialog
            dialog.savedFocus = dijit.getFocus(this._raceDialog);

            // Display the dialog at the overall position the user clicked
            dijit.popup.open({
                popup: dialog,
                parent: dijit.byId('raceOverviewPane'), // Fake parent is the overview pane
                x: event.clientX,
                y: event.clientY,
                orient: 'L',
                onClose: function () {
                    console.debug('genderDialog onClose');
                },
                onCancel: function () {
                    console.debug('genderDialog onCancel');
                    ocp.race.closeGenderDialog();
                },
                onExecute: function () {
                    // This never seems to get called, but keep just in case
                    console.debug('genderDialog onExecute');
                    ocp.race.closeGenderDialog();
                }
            });

            // Store the dialog for later referencing
            this._genderDialog = dialog;
        }
    },


    // Public: Select a race and gender from the gender selection dialog and close everything
    selectGenderDialog: function(race, gender) {
        console.debug('entered selectGenderDialog:', race, gender);
        ocp.race.select(race, gender);
        this.closeGenderDialog();
        this._raceDialog.hide();
    },


    // Public: Close an open gender selection dialog (and restore focus)
    closeGenderDialog: function() {
        if (this._genderDialog) {
            console.debug('entered closeGenderDialog');
            dijit.popup.close(this._genderDialog);
            // TODO: If this got called because the user switched to the Details tab,
            // TODO: this actually sets the focus to the Overview tab -- which is wrong.
            dijit.focus(this._genderDialog.savedFocus);
            this._genderDialog.destroyRecursive();
            delete this._genderDialog;
            this._genderDialog = null;
        }
    },


    // Private: Select race/gender without error checking or notification
    _select: function(race, gender) {
        console.debug('entered _select:', gender, race);

        // Set the current race/gender
        this._race = race;
        this._gender = gender;
    },


    // Public: Validate args, select race/gender, and notify of a change
    //         Should only be called from the selection dialog
    select: function(race, gender) {
        console.debug('entered select:', gender, race);

        // Validate the selection
        if (race in this._data) {
            if (gender in this._data[race].attributes) {
                // Assign the new values
                this._select(race, gender);

                // Notify that something has changed
                ocp.notifyChanged();

                // Clear any lingering gender selection dialog (tho there shouldn't be one)
                this.closeGenderDialog();
            } else {
                var msg = 'Unknown gender "' + gender + '" selected for race "' + race + '".';
                console.error(msg);
                alert(msg);
            }
        } else {
            var msg = 'Unknown race "' + race + '" selected.';
            console.error(msg);
            alert(msg);
        }
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        this._update();
    },


    // Private: Update our generated content
    _update: function() {

        // Update selected label
        dojo.place('<span>' + this._gender + ' ' + this._race + '</span>',
            'raceValue', 'only');

        // Fill in the selected specials
        var list = '';
        var specs = this.specials;
        if (specs.length == 0) {
            list = '<span class="specialDescItem">No special abilities or weaknesses.</span>';
        } else {
            for (var specIndex in specs) {
                list += '<span class="specialDescItem">' + specs[specIndex] + '</span>';
            }
        }
        dojo.place(list, 'raceSpecials', 'only');
    }
};

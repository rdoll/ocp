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
** ocp-clazz.js
**
** Everything related to character classes.
** Note: This is named clazz (with Z's) to avoid the potential future keyword "class".
**
** All of these images were coverted to JPG from the data-mined in-game resources at
** http://www.elderstats.com/about/?p=credits
**
** Descriptions taken from http://www.uesp.net/wiki/Oblivion:Classes
*/

ocp.clazz = {

    // Private: Location of our images
    IMAGE_DIR: ocp.IMAGE_ROOT_DIR + 'class/',

    // Private: Predefined classes
    _data: {
        'Acrobat': {
            specialization: 'Stealth',
            favoredAttrs:   { agi:true, end:true },
            majorSkills:    { acr:true, bla:true, blo:true, mar:true, sec:true, sne:true, spc:true },
            image:          'acrobat.jpg',
            description:    'The kind of person that uses agility and endurance to their ' +
                'advantage. Unafraid of jumping long distances.'
        },

        'Agent': {
            specialization: 'Stealth',
            favoredAttrs:   { per:true, agi:true },
            majorSkills:    { acr:true, ill:true, mar:true, mer:true, sec:true, sne:true, spc:true },
            image:          'agent.jpg',
            description:    'Charming when they can be seen, and nearly invisible when in shadow.'
        },

        'Archer': {
            specialization: 'Combat',
            favoredAttrs:   { agi:true, str:true },
            majorSkills:    { arm:true, bla:true, blu:true, han:true, lig:true, mar:true, sne:true },
            image:          'archer.jpg',
            description:    'A marksman, adept at combat at great distances. Able to take down ' +
                'most foes before they have a chance to draw sword.'
        },

        'Assassin': {
            specialization: 'Stealth',
            favoredAttrs:   { spe:true, itl:true },
            majorSkills:    { acr:true, alc:true, bla:true, lig:true, mar:true, sec:true, sne:true },
            image:          'assassin.jpg',
            description:    'Nimble and quiet, they move in darkness to strike at the ' +
                'unsuspecting. Locks hold no doors shut for them.'
        },

        'Barbarian': {
            specialization: 'Combat',
            favoredAttrs:   { str:true, spe:true },
            majorSkills:    { arm:true, ath:true, bla:true, blo:true, blu:true, han:true, lig:true },
            image:          'barbarian.jpg',
            description:    'Fearsome brutes who inspire fear and dread in the hearts of ' +
                'their enemies. Like a storm, swift and powerful. Finding little use for ' +
                'heavy armor, they rely on smashing their foes into the ground.'
        },

        'Bard': {
            specialization: 'Stealth',
            favoredAttrs:   { per:true, itl:true },
            majorSkills:    { alc:true, bla:true, blo:true, ill:true, lig:true, mer:true, spc:true },
            image:          'bard.jpg',
            description:    'Intelligent and personable, they prefer to accomplish tasks ' +
                'with their words first, and sword second.'
        },

        'Battlemage': {
            specialization: 'Magic',
            favoredAttrs:   { str:true, itl:true },
            majorSkills:    { alc:true, alt:true, bla:true, blu:true, con:true, des:true, mys:true },
            image:          'battlemage.jpg',
            description:    'Able to resolve most conflicts with either spell or sword. ' +
                'They are a deadly mix of scholar and soldier.'
        },

        'Crusader': {
            specialization: 'Combat',
            favoredAttrs:   { str:true, wil:true },
            majorSkills:    { ath:true, bla:true, blu:true, des:true, han:true, hvy:true, res:true },
            image:          'crusader.jpg',
            description:    'A combatant who wields the power of brute strength and ' +
                'medicinal knowledge. Cheating death after every fight, they rely on ' +
                'their keen knowledge of restoration to fight yet again.'
        },

        'Healer': {
            specialization: 'Magic',
            favoredAttrs:   { per:true, wil:true },
            majorSkills:    { alc:true, alt:true, des:true, ill:true, mer:true, res:true, spc:true },
            image:          'healer.jpg',
            description:    'Fighters of poison and illness. The ancient art of ' +
                'restoration is their ally, and the deadly art of destruction is their weapon.'
        },

        'Knight': {
            specialization: 'Combat',
            favoredAttrs:   { str:true, per:true },
            majorSkills:    { bla:true, blo:true, blu:true, han:true, hvy:true, ill:true, spc:true },
            image:          'knight.jpg',
            description:    'The most noble of all combatants. Strong in body and in character.'
        },

        'Mage': {
            specialization: 'Magic',
            favoredAttrs:   { itl:true, wil:true },
            majorSkills:    { alc:true, alt:true, con:true, des:true, ill:true, mys:true, res:true },
            image:          'mage.jpg',
            description:    'Prefering to use their extensive knowledge of all things ' +
                'magical, they wield a might more powerful than the sharpest blade.'
        },

        'Monk': {
            specialization: 'Stealth',
            favoredAttrs:   { agi:true, wil:true },
            majorSkills:    { acr:true, alt:true, ath:true, han:true, mar:true, sec:true, sne:true },
            image:          'monk.jpg',
            description:    'Quick and cunning with the empty hand, they are strong in ' +
                'spirit. They prefer to solve conflict by arrow or by fist.'
        },

        'Nightblade': {
            specialization: 'Magic',
            favoredAttrs:   { wil:true, spe:true },
            majorSkills:    { acr:true, alt:true, ath:true, bla:true, des:true, lig:true, res:true },
            image:          'nightblade.jpg',
            description:    'Spell and shadow are their friends. By darkness they move ' +
                'with haste, casting magic to benefit their circumstances.'
        },

        'Pilgrim': {
            specialization: 'Stealth',
            favoredAttrs:   { per:true, end:true },
            majorSkills:    { arm:true, blo:true, blu:true, lig:true, mer:true, sec:true, spc:true },
            image:          'pilgrim.jpg',
            description:    'Hearty folk, well-versed in the tomes of old. They profit ' +
                'in life by bartering in the market, or by persuading the weak-minded.'
        },

        'Rogue': {
            specialization: 'Combat',
            favoredAttrs:   { spe:true, per:true },
            majorSkills:    { alc:true, ath:true, bla:true, blo:true, ill:true, lig:true, mer:true },
            image:          'rogue.jpg',
            description:    'They use speed in combat rather than brute force. ' +
                'Persuasive in conversation, their tongues are as sharp as blades.'
        },

        'Scout': {
            specialization: 'Combat',
            favoredAttrs:   { spe:true, end:true },
            majorSkills:    { acr:true, alc:true, arm:true, ath:true, bla:true, blo:true, lig:true },
            image:          'scout.jpg',
            description:    'Preferring the rolling countryside to the city life, ' +
                'they are gifted with the ability to evade, guard and protect ' +
                'themselves with great proficiency.'
        },

        'Sorcerer': {
            specialization: 'Magic',
            favoredAttrs:   { itl:true, end:true },
            majorSkills:    { alc:true, alt:true, con:true, des:true, hvy:true, mys:true, res:true },
            image:          'sorcerer.jpg',
            description:    'Besting the most well-equipped fighters, they rely on ' +
                'the spells of the mystic arts. Unique to these mages is the bodily ' +
                'stamina to be armed with the thickest armor.'
        },

        'Spellsword': {
            specialization: 'Magic',
            favoredAttrs:   { wil:true, end:true },
            majorSkills:    { alt:true, bla:true, blo:true, des:true, hvy:true, ill:true, res:true },
            image:          'spellsword.jpg',
            description:    'More nimble and athletic than the sorcerer, and better ' +
                'suited for spell-casting than the knight, their attacks are unpredictable. ' +
                'Students of combat and magic.'
        },

        'Thief': {
            specialization: 'Stealth',
            favoredAttrs:   { spe:true, agi:true },
            majorSkills:    { acr:true, lig:true, mar:true, mer:true, sec:true, sne:true, spc:true },
            image:          'thief.jpg',
            description:    'Profiting from the losses of others is their love. Able to be ' +
                'swift in shadow, and crafty in bartering. Locks are enemies, and lock-picks ' +
                'are their swords.'
        },

        'Warrior': {
            specialization: 'Combat',
            favoredAttrs:   { str:true, end:true },
            majorSkills:    { arm:true, ath:true, bla:true, blo:true, blu:true, han:true, hvy:true },
            image:          'warrior.jpg',
            description:    'Unafraid of light weaponry, they plow into the fray with ' +
                'little regard for injury. Masters of all melee tools, they put little faith ' +
                'in the magical arts.'
        },

        'Witchhunter': {
            specialization: 'Magic',
            favoredAttrs:   { itl:true, agi:true },
            majorSkills:    { alc:true, ath:true, con:true, des:true, mar:true, mys:true, sec:true },
            image:          'witchhunter.jpg',
            description:    'Swift on foot, and clever with spells, they use distance ' +
                'as their ally. Slower adversaries are fodder for their arrows.'
        }
    },


    // Private: Currently selected predefined class
    _predefined: '',

    // Private: Currently selected custom class info
    //          When _custom is true, this data supercedes _predefined
    _custom: false,
    _customData: {
        specialization: '',
        favoredAttrs: {},
        majorSkills: {},
    },


    // Public: A child helper object to encapsulate everything for our dialog
    classDialog: null,


    // Private: Returns a reference to the data for the current class
    _getCurrent: function () {
        return (this._custom ? this._customData : this._data[this._predefined]);
    },

    // Private: Return the value of a favored attr
    //          Favorites get a 5 point bonus, others get 0
    _getAttr: function (attr) {
        return (this._getCurrent().favoredAttrs[attr] ? ocp.ATTR_BONUS_FAV : 0);
    },

    // Private: Get the major/minor base value for a skill
    //          Major skills start at 25 and minor skills at 5
    _getSkillBase: function (skill) {
        return (this.isMajor(skill) ? ocp.SKILL_MAJOR_MIN : ocp.SKILL_MIN);
    },

    // Private: Get the skill specialization value for a skill
    //          Specialized skills get 5 bonus points, others get 0
    // Note:    The game says it's a +10 bonus, but it's actually +5
    _getSkillSpec: function (skill) {
        return (this._getCurrent().specialization == ocp.skills[skill].spec
            ? ocp.SKILL_BONUS_SPEC : 0);
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

    get str () { return this._getAttr('str'); },
    get itl () { return this._getAttr('itl'); },
    get wil () { return this._getAttr('wil'); },
    get agi () { return this._getAttr('agi'); },
    get spe () { return this._getAttr('spe'); },
    get end () { return this._getAttr('end'); },
    get per () { return this._getAttr('per'); },
    get luc () { return this._getAttr('luc'); },

    get bla () { return this._getSkill('bla'); },
    get blu () { return this._getSkill('blu'); },
    get han () { return this._getSkill('han'); },
    get alc () { return this._getSkill('alc'); },
    get con () { return this._getSkill('con'); },
    get mys () { return this._getSkill('mys'); },
    get alt () { return this._getSkill('alt'); },
    get des () { return this._getSkill('des'); },
    get res () { return this._getSkill('res'); },
    get mar () { return this._getSkill('mar'); },
    get sec () { return this._getSkill('sec'); },
    get sne () { return this._getSkill('sne'); },
    get acr () { return this._getSkill('acr'); },
    get ath () { return this._getSkill('ath'); },
    get lig () { return this._getSkill('lig'); },
    get arm () { return this._getSkill('arm'); },
    get blo () { return this._getSkill('blo'); },
    get hvy () { return this._getSkill('hvy'); },
    get ill () { return this._getSkill('ill'); },
    get mer () { return this._getSkill('mer'); },
    get spc () { return this._getSkill('spc'); },


    // Public: Returns if a given skill is a major skill for the current class
    isMajor: function (skill) {
        return (this._getCurrent().majorSkills[skill] ? true : false);
    },

    // Public: Return the base and specialization values of each skill
    skillBase: function (skill) { return this._getSkillBase(skill); },
    skillSpec: function (skill) { return this._getSkillSpec(skill); },


    // Public: Initialize
    initialize: function() {
        // Initialize our data
        this._initializeCustomData();

        // Initialize our children
        this.classDialog.initialize();

        // Select an initial predefined class
        this._selectPredefined('Acrobat');
    },


    // Private: Initialize the custom data
    // Note:    No particular rhyme or reason behind the default values used
    _initializeCustomData: function() {

        var data = this._customData;

        // Pick the first specialization
        for (var spec in ocp.specs) {
            data.specialization = spec;
            break;
        }

        // Pick favored attrs from the list
        var favCount = 0;
        for (var attr in ocp.coreAttrs) {
            data.favoredAttrs[attr] = true;
            if (++favCount >= ocp.CLASS_FAV_ATTR_NUM) {
                break;
            }
        }

        // There's no real method to pick initial major skills, so just go through the skills
        // per spec until we reach the number we need (which should be all for the first spec).
        var majorsCount = 0;
        for (var spec in ocp.specs) {
            var skills = ocp.specs[spec].skills;
            for (var skillIndex in skills) {
                data.majorSkills[skills[skillIndex]] = true;
                if (++majorsCount >= ocp.MAJOR_NUM) {
                    return;
                }
            }
        }
    },


    // Private: Select predefined class without error checking or notification
    _selectPredefined: function (predefined) {
        console.debug('entered _selectPredefined:', predefined);

        // Set the current class
        this._custom = false;
        this._predefined = predefined;
    },


    // Public: Validate args, select predefined class, and notify of a change
    //         Should only be called from the selection dialog
    selectPredefined: function (predefined) {
        console.debug('entered selectPredefined:', predefined);

        // Validate the selection
        if (predefined in this._data) {
            // Assign the new value
            this._selectPredefined(predefined);

            // Notify that something has changed
            ocp.notifyChanged();

            // Close the dialog
            this.classDialog._dialog.hide();
        } else {
            var msg = 'Unknown predefined class "' + predefined + '" selected.';
            console.error(msg);
            alert(msg);
        }
    },


    // Public: Select a custom class without error checking or notification
    _selectCustom: function (spec, favs, majors) {
        console.debug('entered _selectCustom:', spec, favs, majors);

        // Store the new custom data and mark custom as active
        this._custom = true;
        delete this._customData.specialization;
        this._customData.specialization = spec,
        delete this._customData.favoredAttrs;
        this._customData.favoredAttrs = favs;
        delete this._customData.majorSkills;
        this._customData.majorSkills = majors;
    },


    // Public: Validate args, select custom class, and notify of a change
    //         Should only be called from the selection dialog
    selectCustom: function (spec, favs, majors) {
        console.debug('entered selectCustom:', spec, favs, majors);

        // TODO: Add validation here?

        // Assign the new value
        this._selectCustom(spec, favs, majors);

        // Notify that something has changed
        ocp.notifyChanged();
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        this._update();
    },


    // Private: Update our generated content
    _update: function() {

        // Update selected label
        dojo.place('<span>' + (this._custom ? 'Custom' : this._predefined) + '</span>',
            'classValue', 'only');

        // Fill in the selected details
        var det =
            '<span class="specialDescItem">Specialization: ' + this.spec + '</span>' +
            '<span class="specialDescItem">Favored Attributes: ' +
                ocp.prettyAttrList(this.favs, 'and') +
            '</span>' +
            '<span class="specialDescItem">Major Skills: ' +
                ocp.prettySkillList(this.majors, 'and') +
            '</span>';
        dojo.place(det, 'classDetails', 'only');
    }
};


/*
** The class dialog's helper object.
** As a helper, this may access private data/methods in ocp.clazz.
**
** Note: It seems like it'd be useful to have a form here for validation.
**       Unfortanately, this doesn't work well for two reasons:
**
**       1) The form doesn't know how to validate "that 8 majors are checked".
**          We could override the behavior to do this checking, but it gets
**          messy when you do undos and resets.
**
**       2) The form's validation is "valid" or "invalid". The form relies on
**          its input contents to provide feedback when they are invalid.
**          It doesn't make much sense to mark all major checkboxes invalid
**          when you don't have exactly 8, so a message is used instead.
*/
ocp.clazz.classDialog = {

    // Private: To prevent duplicate lookups, store references to the entities we manage
    _dialog: null,
    _submitButton: null,
    _validityMsgNode: null,
    _favCheckbox: {},
    _specRadio: {},
    _majorCheckbox: {},
    _majorLabel: {},

    // Private: Whether the dialog has been initialized
    _dialogInitialized: false,

    // Private: The function currently connected to the fade out animation
    _fadeOutHook: undefined,

    // Private: Denotes if doing multiple input changes (a-la an undo or reset)
    _doingManyChanges: false,

    // Private: Denotes if our inputs are all valid
    _isValid: false,


    // Public: Initialize ourselves
    initialize: function() {

        // Find the entities we manage
        this._dialog = dijit.byId('classDialog');
        this._submitButton = dijit.byId('classDialogSubmit');
        this._validityMsgNode = dojo.byId('classDialogValidity');

        // Trap when the dialog is shown. It does more, but the first
        // time it is shown, it will initialize itself.
        dojo.connect(this._dialog, 'onShow', this, 'onShow');
    },


    // Private: Initialize the dialog
    _initializeDialog: function() {
        console.debug('entered classDialog._initializeDialog');
        this._initializeOverview();
        this._initializeDetails();
        this._initializeCustom();
    },


    // Private: Initialize the predefined classes overview tab
    _initializeOverview: function() {

        // Build a div for each predefined class
        // TODO: Put two per row (one left and one right) like birthsigns?
        var over = '';
        for (var clazz in ocp.clazz._data) {
            var data = ocp.clazz._data[clazz];
            over +=
                '<div class="classOverview">' +
                    '<img src="' + ocp.clazz.IMAGE_DIR + data.image + '" ' +
                        'class="classImage" alt="[' + clazz + ' Image]" ' +
                        'title="Select ' + clazz + '" ' +
                        'onClick="ocp.clazz.selectPredefined(\'' + clazz + '\')" ' +
                    '/>' +
                    '<div class="classDetails">' +
                        '<div class="className">' + clazz + '</div>' +
                        '<div class="classDescription">' + data.description + '</div>' +
                        '<div>' +
                            '<span class="classStatName">Specialization:</span>' +
                            '<span class="classStatValue">' + data.specialization + '</span>' +
                        '</div>' +
                        '<div>' +
                            '<span class="classStatName">Favored Attributes:</span>' +
                            '<span class="classStatValue">' +
                                ocp.prettyAttrList(data.favoredAttrs, 'and') +
                            '</span>' +
                        '</div>' +
                        '<div>' +
                            '<span class="classStatName">Major Skills:</span>' +
                            '<span class="classStatValue">' +
                                ocp.prettySkillList(data.majorSkills, 'and') +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

        // Insert the results
        dojo.place(over, 'classOverviewPane', 'only');
    },


    // Private: Initialize the predefined classes details tab
    _initializeDetails: function() {

        // Start the details table with its header columns
        var det =
            '<table id="classDetailsTable">' +
                '<colgroup />' +
                '<colgroup span="8" />' +
                '<colgroup span="3" class="firstMajor" />' +
                '<colgroup span="3" class="first" />' +
                '<colgroup span="3" class="first" />' +
                '<colgroup span="3" class="first" />' +
                '<colgroup span="3" class="first" />' +
                '<colgroup span="3" class="first" />' +
                '<colgroup span="3" class="first" />' +
            '<thead>' +
                '<tr>' +
                    '<th></th>' +
                    '<th colspan="8">Attributes</th>' +
                    '<th colspan="21">Skills</th>' +
                '</tr>' +
                '<tr class="last">' +
                    '<th>Class</th>';

        // Add a vertical header for each core attribute
        for (var attr in ocp.coreAttrs) {
            det +=
                '<th class="vertical" title="' + ocp.coreAttrs[attr].name + ' core attribute">' +
                    ocp.verticalize(attr) +
                '</th>';
        }

        // Add a vertical header for each skill
        for (var skill in ocp.skills) {
            det +=
                '<th class="vertical" title="' + ocp.skills[skill].name + ' skill">' +
                    ocp.verticalize(skill) +
                '</th>';
        }

        // Complete the header and start the body
        det += '</tr></thead><tbody>';

        // Render one row per class
        var rowCount = 0;
        for (var clazz in ocp.clazz._data) {
            var data = ocp.clazz._data[clazz];

            // Start the row
            det +=
                '<tr class="' + (rowCount++ % 6 < 3 ? 'even' : 'odd') + '">' +
                    '<td>' +
                        // TODO: Clean up the look of this -- it doesn't match the rest of the UI
                        '<a href="javascript:ocp.clazz.selectPredefined(\'' + clazz + '\')" ' +
                            'title="Select ' + clazz + '">' +
                            clazz +
                        '</a>' +
                    '</td>';

            // For each attribute, list a bonus or nothing
            // TODO: Could use a check mark or other icon here instead?
            for (var attr in ocp.coreAttrs) {
                var bonus = (data.favoredAttrs[attr] ? ocp.ATTR_BONUS_FAV : 0);
                det +=
                    '<td class="numeric' + (bonus > 0 ? ' bonus' : '') + '">' +
                        (bonus > 0 ? bonus : '' )+
                    '</td>';
            }

            // For each skill, list a bonus or nothing
            for (var skill in ocp.skills) {
                var isMajor = (data.majorSkills[skill] ? true : false);
                var majorBonus = (isMajor ? ocp.SKILL_BONUS_MAJOR : 0);
                var specBonus = (dojo.indexOf(ocp.specs[data.specialization].skills, skill) == -1
                    ? 0 : ocp.SKILL_BONUS_SPEC);
                var bonus = majorBonus + specBonus;
                det +=
                    '<td class="numeric' + (bonus > 0 ? ' bonus' : '') +
                        (isMajor ? ' majorSkill' : '') + '"' +
                    '>' +
                        // Add skill min so values shown are what you get with this class
                        (bonus > 0 ? bonus + ocp.SKILL_MIN : '' ) +
                    '</td>';
            }

            det += '</tr>';
        }

        // Complete the table and insert the results
        det += '</tbody></table>';
        dojo.place(det, 'classDetailsPane', 'only');
    },


    // Private: Initialize the custom class tab
    _initializeCustom: function() {

        // Hook into events that manipulate this dialog
        dojo.connect(this._dialog, 'onExecute', this, 'submit');
        dojo.connect(this._dialog, 'onSubmit', this, 'submit');
        dojo.connect(this._dialog, 'onCancel', this, 'cancel');

        // Current custom data (so we can set defaualts)
        var customData = ocp.clazz._customData;

        // Initialize the specialization
        var cus = '<div class="customInputHeader">Specialization:</div>';
        for (var spec in ocp.specs) {
            var isSpec = (customData.specialization == spec ? true : false);
            var inputId = 'specRadio_' + spec;
            cus +=
                '<input dojoType="dijit.form.RadioButton" type="radio" ' +
                    'id="' + inputId + '" class="customInputSpec"' +
                    (isSpec ? 'checked="checked" ' : '') +
                    'onChange="ocp.clazz.classDialog.specRadioChanged(\'' + spec + '\')" ' +
                 '/>' +
                 '<label class="classSpecLabel" for="' + inputId + '">' + spec + '</label>';
        }

        // Insert the results (parsing the code for Dojo markups)
        dojo.html.set(dojo.byId('classSpecContainer'), cus, { parseContent: true });

        // Now that they are all created, store references to all spec radio buttons
        for (var spec in ocp.specs) {
            this._specRadio[spec] = dijit.byId('specRadio_' + spec);
        }


        // Initialize the favored attributes
        var cus = '<div class="customInputHeader">Favored Attributes:</div>';
        for (var attr in ocp.coreAttrs) {
            var isFav = (customData.favoredAttrs[attr] ? true : false);
            var inputId = 'favCheck_' + attr;
            cus +=
                '<input dojoType="dijit.form.CheckBox" type="checkbox" ' +
                    'id="' + inputId + '" class="customInputFav" ' +
                    (isFav ? 'checked="checked" ' : '') +
                    'onChange="ocp.clazz.classDialog.favCheckboxChanged(\'' + attr + '\')" ' +
                 '/>' +
                 '<label for="' + inputId + '">' + ocp.coreAttrs[attr].name + '</label>';
        }

        // Insert the results (parsing the code for Dojo markups)
        dojo.html.set(dojo.byId('classFavAttrsContainer'), cus, { parseContent: true });

        // Now that they are all created, store references to all fav attr checkboxes
        for (var attr in ocp.coreAttrs) {
            this._favCheckbox[attr] = dijit.byId('favCheck_' + attr);
        }


        // Initialize the major skills
        var cus =
            '<div class="customInputHeader">Major Skills:</div>' +
            '<div class="customInputFootnote">' +
                'Note: Skills for the selected specialization are ' +
                '<span class="skillIsSpecialized">highlighted</span>.' +
            '</div>';

        // Since the specialization is shown by italics, group the skills by attribute
        for (var attr in ocp.coreAttrs) {
            var coreAttr = ocp.coreAttrs[attr];

            // Only show attributes that have skills
            if (coreAttr.skills.length > 0) {

                // Build a table of all skills for this attribute
                cus += '<div class="customMajorInputs">' +
                    '<table>' +
                    '<thead>' +
                        '<tr>' +
                            '<th class="majorAttrHeader">' + coreAttr.name + ' Skills</th>' +
                            '<th class="majorCheckHeader">Major?</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>';

                // Build a row for each skill
                for (var skillIndex in coreAttr.skills) {
                    var skill = coreAttr.skills[skillIndex];
                    var isMajor = (customData.majorSkills[skill] ? true : false);
                    var inputId = 'classMajorCheck_' + skill;
                    cus +=
                        '<tr>' +
                            '<td>' +
                                '<label for="' + inputId + '" id="' + inputId + '_label">' +
                                    ocp.skills[skill].name +
                                '</label>' +
                            '</td>' +
                            '<td class="majorCheckContainer">' +
                                '<input dojoType="dijit.form.CheckBox" type="checkbox" ' +
                                    'id="' + inputId + '" ' +
                                    (isMajor ? 'checked="checked" ' : '') +
                                    'onChange="ocp.clazz.classDialog.majorCheckboxChanged(\'' +
                                        skill + '\')" ' +
                                '/>' +
                            '</td>' +
                        '</tr>';
                }
                cus += '</tbody></table></div>';
            }
        }

        // Insert the results (parsing the code for Dojo markups)
        dojo.html.set(dojo.byId('classSkillContainer'), cus, { parseContent: true });

        // Now that they are all created, store references to all major checkboxes and labels
        for (var skill in ocp.skills) {
            this._majorCheckbox[skill] = dijit.byId('classMajorCheck_' + skill);
            this._majorLabel[skill] = dojo.byId('classMajorCheck_' + skill + '_label');
        }

        // Pretend that the value of the currently selected specialization changed
        // so the appropriate styles can be applied to the major skill labels
        this.specRadioChanged(customData.specialization);


        // With everything created, set an initial validity
        this._updateValidity();
    },


    // Private: Update the dialog to reflect our current validity
    _updateValidity: function() {

        // If we're doing many changes, updating the validity over and over again gets expensive.
        // Instead, do nothing and wait until the big operation is done.
        if (!this._doingManyChanges) {

            // No need to validate specialization since they are radio buttons

            // Count the number of favorite attribute checkboxes checked
            var favAttrsChecked = 0;
            for (var attr in ocp.coreAttrs) {
                if (this._favCheckbox[attr].checked) {
                    favAttrsChecked++;
                }
            }

            // Count the number of major skill checkboxes checked
            var majorsChecked = 0;
            for (var skill in ocp.skills) {
                if (this._majorCheckbox[skill].checked) {
                    majorsChecked++;
                }
            }

            // Assume we are valid and start building the validity message
            var isValid = true;
            var msg = '';

            // If we don't have exactly the required number of favored attributes,
            // tell the user and mark invalid
            if (favAttrsChecked != ocp.CLASS_FAV_ATTR_NUM) {
                msg +=
                    '<div class="dialogStatusInvalid">' +
                        'You must have exactly ' + ocp.CLASS_FAV_ATTR_NUM +
                        ' favored attributes (' + favAttrsChecked +
                        (favAttrsChecked == 1 ? ' is' : ' are') + ' checked).' +
                    '</div>';
                isValid = false;
            }

            // If we don't have exactly the required number of major skills,
            // tell the user and mark invalid
            if (majorsChecked != ocp.MAJOR_NUM) {
                msg +=
                    '<div class="dialogStatusInvalid">' +
                        'You must have exactly ' + ocp.MAJOR_NUM + ' major skills (' +
                        majorsChecked + (majorsChecked == 1 ? ' is' : ' are') + ' checked).' +
                    '</div>';
                isValid = false;
            }

            // If we are still valid, tell the user all is well
            if (isValid) {
                msg = '<div class="dialogStatusValid">All custom class settings are valid.</div>';
                // TODO: Add a warning if all skills for an attribute are marked as major?
            }

            // Enable/disable the submit button based on our validity
            this._submitButton.attr('disabled', !isValid);

            // Display the validity message
            dojo.place(msg, this._validityMsgNode, 'only');

            // Lastly, store the validity status
            this._isValid = isValid;
            //console.debug('exiting classDialog._updateValidity', this._isValid);
        }
    },


    // Public: A specialization radio button changed
    specRadioChanged: function (spec) {
        var selected = this._specRadio[spec].checked;
        console.debug('entered classDialog.specRadioChanged', spec, selected);

        // For the skills affected, add or remove the "is specialized" class
        var skills = ocp.specs[spec].skills;
        for (var skillIndex in skills) {
            var skill = skills[skillIndex];
            if (selected) {
                dojo.addClass(this._majorLabel[skill], 'skillIsSpecialized');
            } else {
                dojo.removeClass(this._majorLabel[skill], 'skillIsSpecialized');
            }
        }

        // There is no need to update validity since radio buttons must always be valid
    },


    // Public: A favored attribute checkbox changed
    favCheckboxChanged: function (attr) {
        console.debug('entered classDialog.favCheckboxChanged', attr);

        // Nothing special to do, just update our validity
        this._updateValidity();
    },


    // Public: A major skill checkbox changed
    majorCheckboxChanged: function (skill) {
        console.debug('entered classDialog.majorCheckboxChanged', skill);

        // Nothing special to do, just update our validity
        this._updateValidity();
    },


    // Public: Submit and use the dialog's values
    //         Returns true/false for success/failure
    submit: function (event) {
        console.debug('entered classDialog.submit');

        // It should be impossible to get here while invalid (because the
        // button should be disabled), but just in case, check validity again
        this._updateValidity();
        if (this._isValid) {

            // Gather the favored attributes
            var favs = {};
            for (var attr in ocp.coreAttrs) {
                if (this._favCheckbox[attr].checked) {
                    favs[attr] = true;
                }
            }

            // Determine the specialization based on which is checked
            var newSpec;
            for (var spec in ocp.specs) {
                if (this._specRadio[spec].checked) {
                    newSpec = spec;
                    break;
                }
            }

            // Gather the major skills
            var majors = {};
            for (var skill in ocp.skills) {
                if (this._majorCheckbox[skill].checked) {
                    majors[skill] = true;
                }
            }

            // Select this custom class (which does the notification for us)
            ocp.clazz.selectCustom(newSpec, favs, majors);
            return true;
        } else {

            // Erm... This should never happen...
            // Gracefully tell the user something is invalid and inhibit the submission.
            console.warn('Cannot submit class dialog with invalid data!');
            alert('Cannot submit changes until exactly ' + ocp.CLASS_FAV_ATTR_NUM +
                ' favored attributes and ' + ocp.MAJOR_NUM + ' major skills are selected.');
            return false;
        }
    },


    // Public: Revert all dialog values to our current values
    undo: function() {
        console.debug('entered classDialog.undo');

        // Note that we are doing multiple changes
        this._doingManyChanges = true;

        // Set all inputs to our current values
        var customData = ocp.clazz._customData;
        for (var attr in ocp.coreAttrs) {
            this._favCheckbox[attr].attr('value',
                (customData.favoredAttrs[attr] ? true : false));
        }
        for (var spec in ocp.specs) {
            this._specRadio[spec].attr('value',
                (customData.specialization == spec ? true : false));
        }
        for (var skill in ocp.skills) {
            this._majorCheckbox[skill].attr('value',
                (customData.majorSkills[skill] ? true : false));
        }

        // Done with the many changes, so update validity
        this._doingManyChanges = false;
        this._updateValidity();
    },


    // Public: Reset everything to initial values
    reset: function() {
        console.debug('entered classDialog.reset');

        // Note that we are doing multiple changes
        this._doingManyChanges = true;

        // Reset all inputs to starting values
        for (var attr in ocp.coreAttrs) {
            this._favCheckbox[attr].reset();
        }
        for (var spec in ocp.specs) {
            this._specRadio[spec].reset();
        }
        for (var skill in ocp.skills) {
            this._majorCheckbox[skill].reset();
        }

        // Done with the many changes, so update validity
        this._doingManyChanges = false;
        this._updateValidity();
    },


    // Public: Called whenever our dialog is shown
    onShow: function() {
        //console.debug('entered classDialog.onShow');

        // If this is the first time the dialog is shown, initialize it
        if (!this._dialogInitialized) {
            this._dialogInitialized = true;
            this._initializeDialog();
        }

        // If a fade out hook never fired (because the dialog was shown before
        // the fade out animation ended), fire it now
        // The hook disconnects itself and resets the value of _fadeOutHook
        if (this._fadeOutHook) {
            this._fadeOutHook();
        }
    },


    // Public: Cancel all changes and close the dialog
    //         To prevent the browser from rendering the "undo" changes,
    //         do the "undo" when the dialog is not visible
    cancel: function() {
        console.debug('entered classDialog.cancel');

        // Hiding the dialog really means starting its fade out animation
        this._dialog.hide();

        // Define locals for use inside closures
        var _this = this;
        var handle = null;

        // When the fade out animation ends, safely disconnect and then undo all changes
        // Setting this as our fade out hook enables it to be called by onShow in the
        // unlikely event that the user was able to call the dialog's show (which does a
        // fade out stop -- which doesn't call onEnd) before the fade out animation ended.
        this._fadeOutHook = function() {
            //console.debug('in fadeOutHook');
            // From closure: _this, handle
            dojo.disconnect(handle);
            handle = null;
            _this._fadeOutHook = undefined;
            dojo.hitch(_this, 'undo')();
        }

        // When the fade out animation ends, run the hook
        handle = dojo.connect(this._dialog._fadeOut, 'onEnd', this._fadeOutHook);

        // Since I couldn't make this happen via the standard UI (which probably
        // indicates this should never happen -- but be safe and do it anyway),
        // I used this to force a show before the fade out animation could end.
        //this._dialog.show();
    }
};

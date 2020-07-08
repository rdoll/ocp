/*
** (C) Copyright 2009 by Richard Doll
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
** ocp-nullis.js
**
** Everything related to my own Oblivion character Nullis.
**
** Note: Everything here is provided as a just-for-fun hack.
*/

ocp.nullis = {

    // Public: Set starting details for my toon Nullis
    setNullisStart: function () {
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

        ocp.input.isNewChar = true;
        ocp.notifyChanged();
    },


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

        totals[10] = nextLevel(totals[totals.length - 1], {
            agi:5, spe:5, end:5, hea:18, mag:0, fat:10, enc:0,
            bla:1, blu:-1, mar:7, sec:3, sne:12, acr:4, ath:3, lig:3, arm:10, mer:3, spc:3
        });
        wasted[10] = { bla:'', blu:'Skill reduced from being imprisoned.', mer:'', spc:'' };

        totals[11] = nextLevel(totals[totals.length - 1], {
            spe:5, end:5, luc:1, hea:18, mag:0, fat:5, enc:0,
            bla:3, res:1, mar:8, sec:11, sne:20, acr:7, ath:2, lig:5, arm:8, blo:2, mer:4, spc:2
        });
        wasted[11] = { bla:'', res:'', mer:'', spc:'' };

        var maxLevel = totals.length - 1;

        for (var level = 1; level <= maxLevel; level++) {
            for (var skill in wasted[level]) {
                var attr = ocp.skills[skill].attr;
                if (wasted[level][skill].length < 1) {
                    wasted[level][skill] = 'Skill ups were wasted because ' +
                        ocp.coreAttrs[attr].name + ' was not leveled.';
                }
            }
        }

        dijit.byId('levelSlider').attr('value', maxLevel);
        delete ocp.existing._totals;
        ocp.existing._totals = totals[maxLevel];
        delete ocp.existing._majors;
        ocp.existing._majors = [];
        var classMajors = ocp.cclass.majors;
        for (var skillIndex in classMajors) {
            ocp.existing._majors.push(classMajors[skillIndex]);
        }
        if (ocp.existing.attrDialog._dialog._alreadyInitialized) {
            ocp.existing.attrDialog.undo();
        }
        if (ocp.existing.skillDialog._dialogInitialized) {
            ocp.existing.skillDialog.undo();
        }

        ocp.input.isNewChar = false;
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
    },


    // Public: Safely set info for my toon Nullis after planner is loaded
    safeSetStart: function () {
        ocp.loader.runAfterLoaded('plannerContentPane', dojo.hitch(this, 'setNullisStart'));
    },
    safeSetNow: function () {
        ocp.loader.runAfterLoaded('plannerContentPane', dojo.hitch(this, 'setNullisNow'));
    }
};
/*
** ocp-results.js
**
** Most things related to displaying the results.
*/

ocp.results = {

    // Public: Initialize ourselves
    initialize: function() {
        // Nothing to initialize
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        this._update();
    },


    // Private: Update any generated content
    _update: function() {
        this._updateStartingAttrs();
        this._updateStartingSkills();
        this._updateLeveling();
        this._updateAnalysis();
    },


    // Private: Update the results starting attribute table
    _updateStartingAttrs: function() {

        // The starting level's totals
        var totals = ocp.level.levelTotals(ocp.level.minLevel);

        // Start the attribute table
        var res =
            '<table>' +
                '<colgroup />' +
                '<colgroup span="4" />' +
            '<thead>' +
                '<tr class="last">' +
                    '<th>Attribute</th>' +
                    '<th title="Starting values for the selected Race and Gender.">Race</th>' +
                    '<th title="Bonuses for the selected Birthsign.">Birth</th>' +
                    '<th title="Bonuses for selected class Favored Attributes.">Fav</th>' +
                    '<th>Total</th>' +
                '</tr>' +
            '</thead>';

        // Create a row for each core attribute
        res += '<tbody>';
        for (var attr in ocp.coreAttrs) {
            res +=
                '<tr>' +
                    '<td>' + ocp.coreAttrs[attr].name + '</td>' +
                    '<td class="numeric">' + (ocp.race[attr] > 0 ? ocp.race[attr] : '') + '</td>' +
                    '<td class="numeric">' + (ocp.birth[attr] > 0 ? ocp.birth[attr] : '') + '</td>' +
                    '<td class="numeric">' + (ocp.cclass[attr] > 0 ? ocp.cclass[attr] : '') + '</td>' +
                    '<td class="numeric">' + totals[attr] + '</td>' +
                '</tr>';
        }
        res += '</tbody>';

        // Create a row for each derived attribute
        res += '<tbody>';
        for (var attr in ocp.derivedAttrs) {
            res +=
                '<tr>' +
                    '<td>' + ocp.derivedAttrs[attr].name + '</td>' +
                    '<td class="numeric">' + (ocp.race[attr] > 0 ? ocp.race[attr] : '') + '</td>' +
                    '<td class="numeric">' + (ocp.birth[attr] > 0 ? ocp.birth[attr] : '') + '</td>' +
                    '<td class="numeric" />' +
                    '<td class="numeric">' + totals[attr] + '</td>' +
                '</tr>';
        }
        res += '</tbody>';

        // Complete the table and insert it
        res += '</table>';
        dojo.place(res, 'resultsStartingAttributes', 'only');
    },


    // Private: Create the results starting skill info
    //          This allows race, class, and level to just update their values
    _updateStartingSkills: function() {

        // The starting level's totals
        var totals = ocp.level.levelTotals(ocp.level.minLevel);

        // Start the table
        var res =
            '<table>' +
                '<colgroup span="2" />' +
                '<colgroup span="4" />' +
            '<thead>' +
                '<tr class="last">' +
                    '<th colspan="2">Skill</th>' +
                    '<th title="Base skill values for the selected class: ' + ocp.SKILL_MAJOR_MIN +
                        ' for Majors and ' + ocp.SKILL_MIN + ' for Minors.">Base</th>' +
                    '<th title="Bonuses for the selected class Specialization.">Spec</th>' +
                    '<th title="Bonuses for the selected Race.">Race</th>' +
                    '<th>Total</th>' +
                '</tr>' +
            '</thead>';

        // Create a row for each skill
        for (var attr in ocp.coreAttrs) {
            if (ocp.coreAttrs[attr].skills.length > 0) {
                res += '<tbody>';
                var firstSkill = true;
                for each (var skill in ocp.coreAttrs[attr].skills) {

                    // Start the row
                    res += '<tr>';

                    // The first skill means we need to create a vertical skill "header"
                    if (firstSkill) {
                        res += '<td rowspan="' + ocp.coreAttrs[attr].skills.length +
                                '" class="vertical" title="Skills that affect ' +
                                ocp.coreAttrs[attr].name + '.">' +
                            ocp.verticalize(attr) + '</td>';
                    }

                    // Class info for this skill
                    var base = ocp.cclass.skillBase(skill);
                    var spec = ocp.cclass.skillSpec(skill);

                    // The rest of the data
                    res += '<td>' + ocp.skills[skill].name + '</td>' +
                        '<td class="numeric">' + (base > 0 ? base : '') + '</td>' +
                        '<td class="numeric">' + (spec > 0 ? spec : '') + '</td>' +
                        '<td class="numeric">' + (ocp.race[skill] > 0 ? ocp.race[skill] : '') + '</td>' +
                        '<td class="numeric">' + totals[skill] + '</td>' +
                        '</tr>';

                    firstSkill = false;
                }
                res += '</tbody>';
            }
        }

        // Complete the table and insert it
        res += '</table>';
        dojo.place(res, 'resultsStartingSkills', 'only');
    },


    // Private: Re-display all leveling details
    _updateLeveling: function () {

        // The new leveling contents
        var lev =
            '<table id="levelDetailsTable">' +
                '<colgroup />' +
                '<colgroup span="8" />' +
                '<colgroup span="4" class="first" />' +
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
                    '<th colspan="11">Attributes</th>' +
                    '<th colspan="21">Skills</th>' +
                '</tr>' +
                '<tr class="last">' +
                    '<th title="Level">Lv</th>';

        // Add a vertical header for each core attribute
        for (var attr in ocp.coreAttrs) {
            lev += '<th class="vertical" title="' + ocp.coreAttrs[attr].name + ' attribute">' +
                ocp.verticalize(attr) + '</th>';
        }

        // Add a vertical header for each derived attribute
        for (var attr in ocp.derivedAttrs) {
            lev += '<th class="vertical" title="' + ocp.derivedAttrs[attr].name + ' derived attribute">' +
                ocp.verticalize(attr) + '</th>';
        }

        // Add a vertical header for each skill
        for (var skill in ocp.skills) {
            lev += '<th class="vertical" title="' + ocp.skills[skill].name + ' skill">' +
                ocp.verticalize(skill) + '</th>';
        }

        // Complete the header and start the body
        lev += '</tr></thead><tbody>';

        // The current level's data
        // Start it with the first level's info so when it becomes
        // previous and is compared to itself, no changes will be found
        var current = ocp.level.levelTotals(ocp.level.minLevel);

        // Output each level's data, one level per row
        for (var level = ocp.level.minLevel; level <= ocp.level.maxLevel; level++) {

            // The previous level's data is what was current
            var previous = current;

            // The current data now points to this level
            current = ocp.level.levelTotals(level);

            // Anything that was less-than-optimal for this level
            var wasted = ocp.level.levelWasted(level);

            // Start the data
            lev += '<tr><td class="numeric">' + level + '</td>';

            // Core attributes first
            for (var attr in ocp.coreAttrs) {
                var styleClass = 'numeric' + (attr in wasted ? ' worse' :
                    (current[attr] != previous[attr] ? ' changed' : ''));
                lev += '<td class="' + styleClass + '"' +
                    (attr in wasted ? ' title="' + wasted[attr] + '"' : '') +
                    '>' + current[attr] + '</td>';
            }

            // Derived attributes next
            for (var attr in ocp.derivedAttrs) {
                var class = 'numeric' + (attr in wasted ? ' worse' :
                    (current[attr] != previous[attr] ? ' changed' : ''));
                lev += '<td class="' + class + '"' +
                    (attr in wasted ? ' title="' + wasted[attr] + '"' : '') +
                    '>' + current[attr] + '</td>';
            }

            // Skills last
            for (var skill in ocp.skills) {
                var class = 'numeric' + (skill in wasted ? ' worse' :
                    (current[skill] != previous[skill] ? ' changed' : '')) +
                    (ocp.cclass.isMajor(skill) ? ' major' : '');
                lev += '<td class="' + class + '"' +
                    (skill in wasted ? ' title="' + wasted[skill] + '"' : '') +
                    '>' + current[skill] + '</td>';
            }

            // Close the row
            lev += '</tr>';
        }

        // Complete the table
        lev += '</tbody></table>';

        // If there was an error during leveling, note it
        if (ocp.level.hadError) {
            // *** Move to styles if this is permanent
            lev += '<p><i><b><span style="color: red">Warning</span></b>: ' +
                'Leveling hit an error before completion.</p>';
        }

        // Add a final footnote and set it
        // *** Use styles if this is permanent
        lev += '<p><i><b>Note</b>: All leveling tries to achieve the maximum of +5 per attribute ' +
            'per level (except for Luck\'s fixed +1).</i></p>';
        dojo.place(lev, 'resultsLevelingPane', 'only');
    },


    // Private: Recalculate and re-display all analysis information
    _updateAnalysis: function () {

        /*
        ** First perform the analysis
        */

        // Store the details of the level totals
        var data = {
            // A helper function to store the attribute value
            // if it's larger than what we have already stored
            check: function (attr, newValue, level) {
                if (attr in this) {
                    if (newValue > this[attr].max) {
                        this[attr].max = newValue;
                        this[attr].level = level;
                    }
                } else {
                    this[attr] = {
                        start: newValue,
                        max: newValue,
                        level: level,
                        avail: 0,
                        used: 0,
                        spare: 0,
                        major: 0
                    };
                }
            }
        };

        // Check the attributes of every level
        for (var level = ocp.level.minLevel; level <= ocp.level.maxLevel; level++) {
            var levelTotals = ocp.level.levelTotals(level);
            for (var attr in ocp.coreAttrs) {
                data.check(attr, levelTotals[attr], level);
            }
            for (var attr in ocp.derivedAttrs) {
                data.check(attr, levelTotals[attr], level);
            }
        }

        // For skills, just compare the first and last level
        var firstTotals = ocp.level.levelTotals(ocp.level.minLevel);
        var lastTotals  = ocp.level.levelTotals(ocp.level.maxLevel);
        for (var attr in ocp.coreAttrs) {
            for each (var skill in ocp.coreAttrs[attr].skills) {
                data[attr].avail += ocp.SKILL_MAX - firstTotals[skill];
                data[attr].used += lastTotals[skill] - firstTotals[skill];
                if (ocp.cclass.isMajor(skill)) {
                    data[attr].major += ocp.SKILL_MAX - lastTotals[skill];
                }
            }
            data[attr].spare = data[attr].avail - data[attr].used;
        }

        // Using the skill data, calculate totals
        var totals = { avail:0, used:0, spare:0, major:0 };
        for (var attr in ocp.coreAttrs) {
            for (var key in totals) {
                totals[key] += data[attr][key];
            }
        }


        /*
        ** Now generate the HTML for the new analysis
        */

        // Helper function that returns the number of spare skill
        // points per level until the associated attr is leveled to max.
        // Return value is a string padded to two decimal places
        function sparePerLevel(spare, maxAtLevel) {

            // Number of levels this attr will be raised (min of 1)
            var numLevels = maxAtLevel - ocp.level.minLevel;
            numLevels = (numLevels > 0 ? numLevels : 1);

            // Pad to two decimal places
            var splv = Math.round((spare / numLevels) * 100);
            splv = splv.toString().replace(/(..)$/, '.$1');
            splv = splv.replace(/^\./, '0.');

            return splv;
        }

        // The new analysis contents (tee-hee :D)
        // Start with a table of attribute info
        var anal =
            '<table>' +
                '<colgroup />' +
                '<colgroup span="3" />' +
                '<colgroup span="3" class="first" />' +
            '<thead>' +
                '<tr>' +
                    '<th />' +
                    '<th colspan="3" />' +
                    '<th colspan="5">Skill Points</th>' +
                '</tr>' +
                '<tr class="last">' +
                    '<th>Attribute</th>' +
                    '<th title="Starting total value.">Start</th>' +
                    '<th title="Maximum achievable by leveling.">Max</th>' +
                    '<th title="Level the maximum value was achieved.">Level</th>' +
                    '<th title="Total skill points you can level up for this attribute.">Avail</th>' +
                    '<th title="Skill points required to reach the maximum value.">Used</th>' +
                    '<th title="Spare skill points not required to level this attribute.">Spare</th>' +
                    '<th title="Spare skill points that are for major skills">Sp Maj</th>' +
                    '<th title="Skill points you can waste each level (assuming this exact leveling ' +
                        'pattern).">Sp/Lv</th>' +
                '</tr>' +
            '</thead>';

        // Add the details for every core attribute
        anal += '<tbody>';
        for (var attr in ocp.coreAttrs) {
            anal +=
                '<tr>' +
                    '<td>' + ocp.coreAttrs[attr].name + '</td>' +
                    '<td class="numeric">' + data[attr].start + '</td>' +
                    '<td class="numeric' +
                        (data[attr].max < ocp.coreAttrs[attr].max ? ' worse' : '') + '">' +
                            data[attr].max +
                    '</td>' +
                    '<td class="numeric">' + data[attr].level + '</td>' +
                    '<td class="numeric">' + data[attr].avail + '</td>' +
                    '<td class="numeric">' + data[attr].used + '</td>' +
                    '<td class="numeric">' + data[attr].spare + '</td>' +
                    '<td class="numeric">' + data[attr].major + '</td>' +
                    '<td class="numeric">' +
                        sparePerLevel(data[attr].spare, data[attr].level) +
                    '</td>' +
                '</tr>';
        }
        anal += '</tbody>';

        // Add the details for every derived attribute in a new section
        anal += '<tbody>';
        for (var attr in ocp.derivedAttrs) {
            anal +=
                '<tr>' +
                    '<td>' + ocp.derivedAttrs[attr].name + '</td>' +
                    '<td class="numeric">' + data[attr].start + '</td>' +
                    '<td class="numeric">' + data[attr].max + '</td>' +
                    '<td class="numeric">' + data[attr].level + '</td>' +
                    '<td colspan="5"></td>' +
                '</tr>';
        }
        anal += '</tbody>';

        // Finally add a footer Totals row in a new section
        // Make it a tbody since it contains data and it should never repeat
        anal +=
            '<tbody>' +
                '<tr class="first">' +
                    '<th>Totals</th>' +
                    '<td colspan="2" />' +
                    '<td class="numeric">' + ocp.level.maxLevel + '</td>' +
                    '<td class="numeric">' + totals.avail + '</td>' +
                    '<td class="numeric">' + totals.used + '</td>' +
                    '<td class="numeric">' + totals.spare + '</td>' +
                    '<td class="numeric">' + totals.major + '</td>' +
                    '<td class="numeric">' +
                        sparePerLevel(totals.spare, ocp.level.maxLevel) +
                    '</td>' +
                '</tr>' +
            '</body>';

        // End the table
        anal += '</table>';

        // If there was an error during leveling, note it
        if (ocp.level.hadError) {
            // *** Move to styles if this is permanent
            anal += '<p><i><b><span style="color: red">Warning</span></b>: ' +
                'Leveling hit an error before completion, therefore this analysis is inaccurate.</p>';
        }

        // Set the content and we're done
        dojo.place(anal, 'resultsAnalysisPane', 'only');
    }
};

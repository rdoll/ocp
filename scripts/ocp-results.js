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
                    '<th title="Starting values for the selected Race.">Race</th>' +
                    '<th title="Bonuses for the selected Birthsign.">Birth</th>' +
                    '<th title="Bonuses for selected class Favored Attributes.">Fav</th>' +
                    '<th>Total</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>';

        // Create a row for each core attribute
        for (var attr in ocp.coreAttrs) {
            res += '<tr>' +
                '<td>' + ocp.coreAttrs[attr].name + '</td>' +
                '<td class="numeric">' + (ocp.race[attr] > 0 ? ocp.race[attr] : '') + '</td>' +
                '<td class="numeric">' + (ocp.birth[attr] > 0 ? ocp.birth[attr] : '') + '</td>' +
                '<td class="numeric">' + (ocp.class[attr] > 0 ? ocp.class[attr] : '') + '</td>' +
                '<td class="numeric">' + totals[attr] + '</td>' +
                '</tr>';
        }

        // Create a row for each derived attribute
        var firstAttr = true;
        for (var attr in ocp.derivedAttrs) {
            res += '<tr ' + (firstAttr ? 'class="first"' : '') + '>' +
                '<td>' + ocp.derivedAttrs[attr] + '</td>' +
                '<td class="numeric">' + (ocp.race[attr] > 0 ? ocp.race[attr] : '') + '</td>' +
                '<td class="numeric">' + (ocp.birth[attr] > 0 ? ocp.birth[attr] : '') + '</td>' +
                '<td class="numeric">' + (ocp.class[attr] > 0 ? ocp.class[attr] : '') + '</td>' +
                '<td class="numeric">' + totals[attr] + '</td>' +
                '</tr>';
            firstAttr = false;
        }

        // Complete the table and insert it
        res += '</tbody></table>';
        dojo.byId("resultsStartingAttributes").innerHTML = res;
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
                    '<th title="Base skill values for the selected class: 25 for Majors and 5 for Minors.">Base</th>' +
                    '<th title="Bonuses for the selected class Specialization.">Spec</th>' +
                    '<th title="Bonuses for the selected Race.">Race</th>' +
                    '<th>Total</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>';

        // Create a row for each skill
        var firstAttr = true;
        for (var attr in ocp.coreAttrs) {
            var firstSkill = true;
            for each (var skill in ocp.coreAttrs[attr].skills) {

                // The first skill marks a section unless this is the first attr
                res += '<tr ' + (firstSkill && !firstAttr ? 'class="first"' : '') + '>';

                // The first skill means we need to create a vertical skill "header"
                if (firstSkill) {
                    res += '<td rowspan="' + ocp.coreAttrs[attr].skills.length +
                            '" class="vertical" title="Skills that affect ' +
                            ocp.coreAttrs[attr].name + '.">' +
                        ocp.verticalize(attr) + '</td>';
                }

                // Class info for this skill
                var base = ocp.class.skillBase(skill);
                var spec = ocp.class.skillSpec(skill);

                // The rest of the data
                res += '<td>' + ocp.skills[skill].name + '</td>' +
                    '<td class="numeric">' + (base > 0 ? base : '') + '</td>' +
                    '<td class="numeric">' + (spec > 0 ? spec : '') + '</td>' +
                    '<td class="numeric">' + (ocp.race[skill] > 0 ? ocp.race[skill] : '') + '</td>' +
                    '<td class="numeric">' + totals[skill] + '</td>' +
                    '</tr>';

                firstSkill = false;
            }
            firstAttr = false;
        }

        // Complete the table and insert it
        res += '</tbody></table>';
        dojo.byId("resultsStartingSkills").innerHTML = res;
    },


    // Private: Re-display all leveling details
    _updateLeveling: function () {

        // The new leveling contents
        var lev =
            '<table id="levelDetailsTable">' +
                '<colgroup />' +
                '<colgroup span="8" />' +
                '<colgroup span="3" class="first"/>' +
                '<colgroup span="3" class="first"/>' +
                '<colgroup span="3" class="first"/>' +
                '<colgroup span="3" class="first"/>' +
                '<colgroup span="3" class="first"/>' +
                '<colgroup span="3" class="first"/>' +
                '<colgroup span="3" class="first"/>' +
                '<colgroup span="3" class="first"/>' +
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
            lev += '<th class="vertical" title="' + ocp.derivedAttrs[attr].name + ' attribute">' +
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
                var class = 'numeric' + (attr in wasted ? ' worse' :
                    (current[attr] != previous[attr] ? ' changed' : ''));
                lev += '<td class="' + class + '"' +
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
                    (ocp.class.isMajor(skill) ? ' major' : '');
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
        // *** Need to note this in analysis pane too (if this is permanent)
        if (ocp.level.hadError) {
            // *** Move to styles if this is permanent
            lev += '<p><i><b><span style="color: red">Warning</span></b>: ' +
                'Leveling hit an error before completion.</p>';
        }

        // Add a final footnote and set it
        // *** Use styles if this is permanent
        lev += "<p><i><b>Note</b>: All leveling tries to achieve the maximum of +5 per attribute " +
            "per level (except for Luck's fixed +1).</i></p>";
        dojo.byId("resultsLevelingPane").innerHTML = lev;
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
                        spare: 0
                    };
                }
            }
        };

        // Check the attributes of every level
        for (var level = ocp.level.minLevel; level <= ocp.level.maxLevel; level++) {
            var totals = ocp.level.levelTotals(level);
            for (var attr in ocp.coreAttrs) {
                data.check(attr, totals[attr], level);
            }
            for (var attr in ocp.derivedAttrs) {
                data.check(attr, totals[attr], level);
            }
        }

        // For skills, just compare the first and last level
        var firstTotals = ocp.level.levelTotals(ocp.level.minLevel);
        var lastTotals  = ocp.level.levelTotals(ocp.level.maxLevel);
        for (var attr in ocp.coreAttrs) {
            for each (var skill in ocp.coreAttrs[attr].skills) {
                data[attr].avail += ocp.SMAX - firstTotals[skill];
                data[attr].used += lastTotals[skill] - firstTotals[skill];
            }
            data[attr].spare = data[attr].avail - data[attr].used;
        }


        /*
        ** Now generate the HTML for the new analysis
        */

        // The new analysis contents (tee-hee :D)
        // Start with a table of attribute info
        var anal =
            '<table>' +
                '<colgroup />' +
                '<colgroup span="3" />' +
                '<colgroup span="3" class="first" />' +
            '<thead>' +
                '<tr>' +
                    '<th></th>' +
                    '<th colspan="3"></th>' +
                    '<th colspan="4">Skill Points</th>' +
                '</tr>' +
                '<tr class="last">' +
                    '<th>Attribute</th>' +
                    '<th title="Starting total value.">Start</th>' +
                    '<th title="Maximum achievable by leveling.">Max</th>' +
                    '<th title="Level the maximum value was achieved.">Level</th>' +
                    '<th title="Total skill points you can level up for this attribute.">Avail</th>' +
                    '<th title="Skill points required to reach the maximum value.">Used</th>' +
                    '<th title="Spare skill points not required to level this attribute.">Spare</th>' +
                    '<th title="Skill points you can waste each level (assuming this exact leveling pattern).">Sp/Lv</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>';

        // Add the details for every core attribute
        for (var attr in ocp.coreAttrs) {
            // Force spare per level to two decimal
            var splv = Math.round((data[attr].spare / data[attr].level) * 100);
            splv = splv.toString().replace(/(..)$/, '.$1');
            splv = splv.replace(/^\./, '0.');
            anal +=
                '<tr>' +
                    '<td>' + ocp.coreAttrs[attr].name + '</td>' +
                    '<td class="numeric">' + data[attr].start + '</td>' +
                    '<td class="numeric">' + data[attr].max + '</td>' +
                    '<td class="numeric">' + data[attr].level + '</td>' +
                    '<td class="numeric">' + data[attr].avail + '</td>' +
                    '<td class="numeric">' + data[attr].used + '</td>' +
                    '<td class="numeric">' + data[attr].spare + '</td>' +
                    '<td class="numeric">' + splv + '</td>' +
                '</tr>';
        }

        // Add the details for every derived attribute
        var firstAttr = true;
        for (var attr in ocp.derivedAttrs) {
            anal +=
                '<tr' + (firstAttr ? ' class="first"' : '') + '>' +
                    '<td>' + ocp.derivedAttrs[attr] + '</td>' +
                    '<td class="numeric">' + data[attr].start + '</td>' +
                    '<td class="numeric">' + data[attr].max + '</td>' +
                    '<td class="numeric">' + data[attr].level + '</td>' +
                    '<td colspan="4"></td>' +
                '</tr>';
            firstAttr = false;
        }

        // End the table
        anal += '</tbody></table>';

        // If there was an error during leveling, note it
        // *** Need to note this in analysis pane too (if this is permanent)
        if (ocp.level.hadError) {
            // *** Move to styles if this is permanent
            anal += '<p><i><b><span style="color: red">Warning</span></b>: ' +
                'Leveling hit an error before completion, therefore this analysis is inaccurate.</p>';
        }

        // Set the content and we're done
        dojo.byId("resultsAnalysisPane").innerHTML = anal;
    }
};

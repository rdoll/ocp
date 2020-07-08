/*
** ocp-level.js
**
** Everything related to the leveling process.
*/

ocp.level = {

    // Private: Level totals for all core attrs, derived attrs, and skills
    //          The index in this array is the level for the totals
    _totals: [],

    // Private: The core attrs and skills that were not optimally utilized
    //          during the level up process for each level.
    //          The index in this array is the level for the wasted items
    _wasted: [],

    // Private: The number of points an attribute is raised for
    //          "this many" (meaning the array's index) skill points increased
    // Skill Points: 0  1  2  3  4  5  6  7  8  9  10
    _attrBonus:    [ 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5 ],

    // Private: An error was hit during the leveling process
    _error: false,


    // Public: getters for our data
    get levelMax () { return this._totals.length - 1; },
    get hadError () { return this._error; },

    // Public: accessors for per-level total and wasted data
    levelTotals: function (level) { return this._totals[level]; },
    levelWasted: function (level) { return this._wasted[level]; },


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
        this._updateStarting();
        this._updateLeveling();
    },


    // Private: Recalculate all starting value totals
    _updateStarting: function () {

        // The data for new characters comes from several places,
        // but existing character data can just be copied.
        var totals = {};
        var isNewChar = ocp.input.isNewChar;
        var existingTotals = ocp.existing.totals;

        // For new chars, core attributes are the sum of the given selections
        for (var attr in ocp.coreAttrs) {
            totals[attr] = (isNewChar
                ? ocp.race[attr] + ocp.birth[attr] + ocp.cclass[attr]
                : existingTotals[attr]);
        }

        // For new chars, derived attributes start with any race and birthsign bonuses
        for (var attr in ocp.derivedAttrs) {
            totals[attr] = (isNewChar
                ? ocp.race[attr] + ocp.birth[attr]
                : existingTotals[attr]);
        }

        // For new chars, update the derived attributes based on the core ones
        if (isNewChar) {
            ocp.deriveAttrs(totals);
        }

        // For new chars, skills come mainly from your class, but can have a race bonus
        for (var skill in ocp.skills) {
            totals[skill] = (isNewChar
                ? ocp.race[skill] + ocp.cclass[skill]
                : existingTotals[skill]);
        }

        // Since we've started the leveling process, clear all existing totals and wasted info
        delete this._totals;
        this._totals = [];
        delete this._wasted;
        this._wasted = [];

        // Store the new totals (and an empty wasted) for the starting level
        this._totals[ocp.input.levelMin] = totals;
        this._wasted[ocp.input.levelMin] = {};
    },


    // Private: Returns true if the given totals can be leveled
    _canLevel: function (totals) {

        // If all attributes are at max, we can't level
        var maxed = true;
        for (var attr in ocp.coreAttrs) {
            if (totals[attr] < ocp.coreAttrs[attr].max) {
                maxed = false;
                break;
            }
        }
        if (maxed) {
            return false;
        }

        // If we don't have enough points in all major skills combined, we can't level
        var points = 0;
        var majors = ocp.input.majors;
        for (var skillIndex in majors) {
            var skill = majors[skillIndex];
            if (totals[skill] < ocp.SKILL_MAX) {
                points += ocp.SKILL_MAX - totals[skill];
                if (points >= ocp.LEVELUP_MAJOR_POINTS) {
                    break;
                }
            }
        }
        if (points < ocp.LEVELUP_MAJOR_POINTS) {
            return false;
        }

        // We can skill something up
        return true;
    },


    // Private: Given the current totals, level up into next and wasted
    //          Never change current and return all values in next and wasted
    //
    // Note:    Yes, this is a very, very complicated process
    //          If you don't _really_ understand how leveling works,
    //          you have little hope of understanding this algorithm.
    _nextLevel: function (current, next, wasted) {

        // The order we will level the attributes
        var attrOrder = ocp.order.attrs;

        // Track everything we will level up
        var leveled = {};
        for (var key in current) {
            leveled[key] = 0;
        }

        // Track the number of skill points going toward each attribute
        // so we can determine the overall attribute bonuses
        var bonus = {};
        for (var attr in ocp.coreAttrs) {
            bonus[attr] = 0;
        }

        // Based on the order, determine which attributes to level
        var attrsToLevel = [];
        for (var attrIndex in attrOrder) {
            var attr = attrOrder[attrIndex];
            if (current[attr] < ocp.coreAttrs[attr].max) {
                attrsToLevel.push(attr);
                if (attrsToLevel.length >= ocp.LEVELUP_ATTRS_MAX) {
                    break;
                }
            }
        }

        // *** Could change order of attrsToLevel to account for attrs
        // *** that have all 3 major skills; e.g. if agi, str, and luc
        // *** are attrsToLevel and Bla, Blu, and Han are all major
        // *** skills but Mar is not a major skill, swap the order
        // *** of str and agi so the str skill ups aren't wasted.

        // For the attributes we are leveling,
        // determine which skills could yield an attribute bonus
        // This is in the order of desirability, just like attrs
        var bonusSkills = [];
        for (var attrIndex in attrsToLevel) {
            var attr = attrsToLevel[attrIndex];
            var skills = ocp.coreAttrs[attr].skills;
            for (var skillIndex in skills) {
                var skill = skills[skillIndex];
                if (current[skill] < ocp.SKILL_MAX) {
                    bonusSkills.push(skill);
                }
            }
        }


        // For the first phase of the leveling process,
        // we'll find the 10 points in major skills necessary to level.
        var majorPoints = 0;

        // In this first pass, only check the skills that would also
        // yield a bonus to the attributes we are leveling.
        for (var skillIndex in bonusSkills) {
            var skill = bonusSkills[skillIndex];

            // Only useful if this is a major skill
            if (ocp.input.isMajor(skill)) {

                // The attr this major skill helps
                var attr = ocp.skills[skill].attr;

                // We may have leveled this attr via a previous skill iteration,
                // so determine how much room this attr has left.
                // We can't do better than the max 5 point bonus
                var attrMax = Math.min(ocp.coreAttrs[attr].max - (current[attr] + leveled[attr]),
                    ocp.LEVELUP_BONUS_ATTR_MAX - leveled[attr]);

                // Only continue if this attr can still be raised
                if (attrMax > 0) {

                    // We have an attr and major skill that can both be raised.
                    //
                    // Now for the Tricky Part:
                    // We need to determine how many skill points will yield the
                    // total bonus to get this attribute as high as possible.
                    // Because previous skill iterations may have already increased
                    // this attr and the bonus for this attr, include the current
                    // leveled data in the analysis.

                    // Start by determining the max number of skill points we can raise
                    // without overflowing the needed 10 major skill points
                    var skillMax = Math.min(ocp.SKILL_MAX - current[skill],
                        ocp.LEVELUP_MAJOR_POINTS - majorPoints);

                    // Total number of points we're leveling the attr
                    // Since bonuses are pooled, consider everything we've done so far
                    var attrPoints = leveled[attr] + attrMax;

                    // Total number of skill points to get the attrPoints bonus
                    var skillPoints = dojo.indexOf(this._attrBonus, attrPoints);

                    // Now subtract the skill ups we've already done
                    skillPoints -= bonus[attr];

                    // And lastly make sure the skill can be raised this much
                    // Since skillMax considers majorPoints, this will ensure
                    // we don't go beyond the minimum of 10 points in majors
                    skillPoints = Math.min(skillPoints, skillMax);

                    // Now that we know how many points to raise the skill, do it

                    // First update the skill itself
                    leveled[skill] += skillPoints;

                    // Next, add to the bonus pool for this attribute
                    bonus[attr] += skillPoints;

                    // Next, based on the new bonus pool, set the leveled
                    // value for this attribute. This correctly overwrites
                    // any previous value since the pool is "level wide".
                    leveled[attr] = this._attrBonus[bonus[attr]];

                    // Finally, note that we've raised a major skill and
                    // stop if we've done enough for a level
                    majorPoints += skillPoints;
                    if (majorPoints >= ocp.LEVELUP_MAJOR_POINTS) {
                        break;
                    }
                }
            }
        }


        // If we didn't find 10 points in major skills for attributes we need,
        // we'll have to burn some major points just so we can level
        if (majorPoints < ocp.LEVELUP_MAJOR_POINTS) {

            // Since these points will be wasted just for the level up,
            // we want to burn points on skills we don't care about.

            // The ones we care least about are those whose
            // attributes are already at max value
            var burnAttrs = [];
            for (var attr in ocp.coreAttrs) {
                if (current[attr] + leveled[attr] >= ocp.coreAttrs[attr].max) {
                    burnAttrs.push(attr);
                }
            }

            // Next add all other skills in reverse order of importance
            for (var attrIndex = attrOrder.length - 1; attrIndex >= 0; attrIndex--) {
                var attr = attrOrder[attrIndex];
                // Don't add dupes
                if (dojo.indexOf(burnAttrs, attr) == -1) {
                    burnAttrs.push(attr);
                }
            }

            // Now go through the attributes we might burn
            for (var attrIndex in burnAttrs) {
                var attr = burnAttrs[attrIndex];

                // Check skills for this attr
                var skills = ocp.coreAttrs[attr].skills;
                for (var skillIndex in skills) {
                    var skill = skills[skillIndex];

                    // If this is a major skill, check it
                    if (ocp.input.isMajor(skill)) {

                        // Start by determining the max number of skill points we can raise
                        // without overflowing the needed 10 major skill points
                        var skillMax = Math.min(ocp.SKILL_MAX - (current[skill] + leveled[skill]),
                            ocp.LEVELUP_MAJOR_POINTS - majorPoints);

                        // Only continue if this skill can be raised
                        if (skillMax > 0) {

                            // This major skill can be raised, so do it
                            // We aren't raising the attribute for this skill,
                            // so don't track the bonus -- just raise the skill
                            leveled[skill] += skillMax;

                            // If the attr for this skill is not at max,
                            // then we wasted the attr bonus for this skillup
                            if (current[attr] < ocp.coreAttrs[attr].max) {
                                wasted[skill] = 'This skill was raised solely for the major points ' +
                                    'necessary to level. Even though ' + ocp.coreAttrs[attr].name +
                                    ' is not maximized, the attribute bonus of this skill increase ' +
                                    'was wasted.';
                            }

                            // Note that we've raised a major skill and
                            // stop if we've done enough for a level
                            majorPoints += skillMax;
                            if (majorPoints >= ocp.LEVELUP_MAJOR_POINTS) {
                                break;
                            }
                        }
                    }
                }
            }
        }


        // If we *still* don't have enough major points, we can't level
        // This means _canLevel lied to us or we have a bug, so fail
        if (majorPoints < ocp.LEVELUP_MAJOR_POINTS) {
            console.warn('ocp.level._nextLevel: Did not find ' + ocp.LEVELUP_MAJOR_POINTS +
                ' major points to level!');
            return false;
        }


        // *** BUG: These are implied as minor skills, but we never check for it!
        // *** BUG: This means we can consume more than 10 points in major skills!
        // *** BUG: With all defaults, choose Warrior class to see bug.

        // Now that we have the major skills raised to increase our level,
        // raise as many other minor skills we need to maximize the attribute bonuses
        for (var attrIndex in attrsToLevel) {
            var attr = attrsToLevel[attrIndex];

            // Determine the max number of skill points we can use to
            // raise this attr (up to the max of 5 bonus points)
            var attrMax = Math.min(ocp.coreAttrs[attr].max - (current[attr] + leveled[attr]),
                ocp.LEVELUP_BONUS_ATTR_MAX - leveled[attr]);

            // If we cannot level this attr, it must already be done
            if (attrMax > 0) {

                // Order this attr's skills to check minors first and majors last
                var skillsForAttr = [];
                var skills = ocp.coreAttrs[attr].skills;
                for (var skillIndex in skills) {
                    var skill = skills[skillIndex];
                    if (ocp.input.isMajor(skill)) {
                        skillsForAttr.push(skill);      // Put major at end
                    } else {
                        skillsForAttr.unshift(skill);   // Put minor in front
                    }
                }

                // Check each skill for this attribute
                for (var skillIndex in skillsForAttr) {
                    var skill = skillsForAttr[skillIndex];

                    // Max number of skill points we could raise this skill.
                    // There's no need to go beyond the 10 total bonus points
                    // necessary to reach the max +5 attr bonus.
                    var skillMax = Math.min(ocp.SKILL_MAX - (current[skill] + leveled[skill]),
                        ocp.LEVELUP_BONUS_SKILL_MAX - bonus[attr]);

                    // Proceed if we can level this skill
                    if (skillMax > 0) {

                        // We have an attr and skill that can both be raised.
                        //
                        // Now for the Tricky Part:
                        // We need to determine how many skill points will yield the
                        // total bonus to get this attribute as high as possible.
                        // Because previous code may have already increased
                        // this attr and the bonus for this attr, include the current
                        // leveled data in the analysis.

                        // Total number of points we're leveling the attr
                        // Since bonuses are pooled, consider everything we've done so far
                        var attrPoints = leveled[attr] + attrMax;

                        // Total number of skill points to get the attrPoints bonus
                        var skillPoints = dojo.indexOf(this._attrBonus, attrPoints);

                        // Now subtract the skill ups we've already done
                        skillPoints -= bonus[attr];

                        // And lastly make sure the skill can be raised this much
                        skillPoints = Math.min(skillPoints, skillMax);

                        // Now that we know how many points to raise the skill, do it

                        // First update the skill itself
                        leveled[skill] += skillPoints;

                        // Next, add to the bonus pool for this attribute
                        bonus[attr] += skillPoints;

                        // Next, based on the new bonus pool, set the leveled
                        // value for this attribute. This correctly overwrites
                        // any previous value since the pool is "level wide".
                        leveled[attr] = this._attrBonus[bonus[attr]];

                        // If this was a major skill, we did more than the 10 needed to
                        // level which may have cheated us of future levels
                        if (ocp.input.isMajor(skill)) {
                            wasted[skill] = 'This major skill was raised for the attribute bonus on ' +
                                ocp.coreAttrs[attr].name + ', but the skill up did not count towards ' +
                                'the ' + ocp.LEVELUP_MAJOR_POINTS + ' major points necessary to level.';
                        }

                        // The leveling is done.
                        // Now update the attrMax so we can continue with the next skill
                        attrMax = Math.min(ocp.coreAttrs[attr].max - (current[attr] + leveled[attr]),
                            ocp.LEVELUP_BONUS_ATTR_MAX - leveled[attr]);

                        // If this attr is done, stop checking skills
                        if (attrMax <= 0) {
                            break;
                        }
                    }
                }

                // If we still haven't found any skills to raise this attr,
                // then just raise it the default of one point
                if (leveled[attr] == 0) {
                    leveled[attr]++;
                }
            }
        }

        // Check all attributes to make sure we didn't increase any less than their maximum
        for (var attr in ocp.coreAttrs) {
            if ((leveled[attr] > 0) &&
                (leveled[attr] < ocp.LEVELUP_BONUS_ATTR_MAX) &&
                (current[attr] + leveled[attr] < ocp.coreAttrs[attr].max) &&
                (ocp.coreAttrs[attr].skills.length > 0))
            {
                wasted[attr] = 'This attribute was not raised the maximum of ' +
                    ocp.LEVELUP_BONUS_ATTR_MAX + ' points';
            }
        }


        // We leveled up! Create the results and we're done!

        // Derive attributes of what we leveled
        ocp.deriveAttrs(leveled);

        // Apply what we leveled to form the results
        for (var key in current) {
            next[key] = current[key] + leveled[key];
        }

        // In addition to increases from core attribute changes,
        // Health gets 10% of the post-leveled Endurance each time you level up.
        next.hea += Math.floor(next.end * 0.1);

        // Return success
        return true;
    },


    // Private: Recalculate all leveling details
    _updateLeveling: function () {

        // Assume no error was hit during the leveling process
        this._error = false;

        // Always the totals for the current level
        var current = this._totals[ocp.input.levelMin];

        // Keep leveling until we hit the max level or until we hit a failsafe limit.
        // If this is a new character, the failsafe is simply the max level.
        // However, since the inputs for existing characters have to accomodate all
        // min values for every skill and attribute (and because those inputs are not
        // validated for "being possible"), the failsafe has to accomodate this.
        // With all min values, we can reach level 63.
        // *** With a custom class, make sure level 53 can be reached without tripping failsafe
        var failsafe = (ocp.input.isNewChar ? ocp.LEVEL_MAX : 63) + 1;
        while ((--failsafe > 0) && this._canLevel(current)) {

            // Level up -- start with an empty next and wasted for this level
            var next = {};
            var wasted = {};
            if (this._nextLevel(current, next, wasted)) {
                // The leveling worked. Store the data and prep for another level.
                this._totals.push(next);
                this._wasted.push(wasted);
                current = next;
            } else {
                // Failure -- abort the process (nextLevel generated a log about why already)
                this._error = true;
                return;
            }
        }

        // It's an error if we hit the failsafe
        if (failsafe <= 0) {
            console.warn('ocp.level._updateLeveling hit failsafe!');
            this._error = true;
        }
    }
};

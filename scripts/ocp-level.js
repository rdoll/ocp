/*
** ocp-level.js
**
** Everything related to the leveling process.
*/

ocp.level = {

    // Private: Starting level for this character
    _startingLevel: 1,

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
    get minLevel () { return this._startingLevel; },
    get maxLevel () { return this._totals.length - 1; },
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

        // Create a new set of totals
        var totals = {};

        // Core attributes are just the sum of the given selections
        for (var attr in ocp.coreAttrs) {
            totals[attr] = ocp.race[attr] + ocp.birth[attr] + ocp.cclass[attr];
        }

        // Derived attributes start with any race and birthsign bonuses
        for (var attr in ocp.derivedAttrs) {
            totals[attr] = ocp.race[attr] + ocp.birth[attr];
        }

        // Now update the derived attributes based on the core ones
        ocp.deriveAttrs(totals);

        // Skills come mainly from your class, but can have a race bonus
        for (var skill in ocp.skills) {
            totals[skill] = ocp.race[skill] + ocp.cclass[skill];
        }

        // Since we've started the leveling process, clear all existing totals and wasted info
        this._totals = [];
        this._wasted = [];

        // Store the new totals (and an empty wasted) for the starting level
        this._totals[this._startingLevel] = totals;
        this._wasted[this._startingLevel] = {};
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

        // If we have less than 10 points available in major skills, we can't level
        var points = 0;
        for each (var skill in ocp.cclass.majors) {
            if (totals[skill] < ocp.SKILL_MAX) {
                points += ocp.SKILL_MAX - totals[skill];
                if (points >= 10) {
                    break;
                }
            }
        }
        if (points < 10) {
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
        for each (var attr in attrOrder) {
            if (current[attr] < ocp.coreAttrs[attr].max) {
                attrsToLevel.push(attr);
                if (attrsToLevel.length >= 3) {
                    break;
                }
            }
        }

        // For the attributes we are leveling,
        // determine which skills could yield an attribute bonus
        // This is in the order of desirability, just like attrs
        var bonusSkills = [];
        for each (var attr in attrsToLevel) {
            for each (var skill in ocp.coreAttrs[attr].skills) {
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
        for each (var skill in bonusSkills) {

            // Only useful if this is a major skill
            if (ocp.cclass.isMajor(skill)) {

                // The attr this major skill helps
                var attr = ocp.skills[skill].attr;

                // We may have leveled this attr via a previous skill iteration,
                // so determine how much room this attr has left.
                // We can't do better than the max 5 point bonus
                var attrMax = Math.min(ocp.coreAttrs[attr].max - (current[attr] + leveled[attr]),
                    5 - leveled[attr]);

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
                    var skillMax = Math.min(ocp.SKILL_MAX - current[skill], 10 - majorPoints);

                    // Total number of points we're leveling the attr
                    // Since bonuses are pooled, consider everything we've done so far
                    var attrPoints = leveled[attr] + attrMax;

                    // Total number of skill points to get the attrPoints bonus
                    var skillPoints = this._attrBonus.indexOf(attrPoints);

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
                    if (majorPoints >= 10) {
                        break;
                    }
                }
            }
        }


        // If we didn't find 10 points in major skills for attributes we need,
        // we'll have to burn some major points just so we can level
        if (majorPoints < 10) {

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
                if (burnAttrs.indexOf(attr) == -1) {
                    burnAttrs.push(attr);
                }
            }

            // Now go through the attributes we might burn
            for each (var attr in burnAttrs) {

                // Check skills for this attr
                for each (var skill in ocp.coreAttrs[attr].skills) {

                    // If this is a major skill, check it
                    if (ocp.cclass.isMajor(skill)) {

                        // Start by determining the max number of skill points we can raise
                        // without overflowing the needed 10 major skill points
                        var skillMax = Math.min(ocp.SKILL_MAX - (current[skill] + leveled[skill]),
                            10 - majorPoints);

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
                            if (majorPoints >= 10) {
                                break;
                            }
                        }
                    }
                }
            }
        }


        // If we *still* don't have enough major points, we can't level
        // This means _canLevel lied to us or we have a bug, so fail
        if (majorPoints < 10) {
            console.warn('ocp.level._nextLevel: Did not find 10 major points to level!');
            return false;
        }


        // Now that we have the major skills raised to increase our level,
        // raise as many other skills we need to maximize the attribute bonuses
        for each (var attr in attrsToLevel) {

            // Determine the max number of skill points we can use to
            // raise this attr (up to the max of 5 bonus points)
            var attrMax = Math.min(ocp.coreAttrs[attr].max - (current[attr] + leveled[attr]),
                5 - leveled[attr]);

            // If we cannot level this attr, it must already be done
            if (attrMax > 0) {

                // Order this attr's skills to check minors first and majors last
                var skillsForAttr = [];
                for each (var skill in ocp.coreAttrs[attr].skills) {
                    if (ocp.cclass.isMajor(skill)) {
                        skillsForAttr.push(skill);      // Put major at end
                    } else {
                        skillsForAttr.unshift(skill);   // Put minor in front
                    }
                }

                // Check each skill for this attribute
                for each (var skill in skillsForAttr) {

                    // Max number of skill points we could raise this skill.
                    // There's no need to go beyond the 10 total bonus points
                    // necessary to reach the max +5 attr bonus.
                    var skillMax = Math.min(ocp.SKILL_MAX - (current[skill] + leveled[skill]),
                        10 - bonus[attr]);

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
                        var skillPoints = this._attrBonus.indexOf(attrPoints);

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
                        if (ocp.cclass.isMajor(skill)) {
                            wasted[skill] = 'This major skill was raised for the attribute bonus on ' +
                                ocp.coreAttrs[attr].name + ', but the skill up did not count towards ' +
                                'the 10 major points necessary to level.';
                        }

                        // The leveling is done.
                        // Now update the attrMax so we can continue with the next skill
                        attrMax = Math.min(ocp.coreAttrs[attr].max - (current[attr] + leveled[attr]),
                            5 - leveled[attr]);

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
                (leveled[attr] < 5) &&
                (current[attr] + leveled[attr] < ocp.coreAttrs[attr].max) &&
                (ocp.coreAttrs[attr].skills.length > 0))
            {
                wasted[attr] = 'This attribute was not raised the maximum of 5 points.';
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
        var current = this._totals[this._startingLevel];

        // Keep leveling until we hit the max level or until we hit a failsafe limit
        // Set the failsafe to the max level since we can't level more than that many times
        var failsafe = ocp.LEVEL_MAX;
        while ((failsafe-- > 0) && this._canLevel(current)) {

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

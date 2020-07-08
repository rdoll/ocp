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
                ? ocp.race[attr] + ocp.birth[attr] + ocp.clazz[attr]
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
                ? ocp.race[skill] + ocp.clazz[skill]
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
        for (var skill in ocp.input.majors) {
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
    // Note:    This is a very, very complicated process
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
        // TODO: This could be optimized to order the attributes based on the
        // TODO: total number of points available to level; e.g. if str has
        // TODO: bla at 100, minor blu at 99, and major han at 50, the minor
        // TODO: blu at 99 will ensure onlyMajors is false -- but it essentially
        // TODO: is only majors. Should order the attrs by the number of majors
        // TODO: they must raise to get their max bonus.
        var attrsToLevel = [];
        var onlyWithMajors = [];
        var attrsFound = 0;
        for (var attrIndex in attrOrder) {
            var attr = attrOrder[attrIndex];
            if (current[attr] < ocp.coreAttrs[attr].max) {

                // We will level this attr, but if it has only major skills
                // that can be raised, let's do it first. This can help prevent
                // cases of an attr with available minor skills getting its major
                // skill raised while an attr with only majors cannot be raised at all.
                var onlyMajors = true;
                var skills = ocp.coreAttrs[attr].skills;
                if (skills.length > 0) {
                    for (var skillIndex in skills) {
                        var skill = skills[skillIndex];
                        if ((current[skill] < ocp.SKILL_MAX) && (!ocp.input.isMajor(skill))) {
                            onlyMajors = false;
                            break;
                        }
                    }
                } else {
                    // Attributes with no skills are treated as if they
                    // have minors that can be leveled
                    onlyMajors = false;
                }
                if (onlyMajors) {
                    onlyWithMajors.push(attr);
                } else {
                    attrsToLevel.push(attr);
                }

                // Quit if we've found the current number of attrs for a level
                if (++attrsFound >= ocp.LEVELUP_ATTRS_MAX) {
                    break;
                }
            }
        }
        attrsToLevel = onlyWithMajors.concat(attrsToLevel);
        /* Quick way to short-circuit the leveling process after one pass
        console.log('_nextLevel: attrsToLevel=', attrsToLevel);
        if (this._totals.length > ocp.input.levelMin + 1) {
            this._error = true;
            return false;
        }
        */

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

                            // TODO: With Male Argonian, The Mage, and Warrior, this wasted
                            // TODO: message pops out on level 23's Blunt skill. It looks like
                            // TODO: Str was validly raised 2 to max, but then we needed more
                            // TODO: major skill points, so we burnt the other 8 -- which
                            // TODO: puts this wasted message out.
                            // TODO: Could detect this case or make the message more generic...

                            // If the attr for this skill is not at max,
                            // then we wasted the attr bonus for this skillup
                            if (current[attr] < ocp.coreAttrs[attr].max) {
                                wasted[skill] = 'This skill was raised solely for the major ' +
                                    'points necessary to level. Because ' +
                                    ocp.coreAttrs[attr].name + ' was not increased this ' +
                                    'level, the attribute bonus of this skill up was wasted.';
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
            console.warn('_nextLevel did not find ' + ocp.LEVELUP_MAJOR_POINTS +
                ' major points to level!');
            return false;
        }


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

                        // If this is a major skill, we cannot raise it without going beyond
                        // the 10 major skill points required to level. Since minor skills
                        // are checked first, if we got here, it's a problem worth noting.
                        if (ocp.input.isMajor(skill)) {
                            wasted[skill] = 'Since ' + ocp.coreAttrs[attr].name +
                                ' is being increased this level, we want to increase this ' +
                                'skill for the attribute bonus. However, since ' +
                                ocp.skills[skill].name + ' is a major skill, it cannot be ' +
                                'raised without exceeding the ' + ocp.LEVELUP_MAJOR_POINTS +
                                ' major skill points used to level.';
                        } else {

                            // We have an attr and minor skill that can both be raised.
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

                            // The leveling is done.
                            // Now update the attrMax so we can continue with the next skill
                            attrMax = Math.min(
                                ocp.coreAttrs[attr].max - (current[attr] + leveled[attr]),
                                ocp.LEVELUP_BONUS_ATTR_MAX - leveled[attr]);

                            // If this attr is done, stop checking skills
                            if (attrMax <= 0) {
                                break;
                            }
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


        // We leveled up! Create the results for the next level.

        // Derive attributes of what we leveled
        ocp.deriveAttrs(leveled);

        // Apply what we leveled to form the results
        for (var key in current) {
            next[key] = current[key] + leveled[key];
        }

        // In addition to increases from core attribute changes,
        // Health gets 10% of the post-leveled Endurance each time you level up.
        next.hea += Math.floor(next.end * 0.1);


        // The level up algorithm is so complex that we should validate some
        // things to ensure that no bugs slipped through.

        // Check all core attributes for validity
        var leveledAttrCount = 0;
        for (var attr in ocp.coreAttrs) {
            if (leveled[attr] > 0) {
                leveledAttrCount++;

                // We can't raise a core attr by more than the bonus max
                if (leveled[attr] > ocp.LEVELUP_BONUS_ATTR_MAX) {
                    console.warn('_nextLevel increased ' + ocp.coreAttrs[attr].name +
                        ' by ' + leveled[attr] + ' points!');
                    return false;
                }

                // We can't raise a core attr beyond it's max
                if (next[attr] > ocp.coreAttrs[attr].max) {
                    console.warn('_nextLevel increased ' + ocp.coreAttrs[attr].name +
                        ' to ' + next[attr] + ' points!');
                    return false;
                }
            }
        }

        // Ensure we increased a valid number of core attributes
        if ((leveledAttrCount == 0) ||
            (leveledAttrCount > ocp.LEVELUP_ATTRS_MAX))
        {
            console.warn('_nextLevel increased ' + leveledAttrCount + ' attributes!');
            return false;
        }

        // Check all skills for validity
        var leveledMajorPoints = 0;
        for (var skill in ocp.skills) {
            if (leveled[skill] > 0) {
                if (ocp.input.isMajor(skill)) {
                    leveledMajorPoints += leveled[skill];
                }

                // While you can raise a skill any amount, this leveling algorithm
                // should never do more than the amount required for max bonus
                if (leveled[skill] > ocp.LEVELUP_BONUS_SKILL_MAX) {
                    console.warn('_nextLevel increased ' + ocp.skills[skill].name +
                        ' by ' + leveled[skill] + ' points!');
                    return false;
                }

                // We can't raise a skill beyond it's max
                if (next[skill] > ocp.SKILL_MAX) {
                    console.warn('_nextLevel increased ' + ocp.skills[skill].name +
                        ' to ' + next[skill] + ' points!');
                    return false;
                }
            }
        }

        // Ensure we increased exactly the number of major points required to level
        if (leveledMajorPoints != ocp.LEVELUP_MAJOR_POINTS) {
            console.warn('_nextLevel increased ' + leveledMajorPoints + ' major skill points!');
            return false;
        }

        // TODO: Can check that no attr got more than 10 skill points?
        // TODO: Or can the algoritm use a minor for the attr and waste a major for the levelup?


        // All checks passed, so return success
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
        // TODO: With a custom class, make sure level 53 can be reached without tripping failsafe
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
    },


    // Public: Sets the existing character data to the values in the given level.
    //         The majors are pulled from the current majors.
    // Throws: An error if the given level is out of range of the currently generated levels.
    setExisting: function (level) {

        // Only do the work if the level is valid
        if ((level >= ocp.input.levelMin) && (level <= ocp.level.levelMax)) {

            // It's a valid level, so set the new existing data (without notifications)
            ocp.existing._selectCustom(level, this._totals[level], ocp.input.majors);

            // Select the existing details (this may or may not notify)
            ocp.input.isNewChar = false;

            // Since selecting the existing details only generates a notification event if the
            // panel changed, generate an event here just to be sure.
            ocp.notifyChanged();
        } else {
            // The level is invalid -- throw an error
            throw 'Invalid level "' + level + '" in ocp.level.setExisting.';
        }
    }
};

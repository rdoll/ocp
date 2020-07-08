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
** ocp-order.js
**
** Everything related to the leveling order.
*/

ocp.order = {

    // Private: The order attributes will be leveled
    _attrs: [ 'end', 'str', 'luc', 'itl', 'agi', 'spe', 'wil', 'per' ],

    // Private: The DnD source for the order of attributes
    _attrDndSource: null,


    // Public: getters for our data
    get attrs () { return this._attrs; },


    // Public: Initialize ourselves
    initialize: function() {
        // Create any one-time contents
        this._initializeAttrDnd();
    },


    // Private: Initialize DnD (Drag aNd Drop) for the order
    _initializeAttrDnd: function() {

        // Create a new DnD Source
        var source = new dojo.dnd.Source('attrOrderDndSource', {

            // Create our own list nodes so we can pass in the attr for each item
            // We don't really need a custom avatar, but it's ok if they are
            // identical to our nodes
            creator: function (item, hint) {
                //console.debug('creator: item=', item, ', hint=', hint);

                // Use a basic div to create a vertical list of contents
                var node = dojo.doc.createElement('div');
                node.innerHTML = item.name;

                // Return the info for this item
                return { node:node, data:item, type:['text'] };
            }
        });

        // Insert the children using name/attr per the creator above
        for (var attrIndex in this._attrs) {
            var attr = this._attrs[attrIndex];
            source.insertNodes(false, [{ name: ocp.coreAttrs[attr].name, attr: attr }]);
        }

        // Suppress the ability to copy anything (i.e. we are never in the "copy state")
        source.copyState = function(keyPressed, self) {
            return false;
        };

        // Whenever a drop happens, handle the new order
        dojo.connect(source, 'onDndDrop', this, '_attrOrderChanged');

        // Whenever a drop is aborted, clear the current selection
        dojo.connect(source, 'onDndCancel', source, 'selectNone');

        // Store the source and we're done
        this._attrDndSource = source;
    },


    // Private: The order in the attr DnD container changed
    _attrOrderChanged: function ( /* source, nodes, copy, target */ ) {

        // The DnD source
        var source = this._attrDndSource;

        // Unselect all nodes for a cleaner look
        source.selectNone();

        // The source's child nodes are always arranged in their current order,
        // so just traverse the list to build the new order
        var newOrder = [];
        source.getAllNodes().forEach(function (node) {
            // From closure: source, newOrder
            var item = source.getItem(node.id);
            newOrder.push(item.data.attr);
            //console.debug(node.id, item.data);
        });

        /* This works, but the order in the map never changes
        source.forInItems(function (item, id, source) {
            // From closure: newOrder
            newOrder.push(item.data.attr);
        });
        */

        // Set the new order and notify that something has changed
        console.debug('entered _attrOrderChanged:', newOrder);
        this._attrs = newOrder;
        ocp.notifyChanged();
    },


    // Public: Some character data has changed, so update our results
    notifyChanged: function() {
        // Nothing to do
    }
};

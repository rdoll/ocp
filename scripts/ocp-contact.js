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
** ocp-contact.js
**
** Support for the contact dialog with the just for fun email decoding sequence.
*/

ocp.contact = {

    // Public: The dialog widget
    dialog: null,

    // Private: The container for the current progress result message
    _progressResult: null,

    // Private: The container for the decoding letters and decoded address
    _decodeContainer: null,

    // Private: My email address packed from
    //          dojo.map('address'.match(/./g), function (str) { return str.charCodeAt(0) })
    _packedAddress: [ 114, 105, 99, 104, 97, 114, 100, 95, 51, 54, 53,
                      53, 64, 121, 97, 104, 111, 111, 46, 99, 111, 109 ],

    // Private: My email address in unpacked form
    _unpackedAddress: '',

    // Private: The container with a hyperlink to the unpacked email address
    _unpackedContainer: null,

    // Private: The set of decoding letter children
    _letterDecoders: [],


    // Public: Initialize ourselves
    initialize: function () {

        // Initialize the dialog
        this._initializeDialog();

        // Initialize the unpacked address container inside the dialog
        this._initializeUnpacked();
    },


    // Private: Initialize the contact dialog
    _initializeDialog: function () {

        // Create the dialog hooking when it is shown or hidden
        this.dialog = new dijit.Dialog({
            id: 'contactDialog',
            title: 'Contact Richard Doll',
            onShow: dojo.hitch(this, 'onShow'),
            onCancel: dojo.hitch(this, 'onCancel')
        });

        // The dialog's contents is a single ContentPane
        var contactContent = new dijit.layout.ContentPane({ id: 'contactContentPane' },
            this.dialog.containerNode);

        // Create the progress message with a container to update the status
        var progressContainer = dojo.create('div', null, contactContent.containerNode);
        dojo.create('span', { innerHTML: 'Email Address Decoding ... ' }, progressContainer);
        this._progressResult = dojo.create('span', null, progressContainer);

        // Create an area for the decoding letters to roam around in
        this._decodeContainer = dojo.create('div', { id: 'contactDecodeContainer' },
            contactContent.containerNode);
    },


    // Private: Initialize the unpacked email address contents of the dialog
    _initializeUnpacked: function () {

        // Unpack the email address
        this._unpackedAddress = dojo.map(this._packedAddress, function (chCode) {
            return String.fromCharCode(chCode)
        }).join('');

        // Build a hyperlink to the unpacked address inside the decoding container
        // Start it hidden so any text decoration isn't rendered, but it still takes up space
        this._unpackedContainer = dojo.create('a', {
            href: 'mailto:' + this._unpackedAddress + '?subject=Oblivion%20Character%20Planner',
            visibility: 'hidden'
        }, this._decodeContainer);

        // The hyperlink's contents are a span for each letter so we can obtain
        // boundary/position information for each letter.
        // Every letter starts hidden so spacing/sizing is correct, but it's still invisible
        for (var letterIndex in this._unpackedAddress) {
            dojo.create('span', {
                innerHTML: this._unpackedAddress.charAt(letterIndex),
                visibility: 'hidden'
            }, this._unpackedContainer);
        }

        // Center the unpacked container in the decode container
        var dcBox = dojo.contentBox(this._decodeContainer);
        var ucBox = dojo.marginBox(this._unpackedContainer);
        dojo.style(this._unpackedContainer, {
            top:  Math.floor((dcBox.h - ucBox.h) / 2) + 'px',
            left: Math.floor((dcBox.w - ucBox.w) / 2) + 'px',
            position: 'absolute'
        });
    },


    // Private: Sets the visibility of the unpacked container and its contents
    _setUnpackedVisible: function (visible) {
        var vis = (visible ? 'visible' : 'hidden');
        dojo.style(this._unpackedContainer, { visibility: vis });
        dojo.query('span', this._unpackedContainer).style({ visibility: vis });
    },


    // Private: Sets the progress result message and CSS class
    _setProgress: function (progressMsg, addClassName, removeClassName) {
        dojo.removeClass(this._progressResult, removeClassName);
        dojo.attr(this._progressResult, 'innerHTML', progressMsg);
        dojo.addClass(this._progressResult, addClassName);
    },


    // Public: Called when the contact dialog is shown
    onShow: function () {
        //console.debug('entered onShow');

        // Ensure the unpacked container is completely invisible
        this._setUnpackedVisible(false);

        // Reset the progress result to show decoding is in progress
        this._setProgress('In Progress', 'decodingInProgress', 'decodingComplete');

        // With the unpacked container properly positioned, create a decoding
        // letter for each letter (span) inside the hyperlink.
        // Get the unpackedContainer's top/left offsets relative to the decodeContainer
        var _this = this;
        var ucTop = parseInt(dojo.style(this._unpackedContainer, 'top'));
        var ucLeft = parseInt(dojo.style(this._unpackedContainer, 'left'));
        dojo.query('span', this._unpackedContainer).forEach(function (spanNode) {
            // From closure: _this, ucTop, ucLeft

            // Get the location of this letter's span relative to the unpackedContainer
            var spanBox = dojo.marginBox(spanNode);
            //console.log(dojo.attr(spanNode, 'innerHTML'), spanBox);

            // Create a decoding letter that will end up with this letter and location
            // To make the letter's endTop/endLeft relative to the decodeContainer,
            // add the unpackedContainer's offsets to this letter's offsets
            _this._letterDecoders.push( new ocp.contact.letterDecoder({
                container: _this._decodeContainer,
                endLetter: dojo.attr(spanNode, 'innerHTML'),
                endTop: ucTop + spanBox.t,
                endLeft: ucLeft + spanBox.l,
                onDecoded: dojo.hitch(_this, 'onLetterDecoded')
            }));
        });
    },


    // Public: Called when the dialog is closed via the cancel button
    onCancel: function() {
        //console.debug('entered onCancel');

        // Delete all decoders
        this._deleteDecoders();
    },


    // Private: Deletes all letter decoder objects and removes them from the decodeContainer
    _deleteDecoders: function () {

        // Destroy each decoder (which deletes it from the decodeContainer)
        dojo.forEach(this._letterDecoders, function (decoder) { decoder.destroy(); });

        // Delete and reset all letter decoders
        delete this._letterDecoders;
        this._letterDecoders = [];
    },


    // Public: Called when any decoding letter has completed decoding
    onLetterDecoded: function () {

        // If all letters have been decoded, invoke the decoding is complete method
        for (var decoderIndex in this._letterDecoders) {
            var decoder = this._letterDecoders[decoderIndex];
            if (!decoder.isDecoded()) {
                return;
            }
        }
        this._onDecodingComplete();
    },


    // Private: Called when all letters have completed their decoding process
    _onDecodingComplete: function () {
        console.debug('entered _onDecodingComplete');

        // Note that decoding is done
        this._setProgress('Completed!', 'decodingComplete', 'decodingInProgress');

        // Delete all letter decoders because we no longer need them
        this._deleteDecoders();

        // Show the unpacked email address hyperlink
        this._setUnpackedVisible(true);
    }
};


/*
** Define a class to manage the decoding process of an individual letter.
*/

dojo.provide('ocp.contact.letterDecoder');
dojo.declare('ocp.contact.letterDecoder', null, {

    // Public: The container for the decoding process
    container: null,

    // Public: The final letter displayed after decoding is complete
    endLetter: '',

    // Public: The final top/left offset relative to container for this letter
    endTop: -1,
    endLeft: -1,

    // Public: When decoding is complete, this callback is invoked (if given)
    onDecoded: null,

    // Private: The DOM node for this letter placed into the container
    _domNode: null,

    // Private: The animation instance driving decoding
    _animation: null,

    // Private: The possible random characters we can display during decoding
    _decodingChars:
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*-+=<>?|/\~',


    // Public: Creates and automatically starts a decoding letter
    // Required args: endLetter, endTop, endLeft, container
    // Optional args: onDecoded
    // Throws: errors if args cannot be validated
    constructor: function (/* Object */ args) {

        // Set data members based on args
        dojo.mixin(this, args);

        // Validate required arguments
        if (!this.container)            { this._throwBadArgError('container'); }
        if (this.endLetter.length != 1) { this._throwBadArgError('endLetter', this.endLetter); }
        if (this.endTop < 0)            { this._throwBadArgError('endTop', this.endTop); }
        if (this.endLeft < 0)           { this._throwBadArgError('endLeft', this.endLeft); }

        // Create the decoding entity
        this._createDecoderNode();

        // Create and start the animation for this node
        this._startAnimation();
    },


    // Private: Throws an error about a missing or invalid argument during construction
    _throwBadArgError: function (argName, argValue) {
        if (argValue === undefined) {
            // No value means a required arg was missing
            throw 'Missing ' + argName + ' in ocp.contact.letterDecoder construction.';
        } else {
            // The value is either a bad because it is a default or it was given and is bad
            throw 'Missing or invalid ' + argName + ' "' + argValue +
                '" in ocp.contact.letterDecoder construction.';
        }
    },


    // Private: Creates this letter's DOM node at a random position in the container
    _createDecoderNode: function () {

        // Create the node for this letter
        // Start it with a capital M so we can gague the max size of any random letter
        this._domNode = dojo.create('span', { innerHTML: 'M' }, this.container);

        // Find a random position for this letter
        var contBox = dojo.contentBox(this.container);
        var letterBox = dojo.marginBox(this._domNode);
        dojo.style(this._domNode, {
            position: 'absolute',
            color: 'red',
            top: ocp.getRandomInt(0, contBox.h - letterBox.h) + 'px',
            left: ocp.getRandomInt(0, contBox.w - letterBox.w) + 'px'
        });

        // Set an initial random value for this letter
        this._setRandomLetter();
    },


    // Private: Create and start the animation that will move this letter to its end position
    _startAnimation: function () {

        // Create the animation that will do the decoding
        this._animation = dojo.fx.slideTo({
            node: this._domNode,
            top: this.endTop,
            left: this.endLeft,
            unit: 'px',
            delay: 400,  // in milliseconds -- this covers the Dialog's fadeIn time
            duration: ocp.getRandomInt(3000, 6000),  // in milliseconds
            rate: 100, // 10 frames per second
            onAnimate: dojo.hitch(this, '_setRandomLetter'),
            onEnd: dojo.hitch(this, '_onDecodingDone')
        });

        // Start the animation running
        this._animation.play();
    },


    // Public: Destroy ourselves so we can be safely deleted
    destroy: function () {

        // Cease and destroy the animation
        this._animation.stop(false);
        delete this._animation;

        // Remove this letter's DOM node from the container
        this.container.removeChild(this._domNode);

        // Destroy this letter's DOM node
        dojo.destroy(this._domNode);
        delete this._domNode;
    },


    // Private: Set the decoding letter to a random letter
    _setRandomLetter: function () {
        dojo.attr(this._domNode, 'innerHTML',
            this._decodingChars.charAt(ocp.getRandomInt(0, this._decodingChars.length - 1)));
    },


    // Private: Called when the animation has completed and we are at our end position
    _onDecodingDone: function () {

        // Set the final letter in a completed color
        dojo.attr(this._domNode, 'innerHTML', this.endLetter);
        dojo.style(this._domNode, { color: 'green' });

        // If requested, notify that decoding is complete
        if (this.onDecoded) {
            this.onDecoded();
        }
    },


    // Public: Returns if this letter has completed decoding (true) or not (false)
    isDecoded: function () {
        // Decoding is complete if the animation has stopped (due to reaching the end)
        return (this._animation.status() == 'stopped' ? true : false);
    }
});

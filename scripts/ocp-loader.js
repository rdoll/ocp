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
** ocp-loader.js
**
** Support for dynamic AJAX loading of modules.
*/

ocp.loader = {

    // Public: The list of modules the loader is managing, indexed by CSS ID
    _managedModules: {},


    // Public: Initialize ourselves
    initialize: function() {
        // Hook the content download error functions for all managed containers
        dojo.query('.loaderManagedContainer').forEach(dojo.hitch(this, 'hookContainer'));
    },


    // Public: Hook the content download error functions for a given container
    hookContainer: function (container) {
        // Add the new managed module to our list of managed modules
        var id = container.id;
        this._managedModules[id] = new ocp.loader.ManagedModule({ containerId: id });
    },


    // Public: Runs the given function after the specified module has been loaded
    // Throws: error if moduleId is not managed by the loader
    runAfterLoaded: function (moduleId, runFunc) {

        // Validate moduleId
        if (moduleId in this._managedModules) {

            var container = this._managedModules[moduleId]._container;
            if (container.isLoaded) {
                // The container's contents have already been loaded, so just run the function
                runFunc();
            } else {
                // The container's contents have not been loaded.
                // Connect to it's onLoad and then load it.
                // When loaded, disconnect ourselves and run the function.
                // *** Connect leak possible if multiple invocations on broken content?
                // *** Race condition with plannerContentPane's onDownloadEnd="" markup?
                var handle = dojo.connect(container, 'onDownloadEnd', function () {
                    // From closure: handle, runFunc
                    dojo.disconnect(handle);
                    handle = null;
                    runFunc();
                });
            }

            // Switch to the given module, loading it if necessary
            dijit.byId('ocpStackContainer').selectChild(moduleId);
        } else {
            throw 'ocp.loader.runAfterLoaded is not managing moduleId "' + moduleId + '".';
        }
    }
};


/*
** Define a helper class to trap the content download errors for a ContentPane using an href.
*/
dojo.provide('ocp.loader.ManagedModule');
dojo.declare('ocp.loader.ManagedModule', null, {

    // Public: The name of the module as used in error messages
    //         Defaules to the title attribute of the ContentPane container
    moduleName: '',

    // Public: The CSS ID of the ContentPane this is managing
    containerId: '',

    // Private: The ContentPane we are managing
    _container: null,


    // Public: Creates and hooks a managed ContentPane
    // Required args: containerId
    // Optional args: moduleName
    // Throws: errors if args cannot be validated
    constructor: function (/* Object */ args) {

        // Set data members based on args
        dojo.mixin(this, args);

        // Validate containerId and derive _container
        if (this.containerId) {
            this._container = dijit.byId(this.containerId);
            if (!this._container) {
                throw 'ocp.loader.ManagedModule construction failed to find containerId "' +
                    this.containerId + '".';
            }
        } else {
            throw 'ocp.loader.ManagedModule construction requires a containerId.';
        }

        // Derive module name if not given in args
        if (!this.moduleName) {
            this.moduleName = this._container.title;
        }

        // Set a more specific loading message
        this._container.loadingMessage = 'Loading the ' + this.moduleName + '...';

        // Hook the content download error events
        this._container.attr('onDownloadError', dojo.hitch(this, 'onDownloadError'));
        this._container.attr('onContentError',  dojo.hitch(this, 'onContentError'));
    },


    // Public: Called when the ContentPane's content failed to download
    //         The return value string is set as the ContentPane's content
    onDownloadError: function (error) {
        console.log('onDownloadError, containerId=', this.containerId,
            ', error=', error);
        return this._errorMessage(error, 'download');
    },


    // Public: Called when the ContentPane's content downloaded, but failed to parse
    // ***     The return value string is supposed to be set as the ContentPane's content,
    // ***     but since http://bugs.dojotoolkit.org/ticket/9263 still exists in Dojo 1.3.2,
    // ***     the content is never updated. En lieu of a fix, manually set the "fake" content
    // ***     and return nothing.
    onContentError: function (error) {
        console.log('onContentError, containerId=', this.containerId,
            ', error=', error);
        this._container._setContent(this._errorMessage(error, 'parse'), true);
        return undefined;
    },


    // Private: Returns a pretty HTML message (including a retry mechanism)
    //          for the given error/when
    _errorMessage: function (error, when) {
        var retryScript = "dijit.byId('" + this.containerId + "').refresh();";
        var errMsg =
            '<div class="loadingError">' +
                'Failed to ' + when + ' the ' + this.moduleName + '.' +
            '</div>' +
            '<div class="loadingErrorMessage">' + error + '</div>' +
            '<button dojoType="dijit.form.Button" onClick="' + retryScript + '">' +
                'Try Again' +
            '</button>';
        return errMsg;
    }
});
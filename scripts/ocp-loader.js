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

    // Private: The list of modules the loader is managing, indexed by CSS ID
    _managedModules: {},


    // Public: Initialize ourselves
    initialize: function() {
        // Initialize our children
        ocp.loader.relnotes.initialize();

        // Hook the content download error functions for all managed containers
        dojo.query('.loaderManagedContainer').forEach(dojo.hitch(this, 'hookManagedContainer'));
    },


    // Public: Hook the content download error functions for a given container
    hookManagedContainer: function (container) {
        // Add the new managed module to our list of managed modules
        var id = container.id;
        this._managedModules[id] = new ocp.loader.ManagedModule({ containerId: id });
        // TODO: Temp: Prevent caching so I don't need to force reload anything
        this._managedModules[id]._container.ioArgs.preventCache = true;
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

                // The container's contents have not been loaded, so track when the
                // loading has occurred and run the function after.
                // TODO: Race condition with plannerContentPane's onDownloadEnd="" markup?
                var handles = [];

                // On success, disconnect everything and run the function
                handles.push(dojo.connect(container, 'onDownloadEnd', function () {
                    //console.debug('entered runAfterLoaded onDownloadEnd');
                    // From closure: handles, runFunc
                    dojo.forEach(handles, dojo.disconnect);
                    handles = null;
                    runFunc();
                }));

                // On any failure, just disconnect everything
                handles.push(dojo.connect(container, 'onDownloadError', function () {
                    //console.debug('entered runAfterLoaded onDownloadError');
                    // From closure: handles
                    dojo.forEach(handles, dojo.disconnect);
                    handles = null;
                }));
                handles.push(dojo.connect(container, 'onContentError', function () {
                    //console.debug('entered runAfterLoaded onContentError');
                    // From closure: handles
                    dojo.forEach(handles, dojo.disconnect);
                    handles = null;
                }));
            }

            // Switch to the given module, which will load it
            dijit.byId('ocpStackContainer').selectChild(moduleId);
        } else {
            throw 'ocp.loader.runAfterLoaded is not managing moduleId "' + moduleId + '".';
        }
    }
};


/*
** Support for preprocessing the Release Notes' downloaded content
*/

ocp.loader.relnotes = {

    // Public: Initialize ourselves
    initialize: function() {
        // Add a preprocessor to the release notes' content
        dijit.byId('relnotesContentPane').preprocessContent =
            dojo.hitch(this, 'preprocessContent');
    },


    // Public: Preprocess the Release Notes' XML content into pretty HTML content
    //         Input is the downloaded XML DOM and output is returned as HTML DOM
    // Throws: An error for all XML parsing errors
    preprocessContent: function (xmlDom) {
        console.debug('enetered relnotes.preprocessContent', xmlDom);

        // The processed HTML content
        var htmlDom = dojo.create('div', { id: 'relnotes' });

        // Process the Known Issues and Change Log into the HTML results
        this._processKnownIssues(xmlDom, htmlDom);
        this._processChangeLog(xmlDom, htmlDom);

        console.debug('leaving relnotes.preprocessContent', htmlDom);
        return htmlDom;
    },


    // Private: Process the Known Issues in xmlDom to pretty HTML in htmlDom
    _processKnownIssues: function (xmlDom, htmlDom) {

        // Container for the known issues
        var kiHtmlDom = dojo.create('div', { id: 'knownIssues' }, htmlDom);
        dojo.create('div', { class: 'moduleTitle', innerHTML: 'Known Issues' }, kiHtmlDom);

        // Walk through all known issue issues
        var kiIssueNodes = dojo.query('ocp knownissues issue', xmlDom);
        if (kiIssueNodes.length > 0) {

            // There are issues -- walk through them
            dojo.create('div', {
                innerHTML: 'The following known issues and limitations exist in the ' +
                    'current version of OCP:'
            }, kiHtmlDom);
            var kiHtmlListNode = dojo.create('dl', null, kiHtmlDom);
            var _this = this;
            kiIssueNodes.forEach( function (issueNode) {
                // From closure: _this, kiHtmlListNode
                _this._processIssueOrChange(issueNode, kiHtmlListNode);
            });
        } else {

            // There are no issues -- yay for OCP! :D
            dojo.create('div', {
                innerHTML: 'There are no known issues or limitations for the current ' +
                    'release of OCP.'
            }, kiHtmlDom);
        }
    },


    // Private: Process the Change Log in xmlDom to pretty HTML in htmlDom
    _processChangeLog: function (xmlDom, htmlDom) {

        // Container for the change log
        var clHtmlDom = dojo.create('div', { id: 'changeLog' }, htmlDom);
        dojo.create('div', { class: 'moduleTitle', innerHTML: 'Change Log' }, clHtmlDom);

        // Walk through all change log versions
        var clVerNodes = dojo.query('ocp changelog version', xmlDom);
        if (clVerNodes.length > 0) {

            // There are versions -- walk through them
            var _this = this;
            clVerNodes.forEach( function (verNode) {
                // From closure: _this, clHtmlDom
                _this._processVersion(verNode, clHtmlDom);
            });
        } else {

            // There must be at least one version (this one!)
            throw 'Error: There must be at least one "ocp changelog version" defined in ' +
                xmlDom.baseURI;
        }
    },


    // Private: Process a Change Log's Version node into pretty HTML
    _processVersion: function (verNode, clHtmlNode) {

        // Container for this version
        var verHtmlDom = dojo.create('div', { class: 'versionContainer' }, clHtmlNode);

        // Create the header for this version from its attributes
        var verAttrs = ocp.getDomNodeAttrs(verNode,
            { name: true, type: false, scope: true, date: false });
        dojo.create('div', {
            id: 'changelogVersion_' + verAttrs.name.replace(/\W/g, '_'),
            class: 'versionTitle',
            innerHTML: 'Version ' + verAttrs.name +
                ('type' in verAttrs ? ' ' + verAttrs.type : '') +
                (verAttrs.scope == 'public' ? ' publicly released' : ' completed') +
                ('date' in verAttrs ? ' on ' + verAttrs.date : '')
        }, verHtmlDom);

        // Walk through all changes for this version
        var chgNodes = dojo.query('change', verNode);
        if (chgNodes.length > 0) {

            // There are changes -- walk through them
            var verHtmlListNode = dojo.create('dl', null, verHtmlDom);
            var _this = this;
            chgNodes.forEach( function (changeNode) {
                // From closure: _this, verHtmlListNode
                _this._processIssueOrChange(changeNode, verHtmlListNode);
            });
        } else {

            // Every version must have at least one change
            throw 'Error: There must be at least one change for version "' +
                verAttrs.name + '" in ' + verNode.baseURI;
        }
    },


    // Private: Process an XML Issue or Change into HTML list nodes
    //          This works because the XML for both are identical except for their tag name
    //          and the HTML for both is a definition list
    _processIssueOrChange: function (iocXmlNode, iocHtmlListNode) {
        //console.debug('enetered relnotes._processIssueOrChange', iocXmlNode, iocHtmlListNode);

        // Get the issue/change Dom node attributes
        // All attributes are required and throw an error if missing
        var iocNodeAttrs = ocp.getDomNodeAttrs(iocXmlNode, { type: true, name: true });

        // Barf if we don't recognize the type
        if (!/^(bug|function|feature)$/.test(iocNodeAttrs.type)) {
            throw 'Error: Unknown type "' + iocNodeAttrs.type +
                '" for ' + iocXmlNode.nodeName + ' in ' + iocXmlNode.baseURI;;
        }

        // Add the issue/change's name with its type as a CSS class
        dojo.create('dt', {
            class: 'type_' + iocNodeAttrs.type,
            innerHTML: iocNodeAttrs.name
        }, iocHtmlListNode);

        // Add the issue/change's details
        // TODO: Need to allow embedded HTML for emphasis here? textContent strips it.
        dojo.create('dd', { innerHTML: dojo.trim(iocXmlNode.textContent) }, iocHtmlListNode);
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
        console.error('onDownloadError, containerId=', this.containerId,
            ', error=', error);
        return this._errorMessage(error, 'download');
    },


    // Public: Called when the ContentPane's content downloaded, but failed to parse
    // TODO:   The return value string is supposed to be set as the ContentPane's content,
    // TODO:   but since http://bugs.dojotoolkit.org/ticket/9263 still exists in Dojo 1.3.2,
    // TODO:   the content is never updated. En lieu of a fix, manually set the "fake" content
    // TODO:   and return nothing.
    onContentError: function (error) {
        console.error('onContentError, containerId=', this.containerId,
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
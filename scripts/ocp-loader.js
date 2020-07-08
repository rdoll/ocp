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

                // The container's contents have already been loaded, so ensure it is displayed
                // and then run the function
                ocp.setMainModule(moduleId);
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

                // Switch to the given module, which will load it
                ocp.setMainModule(moduleId);
            }
        } else {
            throw 'ocp.loader.runAfterLoaded is not managing moduleId "' + moduleId + '".';
        }
    },


    // Public: Set the module as the main module and shows the given submodule
    showSubmodule: function (moduleId, subModId) {

        // Allow the submodule ID to be abbreviated
        if (!subModId.match(new RegExp('^' + moduleId))) {
            subModId = moduleId + subModId;
        }

        // After the module is loaded, switch to the given submodule
        this.runAfterLoaded(moduleId + 'ContentPane', function () {
            // From closure: moduleId, subModId
            dijit.byId(moduleId).selectChild(subModId);
        });
    }
};


/*
** Support for preprocessing the Release Notes' downloaded content
*/

ocp.loader.relnotes = {

    // Private: Location of our images
    IMAGE_DIR: ocp.IMAGE_ROOT_DIR + 'icons/',


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

        // Capture any processing errors so we can clean up
        try {
            // Process the Known Issues and Change Log into the HTML results
            this._processKnownIssues(xmlDom, htmlDom);
            this._processChangeLog(xmlDom, htmlDom);
        } catch (err) {
            // There was a processing error. So the content can be loaded again,
            // destroy all widgets and DOM nodes that did get processed.
            console.debug('destroying htmlDom', htmlDom);
            dijit.findWidgets(htmlDom).forEach(function (widget) {
                widget.destroyRecursive(false);
            });
            dojo.destroy(htmlDom);

            // Regenerate the error so it can be handled by the loader
            throw err;
        }

        console.debug('leaving relnotes.preprocessContent', htmlDom);
        return htmlDom;
    },


    // Private: Process the Known Issues in xmlDom to pretty HTML in htmlDom
    _processKnownIssues: function (xmlDom, htmlDom) {

        // Container for the known issues
        var kiHtmlDom = dojo.create('div', {
            id: 'knownIssues',
            class: 'moduleSection'
        }, htmlDom);
        dojo.create('div', { class: 'moduleTitle', innerHTML: 'Known Issues' }, kiHtmlDom);

        // Walk through all known issue issues
        var kiIssueNodes = dojo.query('ocp knownissues issue', xmlDom);
        if (kiIssueNodes.length > 0) {

            // There are issues -- walk through them
            dojo.create('div', {
                innerHTML:
                    'The following known issues and limitations exist in this version of OCP:'
            }, kiHtmlDom);
            var kiHtmlTableBody = dojo.create('tbody', null,
                dojo.create('table', null, kiHtmlDom));
            var _this = this;
            kiIssueNodes.forEach(function (issueNode) {
                // From closure: _this, kiHtmlTableBody
                _this._processIssueOrChange(issueNode, kiHtmlTableBody, 'open',
                    'Known bug or limitation', 'Known feature omission or deficiency');
            });
        } else {

            // There are no issues -- yay for OCP! :D
            dojo.create('div', {
                innerHTML: 'There are no known issues or limitations in this version of OCP.'
            }, kiHtmlDom);
        }
    },


    // Private: Process the Change Log in xmlDom to pretty HTML in htmlDom
    _processChangeLog: function (xmlDom, htmlDom) {

        // Container for the change log
        var clHtmlDom = dojo.create('div', {
            id: 'changeLog',
            class: 'moduleSection'
        }, htmlDom);
        dojo.create('div', { class: 'moduleTitle', innerHTML: 'Change Log' }, clHtmlDom);

        // Expand/collapse all buttons
        var buttCont = dojo.create('div', { class: 'expCollButtons' }, clHtmlDom);
        new dijit.form.Button({
            label: 'Expand All',
            onClick: function () {
                ocp.expCollTitlePanes('#changeLog .versionItem', true);
            }
        }, dojo.create('span', null, buttCont));
        new dijit.form.Button({
            label: 'Collapse All',
            onClick: function () {
                ocp.expCollTitlePanes('#changeLog .versionItem', false);
            }
        }, dojo.create('span', null, buttCont));

        // Walk through all change log versions
        var clVerNodes = dojo.query('ocp changelog version', xmlDom);
        if (clVerNodes.length > 0) {

            // There are versions -- walk through them
            var _this = this;
            clVerNodes.forEach(function (verNode) {
                // From closure: _this, clHtmlDom
                _this._processVersion(verNode, clHtmlDom);
            });

            // Open the first version to show its contents (all versions start closed)
            var openedFirst = false;
            dojo.query('.versionItem', clHtmlDom).forEach(function (verItemHtmlNode) {
                // From closure: openedFirst
                if (!openedFirst) {
                    dijit.getEnclosingWidget(verItemHtmlNode).attr('open', true);
                    openedFirst = true;
                }
            });
        } else {

            // There must be at least one version (this one!)
            throw 'Error: There must be at least one "ocp changelog version" defined in ' +
                xmlDom.baseURI;
        }
    },


    // Private: Process a Change Log's Version node into pretty HTML
    _processVersion: function (verNode, clHtmlNode) {

        // Derive the header for this version from its attributes
        var verAttrs = ocp.getDomNodeAttrs(verNode,
            { name: true, type: false, scope: true, date: false });
        var verText = 'Version ' + verAttrs.name +
            ('type' in verAttrs ? ' ' + verAttrs.type : '');
        if (verAttrs.scope == 'wip') {
            verText += ' is still in development';
        } else {
            verText +=
                (verAttrs.scope == 'public' ? ' publicly released' : ' privately completed') +
                ('date' in verAttrs ? ' on ' + verAttrs.date : '');
        }
        var titlePane = new dijit.TitlePane({
            id: 'changelogVersion_' + verAttrs.name.replace(/\W/g, '_'),
            class: 'versionItem',
            open: false,
            title: verText
        }, dojo.create('div', null, clHtmlNode));

        // Walk through all changes for this version
        var chgNodes = dojo.query('change', verNode);
        if (chgNodes.length > 0) {

            // There are changes -- walk through them
            var verHtmlTableNode = dojo.create('table', null);
            var verHtmlTableBody = dojo.create('tbody', null, verHtmlTableNode);
            var _this = this;
            chgNodes.forEach(function (changeNode) {
                // From closure: _this, verHtmlTableBody
                _this._processIssueOrChange(changeNode, verHtmlTableBody, 'closed',
                    'Fixed bug or removed limitation',
                    'Added new feature, filled deficiency, or removed unneeded feature');
            });

            // Now put the version HTML into the title pane
            titlePane.attr('content', verHtmlTableNode);
        } else {

            // Every version must have at least one change
            throw 'Error: There must be at least one change for version "' +
                verAttrs.name + '" in ' + verNode.baseURI;
        }
    },


    // Private: Process an XML Issue or Change into HTML list nodes
    //          This works because the XML for both are identical except for their tag name
    //          and the HTML for both is a definition list
    _processIssueOrChange: function (iocXmlNode, iocHtmlNode, iconStatus, bugDesc, featureDesc) {

        // Get the issue/change Dom node attributes
        // All attributes are required and throw an error if missing
        var iocNodeAttrs = ocp.getDomNodeAttrs(iocXmlNode, { type: true, name: true });

        // Barf if we don't recognize the type
        if (!/^(bug|feature)$/.test(iocNodeAttrs.type)) {
            throw 'Error: Unknown type "' + iocNodeAttrs.type +
                '" for ' + iocXmlNode.nodeName + ' in ' + iocXmlNode.baseURI;;
        }

        // Create the table row for this issue or change
        var iocRowNode = dojo.create('tr', null, iocHtmlNode);

        // Put the image icon in the first column
        dojo.create('img', {
            src: this.IMAGE_DIR + iocNodeAttrs.type + '-' + iconStatus + '.png',
            alt: '[' + iocNodeAttrs.type + ' icon]',
            title: (iocNodeAttrs.type == 'bug' ? bugDesc : featureDesc),
        }, dojo.create('td', null, iocRowNode));

        // Create the 2nd column for the description
        var iocCol2Node = dojo.create('td', null, iocRowNode);

        // Title of the item
        dojo.create('div', {
            class: 'iocItemTitle',
            innerHTML: iocNodeAttrs.name
        }, iocCol2Node);

        // Details of the item
        // TODO: Need to allow embedded HTML for emphasis here? textContent strips it.
        dojo.create('div', {
            class: 'iocItemDetails',
            innerHTML: dojo.trim(iocXmlNode.textContent)
        }, iocCol2Node);
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
        console.error('onDownloadError, containerId=', this.containerId, ', error=', error);
        return this._errorMessage(error, 'download');
    },


    // Public: Called when the ContentPane's content downloaded, but failed to parse
    // TODO:   The return value string is supposed to be set as the ContentPane's content,
    // TODO:   but since http://bugs.dojotoolkit.org/ticket/9263 still exists in Dojo 1.3.2,
    // TODO:   the content is never updated. En lieu of a fix, manually set the "fake" content
    // TODO:   and return nothing.
    onContentError: function (error) {
        console.error('onContentError, containerId=', this.containerId, ', error=', error);
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
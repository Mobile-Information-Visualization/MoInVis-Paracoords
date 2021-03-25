/*
*
* Descr.: Base class for Overlay tab. 
*         Event handling, provides an interface for tabmanager.
* 
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.overlayTab = function ( parentDiv ) {

    var self = this,
        _tabHandle,
        _overlayTabId = null,
        _setTabId = function ( id ) {
            _overlayTabId = id;
        };

    // Instantiate the Vue app here.
    this.initVue = function ( vueData, vueMethods, vueComponents ) {
        var mainApp =
            Vue.createApp( {
                data: function () {
                    return vueData;
                },
                methods: vueMethods || {}
            } ),
            dataProxy;
        if ( vueComponents ) {
            for ( componentName in vueComponents ) {
                mainApp.component( componentName, vueComponents[componentName] );
            }
        }
        dataProxy = mainApp.mount( _tabHandle.parentTab.node() );
        return { mainApp, dataProxy };
    };

    this.getTabHandle = function () {
        return _tabHandle;
    };

    this.activateTab = function () {
        this.moin.tabManager.activateOverlayTab( _overlayTabId );
        if ( this.onTabActivated ) {
            // onTabActivated method to be created in the child classes.
            this.onTabActivated();
        }
    };

    this.deactivateTab = function () {
        this.moin.tabManager.deactivateOverlayTab();
    };

    // Called whenever this tab comes into focus.
    this.onTabInFocus = function () {
        if ( this.onTabFocus ) {
            this.onTabFocus();
        }
    };

    _tabHandle = {
        parentTab: parentDiv,
        setId: _setTabId
    };
};

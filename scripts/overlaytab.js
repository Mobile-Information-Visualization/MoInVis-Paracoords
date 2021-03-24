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
    this.initVue = function ( vueData, vueMethods ) {
        var mainApp =
            Vue.createApp( {
                data: function () {
                    return vueData;
                },
                methods: vueMethods || {}
            } );
        mainApp.mount( _tabHandle.parentTab.node() );
        return mainApp;
    };

    this.getTabHandle = function () {
        return _tabHandle;
    };

    this.activateTab = function () {
        self.moin.tabManager.activateOverlayTab( _overlayTabId );
    };

    this.deactivateTab = function () {
        self.moin.tabManager.deactivateOverlayTab();
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

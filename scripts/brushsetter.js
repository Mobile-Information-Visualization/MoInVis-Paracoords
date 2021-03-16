var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
/*
*
* Descr.: Handles data and UI functionality for the brush setter overlay tab.
*         Inherits MoInVis.Paracoords.overlayTab
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.brushSetter = function ( moin, parentDiv ) {
    this.moin = moin;
    MoInVis.Paracoords.brushSetter.baseCtor.call( this, parentDiv );

    var self = this,
        _parentDiv = parentDiv,
        _vueData,
        _vueApp,
        _closeTab = function ( event ) {
            self.deactivateTab();
            this.pointerDownX = false;
        },
        _onPointerDown = function (event) {
            this.pointerDownX = true;
        },
        _onPointerUp = function (event) {
            this.pointerDownX = false;
        },

        _init = function () {
            var vueStuff,
                vueData = {
                    tabName: 'Brush Settings',
                    brushes: [{ axisName: 'Rubber Waste', rangeText: ['yo', 'haha'], active: true }],
                    pointerDownX: false
                },
                vueMethods = { closeTab: _closeTab, onPointerDown: _onPointerDown, onPointerUp: _onPointerUp };
            vueStuff = self.initVue( vueData, vueMethods );
            _vueApp = vueStuff.mainApp;
            _vueData = vueStuff.dataProxy;
            _parentDiv.style( 'background', 'rgba( 50, 50, 50, 0.75)' );
        };

    this.onTabActivated = function () {
        // Get brush configurations.
        var brushConfig = this.moin.paracoorder.getBrushConfigurations();
        brushConfig.forEach( ( config, index ) => _vueData.brushes.splice( index, 1, config ) );
        //Vue.set( _vueData.brushes, index, config );
    };

    _init();
};


MoInVis.Paracoords.brushSetter.baseCtor = MoInVis.Paracoords.overlayTab;
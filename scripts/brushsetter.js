var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
/*
*
* Descr.: Handles data and UI functionality for the brush setter overlay tab.
*         Inherits MoInVis.Paracoords.overlayTab
*
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

        _init = function () {
            _vueData = {
                tabName: 'Enter the Brush setter!'
            };
            _vueApp = self.initVue( _vueData );
            _parentDiv.style( 'background', 'rgba( 50, 50, 50, 0.75)' );
        };

    _init();
};


MoInVis.Paracoords.brushSetter.baseCtor = MoInVis.Paracoords.overlayTab;
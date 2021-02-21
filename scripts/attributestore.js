/*
*
* Descr.: Handles data and UI functionality for the attribute store tab.
*         Inherits MoInVis.Paracoords.tab
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.attributeStore = function ( moin, parentDiv, axes ) {
    this.moin = moin;
    MoInVis.Paracoords.attributeStore.baseCtor.call( this, parentDiv );

    //Jimmy: Debug
    console.log(axes);

    var self = this,
        _parentDiv = parentDiv,
        _axes = axes,
        _vueData,
        _vueApp,

        _init = function () {
            _vueData = {
                tabName: 'I am the Attribute Store!',
                axesArray: _axes,
                numberAxesInFocus:3,
            
            };
            
            _vueApp = self.initVue( _vueData );
        };

    _init();
};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;


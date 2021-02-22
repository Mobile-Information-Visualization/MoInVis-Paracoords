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

    console.log(axes); //Jimmy: Debug

    var self = this,
        _parentDiv = parentDiv,
        _axes = axes,
        _vueData,
        _vueApp,

        _init = function () {
            _vueData = {
                tabName: 'I am the Attribute Store!',
                axesArray: _axes,
                numberAxesInFocus:5,
                methods: {
                    decreaseNumber: _decreaseNumber
                   
                }
            
            };
            
            _vueApp = self.initVue( _vueData );
        };

        _decreaseNumber = function (){
            console.log(_vueData.numberAxesInFocus);
            _vueData.numberAxesInFocus -= 1;
            
        };

    _init();
};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;


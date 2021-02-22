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
        _vueMethods,
        _vueApp,

        _init = function () {
            _vueData = {
                tabName: 'I am the Attribute Store!',
                axesArray: _axes,
                maxAxesInFocus: 6,
                minAxesInFocus: 2,
                numberAxesInFocus:5            
            };
            _vueMethods = {
                decreaseNumber: _decreaseNumber
            };
            
            _vueApp = self.initVue( _vueData, _vueMethods );
        };

    _decreaseNumber = function () {
            // 'this' refer to the proxy of the sent data created by vue.
            if (this.numberAxesInFocus <= this.maxAxesInFocus && this.numberAxesInFocus > this.minAxesInFocus){

                this.numberAxesInFocus -= 1;
                console.log(this.numberAxesInFocus);
            }
                        
        };

    _init();
};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;


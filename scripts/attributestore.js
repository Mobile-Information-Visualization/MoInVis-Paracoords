var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.parentSvg = 'ParaCoordContainerSVG';
MoInVis.Paracoords.IdStore.defs = 'MoInVisParaCoordDefs';

MoInVis.Paracoords.attributeStore = function ( moin, parentDiv, axes ) {
    this.moin = moin;
    MoInVis.Paracoords.attributeStore.baseCtor.call( this, parentDiv );

    var self = this,
        _parentDiv = parentDiv,
        _axes = axes,
        _vueData,
        _vueApp,

        _init = function () {
            _vueData = {
                tabName: 'I am the Attribute Store!'
            };
            _vueApp = self.initVue( _vueData );
        };

    _init();
};

MoInVis.Paracoords.attributeStore.baseCtor = MoInVis.Paracoords.tab;
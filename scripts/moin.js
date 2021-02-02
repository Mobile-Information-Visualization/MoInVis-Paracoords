var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.parentSvg = 'ParaCoordContainerSVG';
MoInVis.Paracoords.IdStore.defs = 'MoInVisParaCoordDefs';
MoInVis.Paracoords.Count = MoInVis.Paracoords.Count || 0;
MoInVis.Paracoords.TransitionSpeed = 1000;
MoInVis.Paracoords.DeleteTransitionSpeed = 500;
MoInVis.Paracoords.HammerSettings = {
    events: {
        swipeUp: 'swipeup',
        swipeDown: 'swipedown',
        swipeLeft: 'swipeleft',
        swipeRight: 'swiperight'
    },
    swipeThreshold: 10, swipeVelocity: 1.5
};

MoInVis.Paracoords.moin = function ( width, height ) {

    var _parentSVG,
        self = this,

        _init = function () {

            // Create parent SVG
            var defs = document.createElementNS( 'http://www.w3.org/2000/svg', 'defs' ),
                paracoordTab = d3.select( '#paracoordTab' );

            _parentSVG = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
            _parentSVG.setAttributeNS( null, 'width', '100%' );
            _parentSVG.setAttributeNS( null, 'height', '100%' );
            _parentSVG.setAttributeNS( null, 'id', MoInVis.Paracoords.IdStore.parentSvg );

            defs.setAttributeNS( null, 'id', MoInVis.Paracoords.IdStore.defs );
            _parentSVG.appendChild( defs );

            self.width = width;
            self.height = height;

            paracoordTab.node().appendChild( _parentSVG );

            // Create paracoorder object
            self.paracoorder = new MoInVis.Paracoords.paracoorder( self, paracoordTab, d3.select( _parentSVG ) );
            self.paracoorder.init( 0, 0 );
            self.paracoorder.draw();

            self.attributeStore = new MoInVis.Paracoords.attributeStore( self, d3.select( '#attrStoreTab' ), self.paracoorder.axes  );

            self.entryStore = new MoInVis.Paracoords.entryStore( self, d3.select( '#entryStoreTab' ), self.paracoorder.paths );

            self.tabManager = new MoInVis.Paracoords.tabManager( self, [self.entryStore.getTabHandle(), self.attributeStore.getTabHandle(), self.paracoorder.getTabHandle()], 2 );
        };

    _init();
};

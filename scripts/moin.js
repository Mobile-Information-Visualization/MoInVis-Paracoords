/*
*
* Descr.: Moin Instance. Application parent class that creates tabs, and tabhandler.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.moin = 'MoInVis_ParaCoords';
MoInVis.Paracoords.IdStore.parentSvg = 'ContainerSVG';
MoInVis.Paracoords.IdStore.defs = 'SVGDefs';
MoInVis.Paracoords.Count = MoInVis.Paracoords.Count || 0;
MoInVis.Paracoords.Unit = 'tonnes';
MoInVis.Paracoords.UnitShort = 't';
MoInVis.Paracoords.NormalTransitionSpeed = 1000;
MoInVis.Paracoords.OverlayTransitionSpeed = 1000;
MoInVis.Paracoords.FastTransitionSpeed = 500;
MoInVis.Paracoords.DeleteTransitionSpeed = 500;
MoInVis.Paracoords.TransitionSpeed = MoInVis.Paracoords.NormalTransitionSpeed;

MoInVis.Paracoords.ColourScheme = {
    Normal: 0,
    ColourblindSafe: 1
};

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

            self.width = width;
            self.height = height;
            self.id = MoInVis.Paracoords.IdStore.moin + '_' + ( MoInVis.Paracoords.Count++ );

            _parentSVG = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
            _parentSVG.setAttributeNS( null, 'width', '100%' );
            _parentSVG.setAttributeNS( null, 'height', '100%' );
            _parentSVG.setAttributeNS( null, 'id', self.id + '_' + MoInVis.Paracoords.IdStore.parentSvg );

            defs.setAttributeNS( null, 'id', self.id + '_' + MoInVis.Paracoords.IdStore.defs );
            _parentSVG.appendChild( defs );


            paracoordTab.node().appendChild( _parentSVG );

            // Create paracoorder object
            self.paracoorder = new MoInVis.Paracoords.paracoorder( self, paracoordTab, d3.select( _parentSVG ) );
            self.paracoorder.init( 0, 0 );
            self.paracoorder.draw();

            self.attributeStore = new MoInVis.Paracoords.attributeStore( self, d3.select( '#attrStoreTab' ), self.paracoorder.axes, self.paracoorder.getFocusAndContextSettings() );

            self.entryStore = new MoInVis.Paracoords.entryStore( self, d3.select( '#entryStoreTab' ), self.paracoorder.paths );

            self.tabManager = new MoInVis.Paracoords.tabManager( self, [self.entryStore.getTabHandle(), self.attributeStore.getTabHandle(), self.paracoorder.getTabHandle()], 2 );

            self.brushSetter = new MoInVis.Paracoords.brushSetter( self, d3.select( '#brushSetterOverlay' ) );
            self.tabManager.addOverlayTab( self.brushSetter.getTabHandle() );

            self.axisDetailView = new MoInVis.Paracoords.axisDetailView( self, d3.select( '#axisDetailViewOverlay' ) );
            self.tabManager.addOverlayTab( self.axisDetailView.getTabHandle() );

            // The tabs might cause a distortion in actual window height.
            // If the heights and widths have changed, correct the sizing of tabs and paracoorder elements.
            if ( window.innerHeight !== self.height || window.innerWidth !== self.width ) {
                self.height = window.innerHeight;
                self.width = window.innerWidth;
                self.tabManager.resize();
                self.paracoorder.resize();
            }
        };

    this.paraCoorderRedrawReq = false;

    this.colourScheme = MoInVis.Paracoords.ColourScheme.Normal;

    _init();

};

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.parentSvg = 'ParaCoordContainerSVG';
MoInVis.Paracoords.IdStore.defs = 'MoInVisParaCoordDefs';

MoInVis.Paracoords.handler = MoInVis.Paracoords.handler || {};

MoInVis.Paracoords.handler.main = function () {

    // Create parent SVG
    var parentSvg = document.createElementNS( "http://www.w3.org/2000/svg", "svg" );
    parentSvg.setAttributeNS( null, 'width', '100%' );
    parentSvg.setAttributeNS( null, 'height', '100%' );
    parentSvg.setAttributeNS( null, 'id', MoInVis.Paracoords.IdStore.parentSvg );

    // CRITICAL: Restrict browser from handling touch gestures for things like browser refresh, next tab, previous tab.
    parentSvg.style.touchAction = 'none';

    var defs = document.createElementNS( 'http://www.w3.org/2000/svg', 'defs' );
    defs.setAttributeNS( null, 'id', MoInVis.Paracoords.IdStore.defs );
    parentSvg.appendChild( defs );


    var mainDiv = document.getElementById( 'mainDiv' );
    mainDiv.style.height = window.innerHeight - 20 + 'px';
    mainDiv.appendChild( parentSvg );

    // Create paracoorder object
    MoInVis.Paracoords.handler.visualizer = new MoInVis.Paracoords.paracoorder( window.innerWidth, window.innerHeight - 20, d3.select( parentSvg ) );
    MoInVis.Paracoords.handler.visualizer.init(0,0);
    MoInVis.Paracoords.handler.visualizer.draw();
}();

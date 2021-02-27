/*
*
* Descr.: Handles creation of interaction group, and handles events for axis brushing and reordering.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.axisInteractionManager = function ( axis, axisGroup, axisId, attrScale, paracoorder ) {
    // Private variables.
    var self = this,
        _axis = axis,
        _axisGroup = axisGroup,
        _axisId = axisId,
        _attrScale = attrScale,
        _interactionGroup,
        _eventCatcher,
        _hammerMan,
        _brushManager,
        _brushMode,
        _axisReorderMode,
        _paracoorder = paracoorder;

    this.init = function ( brushManager ) {
        _interactionGroup = _axisGroup
            .append( 'g' )
            .attr( 'id', _axisId + '_InteractionGroup' );

        // Draw the event catcher.
        _eventCatcher = _interactionGroup
            .append( 'rect' )
            .attr( 'id', _axisId + '_EventCatcher' )
            .attr( 'x', _axis.xPos )
            .attr( 'y', -_axis.height / 2 )
            .attr( 'height', _axis.height )
            .attr( 'width', _attrScale.range()[1] - _attrScale.range()[0] )
            .attr( 'opacity', 0 )
            .attr( 'fill', 'black' );


        _hammerMan = new Hammer.Manager( _interactionGroup.node() );
        _hammerMan.add( new Hammer.Pan( { event: 'pan', pointers: 1, direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 } ) );
        _hammerMan.add( new Hammer.Tap( { event: 'tap', pointers: 1 } ) );

        _brushManager = brushManager;
        _brushManager.init( _interactionGroup, _hammerMan );


        _brushMode = true; // Brush mode is on for initial operation.
        _axisReorderMode = false; // Axis reorder mode is off.

        // Add events to handle brushing.
        _hammerMan.on( 'panstart', _brushManager.panStart );
        _hammerMan.on( 'panend', _brushManager.panEnd );
        _hammerMan.on( 'pan', _brushManager.onPan );
        _hammerMan.on( 'tap', _brushManager.onTap );
    };

    // [TODO]: Write methods to handle axis reordering.

};
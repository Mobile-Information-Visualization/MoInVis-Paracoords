/*
*
* Descr.: Handles creation of interaction group, and handles events for axis brushing and reordering.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.axisInteractionManager = function ( axis, axisGroup, axisInnerGroup, axisId, attrScale, paracoorder ) {
    // Private variables.
    var self = this,
        _axis = axis,
        _axisGroup = axisGroup,
        _axisInnerGroup = axisInnerGroup,
        _axisId = axisId,
        _attrScale = attrScale,
        _eventCatcher,
        _hammerMan,
        _horizontalPanRecognizer,
        _fullPanRecognizer,
        _brushManager,
        _brushMode,
        _paracoorder = paracoorder;


    this.init = function ( brushManager ) {

        // Draw the event catcher.
        _eventCatcher = _axisInnerGroup
            .insert( 'rect', ':first-child' )
            .attr( 'id', _axisId + '_EventCatcher' )
            .attr( 'x', _axis.xPos )
            .attr( 'y', -_axis.height / 2 )
            .attr( 'height', _axis.height )
            .attr( 'width', _attrScale.range()[1] - _attrScale.range()[0] )
            .attr( 'opacity', 0 )
            .attr( 'fill', 'black' );


        _hammerMan = new Hammer.Manager( _axisGroup.node() );

        _horizontalPanRecognizer = new Hammer.Pan( {
            event: 'pan',
            pointers: 1,
            direction: Hammer.DIRECTION_HORIZONTAL,
            threshold: 10
        } ); // Used when not in reorder mode.

        _fullPanRecognizer = new Hammer.Pan( {
            event: 'pan',
            pointers: 1,
            direction: Hammer.DIRECTION_VERTICAL,
            threshold: 10
        } ); // Used in reorder mode.

        _hammerMan.add( _horizontalPanRecognizer ); // Start simple.
        _hammerMan.add( new Hammer.Tap( { event: 'tap', pointers: 1 } ) );
        _hammerMan.add( new Hammer.Press( { event: 'press', pointers: 1, time: 500 } ) );
        _hammerMan.add( new Hammer.Swipe( { event: 'swipeleft', pointers: 1, velocity: 0.4 } ) );

        _brushManager = brushManager;
        _brushManager.init( _axisInnerGroup, _hammerMan );


        _brushMode = true; // Brush mode is on for initial operation.
        // _axisReorderMode = false; // Axis reorder mode is off.

        // Add events to handle brushing.
        _hammerMan.on( 'panstart', this.onInteraction );
        _hammerMan.on( 'panend', this.onInteraction );
        _hammerMan.on( 'pan', this.onInteraction );
        _hammerMan.on( 'tap', this.onInteraction );
        _hammerMan.on( 'press', this.onInteraction );
        _hammerMan.on( 'swipeleft', this.onInteraction );
    };

    this.enterAxesReorderMode = function () {
        // Deactivate brush interactions.
        _hammerMan.remove( _horizontalPanRecognizer );
        // Activate reorder mode interactions.
        _hammerMan.add( _fullPanRecognizer );
    };

    this.leaveAxesReorderMode = function () {
        // Deactivate reorder mode interactions.
        _hammerMan.remove( _fullPanRecognizer );
        // Activate brush interactions.
        _hammerMan.add( _horizontalPanRecognizer );
    };

    this.onInteraction = function ( event ) {
        const eventType = event.type;

        // Offer reorder mode interactions.
        if ( _paracoorder.checkIfAxesReorderMode() ) {
            switch ( eventType ) {

                case 'panstart':
                    _paracoorder.startAxisReordering( _axis.yPos, _axisId, _axis.indexInVisibilityArray, _axis.height );
                    break;

                case 'pan':
                    _paracoorder.reorderAxis( event.deltaY, _axis.indexInVisibilityArray );
                    break;

                case 'panend':
                    _paracoorder.stopAxisReordering( _axis.indexInVisibilityArray );
                    break;

                case 'swipeleft':
                    _paracoorder.removeAxis( _axis.indexInVisibilityArray );
                    break;
            }
        }
        // Offer normal interactions.
        else {
            switch ( eventType ) {

                case 'panstart':
                    _brushManager.panStart( event );
                    break;

                case 'pan':
                    _brushManager.onPan( event );
                    break;

                case 'panend':
                    _brushManager.panEnd( event );
                    break;

                case 'tap':
                    _brushManager.onTap( event );
                    break;

                case 'press':
                    _paracoorder.enterAxesReorderMode();
                    break;
            }
        }
    };

};
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
        var singleTap,
            doubleTap;
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

        singleTap = new Hammer.Tap( { event: 'singletap', taps: 1, pointers: 1 } );
        doubleTap = new Hammer.Tap( { event: 'doubletap', taps: 2, posThreshold: 50, interval: 500 } );

        _hammerMan.add( [doubleTap, singleTap] );

        doubleTap.recognizeWith( singleTap );
        singleTap.requireFailure( doubleTap );

        _hammerMan.add( new Hammer.Press( { event: 'press', pointers: 1, time: 500 } ) );
        _hammerMan.add( new Hammer.Swipe( { event: 'swipe', pointers: 1, velocity: 0.3, direction: Hammer.DIRECTION_HORIZONTAL } ) );

        _brushManager = brushManager;
        _brushManager.init( _axisInnerGroup, _hammerMan );


        _brushMode = true; // Brush mode is on for initial operation.
        // _axisReorderMode = false; // Axis reorder mode is off.

        // Add events to handle brushing.
        _hammerMan.on( 'panstart', this.onInteraction );
        _hammerMan.on( 'panend', this.onInteraction );
        _hammerMan.on( 'pan', this.onInteraction );
        _hammerMan.on( 'singletap', this.onInteraction );
        _hammerMan.on( 'doubletap', this.onInteraction );
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
        const targetId = event.changedPointers[0].target.id;

        // Offer reorder mode interactions.
        if ( _paracoorder.checkIfAxesReorderMode() ) {
            switch ( eventType ) {
                case 'panstart':
                    _paracoorder.startAxisReordering( _axis.yPos, _axisId, _axis.indexInVisibilityArray, _axis.height );
                    break;

                case 'pan':
                    _paracoorder.reorderAxis( event.deltaY, _axis.indexInVisibilityArray, _axis.indexInGlobalArray );
                    break;

                case 'panend':
                    _paracoorder.stopAxisReordering( _axis.indexInVisibilityArray );
                    break;

                case 'swipeleft':
                    _paracoorder.removeAxis( _axis.indexInVisibilityArray, _axis.indexInGlobalArray, true );
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

                case 'singletap':
                    if ( targetId.includes( 'LabelText', 0 ) ) {
                        _paracoorder.moin.axisDetailView.setUpData( _axis.attribute, _axis.attributeLabel, _paracoorder.paths );
                        _paracoorder.moin.axisDetailView.activateTab();
                    }
                    else {
                        _brushManager.onTap( event );
                    }
                    break;

                case 'doubletap':
                    _brushManager.onDoubleTap( event );
                    break;

                case 'press':
                    if ( targetId.includes( 'LabelText', 0 ) ) {
                        _paracoorder.enterAxesReorderMode();
                    }
                    break;
            }
        }
    };

};
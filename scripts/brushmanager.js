/*
*
* Descr.: Handles creation and management of brushes for an axis.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.brushManager = function ( axisGroup, axisId, attrScale, paracoorder, xPos ) {
    // Private variables.
    var self = this,
        _axisGroup = axisGroup,
        _brushParent,
        _brushes = [],
        _activeBrushes = [],
        _inactiveBrushes = [],
        _activeBrush,
        _paracoorder = paracoorder,
        _axisId = axisId,
        _attrScale = attrScale,
        _eventCatcher,
        _ecHeight = 80,
        _brushHeight = 30,
        _xPos = xPos,
        _gesturePos,
        _hammerMan,
        _brushHandlePanning = false,

        _init = function () {
            _brushParent = _axisGroup
                .append( 'g' )
                .attr( 'id', _axisId + '_BrushGroup' );

            // Draw the event catcher.
            _eventCatcher = _brushParent
                .append( 'rect' )
                .attr( 'id', _axisId + '_EventCatcher' )
                .attr( 'x', _xPos )
                .attr( 'y', -_ecHeight / 2 )
                .attr( 'height', _ecHeight )
                .attr( 'width', _attrScale.range()[1] - _attrScale.range()[0] )
                .attr( 'opacity', 0 )
                .attr( 'fill', 'black' );

            _hammerMan = new Hammer.Manager( _brushParent.node() );
            _hammerMan.add( new Hammer.Pan( { event: 'pan', pointers: 1, direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 } ) );
            _hammerMan.on( 'panstart', _panStart );
            _hammerMan.on( 'panend', _panEnd );
            _hammerMan.on( 'pan', _onPan );


            _hammerMan.add( new Hammer.Tap( { event: 'tap', pointers: 1 } ) );
            _hammerMan.on( 'tap', _onTap );
        },

        // Prepares to handle panning gesture.
        _panStart = function ( event ) {
            var createNewBrush = true, gestureOrigin = {}, index, length, clientRect;
            if ( _paracoorder.scrollingInProgress ) {
                // If scrolling is taking place, do not handle this event.
                _hammerMan.stop( true );
            } else {
                _paracoorder.brushingInProgress = true;
                gestureOrigin.x = event.center.x - event.deltaX;
                gestureOrigin.y = event.center.y - event.deltaY;
                if ( ( length = _activeBrushes.length ) > 0 ) {
                    // Check to see if panning origninated on the handles.
                    clientRect = _brushParent.node().getBoundingClientRect();
                    gestureOrigin.y -= clientRect.top + clientRect.height / 2;
                    for ( i = 0; i < length; i++ ) {
                        if ( _activeBrushes[i].checkHandleInteraction( gestureOrigin ) ) {
                            _activeBrush = _activeBrushes[i];
                            createNewBrush = false;
                            _brushHandlePanning = true;
                            break;
                        }
                    }
                }
                if ( createNewBrush ) {
                    if ( _activeBrushes.length === 0 ) { // [TODO]: Remove check to handle drawing of multiple brushes.
                        //if ( _isValidStart( gestureOrigin.x ) ) { // [TODO]: Uncomment check to handle drawing of multiple brushes.
                        if ( _inactiveBrushes.length > 0 ) {
                            _activeBrush = _inactiveBrushes.pop();
                            _activeBrush.resetBrush( gestureOrigin.x )
                        } else {
                            _activeBrush = new MoInVis.Paracoords.axisBrush( _brushParent, _axisId + '_Brush_' + ( _brushes.length ), _brushHeight );
                            _activeBrush.draw( gestureOrigin.x, 0 );
                            _brushes.push( _activeBrush );
                        }
                        // [TODO]: Create mechanism to select a colour for brushes.
                        _activeBrush.setColour( 'red' );
                        _activeBrushes.push( _activeBrush );
                    }
                }
            }
        },

        // Handles the panning motion.
        _onPan = function ( event ) {
            // [TODO]: Handle panning with deltas instead of exact values.
            if ( _activeBrush ) {
                _gesturePos = event.center.x;
                // Check for interference with other brushes
                if ( _isValidMove() ) {
                    if ( _brushHandlePanning ) {
                        _activeBrush.moveBrushHandle( _gesturePos );
                    } else {
                        _activeBrush.setBrushEnd( _gesturePos );
                    }
                    _paracoorder.brushPaths();
                }
            }
        },

        // Ends the pan event.
        _panEnd = function ( event ) {
            _paracoorder.brushingInProgress = false;
            if ( _activeBrush ) {
                _gesturePos = event.center.x;
                if ( _brushHandlePanning ) {
                    // Check for interference with other brushes
                    if ( _isValidMove() ) {
                        _activeBrush.moveBrushHandle( _gesturePos );
                        _brushHandlePanning = false;
                    }
                } else {
                    // Check for interference with other brushes
                    if ( _isValidMove() ) {
                        _activeBrush.setBrushEnd( _gesturePos );
                    }
                }
                _activeBrush.onBrushingEnd();
                _activeBrush = null;
                _paracoorder.brushPaths();
            }
        },

        // Checks if movement of brush edge is valid.
        _isValidMove = function () {
            var length = _activeBrushes.length, i, validMove = true, probableHandlePos, range = _attrScale.range();
            if ( _gesturePos >= range[1] ) {
                _gesturePos = range[1];
            } else if ( _gesturePos <= range[0] ) {
                _gesturePos = range[0];
            }
            if ( length > 1 ) {
                probableHandlePos = _activeBrush.getProbableHandlePos( _gesturePos );
                for ( i = 0; i < length; i++ ) {
                    if ( _activeBrushes[i] !== _activeBrush ) {
                        if ( _activeBrushes[i].isInterfering( probableHandlePos ) ) { // [TODO]: Add robustness, so handle positions update to best possible change.
                            validMove = false;
                            break;
                        }
                    }
                }
            }
            return validMove;
        },

        // Checks if start of brush is valid.
        _isValidStart = function ( xPos ) {
            var length = _activeBrushes.length, i, validMove = true, probableHandlePos, range = _attrScale.range();
            if ( xPos <= range[1] && xPos >= range[0] ) {
                if ( length ) {
                    probableHandlePos = [xPos, xPos];
                    for ( i = 0; i < length; i++ ) {
                        if ( _activeBrushes[i].isInterfering( probableHandlePos ) ) {
                            validMove = false;
                            break;
                        }
                    }

                }
            } else {
                validMove = false;
            }
            return validMove;
        },

        // If a brush is tapped, show its handles.
        _onTap = function ( event ) {
            var id, index;
            if ( _activeBrushes.length > 0 ) {
                id = event.changedPointers[0].target.id;
                if ( id ) {
                    index = event.changedPointers[0].target.id.split( _axisId + '_Brush_' )[1];
                    if ( index ) {
                        index = parseInt( index.split( '_' )[0] );
                        if ( isNaN( index ) === false ) {
                            _brushes[index].onBrushTapped();
                        }
                    }
                }
            }
        };

    // Checks if a point on the axis has been brushed.
    this.checkPathBrushed = function ( xPos ) {
        var i, length = _activeBrushes.length, brushed = length === 0; // When there are no brushes, then the point can said to have been brushed.
        for ( i = 0; i < length; i++ ) {
            brushed = brushed || _activeBrushes[i].checkPathBrushed( xPos );
        }
        return brushed;
    };

    _init();
};
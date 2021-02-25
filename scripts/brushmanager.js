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
        _ecHeight = 40,
        _brushHeight = 30,
        _xPos = xPos,
        _hammerMan,
        _handlePanning = false,

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
                .attr( 'stroke', 'red' )
                .attr( 'stroke-width', '1' )
                .attr( 'opacity', 0.25 )
                .attr( 'fill', 'black' );

            _hammerMan = new Hammer.Manager( _brushParent.node() );
            _hammerMan.add( new Hammer.Pan( { event: 'pan', pointers: 1, direction: Hammer.DIRECTION_HORIZONTAL, threshold: MoInVis.Paracoords.brushManager.panThreshold } ) );
            _hammerMan.on( 'panstart', _panStart );
            _hammerMan.on( 'panend', _panEnd );
            _hammerMan.on( 'pan', _onPan );


            _hammerMan.add( new Hammer.Tap( { event: 'tap', pointers: 1 } ) );
            _hammerMan.on( 'tap', _onTap );
        },

        _panStart = function ( event ) {
            var createNewBrush = true, gestureOrigin = {}, index, length, clientRect;
            if ( _paracoorder.scrollingInProgress ) {
                _hammerMan.stop( true );
            } else {
                console.log( 'Brush pan start' );
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
                            _handlePanning = true;
                            console.log( 'Brush handle panning start' );
                            break;
                        }
                    }
                }
                if ( createNewBrush ) {
                    if ( _inactiveBrushes.length > 0 ) {
                        _activeBrush = _inactiveBrushes.pop();
                        _activeBrush.resetBrush( gestureOrigin.x )
                    } else {
                        _activeBrush = new MoInVis.Paracoords.axisBrush( _brushParent, _axisId + '_Brush_' + ( _brushes.length ), _brushHeight );
                        _activeBrush.draw( gestureOrigin.x, 0 );
                        _brushes.push( _activeBrush );
                    }
                    _activeBrushes.push( _activeBrush );
                }
            }
        },

        _panEnd = function ( event ) {
            console.log( 'Brush pan end' );
            if ( _activeBrush ) {
                _paracoorder.brushingInProgress = false;
                if ( _handlePanning ) {
                    _activeBrush.moveBrushHandle( event.center.x );
                    _handlePanning = false;
                } else {
                    _activeBrush.setBrushEnd( event.center.x );
                }
                _activeBrush.onBrushingEnd();
                _activeBrush = null;
            }
        },

        _isValidMove = function ( xPos ) {
            var length = _activeBrushes.length, i, validMove = true;
            if ( length > 1 ) {
                for ( i = 0; i < length; i++ ) {
                    if ( _activeBrushes[i] !== _activeBrush ) {
                        if ( _activeBrushes[i].isInterfering( xPos ) ) {
                            validMove = false;
                            break;
                        }
                    }
                }
            }
            return validMove;
        },

        _onPan = function ( event ) {
            var xPos;
            console.log( 'Brush pan happening' );
            if ( _activeBrush ) {
                xPos = event.center.x;
                // Check for interference with other brushes
                if ( _isValidMove( xPos ) ) {
                    if ( _handlePanning ) {
                        _activeBrush.moveBrushHandle( xPos );
                    } else {
                        _activeBrush.setBrushEnd( xPos );
                    }
                }
            } else {
                _hammerMan.stop( true );
            }
        },

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

    this.createBrush = function () {

    };

    this.visible = true;

    this.setVisibility = function ( visible ) {
        this.visible = visible;
        // [TODO]: Make _brushGroup visible or invisible.
    };

    this.getXY = function ( value ) {
        return [_attrScale( value ), this.yPos];
    };

    this.draw = function ( xPos, yPos ) {
        this.xPos = xPos;
        this.yPos = yPos;
    };

    _init();
};

MoInVis.Paracoords.brushManager.panThreshold = 20;
/*
*
* Descr.: Creates an individual brush for an axis.
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};

MoInVis.Paracoords.axisBrush = function ( brushParent, id, brushHeight ) {
    // Private variables.
    var self = this,
        _brushStart,
        _brushEnd,
        _brushTop,
        _brushParent = brushParent,
        _brushGroup,
        _brushHeight = brushHeight,
        _brushRect,
        _id = id,
        _handleStart,
        _handleEnd,
        _handleStartGrp,
        _handleEndGrp,
        _handleWidth = 30,
        _handleSlantHeight = 26,
        _handleCurveHeight = 22,
        _handleLeft = - _handleWidth / 2,
        _eHTop = -_handleSlantHeight,
        _sHTop = _handleSlantHeight,
        _eHCurveTop = _eHTop - _handleCurveHeight,
        _sHCurveBottom = _sHTop + _handleCurveHeight,
        _fatFingerMargin = 5,
        _shInteraction = false,
        _ehInteraction = false,
        _handleColour = 'red',
        _handleOpacity = 1,
        _handleVisibility = false,
        _handleTimer,
        _stopTimer = function () {
            if ( _handleTimer ) {
                _handleTimer.stop();
                _handleTimer = null;
            }
        },
        _hideHandles = function () {
            _handleTimer.stop();
            _handleTimer = null;
            _handleStartGrp
                .transition()
                .attr( 'opacity', 0 )
                .on( 'end', function () {
                    _handleStartGrp.style( 'display', 'none' )
                } );
            _handleEndGrp
                .transition()
                .attr( 'opacity', 0 )
                .on( 'end', function () {
                    _handleEndGrp.style( 'display', 'none' )
                } );
            _handleVisibility = false;
        };

    // Public methods
    this.init = function () {
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
        _brushStart = xPos;
        _brushEnd = _brushStart + 1;
        _brushTop = yPos - _brushHeight / 2;
        _brushGroup = _brushParent
            .append( 'g' )
            .attr( 'id', _id + '_grp' );
        _brushRect = _brushGroup
            .append( 'rect' )
            .attr( 'id', _id + '_rect' )
            .attr( 'x', _brushStart )
            .attr( 'y', _brushTop )
            .attr( 'height', _brushHeight )
            .attr( 'width', _brushEnd - _brushStart )
            .attr( 'stroke', 'red' )
            .attr( 'stroke-width', '1' )
            .attr( 'opacity', 0.25 )
            .attr( 'fill', 'red' );

        _handleStartGrp = _brushGroup
            .append( 'g' )
            .attr( 'id', _id + '_handle_start_grp' )
            .attr( 'opacity', 0 );
        _handleEndGrp = _brushGroup
            .append( 'g' )
            .attr( 'id', _id + '_handle_end_grp' )
            .attr( 'opacity', 0 );

        _handleEnd = _handleEndGrp
            .append( 'path' )
            .attr( 'id', _id + '_HandleEndPath' )
            .attr( 'stroke-width', 0 )
            .attr( 'stroke', _handleColour )
            .attr( 'fill', _handleColour )
            //.attr( 'd', 'M -8 -14 C -8 -26 8 -26 8 -14 L 0 0 L -8 -14' )
            .attr( 'd', 'M ' + _handleLeft + ' ' + _eHTop + ' C ' + _handleLeft + ' ' + ( _eHCurveTop ) + ' ' + ( _handleLeft + _handleWidth ) + ' ' + ( _eHCurveTop ) + ' ' + ( _handleLeft + _handleWidth ) + ' ' + _eHTop + ' L 0 0 L ' + _handleLeft + ' ' + _eHTop );

        _handleEndGrp
            .append( 'rect' )
            .attr( 'id', _id + '_handleEndECRect' )
            .attr( 'x', -MoInVis.Paracoords.brushManager.panThreshold )
            .attr( 'y', _eHCurveTop )
            .attr( 'height', - _eHCurveTop )
            .attr( 'width', 2 * MoInVis.Paracoords.brushManager.panThreshold )
            .attr( 'stroke', 'red' )
            .attr( 'stroke-width', '1' )
            .attr( 'opacity', 0.25 )
            .attr( 'fill', 'blue' );
        _handleStart = _handleStartGrp
            .append( 'path' )
            .attr( 'id', _id + '_HandleEndPath' )
            .attr( 'stroke-width', 0 )
            .attr( 'stroke', _handleColour )
            .attr( 'fill', _handleColour )
            //.attr( 'd', 'M -8 14 C -8 26 8 26 8 14 L 0 0 L -8 14' )
            .attr( 'd', 'M ' + _handleLeft + ' ' + _sHTop + ' C ' + _handleLeft + ' ' + ( _sHCurveBottom ) + ' ' + ( _handleLeft + _handleWidth ) + ' ' + ( _sHCurveBottom ) + ' ' + ( _handleLeft + _handleWidth ) + ' ' + _sHTop + ' L 0 0 L ' + _handleLeft + ' ' + _sHTop );
        _handleStartGrp
            .append( 'rect' )
            .attr( 'id', _id + '_handleStartECRect' )
            .attr( 'x', -MoInVis.Paracoords.brushManager.panThreshold )
            .attr( 'y', 0 )
            .attr( 'height', _sHCurveBottom )
            .attr( 'width', 2 * MoInVis.Paracoords.brushManager.panThreshold )
            .attr( 'stroke', 'red' )
            .attr( 'stroke-width', '1' )
            .attr( 'opacity', 0.25 )
            .attr( 'fill', 'blue' );
    };

    this.resetBrush = function ( xPos ) {
        _brushStart = xPos;
        _brushEnd = _brushStart + 1;
        _brushRect
            .attr( 'x', _brushStart )
            .attr( 'width', _brushEnd - _brushStart );
    };

    this.setBrushStart = function ( brushStart ) {
        _brushStart = brushStart;
        if ( _brushEnd < _brushStart ) {
            _brushRect
                .attr( 'x', _brushEnd )
                .attr( 'width', _brushStart - _brushEnd );
        } else {
            _brushRect
                .attr( 'x', _brushStart )
            _brushRect
                .attr( 'width', _brushEnd - _brushStart );
        }
        _handleEndGrp
            .attr( 'transform', 'translate(' + _brushEnd + ',' + ( -_brushHeight / 2 ) + ')' );
        _handleStartGrp
            .attr( 'transform', 'translate(' + _brushStart + ',' + ( _brushHeight / 2 ) + ')' );
    };

    this.setBrushEnd = function ( brushEnd ) {
        _brushEnd = brushEnd;
        if ( _brushEnd < _brushStart ) {
            _brushRect
                .attr( 'x', _brushEnd )
                .attr( 'width', _brushStart - _brushEnd );
        } else {
            _brushRect
                .attr( 'width', _brushEnd - _brushStart );
        }
        _handleEndGrp
            .attr( 'transform', 'translate(' + _brushEnd + ',' + ( -_brushHeight / 2 ) + ')' );
        _handleStartGrp
            .attr( 'transform', 'translate(' + _brushStart + ',' + ( _brushHeight / 2 ) + ')' );
    };

    this.moveBrushHandle = function ( handlePos ) {
        if ( _ehInteraction ) {
            this.setBrushEnd( handlePos );
        } else if ( _shInteraction ) {
            this.setBrushStart( handlePos );
        }
    };

    this.onBrushingEnd = function () {
        _shInteraction = _ehInteraction = false;
        _handleVisibility = true;
        _handleStartGrp
            .style( 'display', 'inherit' )
            .attr( 'opacity', 1 );
        _handleEndGrp
            .style( 'display', 'inherit' )
            .attr( 'opacity', 1 );
        _handleTimer = d3.interval( _hideHandles, 2500 );
    };

    this.onBrushTapped = function () {
        if ( _handleTimer ) {
            _handleTimer.restart( _hideHandles, 2500 );
        } else {
            this.onBrushingEnd();
        }
    };

    // Check if panning originated on the handles.
    this.checkHandleInteraction = function ( gestureOrigin ) {
        var leftBound, rightBound, endBound;
        _shInteraction = _ehInteraction = false;
        if ( _handleVisibility ) {
            if ( gestureOrigin.y <= (-_brushHeight / 2 + _fatFingerMargin) ) {
                // Check for end handle interaction.
                endBound = -_brushHeight / 2 + _eHCurveTop - _fatFingerMargin;
                if ( gestureOrigin.y >= endBound ) {
                    leftBound = _brushEnd - _handleWidth / 2 - _fatFingerMargin;
                    rightBound = _brushEnd + _handleWidth / 2 + _fatFingerMargin;
                    if ( gestureOrigin.x >= leftBound && gestureOrigin.x <= rightBound ) {
                        _ehInteraction = true;
                        _stopTimer();
                    }
                }
            } else if ( gestureOrigin.y >= _brushHeight / 2 - _fatFingerMargin ) {
                // Check for start handle interaction.
                endBound = _brushHeight / 2 + _sHCurveBottom + _fatFingerMargin;
                if ( gestureOrigin.y <= endBound ) {
                    leftBound = _brushStart - _handleWidth / 2 - _fatFingerMargin;
                    rightBound = _brushStart + _handleWidth / 2 + _fatFingerMargin;
                    if ( gestureOrigin.x >= leftBound && gestureOrigin.x <= rightBound ) {
                        _shInteraction = true;
                        _stopTimer();
                    }
                }
            }
        }
        return _shInteraction || _ehInteraction;
    };

    this.isInterfering = function (xPos) {
        var leftBound, rightBound;
        if ( _brushEnd < _brushStart ) {
            leftBound = _brushEnd;
            rightBound = _brushStart;
        } else {
            leftBound = _brushStart;
            rightBound = _brushEnd;
        }
        return ( xPos >= leftBound && xPos <= rightBound );
    };
};

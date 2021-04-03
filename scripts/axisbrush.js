/*
*
* Descr.: Class for an individual brush.
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
        _brushColour = 'red',
        _brushOpacity = 0.4,
        _brushRect,
        _tapCapturer,
        _tapHeight = 40,
        _brushStrokeWidth = 4,
        _handleStart,
        _handleEnd,
        _handleStartGrp,
        _handleEndGrp,
        _handleWidth = 50,
        _handleSlantHeight = 44,
        _handleCurveHeight = 40,
        _handleLeft = - _handleWidth / 2,
        _eHTop = -_handleSlantHeight,
        _sHTop = _handleSlantHeight,
        _eHCurveTop = _eHTop - _handleCurveHeight,
        _sHCurveBottom = _sHTop + _handleCurveHeight,
        _fatFingerMargin = 10,
        _handleGestureChecker = {
            topHBottom: -_brushHeight / 2 + _fatFingerMargin,
            topHTop: -_brushHeight / 2 + _eHCurveTop - _fatFingerMargin,
            bottomHBottom: _brushHeight / 2 + _sHCurveBottom + _fatFingerMargin,
            bottomHTop: _brushHeight / 2 - _fatFingerMargin,
            leftRightMargin: _handleWidth / 2 + _fatFingerMargin,
        },
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

    this.id = id;

    // Public methods
    this.init = function () {
    };

    this.visible = true;

    this.setVisibility = function ( visible ) {
        this.visible = visible;
        if ( this.visible ) {
            _brushGroup
                .style( 'display', 'inherit' )
                .attr( 'opacity', 1 );
        } else {
            _brushGroup
                .attr( 'opacity', 0 )
                .style( 'display', 'none' );
            if ( _handleVisibility ) {
                _hideHandles();
            }
        }
    };

    this.hideHandles = function () {
        if ( _handleVisibility ) {
            _hideHandles();
        }
    };

    this.setColour = function ( colour ) {
        _brushColour = _handleColour = colour;
        if ( _brushRect ) {
            _brushRect
                .attr( 'stroke', _brushColour )
                .attr( 'fill', _brushColour );
        }
        if ( _handleStart ) {
            _handleStart
                .attr( 'stroke', _handleColour )
                .attr( 'fill', _handleColour );
        }
        if ( _handleEnd ) {
            _handleEnd
                .attr( 'stroke', _handleColour )
                .attr( 'fill', _handleColour );
        }
    };

    this.draw = function ( xPos, yPos ) {
        _brushStart = xPos;
        _brushEnd = _brushStart + 1;
        _brushTop = yPos - _brushHeight / 2;
        _brushGroup = _brushParent
            .append( 'g' )
            .attr( 'id', this.id + '_grp' )
            .attr( 'stroke-opacity', 0 );

        _brushRect = _brushGroup
            .append( 'rect' )
            .attr( 'id', this.id + '_rect' )
            .attr( 'x', _brushStart )
            .attr( 'y', _brushTop )
            .attr( 'height', _brushHeight )
            .attr( 'width', _brushEnd - _brushStart )
            .attr( 'rx', _brushHeight / 2 )
            .attr( 'stroke-width', _brushStrokeWidth )
            .attr( 'fill-opacity', _brushOpacity )
            .attr( 'stroke-opacity', 'inherit' )
            .attr( 'stroke', _brushColour )
            .attr( 'fill', _brushColour );
        _tapCapturer = _brushGroup
            .append( 'rect' )
            .attr( 'id', this.id + '_TapCapturer' )
            .attr( 'x', _brushStart )
            .attr( 'y', yPos - _tapHeight / 2 )
            .attr( 'height', _tapHeight )
            .attr( 'width', _brushEnd - _brushStart )
            .attr( 'stroke-width', _brushStrokeWidth )
            .attr( 'opacity', 0 )
            .attr( 'fill', 'black' );

        _handleStartGrp = _brushGroup
            .append( 'g' )
            .attr( 'id', this.id + '_handle_start_grp' )
            .attr( 'stroke-opacity', 'inherit' )
            .attr( 'opacity', 0 );

        _handleStart = _handleStartGrp
            .append( 'path' )
            .attr( 'id', this.id + '_HandleEndPath' )
            .attr( 'stroke-width', _brushStrokeWidth )
            .attr( 'stroke-opacity', 'inherit' )
            .attr( 'stroke', _handleColour )
            .attr( 'fill-opacity', 0.8 )
            .attr( 'fill', _handleColour )
            //.attr( 'd', 'M -8 14 C -8 26 8 26 8 14 L 0 0 L -8 14' )
            .attr( 'd', 'M ' + _handleLeft + ' ' + _sHTop + ' C ' + _handleLeft + ' ' + ( _sHCurveBottom ) + ' ' + ( _handleLeft + _handleWidth ) + ' ' + ( _sHCurveBottom ) + ' ' + ( _handleLeft + _handleWidth ) + ' ' + _sHTop + ' L 0 0 L ' + _handleLeft + ' ' + _sHTop );
        _handleStartGrp
            .append( 'rect' )
            .attr( 'id', this.id + '_HandleEndRect' )
            .attr( 'x', - _handleGestureChecker.leftRightMargin )
            .attr( 'y', 0 )
            .attr( 'width', 2 * _handleGestureChecker.leftRightMargin )
            .attr( 'height', _sHCurveBottom + _fatFingerMargin )
            .attr( 'opacity', 0 )
            .attr( 'fill', 'black' );

        _handleEndGrp = _brushGroup
            .append( 'g' )
            .attr( 'id', this.id + '_handle_end_grp' )
            .attr( 'stroke-opacity', 'inherit' )
            .attr( 'opacity', 0 );

        _handleEnd = _handleEndGrp
            .append( 'path' )
            .attr( 'id', this.id + '_HandleEndPath' )
            .attr( 'stroke-width', _brushStrokeWidth )
            .attr( 'stroke-opacity', 'inherit' )
            .attr( 'fill-opacity', 0.8 )
            .attr( 'stroke', _handleColour )
            .attr( 'fill', _handleColour )
            //.attr( 'd', 'M -8 -14 C -8 -26 8 -26 8 -14 L 0 0 L -8 -14' )
            .attr( 'd', 'M ' + _handleLeft + ' ' + _eHTop + ' C ' + _handleLeft + ' ' + ( _eHCurveTop ) + ' ' + ( _handleLeft + _handleWidth ) + ' ' + ( _eHCurveTop ) + ' ' + ( _handleLeft + _handleWidth ) + ' ' + _eHTop + ' L 0 0 L ' + _handleLeft + ' ' + _eHTop );
        _handleEndGrp
            .append( 'rect' )
            .attr( 'id', this.id + '_HandleEndRect' )
            .attr( 'x', - _handleGestureChecker.leftRightMargin )
            .attr( 'y', _eHCurveTop - _fatFingerMargin )
            .attr( 'width', 2 * _handleGestureChecker.leftRightMargin )
            .attr( 'height', Math.abs( _eHCurveTop - _fatFingerMargin ) )
            .attr( 'opacity', 0 )
            .attr( 'fill', 'black' );

    };

    // Resets brush after activation.
    this.resetBrush = function ( xPos ) {
        _brushStart = xPos;
        _brushEnd = _brushStart + 1;
        _brushRect
            .attr( 'x', _brushStart )
            .attr( 'width', _brushEnd - _brushStart );
        _tapCapturer
            .attr( 'x', _brushStart )
            .attr( 'width', _brushEnd - _brushStart );
    };

    // Sets the start bound of the brush.
    this.setBrushStart = function ( brushStart ) {
        _brushStart = brushStart;
        if ( _brushEnd < _brushStart ) {
            _brushRect
                .attr( 'x', _brushEnd )
                .attr( 'width', _brushStart - _brushEnd );
            _tapCapturer
                .attr( 'x', _brushEnd )
                .attr( 'width', _brushStart - _brushEnd );
        } else {
            _brushRect
                .attr( 'x', _brushStart )
                .attr( 'width', _brushEnd - _brushStart );
            _tapCapturer
                .attr( 'x', _brushStart )
                .attr( 'width', _brushEnd - _brushStart );
        }
        _handleEndGrp
            .attr( 'transform', 'translate(' + _brushEnd + ',' + ( -_brushHeight / 2 ) + ')' );
        _handleStartGrp
            .attr( 'transform', 'translate(' + _brushStart + ',' + ( _brushHeight / 2 ) + ')' );
    };

    // Sets the end bound of the brush.
    this.setBrushEnd = function ( brushEnd ) {
        _brushEnd = brushEnd;
        if ( _brushEnd < _brushStart ) {
            _brushRect
                .attr( 'x', _brushEnd )
                .attr( 'width', _brushStart - _brushEnd );
            _tapCapturer
                .attr( 'x', _brushEnd )
                .attr( 'width', _brushStart - _brushEnd );
        } else {
            _brushRect
                .attr( 'width', _brushEnd - _brushStart );
            _tapCapturer
                .attr( 'width', _brushEnd - _brushStart );
        }
        _handleEndGrp
            .attr( 'transform', 'translate(' + _brushEnd + ',' + ( -_brushHeight / 2 ) + ')' );
        _handleStartGrp
            .attr( 'transform', 'translate(' + _brushStart + ',' + ( _brushHeight / 2 ) + ')' );
    };

    this.setNewBounds = function ( newBounds ) {
        _brushStart = newBounds[0];
        _brushEnd = newBounds[1];

        _brushRect
            .transition()
            .duration( MoInVis.Paracoords.NormalTransitionSpeed )
            .attr( 'x', _brushStart )
            .attr( 'width', _brushEnd - _brushStart );

        _tapCapturer
            .attr( 'x', _brushStart )
            .attr( 'width', _brushEnd - _brushStart );

        _handleEndGrp
            .attr( 'transform', 'translate(' + _brushEnd + ',' + ( -_brushHeight / 2 ) + ')' );
        _handleStartGrp
            .attr( 'transform', 'translate(' + _brushStart + ',' + ( _brushHeight / 2 ) + ')' );
    };

    // Moves active handle of the brush.
    this.moveBrushHandle = function ( handlePos ) {
        if ( _ehInteraction ) {
            this.setBrushEnd( handlePos );
        } else if ( _shInteraction ) {
            this.setBrushStart( handlePos );
        }
    };

    // End brushing.
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
        _brushGroup
            .transition()
            .duration( MoInVis.Paracoords.FastTransitionSpeed )
            .attr( 'stroke-opacity', 0 );
    };

    // Handles taps on the brush.
    this.onBrushTapped = function () {
        if ( _handleTimer ) {
            _handleTimer.restart( _hideHandles, 2500 );
        } else {
            this.onBrushingEnd();
        }
    };

    // Check if panning originated on the handles.
    this.checkHandleInteraction = function ( gestureOrigin ) {
        var leftBound, rightBound;
        _shInteraction = _ehInteraction = false;
        if ( _handleVisibility ) {
            if ( gestureOrigin.y <= ( _handleGestureChecker.topHBottom ) ) {
                // Check for end handle interaction.
                if ( gestureOrigin.y >= _handleGestureChecker.topHTop ) {
                    leftBound = _brushEnd - _handleGestureChecker.leftRightMargin;
                    rightBound = _brushEnd + _handleGestureChecker.leftRightMargin;
                    if ( gestureOrigin.x >= leftBound && gestureOrigin.x <= rightBound ) {
                        _ehInteraction = true;
                        _stopTimer();
                        _brushGroup.attr( 'stroke-opacity', 1 );
                    }
                }
            } else if ( gestureOrigin.y >= _handleGestureChecker.bottomHTop ) {
                // Check for start handle interaction.
                if ( gestureOrigin.y <= _handleGestureChecker.bottomHBottom ) {
                    leftBound = _brushStart - _handleGestureChecker.leftRightMargin;
                    rightBound = _brushStart + _handleGestureChecker.leftRightMargin;
                    if ( gestureOrigin.x >= leftBound && gestureOrigin.x <= rightBound ) {
                        _shInteraction = true;
                        _stopTimer();
                        _brushGroup.attr( 'stroke-opacity', 1 );
                    }
                }
            }
        }
        return _shInteraction || _ehInteraction;
    };

    // Check if probable handle positions of other brushes due to movement are interfering with this brush.
    this.isInterfering = function ( probableHandlePos ) {
        var brushBounds = [_brushStart, _brushEnd].sort( ( a, b ) => a - b );
        return !( probableHandlePos[1] < brushBounds[0] || probableHandlePos[0] > brushBounds[1] );
    };

    // Get the probable future handle position of this brush due to movement.
    this.getProbableHandlePos = function ( xPos ) {
        var probableHandlePos = [];
        if ( _shInteraction ) {
            probableHandlePos = [xPos, _brushEnd];
        } else {
            probableHandlePos = [_brushStart, xPos];
        }
        return probableHandlePos.sort( ( a, b ) => a - b );
    };

    // Check if a point is brushed.
    this.checkPathBrushed = function ( xPos ) {
        var brushBounds = [_brushStart, _brushEnd].sort( ( a, b ) => a - b );
        return xPos >= brushBounds[0] && xPos <= brushBounds[1];
    };

    // Gets the current bounds of the brush.
    this.getBrushBounds = function () {
        return [_brushStart, _brushEnd].sort( ( a, b ) => a - b );
    };
};

/*
*
* Descr.: Handles drawings the UI and data for the paracoords tab.
*         Inherits MoInVis.Paracoords.tab
*
* <Description>
*/

var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.paracoordClipper = 'ParaCoordClipper';
MoInVis.Paracoords.IdStore.TopCIGradNormal = 'TopCIGradNormal';
MoInVis.Paracoords.IdStore.BottomCIGradNormal = 'BottomCIGradNormal';
MoInVis.Paracoords.IdStore.TopCIGradPressed = 'TopCIGradPressed';
MoInVis.Paracoords.IdStore.BottomCIGradPressed = 'BottomCIGradPressed';

MoInVis.Paracoords.paracoorder = function ( moin, parentDiv, svgParent ) {
    this.moin = moin;
    MoInVis.Paracoords.paracoorder.baseCtor.call( this, parentDiv );


    // Private variables.
    var self = this,
        _svgParent = svgParent,
        _parentDiv = parentDiv,
        _chosenYear = 2018, // Since we are concentrating on the year 2018. The data structure allows for storage of more than a year.
        _id = moin.id + '_svg',
        _visibleAxes = [],
        _axisHeight,
        _focusAndContextSettings = { // Settings for focus and context.
            focusIndex: 1,
            axesInContext: 2,
            axesInFocus: 3,
            maxAxesInFocus: 5,
            minAxesInFocus: 2,
            extraGapFactor: 7, // Factor indicating how much more space axes in focus have between each other w.r.t axes in context.
            contextAxisOverflow: 0, // Gap between two context axes in pixels
            contextAxisOverflowFactor: 0.5,
            pinchAxisOverflow: 0
        },
        _focusIndex = _focusAndContextSettings.focusIndex,
        _axesInFocus,
        _axesInContext,
        _axesInBottomContext,
        _axesInTopContext,
        _axesInViewPortCount, // _axesInFocus and the _axesInContext.
        _axesPositions = [],
        _axesReorderMode = false,
        _pinchScrollProps = {
            deltaY: 0, // Stores the deltaY value from last pan event.
            overflowY: 0, // Stores the amount moved by axis (overflowing above current position).
            initialDistance: 0,
            topPointerId: 0,
            bottomPointerId: 0,
            lastAxisRearrangement: 0, // Time of last axis rearrangement.
            transitionSpeed: MoInVis.Paracoords.FastTransitionSpeed, // Transition speed to be used during scrolling to make it more responsive.
            timer: null
        },
        _xPos = 0,
        _yPos = 0,
        _parentGroup,
        _paracoordHolder,
        _axisParentGroup,
        _pathParentGroup,
        _height = moin.height,
        _width = moin.width,
        _topCI,
        _bottomCI,
        _ciSize,
        _attrScales = new Map(),
        _margins = { left: 0, right: 0, top: 0, bottom: 0 }, // Margins for our content, including texts.
        _positionProps = { // Positions for our content, including texts.
            top: _margins.top,
            left: _margins.left,
            width: _width - _margins.left - _margins.right,
            height: _height - _margins.top - _margins.bottom
        },
        _innerMargins = { left: _width * 0.06, right: _width * 0.06, top: _width * 0.06, bottom: _width * 0.06 }, // Margins for the visualization.
        _innerPositionProps = { // Positions for our visualizations.
            top: _positionProps.top + _innerMargins.top,
            left: _positionProps.left + _innerMargins.left,
            width: _positionProps.width - _innerMargins.left - _innerMargins.right,
            height: _positionProps.height - _innerMargins.top - _innerMargins.bottom,
            hideAtTop: - 0.5 * _positionProps.height,
            hideAtBottom: _positionProps.top + _innerMargins.top + 1.5 * _positionProps.height
        },
        _clipRect,
        _lastPosY = 0,
        _lastDeltaY = 0,
        _isDragging = false,
        _yPosOfVisibleAxes = [],
        _dragBuffer, // Buffer for better dragging

        // Private methods.
        _initializeClipping = function () {
            _clipRect = _parentGroup
                .append( 'clipPath' )
                .attr( 'id', MoInVis.Paracoords.IdStore.paracoordClipper )
                .append( 'rect' );
            _clipRect
                .attr( 'x', _positionProps.left )
                .attr( 'y', _positionProps.top )
                .attr( 'height', _positionProps.height )
                .attr( 'width', _positionProps.width );
        },

        // Creates gradient for the context indicators.
        _createStyles = function () {
            var defs = document.getElementById( self.moin.id + '_' + MoInVis.Paracoords.IdStore.defs ),
                linearGrad,
                stopElement;
            // Top CI gradient - Normal
            linearGrad = document.createElementNS( 'http://www.w3.org/2000/svg', 'linearGradient' );
            linearGrad.setAttributeNS( null, 'id', MoInVis.Paracoords.IdStore.TopCIGradNormal );
            linearGrad.setAttributeNS( null, 'x1', '0%' );
            linearGrad.setAttributeNS( null, 'x2', '0%' );
            linearGrad.setAttributeNS( null, 'y1', '0%' );
            linearGrad.setAttributeNS( null, 'y2', '100%' );

            stopElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );
            stopElement.setAttributeNS( null, 'offset', '0%' );
            stopElement.setAttributeNS( null, 'stop-color', 'rgba(0,0,0,0.8)' );
            linearGrad.appendChild( stopElement );

            stopElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );
            stopElement.setAttributeNS( null, 'offset', '100%' );
            stopElement.setAttributeNS( null, 'stop-color', 'rgba(50,50,50,0)' );
            linearGrad.appendChild( stopElement );

            defs.appendChild( linearGrad );

            // Top CI gradient - Pressed
            linearGrad = document.createElementNS( 'http://www.w3.org/2000/svg', 'linearGradient' );
            linearGrad.setAttributeNS( null, 'id', MoInVis.Paracoords.IdStore.TopCIGradPressed );
            linearGrad.setAttributeNS( null, 'x1', '0%' );
            linearGrad.setAttributeNS( null, 'x2', '0%' );
            linearGrad.setAttributeNS( null, 'y1', '0%' );
            linearGrad.setAttributeNS( null, 'y2', '100%' );

            stopElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );
            stopElement.setAttributeNS( null, 'offset', '0%' );
            stopElement.setAttributeNS( null, 'stop-color', 'rgba(0,0,0,0.8)' );
            linearGrad.appendChild( stopElement );

            stopElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );
            stopElement.setAttributeNS( null, 'offset', '100%' );
            stopElement.setAttributeNS( null, 'stop-color', 'rgba(50,50,50,0)' );
            linearGrad.appendChild( stopElement );

            defs.appendChild( linearGrad );

            // Bottom gradient - Normal
            linearGrad = document.createElementNS( 'http://www.w3.org/2000/svg', 'linearGradient' );
            linearGrad.setAttributeNS( null, 'id', MoInVis.Paracoords.IdStore.BottomCIGradNormal );
            linearGrad.setAttributeNS( null, 'x1', '0%' );
            linearGrad.setAttributeNS( null, 'x2', '0%' );
            linearGrad.setAttributeNS( null, 'y1', '0%' );
            linearGrad.setAttributeNS( null, 'y2', '100%' );

            stopElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );
            stopElement.setAttributeNS( null, 'offset', '0%' );
            stopElement.setAttributeNS( null, 'stop-color', 'rgba(50,50,50,0)' );
            linearGrad.appendChild( stopElement );

            stopElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );
            stopElement.setAttributeNS( null, 'offset', '100%' );
            stopElement.setAttributeNS( null, 'stop-color', 'rgba(0,0,0,0.8)' );
            linearGrad.appendChild( stopElement );

            defs.appendChild( linearGrad );

            // Bottom gradient - Pressed
            linearGrad = document.createElementNS( 'http://www.w3.org/2000/svg', 'linearGradient' );
            linearGrad.setAttributeNS( null, 'id', MoInVis.Paracoords.IdStore.BottomCIGradPressed );
            linearGrad.setAttributeNS( null, 'x1', '0%' );
            linearGrad.setAttributeNS( null, 'x2', '0%' );
            linearGrad.setAttributeNS( null, 'y1', '0%' );
            linearGrad.setAttributeNS( null, 'y2', '100%' );

            stopElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );
            stopElement.setAttributeNS( null, 'offset', '0%' );
            stopElement.setAttributeNS( null, 'stop-color', 'rgba(50,50,50,0)' );
            linearGrad.appendChild( stopElement );

            stopElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'stop' );
            stopElement.setAttributeNS( null, 'offset', '100%' );
            stopElement.setAttributeNS( null, 'stop-color', 'rgba(0,0,0,0.8)' );
            linearGrad.appendChild( stopElement );

            defs.appendChild( linearGrad );
        },

        // Calculates spacing of the axes based on the starting point of the focus.
        _calculateAxisSpacing = function () {
            let axisCount = _visibleAxes.length,
                numAxesInViewport,
                contextAxisGap,
                focusAxisGap,
                unusedSpace,
                gapUnits, // One gap unit represents space gap between 2 context axes.
                i,
                length,
                yPos;

            _axesInFocus = _focusAndContextSettings.axesInFocus;
            _axesInContext = _focusAndContextSettings.axesInContext;
            _axesInBottomContext = _axesInContext / 2;
            _axesInTopContext = _axesInContext / 2;
            _axesInViewPortCount = _axesInContext + _axesInFocus;

            //[TODO]: Handle scenario when number of axes in focus is 1.(Don't let it happen.)

            // Probable handling for scenarion when number of visible axes is lesser than number expected for focus and contexts. [TODO]: TEST.
            if ( axisCount < _axesInViewPortCount ) {
                if ( axisCount <= _axesInFocus ) {
                    _axesInFocus = axisCount;
                    _axesInContext = 0;
                } else {
                    _axesInContext = axisCount - _axesInFocus;
                }
            }
            // [TODO]: Write code to handle insufficient space.

            _axesInTopContext = Math.ceil( _axesInContext / 2 );
            _axesInBottomContext = _axesInContext - _axesInTopContext;
            if ( _focusIndex < _axesInTopContext ) {
                // When focus index is closer to top, adjust the no. of axes in top context.
                _axesInTopContext = _focusIndex;
                if ( _axesInBottomContext === 0 ) {
                    _axesInBottomContext = _axesInContext - _axesInTopContext;
                }
            } else if ( _focusIndex + _axesInFocus > axisCount - _axesInBottomContext ) {
                // When focus index is closer to bottom, adjust the no. of axes in bottom context.
                _axesInBottomContext = axisCount - ( _focusIndex + _axesInFocus );
            }
            gapUnits = _axesInTopContext + _axesInBottomContext;
            numAxesInViewport = _axesInFocus + _axesInTopContext + _axesInBottomContext; // Total number of axes currently displayed.
            unusedSpace = _innerPositionProps.height - ( numAxesInViewport * _axisHeight );

            if ( _axesInFocus > 1 ) {
                // [TODO]: Remove check once we make sure _axesInFocus is always > 1.

                gapUnits += ( _axesInFocus - 1 ) * _focusAndContextSettings.extraGapFactor;
            }
            contextAxisGap = unusedSpace / gapUnits;
            _focusAndContextSettings.contextAxisOverflow = contextAxisGap * _focusAndContextSettings.contextAxisOverflowFactor;
            _focusAndContextSettings.pinchAxisOverflow = contextAxisGap;
            focusAxisGap = contextAxisGap * _focusAndContextSettings.extraGapFactor;

            // Set positions for hidden axes depending on the gap between context axes.
            _innerPositionProps.hideAtTop = - 4 * contextAxisGap;
            _innerPositionProps.hideAtBottom = _positionProps.top + _innerMargins.top + _positionProps.height + 4 * contextAxisGap;

            // [TODO]: Adjust positions such that all the axis, are inside the bounds defined by _innerPositionProps

            _axesPositions = [];
            yPos = _innerPositionProps.top + _axisHeight / 2;
            i = _focusIndex - _axesInTopContext;
            // Set positions of axes in the top context.
            for ( i; i < _focusIndex; i++ ) {
                _axesPositions.push( yPos );
                yPos += contextAxisGap + _axisHeight;
            }
            // Set positions of axes in the focus area.
            length = _focusIndex + _axesInFocus;
            for ( i = _focusIndex; i < length - 1; i++ ) {
                _axesPositions.push( yPos );
                yPos += focusAxisGap + _axisHeight;
            }
            // Set position of last axis in the focus area, and add the context gap for the next axis.
            _axesPositions.push( yPos );
            yPos += contextAxisGap + _axisHeight;
            i++;
            length = i + _axesInBottomContext;
            for ( i; i < length; i++ ) {
                _axesPositions.push( yPos );
                yPos += contextAxisGap + _axisHeight;
            }
        },

        // Rearranges the axes according to positions calculated.
        _rearrangeAxes = function () {
            let i,
                length = _axesInFocus + _axesInTopContext + _axesInBottomContext,
                axisIndex = _focusIndex - _axesInTopContext;

            // Hide axes until the top context axis at the top.
            for ( i = 0; i < axisIndex; i++ ) {
                _visibleAxes[i].transitionY( _innerPositionProps.hideAtTop );
            }
            // Position context and focus axes as calculated.
            for ( i = 0; i < length; i++ ) {
                // Only move when not dragged by user.
                if ( !_visibleAxes[axisIndex].getDragStatus() ) {
                    _visibleAxes[axisIndex].transitionY( _axesPositions[i] );
                }
                axisIndex++;
            }
            // Hide axes after the lower context axis at the bottom.
            for ( i = axisIndex; i < _visibleAxes.length; i++ ) {
                _visibleAxes[i].transitionY( _innerPositionProps.hideAtBottom );
            }

            _shiftPaths( false );
        },

        _swapAxes = function ( indexA, indexB, indexGlobalA, indexGlobalB ) {
            // Swap axes in array.
            let helpVariable = _visibleAxes[indexA];
            _visibleAxes[indexA] = _visibleAxes[indexB];
            _visibleAxes[indexB] = helpVariable;

            // Update indices stored in axes.
            _visibleAxes[indexA].indexInVisibilityArray = indexA;
            _visibleAxes[indexB].indexInVisibilityArray = indexB;


            // Swap axes in global array.
            helpVariable = self.axes[indexGlobalA];
            self.axes[indexGlobalA] = self.axes[indexGlobalB];
            self.axes[indexGlobalB] = helpVariable;

            // Update indices stored in axes.
            self.axes[indexGlobalA].indexInGlobalArray = indexGlobalA;
            self.axes[indexGlobalB].indexInGlobalArray = indexGlobalB;
        },

        _setVisibleAxes = function () {
            _visibleAxes = self.axes.filter( axis => axis.visible );
            _updateIndicesOfVisibleAxes();
        },

        _updateIndicesOfVisibleAxes = function () {
            for ( let i = 0; i < _visibleAxes.length; i++ ) {
                _visibleAxes[i].indexInVisibilityArray = i;
            }
        },

        _updateGlobalIndices = function () {
            for ( i = 0; i < self.axes.length; i++ ) {
                self.axes[i].indexInGlobalArray = i;
            }
        },

        /* var in _resetAxesRanges
                items = MoInVis.Paracoords.Data.itemsForWaste*/
        _resetAxesRanges = function () {
            var extent;
            let items = MoInVis.Paracoords.Data.itemsForWaste;
            // Reset the scales for the axes.
            self.axes.forEach( function ( axis ) {
                extent = d3.extent( items.map( region => self.paths[region].visible ? self.paths[region].data[_chosenYear][axis.attribute] : null ) );
                axis.setAxisRange( extent );
            } );
            //_redrawPaths();
        },

        // Shifts the displayed axes by specified pixels.
        _shiftAxesByPixels = function ( pixels ) {
            let length = _axesInFocus + _focusIndex + _axesInBottomContext,
                i = _focusIndex - _axesInTopContext,
                axis,
                focusStartPos = _axesPositions[_axesInTopContext],
                focusEndPos = _axesPositions[_axesInTopContext + _axesInFocus - 1];

            if ( pixels < 0 ) { // Shifting axes upwards.
                if ( length < _visibleAxes.length - 1 ) { // Include the axis outside viewport.
                    length++;
                } else if ( length === _visibleAxes.length ) { // If last axis is reached, do not move the last axis.
                    length--;
                }
                if ( _axesInTopContext === 0 ) { // Do not move first axis until top context area contains axes.
                    i++;
                }
                for ( i; i < length; i++ ) {
                    axis = _visibleAxes[i];
                    // [TODO]: Rework scaling of axis movements according to positions.
                    if ( axis.yPos > focusStartPos && axis.yPos <= focusEndPos ) {
                        // For axes moving around in the focus area, the movement is scaled.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor );
                    } else {
                        axis.setY( axis.yPos + pixels );
                    }
                }
            } else { // Shifting axes downwards.
                if ( _axesInBottomContext === 0 ) { // Do not move last axis until bottom context area contains axes.
                    length--;
                }
                if ( i === 0 ) { // If first axis is reached, do not move the first axis.
                    i++;
                } else if ( i > 1 ) { // Include the axis outside viewport.
                    i--;
                }
                for ( i; i < length; i++ ) {
                    axis = _visibleAxes[i];
                    axis.setY( axis.yPos + pixels );
                    if ( axis.yPos >= focusStartPos && axis.yPos < focusEndPos ) {
                        // For axes moving around in the focus area, the movement is scaled.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor );
                    } else {
                        axis.setY( axis.yPos + pixels );
                    }
                }
            }

            _shiftPaths( true );
        },

        // Squeeze in axes when pinching in.
        _squeezeAxesByPixels = function ( pixels ) {
            let length,
                i,
                axis,
                lastVisibleAxisIndex;

            if ( _axesInBottomContext ) { // If there are axes in the context below.
                // Start moving bottom axes into focus.
                length = _axesInFocus + _focusIndex + _axesInBottomContext;
                i = _focusIndex; // First moveable axis is the first in focus area.
                lastVisibleAxisIndex = length - 1; // Last visible axis.
                pixels = -pixels; // We move axes after _focusIndex upwards.

                if ( length < _visibleAxes.length - 1 ) { // Include the axis outside viewport, if available.
                    length++;
                } else if ( length === _visibleAxes.length ) { // If last axis is reached, do not move it.
                    length--;
                }
                if ( i === 0 ) { // If first axis is reached, do not move the first axis.
                    i++;
                }

                for ( i; i < length; i++ ) {
                    axis = _visibleAxes[i];
                    if ( i <= _focusIndex ) {
                        axis.setY( axis.yPos + pixels );
                    } else if ( i > lastVisibleAxisIndex ) {
                        // For axes moving up from hidden area, movement is scaled more, so it comes into the visible area.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor * 1.5 );
                    } else {
                        // For axes moving around in the focus area, the movement is scaled.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor );
                    }
                }
                _shiftPaths( true );
            } else if ( _focusIndex > 0 ) {
                // Start moving top axes into focus.
                length = _axesInFocus + _focusIndex - 1;
                i = _focusIndex - _axesInTopContext; // First moveable axis is the first in the top context area.
                lastVisibleAxisIndex = i; // First visible axis is also the first in the top context area.

                if ( i === 0 ) { // If first axis is reached, do not move the first axis.
                    i++;
                } else if ( i > 1 ) { // Include the axis outside viewport.
                    i--;
                }
                for ( i; i < length; i++ ) {
                    axis = _visibleAxes[i];
                    if ( i < lastVisibleAxisIndex ) {
                        // For axes moving down from hidden area, movement is scaled more, so it comes into the visible area.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor * 1.5 );
                    } else {
                        // For axes moving around in the focus area, the movement is scaled.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor );
                    }
                }
                _shiftPaths( true );
            }
        },

        // Spread out axes when pinching out
        _spreadAxesByPixels = function ( pixels ) {
            let length,
                i,
                axis,
                lastVisibleAxisIndex;
            if ( _axesInBottomContext ) {
                // Start moving bottom axes out of focus.
                length = _axesInFocus + _focusIndex + _axesInBottomContext;
                i = _focusIndex; // First moveable axis is the first in the focus area.
                lastVisibleAxisIndex = length - 1;
                if ( i === 0 ) { // If first axis is reached, do not move the first axis.
                    i++;
                }

                for ( i; i < length; i++ ) {
                    axis = _visibleAxes[i];
                    if ( i <= _focusIndex ) {
                        axis.setY( axis.yPos + pixels );
                    } else if ( i >= lastVisibleAxisIndex ) {
                        // For the last visible axes, scale the movement by extra so it goes out of the visible area to disappear.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor * 1.5 );
                    } else {
                        // For axes moving around in the focus area, the movement is scaled.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor );
                    }
                }
                _shiftPaths( true );
            } else if ( _focusIndex > 0 ) {
                // Start moving top axes out of focus.
                length = _axesInFocus + _focusIndex - 1;
                i = _focusIndex - _axesInTopContext; // First moveable axis is the first in the top context area.
                lastVisibleAxisIndex = i; // First visible axis is also the first in the top context area.
                pixels = -pixels;
                if ( i === 0 ) { // If first axis is reached, do not move the first axis.
                    i++;
                }
                for ( i; i < length; i++ ) {
                    axis = _visibleAxes[i];
                    if ( i <= lastVisibleAxisIndex ) {
                        // For the last visible axes, scale the movement by extra so it goes out of the visible area to disappear.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor * 1.5 );
                    } else {
                        // For axes moving around in the focus area, the movement is scaled.
                        axis.setY( axis.yPos + pixels * _focusAndContextSettings.extraGapFactor );
                    }
                }
                _shiftPaths( true );
            }
        },

        _shiftPaths = function ( dontAnimate ) {
            let path;
            // Recalculate paths and draw
            for ( path in self.paths ) {
                if ( self.paths[path].visible ) {
                    // Since elements are moved in tiny amounts, transitions are not needed.
                    // They will only slow rendering down.
                    self.paths[path].recalculate( dontAnimate );
                }
            }
        },

        _onScroll = function ( evt ) {
            if ( evt.wheelDeltaY >= 180 ) {
                self.swipeDown();
            } else if ( evt.wheelDeltaY <= -180 ) {
                self.swipeUp();
            }
        },

        // Sets the focus index, shows/hides the context indicators appropriately,
        // and recalculates axes positions and rearranges the axes.
        _setFocusIndex = function ( newFI ) {
            var topHiddenAxes = 0,
                bottomHiddenAxes = 0;
            _focusAndContextSettings.focusIndex = _focusIndex = newFI;

            _calculateAxisSpacing();
            _rearrangeAxes();

            if ( _focusIndex === 0 ) {
                if ( _topCI.visible ) {
                    _topCI.setVisibility( false );
                }
            } else {
                if ( _topCI.visible === false ) {
                    _topCI.setVisibility( true );
                }
            }
            if ( _focusIndex === _visibleAxes.length - _axesInFocus ) {
                if ( _bottomCI.visible ) {
                    _bottomCI.setVisibility( false );
                }
            } else if ( _bottomCI.visible === false ) {
                _bottomCI.setVisibility( true );
            }
            topHiddenAxes = _focusIndex - _axesInTopContext;
            bottomHiddenAxes = _visibleAxes.length - _focusIndex - _axesInFocus - _axesInBottomContext;
            _topCI.setContextText( topHiddenAxes );
            _bottomCI.setContextText( bottomHiddenAxes );
        },

        // Called when pan event starts.
        _panStart = function () {
            if ( self.brushingInProgress ) {
                self.stopEvent();
            } else {
                // Reset scrolling variables.
                _pinchScrollProps.deltaY = 0;
                _pinchScrollProps.overflowY = 0;
                _setPinchScrollInProgress();
            }
        },

        // Handles the scrolling of the axes from the pan event.
        _panUpDown = function ( event ) {
            if ( self.pinchScrollInProgress ) {
                var deltaY = ( event.deltaY - _pinchScrollProps.deltaY ) / 5; // Scale down panning values.
                _pinchScrollProps.deltaY = event.deltaY;
                // Do not rearrange if rearrangement is still in progress.
                if ( Date.now() - _pinchScrollProps.lastAxisRearrangement > _pinchScrollProps.transitionSpeed ) {
                    if ( deltaY < 0 ) {
                        if ( _focusIndex < _visibleAxes.length - _axesInFocus ) {
                            // Scroll up - move axes up.
                            _pinchScrollProps.overflowY += deltaY; // Update overflow (amount moved by axis)
                            // If overflow exceeds the specified overflow limit, shift point of focus.
                            if ( _pinchScrollProps.overflowY <= -_focusAndContextSettings.contextAxisOverflow ) {
                                _pinchScrollProps.overflowY = 0;
                                // Set the tranition speed to scrolling transition speed.
                                MoInVis.Paracoords.TransitionSpeed = _pinchScrollProps.transitionSpeed;
                                _setFocusIndex( _focusIndex + 1 );
                                _pinchScrollProps.lastAxisRearrangement = Date.now();
                                // Reset the transition speed to normal.
                                MoInVis.Paracoords.TransitionSpeed = MoInVis.Paracoords.NormalTransitionSpeed;
                            } else { // If overflow is not exceeded, shift axes by delta pixels.
                                _shiftAxesByPixels( deltaY );
                            }
                        }
                    } else if ( deltaY > 0 ) {
                        if ( _focusIndex > 0 ) {
                            // Scroll down - move axes down.
                            _pinchScrollProps.overflowY += deltaY; // Update overflow (amount moved by axis)
                            // If overflow exceeds the specified overflow limit, shift point of focus.
                            if ( _pinchScrollProps.overflowY >= _focusAndContextSettings.contextAxisOverflow ) {
                                _pinchScrollProps.overflowY = 0;
                                // Set the tranition speed to scrolling transition speed.
                                MoInVis.Paracoords.TransitionSpeed = _pinchScrollProps.transitionSpeed;
                                _setFocusIndex( _focusIndex - 1 );
                                _pinchScrollProps.lastAxisRearrangement = Date.now();
                                // Reset the transition speed to normal.
                                MoInVis.Paracoords.TransitionSpeed = MoInVis.Paracoords.NormalTransitionSpeed;
                            } else { // If overflow is not exceeded, shift axes by delta pixels.
                                _shiftAxesByPixels( deltaY );
                            }
                        }
                    }
                }
            } else if ( self.brushingInProgress ) {
                self.stopEvent();
            }
        },

        // Called when pan event ends.
        _panEnd = function () {
            if ( self.pinchScrollInProgress ) {
                // Reset scrolling variables.
                _pinchScrollProps.deltaY = 0;
                _pinchScrollProps.overflowY = 0;
                // Do not rearrange if rearrangement is still in progress.
                if ( Date.now() - _pinchScrollProps.lastAxisRearrangement > _pinchScrollProps.transitionSpeed ) {
                    // Set the tranition speed to scrolling transition speed.
                    MoInVis.Paracoords.TransitionSpeed = _pinchScrollProps.transitionSpeed;
                    _rearrangeAxes(); // Move them back to their original positions.
                    // Reset the transition speed to normal.
                    MoInVis.Paracoords.TransitionSpeed = MoInVis.Paracoords.NormalTransitionSpeed;
                }
                self.pinchScrollInProgress = false;
            }
        },

        // Called when pinching starts.
        _onPinchStart = function ( event ) {
            var pointer1 = event.pointers[0],
                pointer2 = event.pointers[1];
            // Find the pointerevent that is on top.
            if ( pointer1.y < pointer2.y ) {
                _pinchScrollProps.topPointerId = pointer1.pointerId;
                _pinchScrollProps.bottomPointerId = pointer2.pointerId;
            } else {
                _pinchScrollProps.topPointerId = pointer2.pointerId;
                _pinchScrollProps.bottomPointerId = pointer1.pointerId;
            }
            _pinchScrollProps.initialDistance = Math.abs( pointer1.y - pointer2.y ); // Initial distance between the pointers.
            _setPinchScrollInProgress();
        },

        // Called while pinching in and out.
        _onPinch = function ( event ) {
            var distance,
                overflowY,
                pointer1 = event.pointers[0],
                pointer2 = event.pointers[1];
            if ( pointer1.pointerId === _pinchScrollProps.topPointerId ) {
                distance = pointer2.y - pointer1.y;
            } else {
                distance = pointer1.y - pointer2.y;
            }
            overflowY = ( _pinchScrollProps.initialDistance - distance ) / 5;
            _pinchScrollProps.initialDistance = distance;
            if ( Date.now() - _pinchScrollProps.lastAxisRearrangement > _pinchScrollProps.transitionSpeed ) {
                _pinchScrollProps.overflowY += overflowY;
                if ( overflowY > 0 ) { // Pinch-in
                    if ( _axesInFocus < _focusAndContextSettings.maxAxesInFocus ) {
                        if ( _pinchScrollProps.overflowY > _focusAndContextSettings.pinchAxisOverflow ) {
                            _pinchScrollProps.overflowY = 0;
                            // Set appropriate focus-context settings and rearrange.
                            _focusAndContextSettings.axesInFocus = _axesInFocus + 1;
                            // Set the tranition speed to scrolling transition speed.
                            MoInVis.Paracoords.TransitionSpeed = _pinchScrollProps.transitionSpeed;
                            if ( _axesInBottomContext ) {
                                _setFocusIndex( _focusIndex );
                            } else {
                                _setFocusIndex( _focusIndex - 1 );
                            }
                            _pinchScrollProps.lastAxisRearrangement = Date.now();
                            // Reset the transition speed to normal.
                            MoInVis.Paracoords.TransitionSpeed = MoInVis.Paracoords.NormalTransitionSpeed;
                        } else {
                            // Squeeze together
                            _squeezeAxesByPixels( overflowY );
                        }
                    }
                } else { // Pinch-out
                    if ( _axesInFocus > _focusAndContextSettings.minAxesInFocus ) {
                        if ( _pinchScrollProps.overflowY < -_focusAndContextSettings.pinchAxisOverflow ) {
                            _pinchScrollProps.overflowY = 0;
                            // Set appropriate focus-context settings and rearrange.
                            _focusAndContextSettings.axesInFocus = _axesInFocus - 1;
                            // Set the tranition speed to scrolling transition speed.
                            MoInVis.Paracoords.TransitionSpeed = _pinchScrollProps.transitionSpeed;
                            if ( _axesInBottomContext ) {
                                _setFocusIndex( _focusIndex );
                            } else {
                                _setFocusIndex( _focusIndex + 1 );
                            }
                            _pinchScrollProps.lastAxisRearrangement = Date.now();
                            // Reset the transition speed to normal.
                            MoInVis.Paracoords.TransitionSpeed = MoInVis.Paracoords.NormalTransitionSpeed;
                        } else {
                            // spread out
                            _spreadAxesByPixels( -overflowY );
                        }
                    }
                }
            }
        },

        // Called on pinch end.
        _onPinchEnd = function () {
            _pinchScrollProps.initialDistance = 0;
            _pinchScrollProps.overflowY = 0;
            _onPinchStopped();
            // Do not rearrange if rearrangement is still in progress.
            if ( Date.now() - _pinchScrollProps.lastAxisRearrangement > _pinchScrollProps.transitionSpeed ) {
                // Set the tranition speed to scrolling transition speed.
                MoInVis.Paracoords.TransitionSpeed = _pinchScrollProps.transitionSpeed;
                _rearrangeAxes(); // Move them back to their original positions.
                // Reset the transition speed to normal.
                MoInVis.Paracoords.TransitionSpeed = MoInVis.Paracoords.NormalTransitionSpeed;
            }
        },

        // Reset the pinch scroll flag.
        _resetPinchScrollInProgress = function () {
            self.pinchScrollInProgress = false;
            _pinchScrollProps.timer.stop();
            _pinchScrollProps.timer = null;
        },

        // Use a timer to reset the pinchscroll flag to prevent accidental brushing.
        _onPinchStopped = function () {
            if ( _pinchScrollProps.timer ) {
                _pinchScrollProps.timer.restart( _resetPinchScrollInProgress, 250 );
            } else {
                _pinchScrollProps.timer = d3.interval( _resetPinchScrollInProgress, 250 );
            }
        },

        // Set the pinch scroll flag.
        _setPinchScrollInProgress = function () {
            if ( _pinchScrollProps.timer ) {
                _pinchScrollProps.timer.stop();
            }
            self.pinchScrollInProgress = true;
        },

        // Handles quick scrolling up when the context indicators are tapped.
        // {param} fullScroll indicates a double tap and that scrolling is to happen to the end.
        _quickScrollUp = function ( fullScroll ) {
            var newFI = _focusIndex;
            if ( newFI > 0 ) {
                if ( fullScroll ) {
                    newFI = 0;
                } else {
                    newFI -= _axesInFocus - 1;
                    if ( newFI < 0 ) {
                        newFI = 0;
                    }
                }
                _setFocusIndex( newFI );
            }
        },

        // Handles quick scrolling down when the context indicators are tapped.
        // {param} fullScroll indicates a double tap and that scrolling is to happen to the end.
        _quickScrollDown = function ( fullScroll ) {
            var newFI = _focusIndex;
            if ( newFI < _visibleAxes.length - _axesInFocus ) {
                if ( fullScroll ) {
                    newFI = _visibleAxes.length - _axesInFocus;
                } else {
                    newFI += _axesInFocus - 1;
                    if ( newFI > _visibleAxes.length - _axesInFocus ) {
                        newFI = _visibleAxes.length - _axesInFocus;
                    }
                }
                _setFocusIndex( newFI );
            }
        };

    this.pinchScrollInProgress = false;
    this.brushingInProgress = false;

    // Overriding base class method.
    this.swipeUp = function () {
        if ( _focusIndex < _visibleAxes.length - _axesInFocus ) {
            _setFocusIndex( _focusIndex + 1 );
        }
    };

    // Overriding base class method.
    this.swipeDown = function () {
        if ( _focusIndex > 0 ) {
            _setFocusIndex( _focusIndex - 1 );
        }
    };

    // Public methods
    this.init = function ( x, y ) {
        _xPos = x;
        _yPos = y;
        _parentGroup = _svgParent
            .append( 'g' )
            .attr( 'id', _id + '_ParentGrp' )
            .attr( 'transform', 'translate(' + _xPos + ',' + _yPos + ')' );
        _initializeClipping();

        _createStyles();

        _paracoordHolder = _parentGroup
            .append( 'g' )
            .attr( 'id', _id + '_ParaCoorHolder' )
            .attr( 'clip-path', 'url(#' + MoInVis.Paracoords.IdStore.paracoordClipper + ')' )
            .on( 'mousewheel.zoom', _onScroll );
        _eventCatcher = _paracoordHolder
            .append( 'rect' )
            .attr( 'id', _id + '_EventCatcher' )
            .attr( 'x', _positionProps.left )
            .attr( 'y', _positionProps.top )
            .attr( 'height', _positionProps.height )
            .attr( 'width', _positionProps.width )
            .attr( 'stroke', 'red' )
            .attr( 'stroke-width', '1' )
            .attr( 'opacity', 0 )
            .attr( 'fill', 'black' );

        self.addEventType( 'Pan', { event: 'pan', pointers: 1, direction: Hammer.DIRECTION_VERTICAL, threshold: 50 } );
        self.addEvent( 'panmove', this.onInteraction );
        self.addEvent( 'panstart', this.onInteraction );
        self.addEvent( 'panend', this.onInteraction );

        self.addEventType( 'Tap', { event: 'tap', pointers: 1 } );
        self.addEvent( 'tap', this.onInteraction );

        self.addEventType( 'Pinch', { event: 'pinch', enable: true } );
        self.addEvent( 'pinchmove', this.onInteraction );
        self.addEvent( 'pinchstart', this.onInteraction );
        self.addEvent( 'pinchend', this.onInteraction );
    };

    this.paths = {};
    this.axes = [];

    this.draw = function () {
        let attributes = MoInVis.Paracoords.Data.wasteAttributes,
            items = MoInVis.Paracoords.Data.itemsForWaste,
            extent;

        this.drawPaths();

        // Set the scales for the axes.
        attributes.forEach( function ( attr ) {
            extent = d3.extent( items.map( region => self.paths[region].visible ? self.paths[region].data[_chosenYear][attr.prop] : null ) );
            _attrScales.set(
                attr.prop,
                d3.scaleLinear()
                    .range( [_innerPositionProps.left, _innerPositionProps.left + _innerPositionProps.width] )
                    .domain( extent )
            );
        } );

        this.drawAttributeAxes();

        _ciSize = _axisHeight / 2;
        // Draw context indicators
        _topCI = new MoInVis.Paracoords.contextIndicator( _parentGroup, _positionProps.left, 0, _ciSize, _positionProps.width, 'TopCI', true, _quickScrollUp );
        _bottomCI = new MoInVis.Paracoords.contextIndicator( _parentGroup, _positionProps.left, _height - _ciSize, _ciSize, _positionProps.width, 'BottomCI', false, _quickScrollDown );

        _setFocusIndex( _focusIndex );
    };

    this.drawAttributeAxes = function () {
        let attributes = MoInVis.Paracoords.Data.wasteAttributes,
            axis,
            i,
            length = attributes.length;

        _axisParentGroup = _paracoordHolder
            .append( 'g' )
            .attr( 'id', _id + '_AxisParentGrp' );

        for ( i = 0; i < length; i++ ) {
            axis = new MoInVis.Paracoords.axis( _axisParentGroup, _id + '_Year_' + _chosenYear, attributes[i], _attrScales.get( attributes[i].prop ), this );
            axis.indexInGlobalArray = i;
            this.axes.push( axis );
            axis.draw( _innerPositionProps.left, -100 );
        }
        // Get corrected height after all axis elements have rendered.
        _axisHeight = this.axes[0].getHeight();

        _setVisibleAxes();
    };

    this.resize = function () {
        _height = moin.height;
        _width = moin.width;

        _positionProps.width = _width - _margins.left - _margins.right;
        _positionProps.height = _height - _margins.top - _margins.bottom;
        _clipRect
            .attr( 'height', _positionProps.height )
            .attr( 'width', _positionProps.width );
        _eventCatcher
            .attr( 'height', _positionProps.height )
            .attr( 'width', _positionProps.width );

        // Ignoring the changes in width for CIs for now as they seem to be insignificant.
        _topCI.reposition( _positionProps.left, 0 );
        _bottomCI.reposition( _positionProps.left, _height - _ciSize );
        _innerMargins.left = _innerMargins.right = _innerMargins.top = _innerMargins.bottom = _width * 0.06;
        _innerPositionProps.width = _positionProps.width - _innerMargins.left - _innerMargins.right;
        _innerPositionProps.height = _positionProps.height - _innerMargins.top - _innerMargins.bottom;

        self.axes.forEach( function ( axis ) {
            axis.setAxisPxRange( [_innerPositionProps.left, _innerPositionProps.left + _innerPositionProps.width] );
        } );

        // Update view.
        _calculateAxisSpacing();
        _rearrangeAxes();
    };

    this.setFocusIndexById = function ( id ) {
        _focusIndex = _visibleAxes.findIndex( axis => axis.getId() === id );
    };

    this.drawPaths = function () {
        let regions = MoInVis.Paracoords.Data.itemsForWaste,
            wasteByCountries = MoInVis.Paracoords.Data.wasteByCountries,
            i,
            length = regions.length,
            getColour = MoInVis.Paracoords.util.getColour,
            colourBlindSafe = this.moin.colourScheme === MoInVis.Paracoords.ColourScheme.ColourblindSafe;
        _pathParentGroup = _paracoordHolder
            .append( 'g' )
            .attr( 'id', _id + '_PathParentGrp' );

        for ( i = 0; i < length; i++ ) {
            this.paths[regions[i]] = new MoInVis.Paracoords.itemPath( _pathParentGroup, _id, regions[i], this );
            this.paths[regions[i]].init( wasteByCountries[regions[i]], _chosenYear, getColour( i, colourBlindSafe ) );
            this.paths[regions[i]].draw();
        }
        this.paths['European_sp_Union_sp_-_sp_28_sp_countries_sp__ob_2013-2020_cb_'].setVisibility( false );
        this.paths['European_sp_Union_sp_-_sp_27_sp_countries_sp__ob_from_sp_2020_cb_'].setVisibility( false );
    };

    this.getPathPointsInfo = function ( itemName ) {
        let i = 0,
            //axisIndex = _focusIndex - _axesInTopContext,
            //length = _focusIndex + _axesInFocus + _axesInBottomContext,
            length = _visibleAxes.length,
            axis,
            emphasis = true,
            points = [],
            point,
            value,
            data = MoInVis.Paracoords.Data.wasteByCountries[itemName].data[_chosenYear];

        for ( i; i < length; i++ ) {
            axis = _visibleAxes[i];
            value = data[axis.attribute];
            if ( value !== null && value !== '' ) {
                point = axis.getXY( value );
                points.push( point );
                emphasis = emphasis && axis.checkPathBrushed( point[0] ); // A path should be brushed on each axis to be emphasized.
            }
        }
        return { points, emphasis };
    };

    this.removeAxis = function ( index, indexGlobal, swipeLeft ) {
        var newFI;
        if ( _visibleAxes.length > _focusAndContextSettings.minAxesInFocus ) {
            const horizontalShift = 2 * window.innerWidth;

            // Remove axis from visualisation.
            if ( swipeLeft ) {
                // Remove to the left.
                _visibleAxes[index].setX( - horizontalShift );
            }
            else {
                // Remove to the right.
                _visibleAxes[index].setX( horizontalShift );
            }

            // Send invisible axis to bottom of axes list.
            self.axes.splice( self.axes.findIndex( axis => axis === _visibleAxes[index] ), 1 );
            self.axes.push( _visibleAxes[index] );

            // Remove axis from stored array.
            _visibleAxes[index].setVisibility( false );
            _setVisibleAxes();
            _updateGlobalIndices();

            if ( _focusIndex + _axesInFocus > _visibleAxes.length ) {
                newFI = _visibleAxes.length - _axesInFocus;
                if ( newFI >= 0 ) {
                    _setFocusIndex( newFI );
                    // Returning because _calculateAxisSpacing and _rearrangeAxes are called in _setFocusIndex already.
                    return;
                } else {
                    _focusAndContextSettings.axesInFocus--;
                }
            }
            // Update view.
            _calculateAxisSpacing();
            _rearrangeAxes();
        }
    };

    this.startAxisReordering = function ( yPos, id, index, boxHeight ) {
        let i = 0,
            length = _visibleAxes.length;

        _visibleAxes[index].setDragStatus( true );

        _lastPosY = yPos;
        _isDragging = true;
        _dragBuffer = boxHeight / 2;

        // Prepare y-values for axis swap.
        for ( i; i < length; i++ ) {
            _yPosOfVisibleAxes.push( _visibleAxes[i].yPos );
        }

        // bring touched axis to front
        d3.select( '#' + id ).raise();
    };

    this.stopAxisReordering = function ( index ) {
        _visibleAxes[index].setDragStatus( false );
        _visibleAxes[index].setX( 0 );

        // Bring axes back into right positions.
        _rearrangeAxes();

        // Reset values.
        _isDragging = false;
        _lastDeltaY = 0;
        _yPosOfVisibleAxes = [];
    };

    this.reorderAxis = function ( deltaY, index, indexGlobal ) {
        // Compute new value.
        const newPosY = deltaY + _lastPosY;

        // Move axis to new position.
        _visibleAxes[index].setY( newPosY );

        let passedAnotherAxis = false;

        // Check if axis was moved upwards or downwards.
        if ( deltaY > _lastDeltaY ) {
            // Was moved downwards.

            // Check screen position of moved axis.
            if ( index < ( _focusIndex + _axesInFocus + _axesInBottomContext - 1 ) ) {
                // Wasn't last one.

                // Check if axis passed subjacent axis.
                if ( newPosY > ( _visibleAxes[index + 1].yPos - _dragBuffer ) ) {
                    // Passed subjacent axis.

                    _swapAxes( index, index + 1, indexGlobal, indexGlobal + 1 );
                    _rearrangeAxes();
                    passedAnotherAxis = true;
                }
            }
        }
        else {
            // Was moved upwards.

            // Check screen position of moved axis.
            if ( index > ( _focusIndex - _axesInTopContext ) ) {
                // Wasn't first one.

                // Check if axis passed overlying axis.
                if ( newPosY < ( _visibleAxes[index - 1].yPos + _dragBuffer ) ) {
                    // Passed overlying axis.

                    _swapAxes( index, index - 1, indexGlobal, indexGlobal - 1 );
                    _rearrangeAxes();
                    passedAnotherAxis = true;
                }
            }
        }
        // Update deltas;
        _lastDeltaY = deltaY;

        // Adjust paths to new axis position.
        if ( !passedAnotherAxis ) {
            // [TODO] Check if a way exists, that parts of the paths can be animated while dragged parts aren't.
            _shiftPaths( false );
        }
    };

    this.brushPaths = function () {
        var path,
            item,
            axisIndex = 0,
            length = _visibleAxes.length,
            axis,
            emphasis,
            value,
            data;

        for ( path in this.paths ) {
            item = this.paths[path];
            emphasis = true;
            if ( item.visible ) {
                data = MoInVis.Paracoords.Data.wasteByCountries[item.itemName].data[_chosenYear];
                for ( axisIndex = 0; axisIndex < length; axisIndex++ ) {
                    axis = _visibleAxes[axisIndex];
                    value = data[axis.attribute];
                    if ( value !== null && value !== '' ) {
                        if ( axis.checkPathBrushed( axis.getXY( value )[0] ) === false ) {
                            // De-emphasize path when it doesn't meet the brush requirements of even one axis.
                            emphasis = false;
                            break;
                        }
                    }
                }
                item.setEmphasis( emphasis );
            }
        }
    };

    this.getBrushConfigurations = function () {
        var brushConfigs = [];
        _visibleAxes.forEach( axis => {
            //var config = axis.getBrushConfigurations();
            //if ( config ) {
            //    brushConfigs.push( config );
            //}
            brushConfigs = brushConfigs.concat( axis.getBrushConfigurations() );
        } );
        return brushConfigs;
    };

    this.enableDisableBrush = function ( axisId, brushId, active ) {
        let axis = _visibleAxes.find( item => item.getId() === axisId );
        if ( axis ) {
            axis.enableDisableBrush( brushId, active );
        }
    };

    this.setBrushValueRange = function ( axisId, brushId, valueRange ) {
        let axis = _visibleAxes.find( item => item.getId() === axisId );
        if ( axis ) {
            axis.setBrushValueRange( brushId, valueRange );
        }
    };

    this.hideBrushHandles = function ( axisId ) {
        _visibleAxes.forEach( axis => {
            if ( axis.getId() !== axisId ) {
                axis.hideBrushHandles();
            }
        } );
    };

    this.enterAxesReorderMode = function () {
        // let rotationCenterX = document.getElementById( 'MoInVis_ParaCoords_0_ContainerSVG' ).clientWidth / 2;
        if ( this.pinchScrollInProgress === false ) { // Only enter axes reorder mode when pinch and scroll are not in progress.
            for ( let i = 0; i < this.axes.length; i++ ) {
                this.axes[i].getInteractionManager().enterAxesReorderMode();
                this.axes[i].startWiggling();
            }
            _axesReorderMode = true;
            this.switchOffEvents( true );
            // window.navigator.vibrate(200);
        }
    };

    this.leaveAxesReorderMode = function () {
        for ( let i = 0; i < this.axes.length; i++ ) {
            this.axes[i].getInteractionManager().leaveAxesReorderMode();
            this.axes[i].stopWiggling();
        }
        this.switchOnEvents( true );
        // Using a setTimeout because if tap occurred on axis label, the tap is called for axisinteractionmanager too.
        // We don't want the detail view popping up when we are only disabling the reorder mode.
        // So we delay lowering the flag till after all hammer events are fired.
        setTimeout( function () {
            _axesReorderMode = false;
        }, 500 );
    };

    this.checkIfAxesReorderMode = function () {
        return _axesReorderMode;
    };

    this.onInteraction = function ( event ) {
        const eventType = event.type;

        // Offer reorder mode interactions.
        if ( _axesReorderMode ) {
            if ( eventType === 'tap' ) {
                // [TODO] Behaviour of reorder mode (on/off) when context indicators were tapped.
                self.leaveAxesReorderMode();

                /*topHiddenAxes = _focusIndex - _axesInTopContext;
                bottomHiddenAxes = _visibleAxes.length - _focusIndex - _axesInFocus - _axesInBottomContext;
                _topCI.setContextText( topHiddenAxes );
                _bottomCI.setContextText( bottomHiddenAxes );*/
            }
        }
        // Offer normal interactions.
        else {
            switch ( eventType ) {
                case 'panstart':
                    _panStart();
                    break;
                case 'panmove':
                    _panUpDown( event );
                    break;
                case 'panend':
                    _panEnd();
                    break;
                case 'pinchstart':
                    _onPinchStart( event );
                    break;
                case 'pinchmove':
                    _onPinch( event );
                    break;
                case 'pinchend':
                    _onPinchEnd();
                    break;
            }
        }
    };

    // Overriding base class method. Called before tab-level events are handled.
    this.isEventHandlingInProgress = function () {
        return this.brushingInProgress || this.pinchScrollInProgress;
    };

    this.getFocusAndContextSettings = function () {
        return _focusAndContextSettings;
    };

    // Called whenever this tab comes into focus.
    this.onTabFocus = function () {
        if ( this.moin.paraCoorderRedrawReq ) {
            _updateGlobalIndices();
            _setVisibleAxes();
            _resetAxesRanges();
            _setFocusIndex( _focusAndContextSettings.focusIndex );
            this.brushPaths();
            this.moin.paraCoorderRedrawReq = false;
        }
    };
    //[TODO]: Write Clean up method.
};

MoInVis.Paracoords.paracoorder.baseCtor = MoInVis.Paracoords.tab;
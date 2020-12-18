var MoInVis = MoInVis || {};
MoInVis.Paracoords = MoInVis.Paracoords || {};
MoInVis.Paracoords.IdStore = MoInVis.Paracoords.IdStore || {};
MoInVis.Paracoords.IdStore.paraCoordGroup = 'MoInVis_ParaCoords';
MoInVis.Paracoords.IdStore.paracoordClipper = 'ParaCoordClipper';
MoInVis.Paracoords.Count = MoInVis.Paracoords.Count || 0;

MoInVis.Paracoords.paracoorder = function ( width, height, svgParent ) {
    // Private variables.
    var self = this,
        _svgParent = svgParent,
        _chosenYear = 2018, // Since we are concentrating on the year 2018. The data structure allows for storage of more than a year.
        _id = MoInVis.Paracoords.IdStore.paraCoordGroup + '_' + ( MoInVis.Paracoords.Count++ ),
        _axisIndexMap,
        _axes = [],
        _visibleAxes = [],
        _axisHeight,
        _focusAndContextSettings = { // Settings for focus and context.
            focusIndex: 2,
            axesInContext: 4,
            axesInFocus: 3,
            extraGapFactor: 5 // Factor indicating how much more space axes in focus have between each other w.r.t axes in context.
        },
        _focusIndex = _focusAndContextSettings.focusIndex,
        _axesInFocus,
        _axesInContext,
        _axesInBottomContext,
        _axesInTopContext,
        _axesInViewPortCount, // _axesInFocus and the _axesInContext.
        _axesPositions = [],
        _xPos = 0,
        _yPos = 0,
        _parentGroup,
        _paracoordHolder,
        _axisParentGroup,
        _height = height,
        _width = width,
        _attrScales = new Map(),
        _margins = { left: 20, right: 20, top: 10, bottom: 10 }, // Margins for our content, including texts.
        _positionProps = { // Positions for our content, including texts.
            top: _margins.top,
            left: _margins.left,
            width: _width - _margins.left - _margins.right,
            height: _height - _margins.top - _margins.bottom
        },
        _innerMargins = { left: 50, right: 50, top: 20, bottom: 20 }, // Margins for the visualization.
        _innerPositionProps = { // Positions for our visualizations.
            top: _positionProps.top + _innerMargins.top,
            left: _positionProps.left + _innerMargins.left,
            width: _positionProps.width - _innerMargins.left - _innerMargins.right,
            height: _positionProps.height - _innerMargins.top - _innerMargins.bottom,
            hideAtTop: - 0.5 * _positionProps.height,
            hideAtBottom: _positionProps.top + _innerMargins.top + 1.5 * _positionProps.height
        },
        _clipRect,

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

        _getYPositionOfAttribute = function ( attr ) {
            var yPos, i, length = _axes.length;
            // [TODO]: More efficient way of retrieving the axis needed.
            for ( i = 0; i < length; i++ ) {
                if ( _axes[i].attribute === attr ) {
                    yPos = _axes[i].yPos;
                    break;
                }
            }
            return yPos;
        },

        // Calculates spacing of the axes based on the starting point of the focus.
        _calculateAxisSpacing = function () {
            var axisCount = _visibleAxes.length, numAxesInViewport, contextAxisGap, focusAxisGap, unusedSpace,
                gapUnits, // One gap unit represents space gap between 2 context axes.
                i, length, yPos;

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
            } else if ( _focusIndex + _axesInFocus > axisCount - _axesInBottomContext ) {
                // When focus index is closer to bottom, adjust the no. of axes in bottom context.
                _axesInBottomContext = axisCount - ( _focusIndex + _axesInFocus );
            }
            gapUnits = _axesInTopContext + _axesInBottomContext;
            numAxesInViewport = _axesInFocus + _axesInTopContext + _axesInBottomContext; // Total number of axes currently displayed.
            unusedSpace = _innerPositionProps.height - ( numAxesInViewport * _axisHeight );

            if ( _axesInFocus > 1 ) { // [TODO]: Remove check once we make sure _axesInFocus is always > 1.
                gapUnits += ( _axesInFocus - 1 ) * _focusAndContextSettings.extraGapFactor;
            }
            contextAxisGap = unusedSpace / gapUnits;
            focusAxisGap = contextAxisGap * _focusAndContextSettings.extraGapFactor;

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
            var i, length = _axesInFocus + _axesInTopContext + _axesInBottomContext, axisIndex = _focusIndex - _axesInTopContext;
            // Hide axes until the top context axes at the top.
            for ( i = 0; i < axisIndex; i++ ) {
                _visibleAxes[i].transitionY( _innerPositionProps.hideAtTop );
            }
            // Position context and focus axes as calculated.
            for ( i = 0; i < length; i++ ) {
                _visibleAxes[axisIndex].transitionY( _axesPositions[i] );
                axisIndex++;
            }
            // Hide axes after the lower context axes at the bottom.
            for ( i = axisIndex; i < _visibleAxes.length; i++ ) {
                _visibleAxes[i].transitionY( _innerPositionProps.hideAtBottom );
            }
        },

        _swipeUp = function () {
            if ( _focusIndex < _visibleAxes.length - _axesInFocus ) {
                _focusIndex++;
                _calculateAxisSpacing();
                _rearrangeAxes();
            }
        },

        _swipeDown = function () {
            if ( _focusIndex > 0 ) {
                _focusIndex--;
                _calculateAxisSpacing();
                _rearrangeAxes();
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

        _paracoordHolder = _parentGroup
            .append( 'g' )
            .attr( 'id', _id + '_ParaCoorHolder' )
            .attr( 'clip-path', 'url(#' + MoInVis.Paracoords.IdStore.paracoordClipper + ')' );
    };

    this.draw = function () {
        var
            attributes = MoInVis.Paracoords.Data.wasteAttributes,
            items = MoInVis.Paracoords.Data.itemsForWaste,
            orderedItems,
            extent;

        // Sort teams alphabetically.
        orderedItems = items.slice()
            .sort( ( itemA, itemB ) => {
                if ( itemA < itemB ) {
                    return -1;
                } else if ( itemA > itemB ) {
                    return 1;
                } else {
                    return 0;
                }
            } );

        // Set the scales for the axes.
        attributes.forEach( function ( attr ) {
            extent = d3.extent( orderedItems.map( region => MoInVis.Paracoords.Data.wasteByCountries[region][_chosenYear][attr.prop] ) );
            //attributeDomain = d3.range( extent[0], extent[1] + 1 );
            _attrScales.set(
                attr.prop,
                d3.scaleLinear()
                    .range( [_innerPositionProps.left, _innerPositionProps.left + _innerPositionProps.width] )
                    .domain( extent )
            );
        } );
        this.drawAttributeAxes();

        // Draw buttons

        var size = 20;
        new MoInVis.Paracoords.button( _paracoordHolder, _innerPositionProps.left - 2 * size, _innerPositionProps.top - size, size, '_LeftUpButton', true, _swipeUp );
        new MoInVis.Paracoords.button( _paracoordHolder, _innerPositionProps.left - 2 * size, _innerPositionProps.top + _innerPositionProps.height, size, '_LeftUpButton', false, _swipeDown );
        // [TODO]:  Draw the paths for each region.
    };

    this.drawAttributeAxes = function () {
        var attributes = MoInVis.Paracoords.Data.wasteAttributes, axis, i, length = attributes.length;
        _axisParentGroup = _paracoordHolder
            .append( 'g' )
            .attr( 'id', _id + '_AxisParentGrp' );

        for ( i = 0; i < length; i++ ) {
            axis = new MoInVis.Paracoords.axis( _axisParentGroup, _id + '_Year_' + _chosenYear, attributes[i], _attrScales.get( attributes[i].prop ), this );
            _axes.push( axis );
            axis.draw( _innerPositionProps.left, -100 );
        }
        _axisHeight = axis.height;
        // [TODO]: Change this.
        _visibleAxes = _axes;
        _calculateAxisSpacing();
        _rearrangeAxes();
    };
};
